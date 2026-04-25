const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Helper to get or create a wishlist ID for a user
const getOrCreateWishlist = async (userId) => {
  if (!userId || userId === 'null' || userId === 'undefined') {
    return null;
  }

  const existing = await pool.query('SELECT wishlist_id FROM wishlists WHERE customer_id = $1', [userId]);
  if (existing.rows.length > 0) {
    return existing.rows[0].wishlist_id;
  }
  
  // Verify user is actually a customer
  const customerCheck = await pool.query('SELECT customer_id FROM customers WHERE customer_id = $1', [userId]);
  if (customerCheck.rows.length === 0) {
    return null;
  }

  const result = await pool.query('INSERT INTO wishlists (customer_id) VALUES ($1) RETURNING wishlist_id', [userId]);
  return result.rows[0].wishlist_id;
};

// GET WISHLIST ITEMS
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlistId = await getOrCreateWishlist(userId);
    if (!wishlistId) {
      return res.json({ wishlistId: null, items: [] });
    }
    const query = `
      SELECT 
        wi.wishlist_item_id, wi.product_id,
        p.*, 
        c.name as category_name,
        pc.name as parent_category_name,
        s.store_name as seller_name,
        COALESCE(
          (SELECT json_agg(v.*) FROM product_variants v WHERE v.product_id = p.product_id),
          '[]'::json
        ) as variant_items,
        COALESCE(
          (SELECT json_agg(img.image_url ORDER BY img.sort_order ASC) FROM product_images img WHERE img.product_id = p.product_id),
          '[]'::json
        ) as images,
        (SELECT AVG(rating) FROM reviews WHERE product_id = p.product_id) as average_rating,
        (SELECT COUNT(*) FROM reviews WHERE product_id = p.product_id) as reviews_count
      FROM wishlist_items wi
      JOIN products p ON wi.product_id = p.product_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN categories pc ON c.parent_category_id = pc.category_id
      LEFT JOIN sellers s ON p.seller_id = s.seller_id
      WHERE wi.wishlist_id = $1
      ORDER BY wi.added_at DESC
    `;
    const result = await pool.query(query, [wishlistId]);
    res.json({ wishlistId, items: result.rows });
  } catch (err) {
    console.error('Wishlist Fetch Error:', err);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
});

// TOGGLE WISHLIST ITEM (Add if not exists, remove if exists)
router.post('/toggle', async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ message: 'userId and productId are required' });
  }

  try {
    const wishlistId = await getOrCreateWishlist(userId);
    
    // Check if exists
    const check = await pool.query('SELECT wishlist_item_id FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2', [wishlistId, productId]);
    
    if (check.rows.length > 0) {
      // Remove
      await pool.query('DELETE FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2', [wishlistId, productId]);
      return res.json({ message: 'Removed from wishlist', action: 'removed' });
    } else {
      // Add
      await pool.query('INSERT INTO wishlist_items (wishlist_id, product_id) VALUES ($1, $2)', [wishlistId, productId]);
      return res.status(201).json({ message: 'Added to wishlist', action: 'added' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to toggle wishlist item' });
  }
});

module.exports = router;
