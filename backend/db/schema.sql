-- Database Schema Migrations for Grocery Application

-- Function for updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Create Gender ENUM if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_enum') THEN
        CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other', 'Prefer Not to Say');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'finance_transaction_type') THEN
        CREATE TYPE finance_transaction_type AS ENUM ('Sale', 'Refund', 'Payout', 'Adjustment');
    END IF;
END $$;

-- ==========================================
-- CUSTOM ID GENERATION LOGIC
-- ==========================================

-- Sequences for all tables
CREATE SEQUENCE IF NOT EXISTS customer_id_seq;
CREATE SEQUENCE IF NOT EXISTS admin_id_seq;
CREATE SEQUENCE IF NOT EXISTS seller_id_seq;
CREATE SEQUENCE IF NOT EXISTS category_id_seq;
CREATE SEQUENCE IF NOT EXISTS product_id_seq;
CREATE SEQUENCE IF NOT EXISTS variant_id_seq;
CREATE SEQUENCE IF NOT EXISTS image_id_seq;
CREATE SEQUENCE IF NOT EXISTS cart_id_seq;
CREATE SEQUENCE IF NOT EXISTS cart_item_id_seq;
CREATE SEQUENCE IF NOT EXISTS wishlist_id_seq;
CREATE SEQUENCE IF NOT EXISTS wishlist_item_id_seq;
CREATE SEQUENCE IF NOT EXISTS order_id_seq;
CREATE SEQUENCE IF NOT EXISTS address_id_seq;
CREATE SEQUENCE IF NOT EXISTS order_item_id_seq;
CREATE SEQUENCE IF NOT EXISTS coupon_id_seq;
CREATE SEQUENCE IF NOT EXISTS coupon_usage_id_seq;
CREATE SEQUENCE IF NOT EXISTS order_coupon_id_seq;
CREATE SEQUENCE IF NOT EXISTS review_id_seq;
CREATE SEQUENCE IF NOT EXISTS payment_id_seq;
CREATE SEQUENCE IF NOT EXISTS bank_account_id_seq;
CREATE SEQUENCE IF NOT EXISTS order_seller_id_seq;
CREATE SEQUENCE IF NOT EXISTS auth_session_id_seq;
CREATE SEQUENCE IF NOT EXISTS otp_id_seq;
CREATE SEQUENCE IF NOT EXISTS notification_id_seq;
CREATE SEQUENCE IF NOT EXISTS pickup_id_seq;
CREATE SEQUENCE IF NOT EXISTS seller_business_id_seq;
CREATE SEQUENCE IF NOT EXISTS seller_payout_id_seq;
CREATE SEQUENCE IF NOT EXISTS daily_finance_id_seq;
CREATE SEQUENCE IF NOT EXISTS weekly_finance_id_seq;
CREATE SEQUENCE IF NOT EXISTS monthly_finance_id_seq;
CREATE SEQUENCE IF NOT EXISTS quarterly_finance_id_seq;
CREATE SEQUENCE IF NOT EXISTS finance_transaction_id_seq;
CREATE SEQUENCE IF NOT EXISTS half_yearly_finance_id_seq;
CREATE SEQUENCE IF NOT EXISTS annual_finance_id_seq;
CREATE SEQUENCE IF NOT EXISTS seller_kyc_id_seq;
CREATE SEQUENCE IF NOT EXISTS seller_agreement_id_seq;
CREATE SEQUENCE IF NOT EXISTS shiprocket_order_id_seq;
CREATE SEQUENCE IF NOT EXISTS shiprocket_payload_id_seq;
CREATE SEQUENCE IF NOT EXISTS shiprocket_tracking_id_seq;
CREATE SEQUENCE IF NOT EXISTS shiprocket_webhook_id_seq;
CREATE SEQUENCE IF NOT EXISTS delivery_id_seq;
CREATE SEQUENCE IF NOT EXISTS reverse_id_seq;
CREATE SEQUENCE IF NOT EXISTS return_request_id_seq;
CREATE SEQUENCE IF NOT EXISTS commission_id_seq;
CREATE SEQUENCE IF NOT EXISTS audit_id_seq;
CREATE SEQUENCE IF NOT EXISTS order_status_history_id_seq;

-- Table-specific formatting functions
CREATE OR REPLACE FUNCTION format_customer_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.customer_id IS NULL THEN NEW.customer_id := 'CUS' || LPAD(nextval('customer_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_admin_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.admin_id IS NULL THEN NEW.admin_id := 'ADM' || LPAD(nextval('admin_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_seller_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.seller_id IS NULL THEN NEW.seller_id := 'SEL' || LPAD(nextval('seller_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_category_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.category_id IS NULL THEN NEW.category_id := 'CAT' || LPAD(nextval('category_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_product_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.product_id IS NULL THEN NEW.product_id := 'PRO' || LPAD(nextval('product_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_variant_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.variant_id IS NULL THEN NEW.variant_id := 'VAR' || LPAD(nextval('variant_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_image_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.image_id IS NULL THEN NEW.image_id := 'IMG' || LPAD(nextval('image_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_cart_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cart_id IS NULL THEN NEW.cart_id := 'CRT' || LPAD(nextval('cart_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_cart_item_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cart_item_id IS NULL THEN NEW.cart_item_id := 'CIT' || LPAD(nextval('cart_item_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_wishlist_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.wishlist_id IS NULL THEN NEW.wishlist_id := 'WIS' || LPAD(nextval('wishlist_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_wishlist_item_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.wishlist_item_id IS NULL THEN NEW.wishlist_item_id := 'WIT' || LPAD(nextval('wishlist_item_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_order_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_id IS NULL THEN NEW.order_id := 'ORD' || LPAD(nextval('order_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_address_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.address_id IS NULL THEN NEW.address_id := 'ADR' || LPAD(nextval('address_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_order_item_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_item_id IS NULL THEN NEW.order_item_id := 'OIT' || LPAD(nextval('order_item_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_coupon_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.coupon_id IS NULL THEN NEW.coupon_id := 'CPN' || LPAD(nextval('coupon_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_coupon_usage_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.usage_id IS NULL THEN NEW.usage_id := 'USG' || LPAD(nextval('coupon_usage_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_order_coupon_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_coupon_id IS NULL THEN NEW.order_coupon_id := 'OCP' || LPAD(nextval('order_coupon_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_review_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.review_id IS NULL THEN NEW.review_id := 'REV' || LPAD(nextval('review_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_payment_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_id IS NULL THEN NEW.payment_id := 'PAY' || LPAD(nextval('payment_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_bank_account_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.bank_account_id IS NULL THEN NEW.bank_account_id := 'BNK' || LPAD(nextval('bank_account_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_order_seller_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_seller_id IS NULL THEN NEW.order_seller_id := 'OSL' || LPAD(nextval('order_seller_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_auth_session_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.session_id IS NULL THEN NEW.session_id := 'SES' || LPAD(nextval('auth_session_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_otp_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.otp_id IS NULL THEN NEW.otp_id := 'OTP' || LPAD(nextval('otp_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_notification_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.notification_id IS NULL THEN NEW.notification_id := 'NOT' || LPAD(nextval('notification_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_pickup_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.pickup_id IS NULL THEN NEW.pickup_id := 'PKP' || LPAD(nextval('pickup_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_seller_business_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.business_id IS NULL THEN NEW.business_id := 'SBU' || LPAD(nextval('seller_business_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_seller_kyc_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.kyc_id IS NULL THEN NEW.kyc_id := 'SKY' || LPAD(nextval('seller_kyc_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_seller_agreement_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.agreement_id IS NULL THEN NEW.agreement_id := 'SAG' || LPAD(nextval('seller_agreement_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_seller_payout_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.seller_payout_id IS NULL THEN NEW.seller_payout_id := 'SP' || LPAD(nextval('seller_payout_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_daily_finance_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.daily_finance_id IS NULL THEN NEW.daily_finance_id := 'DF' || LPAD(nextval('daily_finance_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_weekly_finance_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.weekly_finance_id IS NULL THEN NEW.weekly_finance_id := 'WF' || LPAD(nextval('weekly_finance_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_monthly_finance_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.monthly_finance_id IS NULL THEN NEW.monthly_finance_id := 'MF' || LPAD(nextval('monthly_finance_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_quarterly_finance_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quarterly_finance_id IS NULL THEN NEW.quarterly_finance_id := 'QF' || LPAD(nextval('quarterly_finance_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_finance_transaction_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.finance_transaction_id IS NULL THEN NEW.finance_transaction_id := 'FT' || LPAD(nextval('finance_transaction_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_half_yearly_finance_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.half_yearly_finance_id IS NULL THEN NEW.half_yearly_finance_id := 'HF' || LPAD(nextval('half_yearly_finance_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_annual_finance_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.annual_finance_id IS NULL THEN NEW.annual_finance_id := 'AF' || LPAD(nextval('annual_finance_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_shiprocket_order_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sr_order_id IS NULL THEN NEW.sr_order_id := 'SRO' || LPAD(nextval('shiprocket_order_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_shiprocket_payload_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payload_id IS NULL THEN NEW.payload_id := 'SRP' || LPAD(nextval('shiprocket_payload_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_shiprocket_tracking_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tracking_id IS NULL THEN NEW.tracking_id := 'SRT' || LPAD(nextval('shiprocket_tracking_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_shiprocket_webhook_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.webhook_id IS NULL THEN NEW.webhook_id := 'SRW' || LPAD(nextval('shiprocket_webhook_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_delivery_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.delivery_id IS NULL THEN NEW.delivery_id := 'DLV' || LPAD(nextval('delivery_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_reverse_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reverse_id IS NULL THEN NEW.reverse_id := 'RSV' || LPAD(nextval('reverse_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_return_request_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.return_request_id IS NULL THEN NEW.return_request_id := 'RET' || LPAD(nextval('return_request_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_commission_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.commission_id IS NULL THEN NEW.commission_id := 'SCM' || LPAD(nextval('commission_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_audit_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.audit_id IS NULL THEN NEW.audit_id := 'ADT' || LPAD(nextval('audit_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION format_order_status_history_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.history_id IS NULL THEN NEW.history_id := 'OSH' || LPAD(nextval('order_status_history_id_seq')::text, 3, '0'); END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

-- 2. CUSTOMERS Table
CREATE TABLE IF NOT EXISTS customers (
    customer_id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    date_of_birth DATE,
    gender gender_enum,
    profile_picture_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ADMINS Table
CREATE TABLE IF NOT EXISTS admins (
    admin_id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_by_admin_id VARCHAR(20) REFERENCES admins(admin_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. SELLERS Table
CREATE TABLE IF NOT EXISTS sellers (
    seller_id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    store_name VARCHAR(255),
    gstin VARCHAR(50), 
    store_logo_url TEXT,
    store_description TEXT,
    pickup_address TEXT,
    return_address TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    approved_by_admin_id VARCHAR(20) REFERENCES admins(admin_id),
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. BANK_ACCOUNTS Table
CREATE TABLE IF NOT EXISTS bank_accounts (
    bank_account_id VARCHAR(20) PRIMARY KEY,
    owner_id VARCHAR(20) NOT NULL,
    owner_type VARCHAR(20) NOT NULL CHECK (owner_type IN ('Seller', 'Customer')),
    account_number VARCHAR(20),
    account_holder_name VARCHAR(255),
    upi_id VARCHAR(100),
    bank_name VARCHAR(100),
    ifsc_code VARCHAR(20),
    account_type VARCHAR(50),
    verification_status VARCHAR(50) DEFAULT 'Pending',
    verified_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by_admin_id VARCHAR(20) REFERENCES admins(admin_id)
);

-- 6. CATEGORIES Table
CREATE TABLE IF NOT EXISTS categories (
    category_id VARCHAR(20) PRIMARY KEY,
    admin_id VARCHAR(20) REFERENCES admins(admin_id),
    parent_category_id VARCHAR(20) REFERENCES categories(category_id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. PRODUCTS Table
CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    admin_id VARCHAR(20) REFERENCES admins(admin_id) ON DELETE CASCADE,
    category_id VARCHAR(20) REFERENCES categories(category_id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    mrp DECIMAL(10,2),
    stock_quantity INT DEFAULT 0,
    weight DECIMAL(10,2),
    length DECIMAL(10,2),
    breadth DECIMAL(10,2),
    height DECIMAL(10,2),
    unit VARCHAR(50) DEFAULT '1 pc',
    brand VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. PRODUCT_VARIANTS Table
CREATE TABLE IF NOT EXISTS product_variants (
    variant_id VARCHAR(20) PRIMARY KEY,
    product_id VARCHAR(20) REFERENCES products(product_id) ON DELETE CASCADE,
    sku VARCHAR(100),
    variant_name VARCHAR(100),
    variant_value VARCHAR(100),
    price DECIMAL(10,2),
    mrp DECIMAL(10,2),
    stock_quantity INT,
    is_active BOOLEAN DEFAULT TRUE
);

-- 9. PRODUCT_IMAGES Table
CREATE TABLE IF NOT EXISTS product_images (
    image_id VARCHAR(20) PRIMARY KEY,
    product_id VARCHAR(20) REFERENCES products(product_id) ON DELETE CASCADE,
    image_url TEXT,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. CARTS Table
CREATE TABLE IF NOT EXISTS carts (
    cart_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20) REFERENCES customers(customer_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. CART_ITEMS Table
CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id VARCHAR(20) PRIMARY KEY,
    cart_id VARCHAR(20) REFERENCES carts(cart_id) ON DELETE CASCADE,
    product_id VARCHAR(20) REFERENCES products(product_id) ON DELETE CASCADE,
    variant_id VARCHAR(20) REFERENCES product_variants(variant_id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. WISHLISTS Table
CREATE TABLE IF NOT EXISTS wishlists (
    wishlist_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20) REFERENCES customers(customer_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. WISHLIST_ITEMS Table
CREATE TABLE IF NOT EXISTS wishlist_items (
    wishlist_item_id VARCHAR(20) PRIMARY KEY,
    wishlist_id VARCHAR(20) REFERENCES wishlists(wishlist_id) ON DELETE CASCADE,
    product_id VARCHAR(20) REFERENCES products(product_id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. ADDRESSES Table
CREATE TABLE IF NOT EXISTS addresses (
    address_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20) REFERENCES customers(customer_id) ON DELETE CASCADE,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    address_type VARCHAR(50) DEFAULT 'Home',
    is_default BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. COUPONS Table
CREATE TABLE IF NOT EXISTS coupons (
    coupon_id VARCHAR(20) PRIMARY KEY,
    admin_id VARCHAR(20) REFERENCES admins(admin_id),
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) DEFAULT 'Percentage',
    discount_percent DECIMAL(5,2),
    max_discount DECIMAL(10,2),
    min_order_value DECIMAL(10,2),
    used_count INT DEFAULT 0,
    max_usage INT,
    is_active BOOLEAN DEFAULT TRUE,
    valid_until DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. ORDERS Table
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20) REFERENCES customers(customer_id) ON DELETE SET NULL,
    address_id VARCHAR(20) REFERENCES addresses(address_id) ON DELETE SET NULL,
    coupon_id VARCHAR(20) REFERENCES coupons(coupon_id) ON DELETE SET NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_charge DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'Processing',
    payment_status VARCHAR(50) DEFAULT 'Pending',
    payment_method VARCHAR(50),
    cancellation_reason TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. ORDER_ITEMS Table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id VARCHAR(20) PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id VARCHAR(20) NOT NULL REFERENCES products(product_id),
    variant_id VARCHAR(20) REFERENCES product_variants(variant_id),
    seller_id VARCHAR(20) REFERENCES sellers(seller_id),
    admin_id VARCHAR(20) REFERENCES admins(admin_id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    item_status VARCHAR(50) DEFAULT 'Processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17.5. ORDER_SELLERS Table
CREATE TABLE IF NOT EXISTS order_sellers (
    order_seller_id VARCHAR(20) PRIMARY KEY,
    order_id VARCHAR(20) REFERENCES orders(order_id) ON DELETE CASCADE,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    admin_id VARCHAR(20) REFERENCES admins(admin_id) ON DELETE CASCADE,
    seller_subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. COUPON_USAGE Table
CREATE TABLE IF NOT EXISTS coupon_usage (
    usage_id VARCHAR(20) PRIMARY KEY,
    coupon_id VARCHAR(20) REFERENCES coupons(coupon_id) ON DELETE CASCADE,
    customer_id VARCHAR(20) REFERENCES customers(customer_id) ON DELETE CASCADE,
    order_id VARCHAR(20) REFERENCES orders(order_id) ON DELETE CASCADE,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. PAYMENTS Table
CREATE TABLE IF NOT EXISTS payments (
    payment_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE SET NULL,
    admin_id VARCHAR(20) REFERENCES admins(admin_id) ON DELETE SET NULL,
    customer_id VARCHAR(20) REFERENCES customers(customer_id) ON DELETE SET NULL,
    order_id VARCHAR(20) REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_method VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE,
    payment_status VARCHAR(50) DEFAULT 'Pending',
    paid_at TIMESTAMP,
    gateway_name VARCHAR(100),
    gateway_response_code VARCHAR(10),
    failure_reason_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 20. REVIEWS Table
CREATE TABLE IF NOT EXISTS reviews (
    review_id VARCHAR(20) PRIMARY KEY,
    order_item_id VARCHAR(20) REFERENCES order_items(order_item_id) ON DELETE CASCADE,
    customer_id VARCHAR(20) REFERENCES customers(customer_id) ON DELETE CASCADE,
    product_id VARCHAR(20) REFERENCES products(product_id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 21. ORDER_COUPONS Table
CREATE TABLE IF NOT EXISTS order_coupons (
    order_coupon_id VARCHAR(20) PRIMARY KEY,
    order_id VARCHAR(20) REFERENCES orders(order_id) ON DELETE CASCADE,
    coupon_id VARCHAR(20) REFERENCES coupons(coupon_id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 22. AUTH_SESSIONS Table
CREATE TABLE IF NOT EXISTS auth_sessions (
    session_id VARCHAR(20) PRIMARY KEY,
    user_type VARCHAR(20) NOT NULL,
    user_ref_id VARCHAR(20) NOT NULL,
    token_hash VARCHAR(64),
    device_info VARCHAR(64),
    ip_address VARCHAR(45),
    is_blacklisted BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 23. OTP_VERIFICATIONS Table
CREATE TABLE IF NOT EXISTS otp_verifications (
    otp_id VARCHAR(20) PRIMARY KEY,
    user_type VARCHAR(20),
    user_ref_id VARCHAR(20),
    contact VARCHAR(100) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    attempts INT DEFAULT 0,
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 24. NOTIFICATIONS Table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20) REFERENCES customers(customer_id) ON DELETE CASCADE,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    admin_id VARCHAR(20) REFERENCES admins(admin_id) ON DELETE CASCADE,
    order_id VARCHAR(20) REFERENCES orders(order_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- 25. SELLER_PICKUP_LOCATIONS Table
CREATE TABLE IF NOT EXISTS seller_pickup_locations (
    pickup_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    location_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    address_line_1 TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    shiprocket_location_id VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 26. SELLER_BUSINESSES Table
CREATE TABLE IF NOT EXISTS seller_businesses (
    business_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    business_type VARCHAR(100),
    business_name VARCHAR(255),
    address_line_1 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 27. SELLER_KYC Table
CREATE TABLE IF NOT EXISTS seller_kyc (
    kyc_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    kyc_type VARCHAR(50),
    pan_number VARCHAR(50),
    aadhaar_number VARCHAR(50),
    gstin_number VARCHAR(50),
    document_number VARCHAR(100),
    document_url TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 28. SELLER_AGREEMENTS Table
CREATE TABLE IF NOT EXISTS seller_agreements (
    agreement_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    terms_accepted BOOLEAN DEFAULT FALSE,
    privacy_accepted BOOLEAN DEFAULT FALSE,
    seller_policy_accepted BOOLEAN DEFAULT FALSE,
    accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 29. ANNUAL_FINANCES Table
CREATE TABLE IF NOT EXISTS annual_finances (
    annual_finance_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    admin_id VARCHAR(20) REFERENCES admins(admin_id) ON DELETE CASCADE,
    year INT NOT NULL,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    platform_commission DECIMAL(15,2) DEFAULT 0,
    net_seller_earnings DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (seller_id, admin_id, year),
    CONSTRAINT check_entity_annual CHECK (seller_id IS NOT NULL OR admin_id IS NOT NULL)
);

-- 30. HALF_YEARLY_FINANCES Table
CREATE TABLE IF NOT EXISTS half_yearly_finances (
    half_yearly_finance_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    admin_id VARCHAR(20) REFERENCES admins(admin_id) ON DELETE CASCADE,
    half_number INT NOT NULL, -- 1 or 2
    year INT NOT NULL,
    annual_finance_id VARCHAR(20) REFERENCES annual_finances(annual_finance_id),
    total_revenue DECIMAL(15,2) DEFAULT 0,
    platform_commission DECIMAL(15,2) DEFAULT 0,
    net_seller_earnings DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (seller_id, admin_id, half_number, year),
    CONSTRAINT check_entity_half CHECK (seller_id IS NOT NULL OR admin_id IS NOT NULL)
);

-- 31. QUARTERLY_FINANCES Table
CREATE TABLE IF NOT EXISTS quarterly_finances (
    quarterly_finance_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    admin_id VARCHAR(20) REFERENCES admins(admin_id) ON DELETE CASCADE,
    quarter_number INT NOT NULL,
    year INT NOT NULL,
    half_yearly_finance_id VARCHAR(20) REFERENCES half_yearly_finances(half_yearly_finance_id),
    total_revenue DECIMAL(15,2) DEFAULT 0,
    platform_commission DECIMAL(15,2) DEFAULT 0,
    net_seller_earnings DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (seller_id, admin_id, quarter_number, year)
);

-- 30. MONTHLY_FINANCES Table
CREATE TABLE IF NOT EXISTS monthly_finances (
    monthly_finance_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    admin_id VARCHAR(20) REFERENCES admins(admin_id) ON DELETE CASCADE,
    month_number INT NOT NULL,
    year INT NOT NULL,
    quarterly_finance_id VARCHAR(20) REFERENCES quarterly_finances(quarterly_finance_id),
    total_revenue DECIMAL(15,2) DEFAULT 0,
    platform_commission DECIMAL(15,2) DEFAULT 0,
    net_seller_earnings DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (seller_id, admin_id, month_number, year)
);

-- 31. WEEKLY_FINANCES Table
CREATE TABLE IF NOT EXISTS weekly_finances (
    weekly_finance_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    admin_id VARCHAR(20) REFERENCES admins(admin_id) ON DELETE CASCADE,
    week_number INT NOT NULL,
    year INT NOT NULL,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    platform_commission DECIMAL(15,2) DEFAULT 0,
    net_seller_earnings DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (seller_id, admin_id, week_number, year)
);

-- 32. DAILY_FINANCES Table
CREATE TABLE IF NOT EXISTS daily_finances (
    daily_finance_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    admin_id VARCHAR(20) REFERENCES admins(admin_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weekly_finance_id VARCHAR(20) REFERENCES weekly_finances(weekly_finance_id),
    monthly_finance_id VARCHAR(20) REFERENCES monthly_finances(monthly_finance_id),
    total_revenue DECIMAL(15,2) DEFAULT 0,
    platform_commission DECIMAL(15,2) DEFAULT 0,
    net_seller_earnings DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (seller_id, admin_id, date)
);

-- 33. SELLER_PAYOUTS Table
CREATE TABLE IF NOT EXISTS seller_payouts (
    seller_payout_id VARCHAR(20) PRIMARY KEY,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    payout_status VARCHAR(50) DEFAULT 'Pending',
    transaction_id VARCHAR(255),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 34. FINANCE_TRANSACTIONS Table
CREATE TABLE IF NOT EXISTS finance_transactions (
    finance_transaction_id VARCHAR(20) PRIMARY KEY,
    daily_finance_id VARCHAR(20) REFERENCES daily_finances(daily_finance_id),
    order_id VARCHAR(20) REFERENCES orders(order_id),
    payment_id VARCHAR(20) REFERENCES payments(payment_id),
    seller_payout_id VARCHAR(20) REFERENCES seller_payouts(seller_payout_id),
    admin_id VARCHAR(20) REFERENCES admins(admin_id),
    transaction_type finance_transaction_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 35. SHIPROCKET_ORDERS Table
CREATE TABLE IF NOT EXISTS shiprocket_orders (
    sr_order_id VARCHAR(20) PRIMARY KEY,
    order_id VARCHAR(20) REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_id VARCHAR(20) REFERENCES payments(payment_id),
    channel_order_id VARCHAR(100),
    awb_code VARCHAR(100),
    shipment_id VARCHAR(100),
    courier_id VARCHAR(100),
    courier_name VARCHAR(255),
    pickup_location VARCHAR(255),
    sr_status VARCHAR(50),
    sr_status_code INT,
    sr_created_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 36. SHIPROCKET_PAYLOAD Table
CREATE TABLE IF NOT EXISTS shiprocket_payload (
    payload_id VARCHAR(20) PRIMARY KEY,
    sr_order_id VARCHAR(20) REFERENCES shiprocket_orders(sr_order_id) ON DELETE CASCADE,
    product_id VARCHAR(20) REFERENCES products(product_id),
    order_item_id VARCHAR(20) REFERENCES order_items(order_item_id),
    product_name_snapshot TEXT,
    sku_snapshot VARCHAR(100),
    quantity INT,
    weight_kg DECIMAL(10,3),
    length_cm DECIMAL(10,2),
    breadth_cm DECIMAL(10,2),
    height_cm DECIMAL(10,2),
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    hsn_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 37. SHIPROCKET_TRACKING Table
CREATE TABLE IF NOT EXISTS shiprocket_tracking (
    tracking_id VARCHAR(20) PRIMARY KEY,
    sr_order_id VARCHAR(20) REFERENCES shiprocket_orders(sr_order_id) ON DELETE CASCADE,
    awb_code VARCHAR(100),
    current_status VARCHAR(50),
    current_location VARCHAR(255),
    estimated_delivery DATE,
    activity_log JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 38. SHIPROCKET_WEBHOOK_LOG Table
CREATE TABLE IF NOT EXISTS shiprocket_webhook_log (
    webhook_id VARCHAR(20) PRIMARY KEY,
    sr_order_id VARCHAR(20),
    event_type VARCHAR(100),
    raw_payload JSONB,
    is_processed BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- 39. DELIVERIES Table
CREATE TABLE IF NOT EXISTS deliveries (
    delivery_id VARCHAR(20) PRIMARY KEY,
    order_id VARCHAR(20) REFERENCES orders(order_id) ON DELETE CASCADE,
    order_item_id VARCHAR(20) REFERENCES order_items(order_item_id),
    seller_id VARCHAR(20) REFERENCES sellers(seller_id),
    address_id VARCHAR(20) REFERENCES addresses(address_id),
    pickup_location_id VARCHAR(20) REFERENCES seller_pickup_locations(pickup_id),
    processed_webhook_id VARCHAR(20) REFERENCES shiprocket_webhook_log(webhook_id),
    shipping_address_snapshot JSONB,
    shiprocket_order_id VARCHAR(100),
    shipment_id VARCHAR(100),
    awb_code VARCHAR(100),
    courier_name VARCHAR(100),
    shipping_status VARCHAR(50),
    estimated_delivery_date DATE,
    dispatched_at TIMESTAMP,
    delivered_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 40. RETURN_REQUESTS Table
CREATE TABLE IF NOT EXISTS return_requests (
    return_request_id VARCHAR(20) PRIMARY KEY,
    order_item_id VARCHAR(20) REFERENCES order_items(order_item_id) ON DELETE CASCADE,
    customer_id VARCHAR(20) REFERENCES customers(customer_id),
    order_id VARCHAR(20) REFERENCES orders(order_id),
    resolved_by_admin_id VARCHAR(20) REFERENCES admins(admin_id),
    reason TEXT,
    return_type VARCHAR(50), -- 'Return', 'Exchange'
    refund_amount DECIMAL(10,2),
    refund_status VARCHAR(50) DEFAULT 'Pending',
    resolution_note TEXT,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- 41. REVERSE_SHIPMENTS Table
CREATE TABLE IF NOT EXISTS reverse_shipments (
    reverse_id VARCHAR(20) PRIMARY KEY,
    return_request_id VARCHAR(20) REFERENCES return_requests(return_request_id) ON DELETE CASCADE,
    order_item_id VARCHAR(20) REFERENCES order_items(order_item_id),
    seller_id VARCHAR(20) REFERENCES sellers(seller_id),
    customer_id VARCHAR(20) REFERENCES customers(customer_id),
    pickup_address_id VARCHAR(20) REFERENCES addresses(address_id),
    dropoff_pickup_location_id VARCHAR(20) REFERENCES seller_pickup_locations(pickup_id),
    shiprocket_reverse_order_id VARCHAR(100),
    reverse_awb_code VARCHAR(100),
    status VARCHAR(50),
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP
);

-- 42. SELLER_COMMISSIONS Table
CREATE TABLE IF NOT EXISTS seller_commissions (
    commission_id VARCHAR(20) PRIMARY KEY,
    order_item_id VARCHAR(20) REFERENCES order_items(order_item_id) ON DELETE CASCADE,
    seller_id VARCHAR(20) REFERENCES sellers(seller_id),
    order_id VARCHAR(20) REFERENCES orders(order_id),
    sale_amount DECIMAL(10,2),
    commission_rate DECIMAL(5,2),
    commission_amount DECIMAL(10,2),
    seller_earnings DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 43. AUDIT_LOGS Table
CREATE TABLE IF NOT EXISTS audit_logs (
    audit_id VARCHAR(20) PRIMARY KEY,
    admin_id VARCHAR(20) REFERENCES admins(admin_id),
    table_name VARCHAR(100),
    record_id VARCHAR(100),
    action VARCHAR(50),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 44. ORDER_STATUS_HISTORY Table
CREATE TABLE IF NOT EXISTS order_status_history (
    history_id VARCHAR(20) PRIMARY KEY,
    order_id VARCHAR(20) REFERENCES orders(order_id) ON DELETE CASCADE,
    status VARCHAR(50),
    changed_by VARCHAR(255),
    notes TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TRIGGERS FOR ID FORMATTING
-- ==========================================

DROP TRIGGER IF EXISTS trigger_format_customers_id ON customers;
CREATE TRIGGER trigger_format_customers_id BEFORE INSERT ON customers FOR EACH ROW EXECUTE FUNCTION format_customer_id();

DROP TRIGGER IF EXISTS trigger_format_admins_id ON admins;
CREATE TRIGGER trigger_format_admins_id BEFORE INSERT ON admins FOR EACH ROW EXECUTE FUNCTION format_admin_id();

DROP TRIGGER IF EXISTS trigger_format_sellers_id ON sellers;
CREATE TRIGGER trigger_format_sellers_id BEFORE INSERT ON sellers FOR EACH ROW EXECUTE FUNCTION format_seller_id();

DROP TRIGGER IF EXISTS trigger_format_bank_accounts_id ON bank_accounts;
CREATE TRIGGER trigger_format_bank_accounts_id BEFORE INSERT ON bank_accounts FOR EACH ROW EXECUTE FUNCTION format_bank_account_id();

DROP TRIGGER IF EXISTS trigger_format_daily_finances_id ON daily_finances;
CREATE TRIGGER trigger_format_daily_finances_id BEFORE INSERT ON daily_finances FOR EACH ROW EXECUTE FUNCTION format_daily_finance_id();

DROP TRIGGER IF EXISTS trigger_format_weekly_finances_id ON weekly_finances;
CREATE TRIGGER trigger_format_weekly_finances_id BEFORE INSERT ON weekly_finances FOR EACH ROW EXECUTE FUNCTION format_weekly_finance_id();

DROP TRIGGER IF EXISTS trigger_format_monthly_finances_id ON monthly_finances;
CREATE TRIGGER trigger_format_monthly_finances_id BEFORE INSERT ON monthly_finances FOR EACH ROW EXECUTE FUNCTION format_monthly_finance_id();

DROP TRIGGER IF EXISTS trigger_format_quarterly_finances_id ON quarterly_finances;
CREATE TRIGGER trigger_format_quarterly_finances_id BEFORE INSERT ON quarterly_finances FOR EACH ROW EXECUTE FUNCTION format_quarterly_finance_id();

DROP TRIGGER IF EXISTS trigger_format_half_yearly_finances_id ON half_yearly_finances;
CREATE TRIGGER trigger_format_half_yearly_finances_id BEFORE INSERT ON half_yearly_finances FOR EACH ROW EXECUTE FUNCTION format_half_yearly_finance_id();

DROP TRIGGER IF EXISTS trigger_format_annual_finances_id ON annual_finances;
CREATE TRIGGER trigger_format_annual_finances_id BEFORE INSERT ON annual_finances FOR EACH ROW EXECUTE FUNCTION format_annual_finance_id();

DROP TRIGGER IF EXISTS trigger_format_finance_transactions_id ON finance_transactions;
CREATE TRIGGER trigger_format_finance_transactions_id BEFORE INSERT ON finance_transactions FOR EACH ROW EXECUTE FUNCTION format_finance_transaction_id();

DROP TRIGGER IF EXISTS trigger_format_seller_payouts_id ON seller_payouts;
CREATE TRIGGER trigger_format_seller_payouts_id BEFORE INSERT ON seller_payouts FOR EACH ROW EXECUTE FUNCTION format_seller_payout_id();

DROP TRIGGER IF EXISTS trigger_format_categories_id ON categories;
CREATE TRIGGER trigger_format_categories_id BEFORE INSERT ON categories FOR EACH ROW EXECUTE FUNCTION format_category_id();

DROP TRIGGER IF EXISTS trigger_format_products_id ON products;
CREATE TRIGGER trigger_format_products_id BEFORE INSERT ON products FOR EACH ROW EXECUTE FUNCTION format_product_id();

DROP TRIGGER IF EXISTS trigger_format_product_variants_id ON product_variants;
CREATE TRIGGER trigger_format_product_variants_id BEFORE INSERT ON product_variants FOR EACH ROW EXECUTE FUNCTION format_variant_id();

DROP TRIGGER IF EXISTS trigger_format_product_images_id ON product_images;
CREATE TRIGGER trigger_format_product_images_id BEFORE INSERT ON product_images FOR EACH ROW EXECUTE FUNCTION format_image_id();

DROP TRIGGER IF EXISTS trigger_format_carts_id ON carts;
CREATE TRIGGER trigger_format_carts_id BEFORE INSERT ON carts FOR EACH ROW EXECUTE FUNCTION format_cart_id();

DROP TRIGGER IF EXISTS trigger_format_cart_items_id ON cart_items;
CREATE TRIGGER trigger_format_cart_items_id BEFORE INSERT ON cart_items FOR EACH ROW EXECUTE FUNCTION format_cart_item_id();

DROP TRIGGER IF EXISTS trigger_format_wishlists_id ON wishlists;
CREATE TRIGGER trigger_format_wishlists_id BEFORE INSERT ON wishlists FOR EACH ROW EXECUTE FUNCTION format_wishlist_id();

DROP TRIGGER IF EXISTS trigger_format_wishlist_items_id ON wishlist_items;
CREATE TRIGGER trigger_format_wishlist_items_id BEFORE INSERT ON wishlist_items FOR EACH ROW EXECUTE FUNCTION format_wishlist_item_id();

DROP TRIGGER IF EXISTS trigger_format_orders_id ON orders;
CREATE TRIGGER trigger_format_orders_id BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION format_order_id();

DROP TRIGGER IF EXISTS trigger_format_addresses_id ON addresses;
CREATE TRIGGER trigger_format_addresses_id BEFORE INSERT ON addresses FOR EACH ROW EXECUTE FUNCTION format_address_id();

DROP TRIGGER IF EXISTS trigger_format_order_items_id ON order_items;
CREATE TRIGGER trigger_format_order_items_id BEFORE INSERT ON order_items FOR EACH ROW EXECUTE FUNCTION format_order_item_id();

DROP TRIGGER IF EXISTS trigger_format_coupons_id ON coupons;
CREATE TRIGGER trigger_format_coupons_id BEFORE INSERT ON coupons FOR EACH ROW EXECUTE FUNCTION format_coupon_id();

DROP TRIGGER IF EXISTS trigger_format_coupon_usage_id ON coupon_usage;
CREATE TRIGGER trigger_format_coupon_usage_id BEFORE INSERT ON coupon_usage FOR EACH ROW EXECUTE FUNCTION format_coupon_usage_id();

DROP TRIGGER IF EXISTS trigger_format_order_coupons_id ON order_coupons;
CREATE TRIGGER trigger_format_order_coupons_id BEFORE INSERT ON order_coupons FOR EACH ROW EXECUTE FUNCTION format_order_coupon_id();

DROP TRIGGER IF EXISTS trigger_format_reviews_id ON reviews;
CREATE TRIGGER trigger_format_reviews_id BEFORE INSERT ON reviews FOR EACH ROW EXECUTE FUNCTION format_review_id();

DROP TRIGGER IF EXISTS trigger_format_payments_id ON payments;
CREATE TRIGGER trigger_format_payments_id BEFORE INSERT ON payments FOR EACH ROW EXECUTE FUNCTION format_payment_id();

DROP TRIGGER IF EXISTS trigger_format_order_sellers_id ON order_sellers;
CREATE TRIGGER trigger_format_order_sellers_id BEFORE INSERT ON order_sellers FOR EACH ROW EXECUTE FUNCTION format_order_seller_id();

DROP TRIGGER IF EXISTS trigger_format_auth_sessions_id ON auth_sessions;
CREATE TRIGGER trigger_format_auth_sessions_id BEFORE INSERT ON auth_sessions FOR EACH ROW EXECUTE FUNCTION format_auth_session_id();

DROP TRIGGER IF EXISTS trigger_format_otp_verifications_id ON otp_verifications;
CREATE TRIGGER trigger_format_otp_verifications_id BEFORE INSERT ON otp_verifications FOR EACH ROW EXECUTE FUNCTION format_otp_id();

DROP TRIGGER IF EXISTS trigger_format_notifications_id ON notifications;
CREATE TRIGGER trigger_format_notifications_id BEFORE INSERT ON notifications FOR EACH ROW EXECUTE FUNCTION format_notification_id();

DROP TRIGGER IF EXISTS trigger_format_seller_pickup_locations_id ON seller_pickup_locations;
CREATE TRIGGER trigger_format_seller_pickup_locations_id BEFORE INSERT ON seller_pickup_locations FOR EACH ROW EXECUTE FUNCTION format_pickup_id();

DROP TRIGGER IF EXISTS trigger_format_seller_businesses_id ON seller_businesses;
CREATE TRIGGER trigger_format_seller_businesses_id BEFORE INSERT ON seller_businesses FOR EACH ROW EXECUTE FUNCTION format_seller_business_id();

DROP TRIGGER IF EXISTS trigger_format_seller_kyc_id ON seller_kyc;
CREATE TRIGGER trigger_format_seller_kyc_id BEFORE INSERT ON seller_kyc FOR EACH ROW EXECUTE FUNCTION format_seller_kyc_id();

DROP TRIGGER IF EXISTS trigger_format_seller_agreements_id ON seller_agreements;
CREATE TRIGGER trigger_format_seller_agreements_id BEFORE INSERT ON seller_agreements FOR EACH ROW EXECUTE FUNCTION format_seller_agreement_id();

DROP TRIGGER IF EXISTS trigger_format_shiprocket_orders_id ON shiprocket_orders;
CREATE TRIGGER trigger_format_shiprocket_orders_id BEFORE INSERT ON shiprocket_orders FOR EACH ROW EXECUTE FUNCTION format_shiprocket_order_id();

DROP TRIGGER IF EXISTS trigger_format_shiprocket_payload_id ON shiprocket_payload;
CREATE TRIGGER trigger_format_shiprocket_payload_id BEFORE INSERT ON shiprocket_payload FOR EACH ROW EXECUTE FUNCTION format_shiprocket_payload_id();

DROP TRIGGER IF EXISTS trigger_format_shiprocket_tracking_id ON shiprocket_tracking;
CREATE TRIGGER trigger_format_shiprocket_tracking_id BEFORE INSERT ON shiprocket_tracking FOR EACH ROW EXECUTE FUNCTION format_shiprocket_tracking_id();

DROP TRIGGER IF EXISTS trigger_format_shiprocket_webhook_id ON shiprocket_webhook_log;
CREATE TRIGGER trigger_format_shiprocket_webhook_id BEFORE INSERT ON shiprocket_webhook_log FOR EACH ROW EXECUTE FUNCTION format_shiprocket_webhook_id();

DROP TRIGGER IF EXISTS trigger_format_deliveries_id ON deliveries;
CREATE TRIGGER trigger_format_deliveries_id BEFORE INSERT ON deliveries FOR EACH ROW EXECUTE FUNCTION format_delivery_id();

DROP TRIGGER IF EXISTS trigger_format_reverse_shipments_id ON reverse_shipments;
CREATE TRIGGER trigger_format_reverse_shipments_id BEFORE INSERT ON reverse_shipments FOR EACH ROW EXECUTE FUNCTION format_reverse_id();

DROP TRIGGER IF EXISTS trigger_format_return_requests_id ON return_requests;
CREATE TRIGGER trigger_format_return_requests_id BEFORE INSERT ON return_requests FOR EACH ROW EXECUTE FUNCTION format_return_request_id();

DROP TRIGGER IF EXISTS trigger_format_seller_commissions_id ON seller_commissions;
CREATE TRIGGER trigger_format_seller_commissions_id BEFORE INSERT ON seller_commissions FOR EACH ROW EXECUTE FUNCTION format_commission_id();

DROP TRIGGER IF EXISTS trigger_format_audit_logs_id ON audit_logs;
CREATE TRIGGER trigger_format_audit_logs_id BEFORE INSERT ON audit_logs FOR EACH ROW EXECUTE FUNCTION format_audit_id();

DROP TRIGGER IF EXISTS trigger_format_order_status_history_id ON order_status_history;
CREATE TRIGGER trigger_format_order_status_history_id BEFORE INSERT ON order_status_history FOR EACH ROW EXECUTE FUNCTION format_order_status_history_id();

-- Triggers for updated_at
DROP TRIGGER IF EXISTS trigger_update_customer_updated_at ON customers;
CREATE TRIGGER trigger_update_customer_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_admin_updated_at ON admins;
CREATE TRIGGER trigger_update_admin_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_seller_updated_at ON sellers;
CREATE TRIGGER trigger_update_seller_updated_at BEFORE UPDATE ON sellers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_bank_account_updated_at ON bank_accounts;
CREATE TRIGGER trigger_update_bank_account_updated_at BEFORE UPDATE ON bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_product_updated_at ON products;
CREATE TRIGGER trigger_update_product_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_order_updated_at ON orders;
CREATE TRIGGER trigger_update_order_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_address_updated_at ON addresses;
CREATE TRIGGER trigger_update_address_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_order_item_updated_at ON order_items;
CREATE TRIGGER trigger_update_order_item_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_payment_updated_at ON payments;
CREATE TRIGGER trigger_update_payment_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_shiprocket_order_updated_at ON shiprocket_orders;
CREATE TRIGGER trigger_update_shiprocket_order_updated_at BEFORE UPDATE ON shiprocket_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_shiprocket_tracking_updated_at ON shiprocket_tracking;
CREATE TRIGGER trigger_update_shiprocket_tracking_updated_at BEFORE UPDATE ON shiprocket_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_delivery_updated_at ON deliveries;
CREATE TRIGGER trigger_update_delivery_updated_at BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- FINANCIAL AGGREGATION LOGIC
-- ==========================================

CREATE OR REPLACE FUNCTION update_financial_aggregates()
RETURNS TRIGGER AS $$
DECLARE
    v_date DATE;
    v_week INT;
    v_month INT;
    v_quarter INT;
    v_half INT;
    v_year INT;
    v_commission DECIMAL(15,2);
    v_earnings DECIMAL(15,2);
    v_annual_id VARCHAR(20);
    v_half_id VARCHAR(20);
    v_quarter_id VARCHAR(20);
    v_month_id VARCHAR(20);
    v_weekly_id VARCHAR(20);
BEGIN
    -- Skip if both are NULL (safety check)
    IF NEW.seller_id IS NULL AND NEW.admin_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Get time components
    v_date := CURRENT_DATE;
    v_week := EXTRACT(WEEK FROM v_date);
    v_month := EXTRACT(MONTH FROM v_date);
    v_quarter := EXTRACT(QUARTER FROM v_date);
    v_half := CASE WHEN v_month <= 6 THEN 1 ELSE 2 END;
    v_year := EXTRACT(YEAR FROM v_date);

    -- Calculate Commission (Default 10% for sellers, 0% for admin) and Earnings
    IF NEW.admin_id IS NOT NULL THEN
        v_commission := 0;
        v_earnings := NEW.seller_subtotal;
    ELSE
        v_commission := NEW.seller_subtotal * 0.10;
        v_earnings := NEW.seller_subtotal - v_commission;
    END IF;

    -- 1. Update Annual Finances (Primary parent)
    INSERT INTO annual_finances (seller_id, admin_id, year, total_revenue, platform_commission, net_seller_earnings)
    VALUES (NEW.seller_id, NEW.admin_id, v_year, NEW.seller_subtotal, v_commission, v_earnings)
    ON CONFLICT (seller_id, admin_id, year) 
    DO UPDATE SET 
        total_revenue = annual_finances.total_revenue + EXCLUDED.total_revenue,
        platform_commission = annual_finances.platform_commission + EXCLUDED.platform_commission,
        net_seller_earnings = annual_finances.net_seller_earnings + EXCLUDED.net_seller_earnings
    RETURNING annual_finance_id INTO v_annual_id;

    -- 2. Update Half-Yearly Finances
    INSERT INTO half_yearly_finances (seller_id, admin_id, half_number, year, annual_finance_id, total_revenue, platform_commission, net_seller_earnings)
    VALUES (NEW.seller_id, NEW.admin_id, v_half, v_year, v_annual_id, NEW.seller_subtotal, v_commission, v_earnings)
    ON CONFLICT (seller_id, admin_id, half_number, year) 
    DO UPDATE SET 
        total_revenue = half_yearly_finances.total_revenue + EXCLUDED.total_revenue,
        platform_commission = half_yearly_finances.platform_commission + EXCLUDED.platform_commission,
        net_seller_earnings = half_yearly_finances.net_seller_earnings + EXCLUDED.net_seller_earnings,
        annual_finance_id = COALESCE(half_yearly_finances.annual_finance_id, EXCLUDED.annual_finance_id)
    RETURNING half_yearly_finance_id INTO v_half_id;

    -- 3. Update Quarterly Finances
    INSERT INTO quarterly_finances (seller_id, admin_id, quarter_number, year, half_yearly_finance_id, total_revenue, platform_commission, net_seller_earnings)
    VALUES (NEW.seller_id, NEW.admin_id, v_quarter, v_year, v_half_id, NEW.seller_subtotal, v_commission, v_earnings)
    ON CONFLICT (seller_id, admin_id, quarter_number, year) 
    DO UPDATE SET 
        total_revenue = quarterly_finances.total_revenue + EXCLUDED.total_revenue,
        platform_commission = quarterly_finances.platform_commission + EXCLUDED.platform_commission,
        net_seller_earnings = quarterly_finances.net_seller_earnings + EXCLUDED.net_seller_earnings,
        half_yearly_finance_id = COALESCE(quarterly_finances.half_yearly_finance_id, EXCLUDED.half_yearly_finance_id)
    RETURNING quarterly_finance_id INTO v_quarter_id;

    -- 4. Update Monthly Finances
    INSERT INTO monthly_finances (seller_id, admin_id, month_number, year, quarterly_finance_id, total_revenue, platform_commission, net_seller_earnings)
    VALUES (NEW.seller_id, NEW.admin_id, v_month, v_year, v_quarter_id, NEW.seller_subtotal, v_commission, v_earnings)
    ON CONFLICT (seller_id, admin_id, month_number, year) 
    DO UPDATE SET 
        total_revenue = monthly_finances.total_revenue + EXCLUDED.total_revenue,
        platform_commission = monthly_finances.platform_commission + EXCLUDED.platform_commission,
        net_seller_earnings = monthly_finances.net_seller_earnings + EXCLUDED.net_seller_earnings,
        quarterly_finance_id = COALESCE(monthly_finances.quarterly_finance_id, EXCLUDED.quarterly_finance_id)
    RETURNING monthly_finance_id INTO v_month_id;

    -- 5. Update Weekly Finances
    INSERT INTO weekly_finances (seller_id, admin_id, week_number, year, total_revenue, platform_commission, net_seller_earnings)
    VALUES (NEW.seller_id, NEW.admin_id, v_week, v_year, NEW.seller_subtotal, v_commission, v_earnings)
    ON CONFLICT (seller_id, admin_id, week_number, year) 
    DO UPDATE SET 
        total_revenue = weekly_finances.total_revenue + EXCLUDED.total_revenue,
        platform_commission = weekly_finances.platform_commission + EXCLUDED.platform_commission,
        net_seller_earnings = weekly_finances.net_seller_earnings + EXCLUDED.net_seller_earnings
    RETURNING weekly_finance_id INTO v_weekly_id;

    -- 6. Update Daily Finances
    INSERT INTO daily_finances (seller_id, admin_id, date, weekly_finance_id, monthly_finance_id, total_revenue, platform_commission, net_seller_earnings)
    VALUES (NEW.seller_id, NEW.admin_id, v_date, v_weekly_id, v_month_id, NEW.seller_subtotal, v_commission, v_earnings)
    ON CONFLICT (seller_id, admin_id, date) 
    DO UPDATE SET 
        total_revenue = daily_finances.total_revenue + EXCLUDED.total_revenue,
        platform_commission = daily_finances.platform_commission + EXCLUDED.platform_commission,
        net_seller_earnings = daily_finances.net_seller_earnings + EXCLUDED.net_seller_earnings,
        weekly_finance_id = COALESCE(daily_finances.weekly_finance_id, EXCLUDED.weekly_finance_id),
        monthly_finance_id = COALESCE(daily_finances.monthly_finance_id, EXCLUDED.monthly_finance_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_finances ON order_sellers;
CREATE TRIGGER trigger_update_finances AFTER INSERT ON order_sellers FOR EACH ROW EXECUTE FUNCTION update_financial_aggregates();

-- ==========================================
-- SCHEMA MIGRATIONS (Ensure new columns exist)
-- ==========================================
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS pickup_address TEXT;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS return_address TEXT;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS admin_id VARCHAR(20) REFERENCES admins(admin_id) ON DELETE CASCADE;
