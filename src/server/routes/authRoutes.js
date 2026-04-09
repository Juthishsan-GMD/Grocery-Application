const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// SIGNUP
router.post('/signup', async (req, res) => {
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
    if (client) await client.query('ROLLBACK'); // Rollback on error
    console.error('Signup Error Detailed:', err);
    res.status(500).json({ message: 'Server error during signup. ' + err.message });
  } finally {
    if (client) client.release();
  }
});

// LOGIN
router.post('/login', async (req, res) => {
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

// UPDATE PROFILE
router.put('/profile/:id', async (req, res) => {
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

module.exports = router;
