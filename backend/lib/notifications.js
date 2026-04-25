const pool = require('../config/db');

/**
 * Create a notification in the database
 * @param {Object} params
 * @param {string} params.customerId
 * @param {string} params.sellerId
 * @param {string} params.adminId
 * @param {string} params.orderId
 * @param {string} params.type - 'info', 'success', 'warning', 'error'
 * @param {string} params.title
 * @param {string} params.message
 */
const createNotification = async ({ customerId, sellerId, adminId, orderId, type, title, message }) => {
  try {
    await pool.query(
      `INSERT INTO notifications 
        (customer_id, seller_id, admin_id, order_id, type, message, expires_at) 
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP + INTERVAL '30 days')`,
      [customerId || null, sellerId || null, adminId || null, orderId || null, type, `[${title}] ${message}`]
    );
    console.log(`Notification created: ${title}`);
  } catch (err) {
    console.error('Error creating notification:', err);
  }
};

module.exports = { createNotification };
