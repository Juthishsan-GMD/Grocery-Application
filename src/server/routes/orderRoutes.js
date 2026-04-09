const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET ALL ORDERS
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// CREATE NEW ORDER
router.post('/', async (req, res) => {
  const { 
    id, customer_name, customer_email, customer_phone, items, 
    total_amount, payment_method, shipping_address 
  } = req.body;

  try {
    const query = `
      INSERT INTO orders (
        id, customer_name, customer_email, customer_phone, items, 
        total_amount, payment_method, shipping_address, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Processing')
      RETURNING *
    `;
    const values = [
      id, customer_name, customer_email, customer_phone, JSON.stringify(items), 
      total_amount, payment_method, shipping_address
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Order Creation Error:', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// UPDATE ORDER STATUS
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, courier, tracking_id, est_delivery } = req.body;

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1, courier = $2, tracking_id = $3, estimated_delivery = $4 WHERE id = $5 RETURNING *',
      [status, courier, tracking_id, est_delivery, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

module.exports = router;
