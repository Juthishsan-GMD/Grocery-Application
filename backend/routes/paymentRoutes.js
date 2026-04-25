const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET ALL PAYMENTS (Admin)
router.get('/', async (req, res) => {
  try {
    const paymentsQuery = `
      SELECT 
        p.payment_id as id, 
        p.order_id as "orderId", 
        c.full_name as customer, 
        s.store_name as seller,
        p.amount, 
        p.payment_method as method, 
        p.payment_status as status, 
        p.created_at as date
      FROM payments p
      LEFT JOIN customers c ON p.customer_id = c.customer_id
      LEFT JOIN sellers s ON p.seller_id = s.seller_id
      ORDER BY p.created_at DESC
    `;
    const paymentsResult = await pool.query(paymentsQuery);

    const statsQuery = `
      SELECT 
        SUM(amount) FILTER (WHERE payment_status = 'Completed') as "totalCollected",
        SUM(amount) FILTER (WHERE payment_status = 'Completed' AND created_at >= CURRENT_DATE) as "todayCollected",
        COUNT(*) FILTER (WHERE payment_status = 'Completed') as "successfulTxns",
        COUNT(*) FILTER (WHERE payment_status = 'Failed') as "failedTxns",
        COUNT(*) FILTER (WHERE payment_status = 'Refunded') as "pendingRefunds"
      FROM payments
    `;
    const statsResult = await pool.query(statsQuery);

    res.json({
      payments: paymentsResult.rows,
      stats: {
        ...statsResult.rows[0],
        todayCollected: statsResult.rows[0].todayCollected || 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
});

// GET PAYMENTS FOR A SELLER
router.get('/seller/:sellerId', async (req, res) => {
  const { sellerId } = req.params;
  try {
    const paymentsQuery = `
      SELECT 
        p.payment_id as id, 
        p.created_at as date, 
        p.amount, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = p.order_id AND seller_id = $1) as orders,
        p.payment_status as status, 
        p.payment_method as method
      FROM payments p
      WHERE p.seller_id = $1
      ORDER BY p.created_at DESC
    `;
    const paymentsResult = await pool.query(paymentsQuery, [sellerId]);

    const statsQuery = `
      SELECT 
        SUM(amount) FILTER (WHERE payment_status = 'Completed') as total,
        SUM(amount) FILTER (WHERE payment_status = 'Pending') as pending,
        COUNT(*) FILTER (WHERE payment_status = 'Completed') as completedCount
      FROM payments
      WHERE seller_id = $1
    `;
    const statsResult = await pool.query(statsQuery, [sellerId]);

    res.json({
      payments: paymentsResult.rows,
      stats: statsResult.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch seller payments' });
  }
});

module.exports = router;
