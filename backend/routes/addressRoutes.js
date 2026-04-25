const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET ADDRESSES FOR A CUSTOMER
router.get('/customer/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM addresses WHERE customer_id = $1 AND deleted_at IS NULL ORDER BY is_default DESC, created_at DESC',
      [customerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }
});

// ADD NEW ADDRESS
router.post('/', async (req, res) => {
  const { 
    customerId, sellerId, fullName, phone, addressLine1, addressLine2, 
    city, state, pincode, addressType, isDefault 
  } = req.body;

  try {
    // If isDefault is true, unset other defaults for this customer
    if (isDefault) {
      await pool.query('UPDATE addresses SET is_default = FALSE WHERE customer_id = $1', [customerId]);
    }

    const query = `
      INSERT INTO addresses (
        customer_id, seller_id, full_name, phone, address_line_1, address_line_2, 
        city, state, pincode, address_type, is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      customerId || null, sellerId || null, fullName, phone, addressLine1, addressLine2, 
      city, state, pincode, addressType || 'Home', isDefault || false
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Address Creation Error:', err);
    res.status(500).json({ message: 'Failed to save address' });
  }
});

// UPDATE ADDRESS
router.put('/:addressId', async (req, res) => {
  const { addressId } = req.params;
  const { 
    customerId, fullName, phone, addressLine1, addressLine2, 
    city, state, pincode, addressType, isDefault 
  } = req.body;

  try {
    if (isDefault) {
      await pool.query('UPDATE addresses SET is_default = FALSE WHERE customer_id = $1', [customerId]);
    }

    const query = `
      UPDATE addresses SET
        full_name = $1, phone = $2, address_line_1 = $3, address_line_2 = $4, 
        city = $5, state = $6, pincode = $7, address_type = $8, is_default = $9, updated_at = CURRENT_TIMESTAMP
      WHERE address_id = $10 AND customer_id = $11
      RETURNING *
    `;
    const values = [
      fullName, phone, addressLine1, addressLine2, 
      city, state, pincode, addressType || 'Home', isDefault || false, addressId, customerId
    ];

    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Address not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Address Update Error:', err);
    res.status(500).json({ message: 'Failed to update address' });
  }
});

// DELETE ADDRESS
router.delete('/:addressId', async (req, res) => {
  const { addressId } = req.params;
  const { customerId } = req.query;
  try {
    await pool.query('UPDATE addresses SET deleted_at = CURRENT_TIMESTAMP WHERE address_id = $1 AND customer_id = $2', [addressId, customerId]);
    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    console.error('Address Delete Error:', err);
    res.status(500).json({ message: 'Failed to delete address' });
  }
});

module.exports = router;
