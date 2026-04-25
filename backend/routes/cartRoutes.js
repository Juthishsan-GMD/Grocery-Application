const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Helper to get or create a cart for a customer
const getOrCreateCart = async (userId) => {
  if (!userId || userId === 'null' || userId === 'undefined') {
    return null; // Return null for guests instead of throwing error
  }
  
  const existing = await pool.query('SELECT cart_id FROM carts WHERE customer_id = $1', [userId]);
  if (existing.rows.length > 0) {
    return existing.rows[0].cart_id;
  }
  
  // Verify user is actually a customer
  const customerCheck = await pool.query('SELECT customer_id FROM customers WHERE customer_id = $1', [userId]);
  if (customerCheck.rows.length === 0) {
    return null; 
  }

  const result = await pool.query('INSERT INTO carts (customer_id) VALUES ($1) RETURNING cart_id', [userId]);
  return result.rows[0].cart_id;
};

// GET CART ITEMS
router.get('/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const cartId = await getOrCreateCart(customerId);
    if (!cartId) {
      return res.json({ cartId: null, items: [] });
    }
    const query = `
      SELECT 
        ci.cart_item_id, ci.product_id, ci.variant_id, ci.quantity, ci.price as cart_item_price,
        p.name, p.description, p.unit, p.seller_id,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id ORDER BY sort_order ASC LIMIT 1) as image,
        v.variant_name, v.variant_value, v.price as variant_price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.product_id
      LEFT JOIN product_variants v ON ci.variant_id = v.variant_id
      WHERE ci.cart_id = $1
      ORDER BY ci.created_at DESC
    `;
    const result = await pool.query(query, [cartId]);
    res.json({ cartId, items: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// ADD ITEM TO CART
router.post('/add', async (req, res) => {
  const { customerId, productId, variantId, quantity, price } = req.body;
  
  if (!customerId || !productId || !price) {
    return res.status(400).json({ message: 'customerId, productId, and price are required' });
  }

  try {
    const cartId = await getOrCreateCart(customerId);
    if (!cartId) {
      return res.status(400).json({ message: 'Invalid customer' });
    }
    
    // Check if item already exists in cart (with same variant)
    const checkQuery = `
      SELECT cart_item_id, quantity FROM cart_items 
      WHERE cart_id = $1 AND product_id = $2 AND (variant_id = $3 OR (variant_id IS NULL AND $3 IS NULL))
    `;
    const checkResult = await pool.query(checkQuery, [cartId, productId, variantId || null]);

    if (checkResult.rows.length > 0) {
      // Update quantity
      const newQty = checkResult.rows[0].quantity + (quantity || 1);
      const updateQuery = 'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE cart_item_id = $2 RETURNING *';
      const result = await pool.query(updateQuery, [newQty, checkResult.rows[0].cart_item_id]);
      return res.json({ message: 'Quantity updated', item: result.rows[0] });
    } else {
      // Insert new item
      const insertQuery = `
        INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, price) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *
      `;
      const result = await pool.query(insertQuery, [cartId, productId, variantId || null, quantity || 1, price]);
      res.status(201).json({ message: 'Item added to cart', item: result.rows[0] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

// UPDATE QUANTITY
router.put('/update', async (req, res) => {
  const { cartItemId, quantity } = req.body;
  if (!cartItemId || quantity === undefined) {
    return res.status(400).json({ message: 'cartItemId and quantity are required' });
  }

  try {
    if (quantity <= 0) {
      await pool.query('DELETE FROM cart_items WHERE cart_item_id = $1', [cartItemId]);
      return res.json({ message: 'Item removed from cart' });
    }

    const query = 'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE cart_item_id = $2 RETURNING *';
    const result = await pool.query(query, [quantity, cartItemId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Cart item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update quantity' });
  }
});

// REMOVE ITEM
router.delete('/remove/:cartItemId', async (req, res) => {
  const { cartItemId } = req.params;
  try {
    const result = await pool.query('DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING *', [cartItemId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove item' });
  }
});

// CLEAR CART
router.delete('/clear/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const cartId = await getOrCreateCart(customerId);
    await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

module.exports = router;
