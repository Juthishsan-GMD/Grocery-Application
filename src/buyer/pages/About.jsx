import React from 'react';
import { FiTarget, FiHeart, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import '../../styles/pages/Pages.css';

const About = () => {
  return (
    <div className="page-wrapper about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content">
          <h1>Freshness Delivered to Your Doorstep</h1>
          <p>We are reimagining the way you shop for daily groceries. Bringing the farm closer to your home sustainably and reliably.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mission container">
        <div className="mission-content">
          <h2>Our Core Mission</h2>
          <p className="lead-text">
            At FreshBasket, our mission is simple: to make high-quality, fresh, and organic foods accessible to everyone. We believe that eating healthy shouldn't be a luxury, and shopping shouldn't be a chore.
          </p>
          <div className="mission-features">
            <div className="feature-item">
              <FiCheckCircle className="feature-icon" />
              <span>100% Organic Sourcing</span>
            </div>
            <div className="feature-item">
              <FiCheckCircle className="feature-icon" />
              <span>Same-Day Delivery</span>
            </div>
            <div className="feature-item">
              <FiCheckCircle className="feature-icon" />
              <span>Support Local Farmers</span>
            </div>
          </div>
        </div>
        <div className="mission-image">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600" alt="Fresh Produce" className="floating-img" />
        </div>
      </section>

      {/* Values Grid */}
      <section className="about-values">
        <div className="container">
          <div className="section-title-center">
            <h2>Why Choose FreshBasket?</h2>
            <p>Our values dictate everything we do, from sourcing to delivery.</p>
          </div>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon-wrapper">
                <FiTarget className="value-icon" />
              </div>
              <h3>Unmatched Quality</h3>
              <p>We handpick every item from verified local farms to ensure you get the freshest produce possible.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon-wrapper">
                <FiHeart className="value-icon" />
              </div>
              <h3>Community First</h3>
              <p>By bypassing giant chains, we push profits directly back into the hands of community farmers.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon-wrapper">
                <FiTrendingUp className="value-icon" />
              </div>
              <h3>Sustainable Growth</h3>
              <p>We utilize eco-friendly packaging and optimized delivery routes to reduce our carbon footprint globally.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
