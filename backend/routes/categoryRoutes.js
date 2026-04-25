const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Slugify helper
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

// GET ALL CATEGORIES
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// ADD CATEGORY
router.post('/', async (req, res) => {
  const { name, parent_category_id, image_url, admin_id } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    const slug = slugify(name);
    const query = `
      INSERT INTO categories (name, slug, parent_category_id, image_url, admin_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [name, slug, parent_category_id || null, image_url || null, admin_id || null];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // unique_violation
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Failed to create category' });
  }
});

module.exports = router;
