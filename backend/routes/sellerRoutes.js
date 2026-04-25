const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { createNotification } = require('../lib/notifications');

// GET BANK ACCOUNT
router.get('/bank/:sellerId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bank_accounts WHERE owner_id = $1 AND owner_type = \'Seller\'', [req.params.sellerId]);
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bank details' });
  }
});

// ONBOARDING SUBMISSION
router.post('/onboarding', async (req, res) => {
  const { sellerId, business, tax, bank, store, kyc, compliance } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Update Seller Profile (Store info & Socials)
    await client.query(
      `UPDATE sellers 
       SET store_name = $1, store_description = $2, gstin = $3, pickup_address = $4, return_address = $5, 
           instagram_url = $6, facebook_url = $7, twitter_url = $8, is_verified = FALSE 
       WHERE seller_id = $9`,
      [store.storeName, store.storeDescription, tax.gstin, store.pickupAddress, store.returnAddress, 
       store.instagramUrl, store.facebookUrl, store.twitterUrl, sellerId]
    );

    // 2. Add/Update Seller Businesses
    const existingBusiness = await client.query('SELECT business_id FROM seller_businesses WHERE seller_id = $1', [sellerId]);
    if (existingBusiness.rows.length > 0) {
      await client.query(
        `UPDATE seller_businesses SET business_type = $1, business_name = $2, address_line_1 = $3, city = $4, state = $5, pincode = $6 WHERE seller_id = $7`,
        [business.businessType, business.businessName, business.address, business.city, business.state, business.pincode, sellerId]
      );
    } else {
      await client.query(
        `INSERT INTO seller_businesses (seller_id, business_type, business_name, address_line_1, city, state, pincode) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [sellerId, business.businessType, business.businessName, business.address, business.city, business.state, business.pincode]
      );
    }

    // 3. Add/Update Seller KYC
    const existingKyc = await client.query('SELECT kyc_id FROM seller_kyc WHERE seller_id = $1', [sellerId]);
    if (existingKyc.rows.length > 0) {
      await client.query(
        `UPDATE seller_kyc SET kyc_type = $1, pan_number = $2, aadhaar_number = $3, gstin_number = $4, document_number = $5 WHERE seller_id = $6`,
        [kyc.kycType, kyc.panNumber, kyc.aadhaarNumber, kyc.gstinNumber, kyc.documentNumber, sellerId]
      );
    } else {
      await client.query(
        `INSERT INTO seller_kyc (seller_id, kyc_type, pan_number, aadhaar_number, gstin_number, document_number) VALUES ($1, $2, $3, $4, $5, $6)`,
        [sellerId, kyc.kycType, kyc.panNumber, kyc.aadhaarNumber, kyc.gstinNumber, kyc.documentNumber]
      );
    }

    // 4. Add/Update Seller Agreements
    const existingAgreements = await client.query('SELECT agreement_id FROM seller_agreements WHERE seller_id = $1', [sellerId]);
    if (existingAgreements.rows.length > 0) {
      await client.query(
        `UPDATE seller_agreements SET terms_accepted = $1, privacy_accepted = $2, seller_policy_accepted = $3 WHERE seller_id = $4`,
        [compliance.termsAccepted, compliance.privacyAccepted, compliance.sellerPolicyAccepted, sellerId]
      );
    } else {
      await client.query(
        `INSERT INTO seller_agreements (seller_id, terms_accepted, privacy_accepted, seller_policy_accepted) VALUES ($1, $2, $3, $4)`,
        [sellerId, compliance.termsAccepted, compliance.privacyAccepted, compliance.sellerPolicyAccepted]
      );
    }

    // 5. Add/Update Bank Account
    const existingBank = await client.query('SELECT bank_account_id FROM bank_accounts WHERE owner_id = $1 AND owner_type = \'Seller\'', [sellerId]);
    if (existingBank.rows.length > 0) {
      await client.query(
        `UPDATE bank_accounts 
         SET account_number = $1, account_holder_name = $2, upi_id = $3, bank_name = $4, ifsc_code = $5, account_type = $6 
         WHERE owner_id = $7 AND owner_type = 'Seller'`,
        [bank.accountNumber, bank.accountHolderName, bank.upiId, bank.bankName, bank.ifscCode, bank.accountType, sellerId]
      );
    } else {
      await client.query(
        `INSERT INTO bank_accounts (owner_id, owner_type, account_number, account_holder_name, upi_id, bank_name, ifsc_code, account_type, is_primary)
         VALUES ($1, 'Seller', $2, $3, $4, $5, $6, $7, TRUE)`,
        [sellerId, bank.accountNumber, bank.accountHolderName, bank.upiId, bank.bankName, bank.ifscCode, bank.accountType]
      );
    }

    await client.query('COMMIT');

    // Notify Admin about new onboarding completion
    await createNotification({
      adminId: 'ADM001',
      type: 'warning',
      title: 'New Seller Onboarding',
      message: `Seller ${store.storeName} (${sellerId}) has completed onboarding and is awaiting verification.`
    });

    res.json({ message: 'Onboarding data saved successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Onboarding failed' });
  } finally {
    client.release();
  }
});

// VERIFY/APPROVE SELLER (Admin)
router.post('/:sellerId/verify', async (req, res) => {
  const { sellerId } = req.params;
  const { approvedBy } = req.body; // adminId

  try {
    await pool.query(
      'UPDATE sellers SET is_verified = TRUE, approved_by_admin_id = $1, updated_at = CURRENT_TIMESTAMP WHERE seller_id = $2',
      [approvedBy, sellerId]
    );

    // Notify Seller
    await createNotification({
      sellerId,
      type: 'success',
      title: 'Store Verified!',
      message: 'Your store has been verified by the admin. You can now start selling products.'
    });

    res.json({ message: 'Seller verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to verify seller' });
  }
});

// UPDATE KYC STATUS (Admin)
router.post('/:sellerId/kyc/status', async (req, res) => {
  const { sellerId } = req.params;
  const { status, note } = req.body; // 'Approved', 'Rejected'

  try {
    await pool.query(
      'UPDATE seller_kyc SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE seller_id = $2',
      [status, sellerId]
    );

    // Notify Seller
    await createNotification({
      sellerId,
      type: status === 'Approved' ? 'success' : 'error',
      title: `KYC ${status}`,
      message: status === 'Approved' 
        ? 'Your KYC documents have been approved.' 
        : `Your KYC documents were rejected. Reason: ${note || 'Please re-upload valid documents.'}`
    });

    res.json({ message: `KYC ${status} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update KYC status' });
  }
});

module.exports = router;
