const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET NOTIFICATIONS FOR A CUSTOMER
router.get('/customer/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications WHERE customer_id = $1 ORDER BY created_at DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// GET NOTIFICATIONS FOR A SELLER
router.get('/seller/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications WHERE seller_id = $1 ORDER BY created_at DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch seller notifications' });
  }
});

// MARK AS READ
router.put('/:id/read', async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE notification_id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

// DELETE NOTIFICATION
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM notifications WHERE notification_id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});

// CREATE NOTIFICATION
router.post('/', async (req, res) => {
  const { customerId, sellerId, orderId, type, message } = req.body;
  try {
    await pool.query(
      'INSERT INTO notifications (customer_id, seller_id, order_id, type, message, expires_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP + INTERVAL \'30 days\')',
      [customerId || null, sellerId || null, orderId || null, type, message]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create notification' });
  }
});

module.exports = router;
