const express = require('express');
const router = express.Router();
const pool = require('../config/db');

let productsColumnsCache = null;
let productsColumnsCacheAt = 0;
const PRODUCTS_COLUMNS_TTL_MS = 60 * 1000;

const toNullable = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  return value;
};

const toNumberOrDefault = (value, defaultValue = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : defaultValue;
};

const formatProduct = (p) => {
  const images = Array.isArray(p.images) ? p.images : [];
  return {
    ...p,
    id: p.product_id,
    stock: p.stock_quantity,
    categoryId: p.category_id ?? null,
    category: p.parent_category_name || p.category_name || "General",
    subCategory: p.parent_category_id ? p.category_name : "",
    image: images.length > 0 ? images[0] : null,
    images: images,
    variants: (Array.isArray(p.variant_items) ? p.variant_items : []).map(v => ({
      ...v,
      unit: v.variant_value,
      stock: v.stock_quantity,
      mrp: v.mrp || v.price
    })),
    variantItems: (Array.isArray(p.variant_items) ? p.variant_items : []).map(v => ({
      ...v,
      unit: v.variant_value,
      stock: v.stock_quantity,
      mrp: v.mrp || v.price
    })),
    rating: Number(p.average_rating || 0).toFixed(1),
    reviewsCount: Number(p.reviews_count || 0),
    is_active: Boolean(p.is_active)
  };
};

const GET_PRODUCT_QUERY = `
  SELECT p.*, s.store_name as seller, 
         a.full_name as admin_name,
         c.name as category_name, 
         c.parent_category_id,
         pc.name as parent_category_name,
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
  FROM products p
  LEFT JOIN sellers s ON p.seller_id = s.seller_id
  LEFT JOIN admins a ON p.admin_id = a.admin_id
  LEFT JOIN categories c ON p.category_id = c.category_id
  LEFT JOIN categories pc ON c.parent_category_id = pc.category_id
`;

const getProductsColumns = async () => {
  const now = Date.now();
  if (productsColumnsCache && (now - productsColumnsCacheAt) < PRODUCTS_COLUMNS_TTL_MS) {
    return productsColumnsCache;
  }

  const result = await pool.query(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products'
    `
  );

  const cols = new Set(result.rows.map(r => r.column_name));
  productsColumnsCache = cols;
  productsColumnsCacheAt = now;
  return cols;
};

const buildProductMutationFromPayload = (payload, cols) => {
  const columnCandidates = {
    name: ['name'],
    sku: ['sku'],
    sellerId: ['seller_id'],
    adminId: ['admin_id'],
    category: ['category'],
    categoryId: ['category_id'],
    subCategory: ['subcategory', 'sub_category'],
    price: ['price'],
    mrp: ['mrp'],
    stock: ['stock_quantity', 'stock'],
    description: ['description'],
    image: ['image_url', 'image'],
    brand: ['brand'],
    weight: ['weight'],
    length: ['length'],
    breadth: ['breadth'],
    height: ['height'],
    variants: ['variants'],
    is_active: ['is_active', 'isactive'],
    featured: ['featured'],
    images: ['images'],
  };

  const primaryImage = toNullable(payload.image) || (Array.isArray(payload.images) && payload.images.length > 0 ? payload.images[0] : null);
  const normalizedVariants = Array.isArray(payload.variants) ? payload.variants : [];

  const valuesByPayloadKey = {
    name: payload.name,
    sku: toNullable(payload.sku),
    sellerId: toNullable(payload.sellerId),
    adminId: toNullable(payload.adminId),
    category: toNullable(payload.category),
    categoryId: toNullable(payload.categoryId),
    subCategory: toNullable(payload.subCategory),
    price: toNumberOrDefault(payload.price, 0),
    mrp: toNumberOrDefault(payload.mrp, toNumberOrDefault(payload.price, 0)),
    stock: toNumberOrDefault(payload.stock, 0),
    description: toNullable(payload.description),
    image: primaryImage,
    brand: toNullable(payload.brand),
    weight: toNumberOrDefault(payload.weight, 0),
    length: toNumberOrDefault(payload.length, 0),
    breadth: toNumberOrDefault(payload.breadth, 0),
    height: toNumberOrDefault(payload.height, 0),
    variants: JSON.stringify(normalizedVariants),
    is_active: payload.is_active ?? true,
    featured: Boolean(payload.featured),
    images: Array.isArray(payload.images) ? JSON.stringify(payload.images) : null,
  };

  const columns = [];
  const values = [];

  for (const [payloadKey, candidates] of Object.entries(columnCandidates)) {
    const matchedColumn = candidates.find(c => cols.has(c));
    if (!matchedColumn) continue;
    columns.push(matchedColumn);
    values.push(valuesByPayloadKey[payloadKey]);
  }

  return { columns, values };
};

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`${GET_PRODUCT_QUERY} ORDER BY p.created_at DESC`);
    res.json(result.rows.map(formatProduct));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GET SELLER PRODUCTS
router.get('/seller/:sellerId', async (req, res) => {
  const { sellerId } = req.params;
  try {
    const result = await pool.query(`${GET_PRODUCT_QUERY} WHERE p.seller_id = $1 ORDER BY p.created_at DESC`, [sellerId]);
    res.json(result.rows.map(formatProduct));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch seller products' });
  }
});

// ADD PRODUCT
router.post('/', async (req, res) => {
  const payload = req.body;

  try {
    const cols = await getProductsColumns();
    const { columns, values } = buildProductMutationFromPayload(payload, cols);

    const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');
    const query = `INSERT INTO products (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;

    const result = await pool.query(query, values);
    const newProduct = result.rows[0];
    const productId = newProduct.product_id;

    // Sync Variants Table (product_variants)
    if (Array.isArray(payload.variants)) {
      for (const v of payload.variants) {
        const variantSku = v.sku || (payload.sku ? `${payload.sku}-${(v.unit || v.variant_value || '').replace(/\s+/g, '').toUpperCase()}` : null);
        await pool.query(
          'INSERT INTO product_variants (product_id, sku, variant_name, variant_value, price, mrp, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [
            productId, 
            variantSku, 
            v.name || v.variant_name || 'Unit', 
            v.unit || v.value || v.variant_value, 
            toNumberOrDefault(v.price), 
            toNumberOrDefault(v.mrp || v.price),
            toNumberOrDefault(v.stock || v.stock_quantity)
          ]
        );
      }
    }

    // Sync Images Table (product_images)
    if (Array.isArray(payload.images)) {
      for (let i = 0; i < payload.images.length; i++) {
        await pool.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ($1, $2, $3, $4)',
          [productId, payload.images[i], i === 0, i]
        );
      }
    }

    const finalResult = await pool.query(`${GET_PRODUCT_QUERY} WHERE p.product_id = $1`, [productId]);
    res.status(201).json(formatProduct(finalResult.rows[0]));
  } catch (err) {
    console.error('Add Product Error:', err);
    res.status(500).json({ message: 'Failed to add product: ' + err.message });
  }
});

// UPDATE STOCK ONLY
router.patch('/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE product_id = $2 RETURNING *',
      [stock, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    
    const finalResult = await pool.query(`${GET_PRODUCT_QUERY} WHERE p.product_id = $1`, [id]);
    res.json(formatProduct(finalResult.rows[0]));
  } catch (err) {
    console.error('Update Stock Error:', err);
    res.status(500).json({ message: 'Failed to update stock' });
  }
});

// UPDATE PRODUCT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  try {
    const cols = await getProductsColumns();
    const { columns, values } = buildProductMutationFromPayload(payload, cols);

    const setClause = columns.map((c, idx) => `${c} = $${idx + 1}`).join(', ');
    const result = await pool.query(`UPDATE products SET ${setClause} WHERE product_id = $${columns.length + 1} RETURNING *`, [...values, id]);
    
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    const updatedProduct = result.rows[0];

    // Sync Variants
    if (Array.isArray(payload.variants)) {
      await pool.query('DELETE FROM product_variants WHERE product_id = $1', [id]);
      for (const v of payload.variants) {
        const variantSku = v.sku || (payload.sku ? `${payload.sku}-${(v.unit || v.variant_value || '').replace(/\s+/g, '').toUpperCase()}` : null);
        await pool.query(
          'INSERT INTO product_variants (product_id, sku, variant_name, variant_value, price, mrp, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [
            id, 
            variantSku, 
            v.name || v.variant_name || 'Unit', 
            v.unit || v.value || v.variant_value, 
            toNumberOrDefault(v.price), 
            toNumberOrDefault(v.mrp || v.price),
            toNumberOrDefault(v.stock || v.stock_quantity)
          ]
        );
      }
    }

    // Sync Images
    if (Array.isArray(payload.images)) {
      await pool.query('DELETE FROM product_images WHERE product_id = $1', [id]);
      for (let i = 0; i < payload.images.length; i++) {
        await pool.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ($1, $2, $3, $4)',
          [id, payload.images[i], i === 0, i]
        );
      }
    }

    const finalResult = await pool.query(`${GET_PRODUCT_QUERY} WHERE p.product_id = $1`, [id]);
    res.json(formatProduct(finalResult.rows[0]));
  } catch (err) {
    console.error('Update Product Error:', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// DELETE PRODUCT
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE product_id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
