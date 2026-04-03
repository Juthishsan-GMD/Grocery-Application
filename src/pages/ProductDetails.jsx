import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiChevronLeft, FiCheckCircle, FiTruck, FiShield, FiMinus, FiPlus } from 'react-icons/fi';
import { products } from '../data';
import { useCart } from '../context/CartContext';
import CustomSelect from '../components/CustomSelect';
import ProductCard from '../components/ProductCard';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    // Find the product by ID from our mock data
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.variants && foundProduct.variants.length > 0) {
        setSelectedVariant(foundProduct.variants[0]);
      } else {
        setSelectedVariant({ unit: foundProduct.unit, price: foundProduct.price });
      }
    }
  }, [id]);

  if (!product) {
    return (
      <div className="product-details-loading">
        <div className="loader"></div>
        <p>Loading fresh produce...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    const isDiscounted = product.discount > 0;
    const sellPrice = isDiscounted ? selectedVariant.price * (1 - product.discount / 100) : selectedVariant.price;
    const customizedProduct = { ...product, price: sellPrice, unit: selectedVariant.unit };
    addToCart(customizedProduct, `Added ${quantity} ${product.name} to your cart successfully!`);
    
    if (quantity > 1) {
      for (let i = 1; i < quantity; i++) {
        addToCart(customizedProduct, null, true); // Suppress duplicate toasts on loops
      }
    }
  };

  return (
    <div className="page-wrapper product-details-page">
      <div className="container">
        
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiChevronLeft /> Back to Shopping
        </button>

        <div className="product-view-container">
          
          {/* Left: Product Image Gallery */}
          <div className="product-gallery">
            <div className="main-image-wrapper">
              {product.discount && <span className="pdp-discount-badge">{product.discount}</span>}
              <img src={product.image} alt={product.name} className="main-product-image" />
            </div>
            {/* Mock thumbnails to make it look extremely premium */}
            <div className="thumbnail-track">
              <div className="thumbnail active">
                <img src={product.image} alt="Thumb 1" />
              </div>
              <div className="thumbnail">
                <img src={product.image} alt="Thumb 2" />
                <div className="thumbnail-overlay"></div>
              </div>
              <div className="thumbnail">
                <img src={product.image} alt="Thumb 3" />
                <div className="thumbnail-overlay"></div>
              </div>
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="product-info-panel">
            <div className="pdp-header">
              <span className="pdp-category">{product.category}</span>
              <h1 className="pdp-title">{product.name}</h1>
              
              <div className="pdp-rating-row">
                <div className="pdp-stars">
                  <FiStar className="star-icon filled" />
                  <FiStar className="star-icon filled" />
                  <FiStar className="star-icon filled" />
                  <FiStar className="star-icon filled" />
                  <span className="star-icon-half"><FiStar className="star-icon filled" /></span>
                </div>
                <span className="pdp-rating-text">{product.rating} / 5.0 (128 Reviews)</span>
              </div>
            </div>

            <div className="pdp-price-row">
              <div className="price-block">
                {product.discount > 0 ? (
                  <div className="pdp-deal-wrapper" style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    <span className="current-price" style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '1.5rem', fontWeight: 600 }}>
                      ₹{selectedVariant.price.toFixed(0)}
                    </span>
                    <span className="current-price">
                      ₹{(selectedVariant.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="current-price">₹{selectedVariant.price.toFixed(2)}</span>
                )}
                {(!product.variants || product.variants.length === 0) && (
                  <span className="price-unit">/ {product.unit}</span>
                )}
              </div>
              <div className="stock-status">
                <span className="status-dot in-stock"></span> In Stock (Ready to Ship)
              </div>
            </div>

            <p className="pdp-description">
              Experience the finest quality freshness with our hand-picked <strong>{product.name}</strong>. Sourced directly from trusted, sustainable farms, this product undergoes rigorous quality checks to ensure you receive nothing but the absolute best. Perfect for your daily nutritional needs.
            </p>

            {/* Premium Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <FiCheckCircle className="trust-icon" />
                <span>100% Organic certified</span>
              </div>
              <div className="trust-badge">
                <FiTruck className="trust-icon" />
                <span>Same-day ultra-fast delivery</span>
              </div>
              <div className="trust-badge">
                <FiShield className="trust-icon" />
                <span>Freshness guarantee policy</span>
              </div>
            </div>

            <hr className="pdp-divider" />

            {/* Variant Layout Integration */}
            {product.variants && product.variants.length > 0 && (
              <div className="pdp-variant-selector" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Select Size/Weight:</h4>
                <div style={{ width: '100%', fontSize: '1.05rem' }}>
                  <CustomSelect 
                    value={product.variants.indexOf(product.variants.find(v => v.unit === selectedVariant.unit))}
                    onChange={(val) => setSelectedVariant(product.variants[val])}
                    options={product.variants.map((v, idx) => {
                      const isDiscounted = product.discount > 0;
                      const vSellPrice = isDiscounted ? v.price * (1 - product.discount / 100) : v.price;
                      const priceLabel = isDiscounted 
                        ? <><span style={{textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.9em'}}>₹{v.price.toFixed(0)}</span> <span style={{color: 'var(--primary-color)', fontWeight: 800}}>₹{vSellPrice.toFixed(2)}</span></>
                        : `₹${v.price.toFixed(2)}`;
                      return {
                        value: idx,
                        label: <span style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>{v.unit} - {priceLabel}</span>
                      };
                    })}
                  />
                </div>
              </div>
            )}

            {/* Action Area */}
            <div className="pdp-action-area">
              <div className="quantity-selector-pdp">
                <button 
                  className="qty-btn-pdp" 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="qty-display-pdp">{quantity}</span>
                <button 
                  className="qty-btn-pdp" 
                  onClick={() => setQuantity(q => q + 1)}
                >
                  <FiPlus />
                </button>
              </div>

              <button className="btn btn-primary pdp-add-cart-btn" onClick={handleAddToCart}>
                <FiShoppingCart className="btn-icon" /> Add to Cart — ₹{
                  ((product.discount > 0 ? selectedVariant.price * (1 - product.discount / 100) : selectedVariant.price) * quantity).toFixed(2)
                }
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {product && (
          <div className="similar-products-section">
            <div className="similar-products-header">
              <h2>You Might Also Like</h2>
              <p>Customers who viewed this item also looked at these fresh products.</p>
            </div>
            <div className="similar-products-grid">
              {products
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
                .map(p => (
                  <ProductCard key={p.id} product={p} cardType="shop" />
                ))
              }
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
