const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { createNotification } = require('../lib/notifications');

// Helper to fetch a single detailed order
const fetchDetailedOrder = async (orderId) => {
  const query = `
    SELECT 
      o.order_id as id, 
      o.order_id,
      o.customer_id,
      o.address_id,
      o.coupon_id,
      o.subtotal,
      o.discount_amount,
      o.tax_amount,
      o.shipping_charge,
      o.total_amount,
      o.order_status as status,
      o.order_status,
      o.payment_status,
      o.payment_method,
      o.cancellation_reason,
      o.placed_at as created_at,
      o.placed_at,
      o.updated_at,
      c.full_name as customer_name,
      c.email as customer_email,
      (SELECT JSON_AGG(oi_with_details) FROM (
        SELECT oi.*, p.name, 
          (SELECT image_url FROM product_images WHERE product_id = p.product_id AND is_primary = TRUE LIMIT 1) as image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = o.order_id
      ) oi_with_details) as items
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.customer_id
    WHERE o.order_id = $1
  `;
  const result = await pool.query(query, [orderId]);
  return result.rows[0];
};

// GET ALL ORDERS (General/Admin)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        o.order_id as id, o.*, o.order_status as status, o.placed_at as created_at,
        c.full_name as customer_name, c.email as customer_email,
        (SELECT JSON_AGG(oi) FROM (
          SELECT oi.*, p.name, 
            (SELECT image_url FROM product_images WHERE product_id = p.product_id AND is_primary = TRUE LIMIT 1) as image
          FROM order_items oi
          JOIN products p ON oi.product_id = p.product_id
          WHERE oi.order_id = o.order_id
        ) oi) as items
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.placed_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// CREATE NEW ORDER
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const payload = req.body;
    console.log('--- INCOMING ORDER PAYLOAD ---');
    console.log(JSON.stringify(payload, null, 2));

    const { 
      customerId, addressId, couponId, items, 
      subtotal, discountAmount, taxAmount, shippingCharge, totalAmount,
      paymentMethod 
    } = payload;

    // Sanitize subtotal and other amounts to prevent NULL violations
    const safeSubtotal = Number(subtotal) || 0;
    const safeTotal = Number(totalAmount) || 0;

    // customerId is now optional to allow guest checkout
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required to place an order.' });
    }

    await client.query('BEGIN');

    // Check stock for all items before proceeding
    for (const item of items) {
      if (!item.productId) continue;
      const stockCheck = await client.query('SELECT name, stock_quantity FROM products WHERE product_id = $1', [item.productId]);
      if (stockCheck.rows.length === 0) {
        throw new Error(`Product ${item.productId} not found.`);
      }
      const currentStock = stockCheck.rows[0].stock_quantity;
      if (currentStock < (item.quantity || 1)) {
        throw new Error(`Insufficient stock for ${stockCheck.rows[0].name}. Available: ${currentStock}`);
      }
    }

    // 0. Resolve Coupon Code to ID if a string code was passed
    let actualCouponId = null;
    if (couponId) {
      const couponCheck = await client.query('SELECT coupon_id FROM coupons WHERE code = $1 OR coupon_id = $1', [couponId]);
      if (couponCheck.rows.length > 0) {
        actualCouponId = couponCheck.rows[0].coupon_id;
        // Increment usage count
        await client.query('UPDATE coupons SET used_count = used_count + 1 WHERE coupon_id = $1', [actualCouponId]);
      }
    }

    // 1. Insert into main orders table
    const orderQuery = `
      INSERT INTO orders (
        customer_id, address_id, coupon_id, subtotal, 
        discount_amount, tax_amount, shipping_charge, total_amount, 
        payment_method, order_status, payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Processing', 'Pending')
      RETURNING *
    `;
    const orderValues = [
      customerId || null, addressId || null, actualCouponId, safeSubtotal,
      Number(discountAmount) || 0, Number(taxAmount) || 0, Number(shippingCharge) || 0, safeTotal,
      paymentMethod
    ];

    const orderResult = await client.query(orderQuery, orderValues);
    const newOrder = orderResult.rows[0];

    // 2. Insert items into order_items table
    const sellerTotals = {};
    const adminTotals = {};

    for (const item of items) {
      // Small check to ensure we have product data
      if (!item.productId) continue;

      // Fetch product details to get admin_id if seller_id is null
      const productRes = await client.query('SELECT seller_id, admin_id, name, stock_quantity FROM products WHERE product_id = $1', [item.productId]);
      if (productRes.rows.length === 0) throw new Error(`Product ${item.productId} not found.`);
      const p = productRes.rows[0];

      const itemQuery = `
        INSERT INTO order_items (
          order_id, product_id, variant_id, seller_id, admin_id,
          quantity, unit_price, total_price, item_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Processing')
      `;
      const itemTotal = Number(item.totalPrice) || (Number(item.unitPrice) * Number(item.quantity || 1)) || 0;
      
      const itemSellerId = p.seller_id || item.sellerId || null;
      const itemAdminId = p.admin_id || null;

      if (itemSellerId) {
        sellerTotals[itemSellerId] = (sellerTotals[itemSellerId] || 0) + itemTotal;
      } else if (itemAdminId) {
        adminTotals[itemAdminId] = (adminTotals[itemAdminId] || 0) + itemTotal;
      }
      
      const itemValues = [
        newOrder.order_id, 
        item.productId, 
        item.variantId || null, 
        itemSellerId,
        itemAdminId,
        item.quantity || 1, 
        Number(item.unitPrice) || 0, 
        itemTotal
      ];
      await client.query(itemQuery, itemValues);

      // Check for low stock and notify seller/admin
      if (p.stock_quantity <= 10) {
        if (p.seller_id) {
          await createNotification({
            sellerId: p.seller_id,
            type: 'warning',
            title: 'Low Stock Alert',
            message: `Product "${p.name}" has only ${p.stock_quantity} units left in stock.`
          });
        } else if (p.admin_id) {
          await createNotification({
            adminId: p.admin_id,
            type: 'warning',
            title: 'Low Stock Alert',
            message: `Platform product "${p.name}" has only ${p.stock_quantity} units left in stock.`
          });
        }
      }
    }

    // Insert into order_sellers
    for (const [sellerId, subtotal] of Object.entries(sellerTotals)) {
      await client.query(
        'INSERT INTO order_sellers (order_id, seller_id, seller_subtotal) VALUES ($1, $2, $3)',
        [newOrder.order_id, sellerId, subtotal]
      );
    }

    // Insert into order_sellers for Admin records as well
    for (const [adminId, subtotal] of Object.entries(adminTotals)) {
      await client.query(
        'INSERT INTO order_sellers (order_id, admin_id, seller_subtotal) VALUES ($1, $2, $3)',
        [newOrder.order_id, adminId, subtotal]
      );
    }

    // 3. (Optional) If coupon used, record usage
    if (actualCouponId && customerId) {
      await client.query(
        'INSERT INTO coupon_usage (coupon_id, customer_id, order_id) VALUES ($1, $2, $3)',
        [actualCouponId, customerId, newOrder.order_id]
      );
      await client.query('UPDATE coupons SET used_count = used_count + 1 WHERE coupon_id = $1', [actualCouponId]);
    }

    // 4. Record payment details
    const paymentQuery = `
      INSERT INTO payments (
        order_id, customer_id, seller_id, amount, payment_method, 
        payment_status, transaction_id, gateway_name
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const transId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Pick the first seller from items as the primary seller for this payment
    const primarySellerId = items.length > 0 ? items[0].sellerId : null;

    const paymentValues = [
      newOrder.order_id,
      customerId || null,
      primarySellerId,
      safeTotal,
      paymentMethod || 'COD',
      paymentMethod === 'Online' ? 'Completed' : 'Pending',
      payload.transactionId || transId,
      payload.gatewayName || (paymentMethod === 'Online' ? 'Razorpay' : 'Manual')
    ];
    await client.query(paymentQuery, paymentValues);

    await client.query('COMMIT');
    console.log(`✅ Order ${newOrder.order_id} created successfully.`);
    
    // --- DYNAMIC NOTIFICATIONS ---
    // 1. Notify Admin about new global order
    await createNotification({
      adminId: 'ADM001', // Defaulting to ADM001 for now, or fetch active admins
      orderId: newOrder.order_id,
      type: 'info',
      title: 'New Global Order',
      message: `A new order ${newOrder.order_id} has been placed for ₹${newOrder.total_amount}.`
    });

    // 2. Notify each involved Seller
    for (const [sellerId, subtotal] of Object.entries(sellerTotals)) {
      await createNotification({
        sellerId,
        orderId: newOrder.order_id,
        type: 'success',
        title: 'New Order Received',
        message: `You have received a new order ${newOrder.order_id} worth ₹${subtotal}.`
      });
    }

    // 3. Notify Customer
    if (customerId) {
      await createNotification({
        customerId,
        orderId: newOrder.order_id,
        type: 'success',
        title: 'Order Placed Successfully',
        message: `Your order ${newOrder.order_id} has been placed and is being processed.`
      });
    }
    // ----------------------------
    
    // Fetch detailed order for response
    const detailedOrder = await fetchDetailedOrder(newOrder.order_id);
    res.status(201).json(detailedOrder);

  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('❌ SERVER ORDER ERROR:', err.message, err.stack);
    res.status(500).json({ 
      message: 'Failed to create order in database.', 
      error: err.message,
      detail: err.detail || 'Possible data mismatch or constraint violation.'
    });
  } finally {
    if (client) client.release();
  }
});

// GET ALL ORDERS FOR A CUSTOMER
router.get('/customer/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const query = `
      SELECT 
        o.order_id as id, o.*, o.order_status as status, o.placed_at as created_at,
        (SELECT JSON_AGG(oi_with_details) FROM (
          SELECT oi.*, p.name, 
            (SELECT image_url FROM product_images WHERE product_id = p.product_id AND is_primary = TRUE LIMIT 1) as image
          FROM order_items oi
          JOIN products p ON oi.product_id = p.product_id
          WHERE oi.order_id = o.order_id
        ) oi_with_details) as items
      FROM orders o
      WHERE o.customer_id = $1
      ORDER BY o.placed_at DESC
    `;
    const result = await pool.query(query, [customerId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch customer orders' });
  }
});

// UPDATE ORDER STATUS
router.put('/:orderId/status', async (req, res) => {
  const { orderId } = req.params;
  const { status, paymentStatus, cancellationReason } = req.body;

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Get current status to check transition
      const currentOrder = await client.query('SELECT order_status FROM orders WHERE order_id = $1', [orderId]);
      if (currentOrder.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Order not found' });
      }
      
      const oldStatus = currentOrder.rows[0].order_status;
      
      const result = await client.query(
        `UPDATE orders 
         SET order_status = COALESCE($1, order_status), 
             payment_status = COALESCE($2, payment_status), 
             cancellation_reason = COALESCE($3, cancellation_reason),
             updated_at = CURRENT_TIMESTAMP 
         WHERE order_id = $4 RETURNING *`,
        [status, paymentStatus, cancellationReason, orderId]
      );

      // If status changed to 'Delivered' and it wasn't already 'Delivered'
      if (status === 'Delivered' && oldStatus !== 'Delivered') {
        const orderItems = await client.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [orderId]);
        for (const item of orderItems.rows) {
          await client.query(
            'UPDATE products SET stock_quantity = GREATEST(0, stock_quantity - $1) WHERE product_id = $2',
            [item.quantity, item.product_id]
          );
        }
      }

      await client.query('COMMIT');
      
      // --- DYNAMIC NOTIFICATIONS ---
      const detailedOrder = await fetchDetailedOrder(orderId);

      // Notify Customer about status change
      if (detailedOrder.customer_id) {
        await createNotification({
          customerId: detailedOrder.customer_id,
          orderId,
          type: status === 'Delivered' ? 'success' : status === 'Cancelled' ? 'error' : 'info',
          title: `Order Status: ${status}`,
          message: `Your order ${orderId} status has been updated to ${status}.`
        });
      }

      // Notify Sellers if it was cancelled
      if (status === 'Cancelled') {
        const sellers = await client.query('SELECT DISTINCT seller_id FROM order_items WHERE order_id = $1', [orderId]);
        for (const s of sellers.rows) {
          if (s.seller_id) {
            await createNotification({
              sellerId: s.seller_id,
              orderId,
              type: 'error',
              title: 'Order Cancelled',
              message: `Order ${orderId} has been cancelled by the customer/admin.`
            });
          }
        }
      }
      // ----------------------------
      
      res.json(detailedOrder);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update order: ' + err.message });
  }
});

// GET ALL ORDERS FOR A SELLER
router.get('/seller/:sellerId', async (req, res) => {
  const { sellerId } = req.params;
  try {
    const query = `
      SELECT DISTINCT ON (o.order_id)
        o.order_id as id, o.*, o.order_status as status, o.placed_at as created_at,
        c.full_name as customer_name, c.email as customer_email,
        os.seller_subtotal,
        (SELECT JSON_AGG(oi_filtered) FROM (
          SELECT oi.*, p.name, 
            (SELECT image_url FROM product_images WHERE product_id = p.product_id AND is_primary = TRUE LIMIT 1) as image
          FROM order_items oi
          JOIN products p ON oi.product_id = p.product_id
          WHERE oi.order_id = o.order_id AND oi.seller_id = $1
        ) oi_filtered) as items
      FROM orders o
      JOIN order_sellers os ON o.order_id = os.order_id
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      WHERE os.seller_id = $1
      ORDER BY o.order_id, o.placed_at DESC
    `;
    const result = await pool.query(query, [sellerId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch seller orders' });
  }
});

module.exports = router;
