const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env'), override: true });

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL local_db');
});

// ── Auth Routes ──────────────────────────────────────────────

// SIGNUP
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role = 'buyer', storeName, phone, address } = req.body;
  
  const client = await pool.connect();
  try {
    const userResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await client.query('BEGIN'); // Start Transaction

    // 1. Insert into base users table
    const newUser = await client.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, hashedPassword, role]
    );
    const userId = newUser.rows[0].id;

    // 2. Role-specific table insertion
    if (role === 'seller') {
      await client.query(
        'INSERT INTO sellers (id, name, email, store_name, phone, address) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, name, email, storeName || 'New Store', phone || '', address || '']
      );
    } else if (role === 'admin') {
      await client.query(
        'INSERT INTO admins (id, name, email) VALUES ($1, $2, $3)',
        [userId, name, email]
      );
    } else {
      await client.query(
        'INSERT INTO buyers (id, name, email) VALUES ($1, $2, $3)',
        [userId, name, email]
      );
    }

    await client.query('COMMIT'); // Commit Transaction

    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, name, email, role, storeName, phone, address } });
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error('Signup Error Detailed:', err);
    res.status(500).json({ message: 'Server error during signup. ' + err.message });
  } finally {
    client.release();
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    let extraData = {};
    if (user.role === 'seller') {
      const sellerRes = await pool.query('SELECT * FROM sellers WHERE id = $1', [user.id]);
      if (sellerRes.rows.length > 0) {
        extraData = { 
          storeName: sellerRes.rows[0].store_name, 
          phone: sellerRes.rows[0].phone, 
          address: sellerRes.rows[0].address 
        };
      }
    } else if (user.role === 'admin') {
      const adminRes = await pool.query('SELECT * FROM admins WHERE id = $1', [user.id]);
      if (adminRes.rows.length > 0) extraData = { super: adminRes.rows[0].is_super };
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, ...extraData } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET ALL PRODUCTS
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    // Map back some field names if needed (subCategory vs subcategory)
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
app.post('/api/products', async (req, res) => {
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
    res.status(500).json(message || 'Failed to add product');
  }
});

// ── Orders Routes ─────────────────────────────────────────────

// GET ALL ORDERS (for Admin)
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// CREATE NEW ORDER
app.post('/api/orders', async (req, res) => {
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
app.put('/api/orders/:id/status', async (req, res) => {
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

// UPDATE PRODUCT
app.put('/api/products/:id', async (req, res) => {
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
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// UPDATE PROFILE
app.put('/api/auth/profile/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role, ...extraData } = req.body;

  try {
    // 1. Update base users table
    await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id]
    );

    // 2. Update role-specific table
    if (role === 'seller') {
      await pool.query(
        'UPDATE sellers SET name = $1, email = $2, store_name = $3, phone = $4, address = $5 WHERE id = $6',
        [name, email, extraData.storeName, extraData.phone, extraData.address, id]
      );
    } else if (role === 'admin') {
      await pool.query(
        'UPDATE admins SET name = $1, email = $2, phone = $3, address = $4 WHERE id = $5',
        [name, email, extraData.phone, extraData.address, id]
      );
    } else if (role === 'buyer') {
      await pool.query(
        'UPDATE buyers SET name = $1, email = $2, phone = $3, address = $4 WHERE id = $5',
        [name, email, extraData.phone, extraData.address, id]
      );
    }

    res.json({ message: 'Profile updated successfully', user: { id, name, email, role, ...extraData } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
