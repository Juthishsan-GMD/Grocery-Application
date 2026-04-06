import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { categories } from '../../constants/data';
import { useProducts } from '../../contexts/ProductContext';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import '../../styles/pages/Home.css';

import ProductCard from '../components/shop/ProductCard';
import OfferTimer from '../components/shop/OfferTimer';

const Home = () => {
  const { products } = useProducts();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container animate-fade-in">
          <div className="hero-content">
            <span className="hero-badge">100% Organic Products</span>
            <h1 className="hero-title">
              Fresh groceries, <br />
              delivered to your door.
            </h1>
            <p className="hero-subtitle">
              Experience the finest quality fruits, vegetables, and daily essentials sourced directly from local farms. Get free delivery on your first order.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary shop-now-btn" onClick={() => navigate('/shop')}>Shop Now</button>
              <button className="btn btn-outline" onClick={() => navigate('/shop')}>Explore Offers</button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <h4>15k+</h4>
                <p>Products</p>
              </div>
              <div className="stat-item">
                <h4>50k+</h4>
                <p>Customers</p>
              </div>
              <div className="stat-item">
                <h4>24/7</h4>
                <p>Support</p>
              </div>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-blob"></div>
            <img 
              src="/hero_banner.png" 
              alt="Fresh colorful groceries spilling from basket" 
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="category-grid">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="category-card"
                onClick={() => navigate('/shop', { state: { category: category.name } })}
              >
                <div className="category-image-wrap">
                  <img src={category.image} alt={category.name} loading="lazy" />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <span className="category-link">Explore →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Timer Section */}
      <OfferTimer />

      {/* Top Deals Section */}
      <section className="deals-section">
        <div className="container">
          <div className="section-header section-text-center">
            <h2 className="section-title">Top Deals of the Day</h2>
            <p className="section-subtitle text-center">Grab these limited-time offers before they're gone!</p>
          </div>
          
          <div className="deals-grid">
            {products.filter(p => p.discount && p.discount > 0).map((product) => (
              <ProductCard key={product.id} product={product} cardType="home" />
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trending Products</h2>
          </div>
          
          <div className="product-grid">
            {products.length > 0 ? (
              products.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} cardType="home" />
              ))
            ) : (
              <div className="full-width-msg" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '24px', border: '2px dashed #e5e7eb' }}>
                <p className="msg-text" style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '1rem' }}>No products uploaded by the administrator yet.</p>
                <button className="btn btn-primary" onClick={() => navigate('/admin/products/add')}>Add First Product</button>
              </div>
            )}
          </div>

          <div className="view-all-wrapper">
            <button className="btn btn-outline view-all-btn" onClick={() => navigate('/shop')}>
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap">🚚</div>
              <h3>Free Shipping</h3>
              <p>On all local orders above ₹499</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">🌱</div>
              <h3>100% Organic</h3>
              <p>Sourced directly from local farms</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">🛡️</div>
              <h3>Secure Payments</h3>
              <p>100% safe & protected checkouts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">📞</div>
              <h3>24/7 Support</h3>
              <p>Dedicated team ready to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner Section */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-content">
              <h2>Get <span className="highlight-text">20% Off</span> Your First Order</h2>
              <p>Sign up today and get access to exclusive deals, premium farm-fresh produce, and priority delivery!</p>
              <button className="btn btn-primary promo-btn" onClick={() => navigate('/shop')}>Claim Offer Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container newsletter-container">
          <div className="newsletter-text">
            <h2>Join Our FreshBasket Family</h2>
            <p>Subscribe to our newsletter for daily health tips, fresh arrivals, and surprise coupons.</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Home;
