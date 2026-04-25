const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET reviews for a product
router.get('/product/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const query = `
      SELECT r.*, c.full_name as customer_name
      FROM reviews r
      JOIN customers c ON r.customer_id = c.customer_id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [productId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// GET reviews for a seller's products
router.get('/seller/:sellerId', async (req, res) => {
  const { sellerId } = req.params;
  try {
    const query = `
      SELECT r.*, c.full_name as customer_name, p.name as product_name,
             (SELECT image_url FROM product_images WHERE product_id = p.product_id AND is_primary = true LIMIT 1) as product_image
      FROM reviews r
      JOIN customers c ON r.customer_id = c.customer_id
      JOIN products p ON r.product_id = p.product_id
      WHERE p.seller_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [sellerId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch seller reviews' });
  }
});

// POST a new review
router.post('/', async (req, res) => {
  const { orderItemId, customerId, productId, rating, title, body } = req.body;
  
  if (!customerId || !productId || !rating) {
    return res.status(400).json({ message: 'customer_id, product_id, and rating are required' });
  }

  try {
    // Check if user already reviewed this order item (if provided)
    if (orderItemId) {
      const check = await pool.query('SELECT review_id FROM reviews WHERE order_item_id = $1', [orderItemId]);
      if (check.rows.length > 0) {
        return res.status(400).json({ message: 'You have already reviewed this item' });
      }
    }

    const query = `
      INSERT INTO reviews (order_item_id, customer_id, product_id, rating, title, body)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [orderItemId || null, customerId, productId, rating, title, body]);
    
    // Optional: Update product rating average (could be a trigger or manual update)
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit review' });
  }
});

module.exports = router;
