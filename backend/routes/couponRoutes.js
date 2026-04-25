const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET ALL COUPONS FOR A SELLER
router.get('/seller/:sellerId', async (req, res) => {
  const { sellerId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM coupons WHERE seller_id = $1 ORDER BY created_at DESC',
      [sellerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch coupons' });
  }
});

// CREATE NEW COUPON
router.post('/', async (req, res) => {
  const { 
    sellerId, code, type, discountPercent, maxDiscount, 
    minOrderValue, maxUsage, validUntil 
  } = req.body;

  try {
    const safeDiscountPercent = discountPercent === '' ? null : Number(discountPercent);
    const safeMaxDiscount = maxDiscount === '' ? null : Number(maxDiscount);
    const safeMinOrderValue = minOrderValue === '' ? null : Number(minOrderValue);
    const safeMaxUsage = maxUsage === '' ? null : Number(maxUsage);
    const safeValidUntil = validUntil === '' ? null : validUntil;

    const result = await pool.query(
      `INSERT INTO coupons (
        seller_id, code, type, discount_percent, max_discount, 
        min_order_value, max_usage, valid_until
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [sellerId, code, type, safeDiscountPercent, safeMaxDiscount, safeMinOrderValue, safeMaxUsage, safeValidUntil]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Coupon code already exists.' });
    }
    res.status(500).json({ message: 'Failed to create coupon' });
  }
});

// UPDATE COUPON
router.put('/:couponId', async (req, res) => {
  const { couponId } = req.params;
  const { 
    code, type, discountPercent, maxDiscount, 
    minOrderValue, maxUsage, validUntil, isActive 
  } = req.body;

  try {
    const safeDiscountPercent = discountPercent === '' ? null : Number(discountPercent);
    const safeMaxDiscount = maxDiscount === '' ? null : Number(maxDiscount);
    const safeMinOrderValue = minOrderValue === '' ? null : Number(minOrderValue);
    const safeMaxUsage = maxUsage === '' ? null : Number(maxUsage);
    const safeValidUntil = validUntil === '' ? null : validUntil;

    const result = await pool.query(
      `UPDATE coupons SET 
        code = $1, type = $2, discount_percent = $3, max_discount = $4, 
        min_order_value = $5, max_usage = $6, valid_until = $7, is_active = $8
      WHERE coupon_id = $9 RETURNING *`,
      [code, type, safeDiscountPercent, safeMaxDiscount, safeMinOrderValue, safeMaxUsage, safeValidUntil, isActive, couponId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update coupon' });
  }
});

// DELETE COUPON
router.delete('/:couponId', async (req, res) => {
  const { couponId } = req.params;
  try {
    const result = await pool.query('DELETE FROM coupons WHERE coupon_id = $1 RETURNING *', [couponId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete coupon' });
  }
});

// VALIDATE COUPON (For Buyers)
router.get('/validate/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM coupons WHERE code = $1 AND is_active = TRUE AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)',
      [code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Invalid or expired coupon code.' });
    }
    const coupon = result.rows[0];
    if (coupon.max_usage && coupon.used_count >= coupon.max_usage) {
      return res.status(400).json({ message: 'Coupon usage limit reached.' });
    }
    res.json(coupon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to validate coupon' });
  }
});

module.exports = router;
