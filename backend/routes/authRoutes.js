const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { createNotification } = require('../lib/notifications');

// SEND OTP
router.post('/send-otp', async (req, res) => {
  const { email, role = 'buyer' } = req.body;
  
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const client = await pool.connect();
  try {
    let tableName = 'customers';
    if (role === 'admin') tableName = 'admins';
    else if (role === 'seller') tableName = 'sellers';

    const userResult = await client.query(`SELECT * FROM ${tableName} WHERE email = $1`, [email]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await client.query(
      `INSERT INTO otp_verifications (user_type, contact, otp_hash, purpose, expires_at) VALUES ($1, $2, $3, $4, $5)`,
      [role, email, otpHash, 'signup', expiresAt]
    );

    // Send Email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail({
          from: '"Grocery App" <noreply@grocery.com>',
          to: email,
          subject: 'Your Signup OTP',
          text: `Your OTP for signup is: ${otp}. It expires in 10 minutes.`
        });
      } else {
        console.log(`[OTP GENERATED] Email: ${email}, OTP: ${otp}`);
      }
    } catch (mailErr) {
      console.log(`[OTP GENERATED (Mail Failed)] Email: ${email}, OTP: ${otp}`);
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP Error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  } finally {
    if (client) client.release();
  }
});

// SIGNUP
router.post('/signup', async (req, res) => {
  const { name, email, password, role = 'buyer', phone, storeName, address, otp } = req.body;
  
  if (!otp) return res.status(400).json({ message: 'OTP is required' });
  const client = await pool.connect();
  try {
    let tableName = 'customers';
    let idColumn = 'customer_id';
    
    if (role === 'admin') { tableName = 'admins'; idColumn = 'admin_id'; }
    else if (role === 'seller') { tableName = 'sellers'; idColumn = 'seller_id'; }

    const userResult = await client.query(`SELECT * FROM ${tableName} WHERE email = $1`, [email]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check OTP
    const otpResult = await client.query(
      `SELECT * FROM otp_verifications 
       WHERE contact = $1 AND purpose = 'signup' AND is_used = FALSE AND expires_at > NOW() 
       ORDER BY created_at DESC LIMIT 1`,
      [email]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new one.' });
    }

    const validOtp = await bcrypt.compare(otp, otpResult.rows[0].otp_hash);
    if (!validOtp) {
      await client.query(`UPDATE otp_verifications SET attempts = attempts + 1 WHERE otp_id = $1`, [otpResult.rows[0].otp_id]);
      return res.status(400).json({ message: 'Incorrect OTP' });
    }

    // Mark OTP as used
    await client.query(`UPDATE otp_verifications SET is_used = TRUE WHERE otp_id = $1`, [otpResult.rows[0].otp_id]);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let query = '';
    let values = [];
    let idCol = 'customer_id';

    if (role === 'buyer') {
      query = 'INSERT INTO customers (full_name, email, password_hash, phone, is_email_verified) VALUES ($1, $2, $3, $4, TRUE) RETURNING customer_id as id';
      values = [name, email, hashedPassword, phone || ''];
      idCol = 'customer_id';
    } else if (role === 'admin') {
      query = 'INSERT INTO admins (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING admin_id as id';
      values = [name, email, hashedPassword, role];
      idCol = 'admin_id';
    } else if (role === 'seller') {
      query = 'INSERT INTO sellers (full_name, email, password_hash, store_name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING seller_id as id';
      values = [name, email, hashedPassword, storeName || 'New Store', phone || ''];
      idCol = 'seller_id';
    }

    const result = await client.query(query, values);
    const userId = result.rows[0].id;

    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const userObj = { id: userId, name, email, role, phone, storeName, address, onboardingDone: false };

    // --- DYNAMIC NOTIFICATIONS ---
    if (role === 'buyer' || role === 'seller') {
      await createNotification({
        adminId: 'ADM001',
        type: 'info',
        title: `New ${role === 'buyer' ? 'Customer' : 'Seller'} Joined`,
        message: `${name} has registered as a ${role === 'buyer' ? 'customer' : 'seller'}.`
      });
    }
    // ----------------------------

    // Record session
    await recordSession(userObj, req, token);

    res.status(201).json({ token, user: userObj });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup. ' + err.message });
  } finally {
    if (client) client.release();
  }
});

// Helper to record auth session
const recordSession = async (user, req, token) => {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days session
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await pool.query(
      `INSERT INTO auth_sessions (user_type, user_ref_id, token_hash, device_info, ip_address, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.role, user.id, tokenHash, req.headers['user-agent']?.slice(0, 64), req.ip || '0.0.0.0', expiresAt]
    );
  } catch (err) {
    console.error('Session Recording Error:', err);
  }
};

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body; 

  try {
    let user = null;
    const checkUser = async (table, idCol) => {
      const res = await pool.query(`SELECT *, ${idCol} as id, password_hash as password, full_name as name FROM ${table} WHERE email = $1`, [email]);
      return res.rows[0] ? { ...res.rows[0], role: table.slice(0, -1) === 'customer' ? 'buyer' : table.slice(0, -1) } : null;
    };

    if (role === 'admin') user = await checkUser('admins', 'admin_id');
    else if (role === 'seller') user = await checkUser('sellers', 'seller_id');
    else if (role === 'buyer') user = await checkUser('customers', 'customer_id');
    else {
      user = await checkUser('customers', 'customer_id') || 
             await checkUser('sellers', 'seller_id') || 
             await checkUser('admins', 'admin_id');
    }

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Record session
    await recordSession(user, req, token);
    res.json({ token, user: { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      phone: user.phone || user.phone_no,
      storeName: user.store_name,
      address: user.address,
      onboardingDone: user.role === 'seller' ? !!user.store_description : undefined
    }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// UPDATE PROFILE
router.put('/profile/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role, phone, address, ...extraData } = req.body;

  try {
    if (role === 'buyer') {
      // Update customer table
      await pool.query(
        'UPDATE customers SET full_name = $1, email = $2, phone = $3 WHERE customer_id = $4',
        [name, email, phone, id]
      );
    } else if (role === 'seller') {
      // Logic for sellers table
      await pool.query(
        'UPDATE sellers SET full_name = $1, email = $2, store_name = $3, phone = $4 WHERE seller_id = $5',
        [name, email, extraData.storeName, phone, id]
      );
    } else if (role === 'admin') {
      // Logic for admins table
      await pool.query(
        'UPDATE admins SET full_name = $1, email = $2 WHERE admin_id = $3',
        [name, email, id]
      );
    }

    res.json({ message: 'Profile updated successfully', user: { id, name, email, role, phone, address, ...extraData } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// GET ALL CUSTOMERS (ADMIN)
router.get('/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT customer_id, full_name as name, email, phone, is_active, created_at FROM customers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
});

// GET PROFILE STATS
router.get('/profile/:id/stats', async (req, res) => {
  const { id } = req.params;
  try {
    const statsQuery = `
      SELECT 
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE customer_id = $1 AND order_status != 'Cancelled') as total_spent,
        (SELECT COUNT(*) FROM orders WHERE customer_id = $1) as orders_count,
        (SELECT COUNT(*) FROM wishlist_items wi JOIN wishlists w ON wi.wishlist_id = w.wishlist_id WHERE w.customer_id = $1) as wishlist_count,
        (SELECT city || ', ' || state FROM addresses WHERE customer_id = $1 AND is_default = TRUE LIMIT 1) as default_address
    `;
    const result = await pool.query(statsQuery, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile stats' });
  }
});

module.exports = router;
