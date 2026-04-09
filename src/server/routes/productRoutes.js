const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    const formatted = result.rows.map(p => ({
      ...p,
      subCategory: p.subcategory, 
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ADD PRODUCT
router.post('/', async (req, res) => {
  const { 
    name, sku, seller, category, subCategory, price, mrp, stock, 
    description, image, images, discount, unit, variants, featured 
  } = req.body;

  try {
    const query = `
      INSERT INTO products (
        name, sku, seller, category, subcategory, price, mrp, stock, 
        description, image, images, discount, unit, variants, featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;
    const values = [
      name, sku, seller, category, subCategory, price, mrp, stock, 
      description, image, images, discount, unit, JSON.stringify(variants), featured
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add product' });
  }
});

// UPDATE PRODUCT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    name, sku, seller, category, subCategory, price, mrp, stock, 
    description, image, images, discount, unit, variants, featured 
  } = req.body;

  try {
    const query = `
      UPDATE products SET
        name = $1, sku = $2, seller = $3, category = $4, subcategory = $5, 
        price = $6, mrp = $7, stock = $8, description = $9, image = $10, 
        images = $11, discount = $12, unit = $13, variants = $14, featured = $15
      WHERE id = $16 RETURNING *
    `;
    const values = [
      name, sku, seller, category, subCategory, price, mrp, stock, 
      description, image, images, discount, unit, JSON.stringify(variants), featured,
      id
    ];

    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// DELETE PRODUCT
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
