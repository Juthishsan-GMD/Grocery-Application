import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiChevronLeft, FiCheckCircle, FiTruck, FiShield, FiMinus, FiPlus } from 'react-icons/fi';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import CustomSelect from '../../components/common/CustomSelect';
import ProductCard from '../components/shop/ProductCard';
import ReviewsSection from '../components/shop/ReviewsSection';
import '../../styles/pages/ProductDetails.css';

const categoryColors = {
  'Fresh Vegetables': '#10b981',
  'Fresh Fruits': '#fbbf24',
  'Dairy & Eggs': '#3b82f6',
  'Breads & Bakery': '#d97706',
  'Beverages': '#ef4444',
  'Snacks': '#a855f7'
};

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeImage, setActiveImage] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomParams, setZoomParams] = useState(null);

  useEffect(() => {
    if (!id || !products.length) return;
    
    const foundProduct = products.find(p => String(p.id || '').trim() === String(id).trim());
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.image || foundProduct.images?.[0] || '');
      setActiveIdx(0);
      
      const variants = foundProduct.variants || [];
      setSelectedVariantIdx(0);
    }
  }, [id, products]);

  const hasVariants = product?.variants && product.variants.length > 0;
  const selectedVariant = product ? (hasVariants && product.variants[selectedVariantIdx] ? product.variants[selectedVariantIdx] : { unit: product.unit || '1 pc', price: Number(product.price) || 0, mrp: Number(product.mrp) || Number(product.price) || 0 }) : null;

  if (!product || !selectedVariant) {
    return (
      <div className="product-details-loading">
        <div className="loader"></div>
        <p>Loading fresh produce...</p>
      </div>
    );
  }

  const savedReviews = localStorage.getItem(`reviews_product_${product.id}`);
  const customReviews = savedReviews ? JSON.parse(savedReviews) : [];
  const allReviews = [...customReviews, ...(product.reviews || [])];
  const dynamicRating = allReviews.length > 0 
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1) 
    : Number(product.rating || 4.5).toFixed(1);
  const reviewsCount = allReviews.length;

  let dynamicDiscount = Number(product.discount) || 0;
  const currentPrice = Number(selectedVariant.price) || Number(product.price) || 0;
  const currentMrp = Number(selectedVariant.mrp) || Number(product.mrp) || currentPrice;
  if (!dynamicDiscount && currentMrp > currentPrice) {
    dynamicDiscount = Math.round(((currentMrp - currentPrice) / currentMrp) * 100);
  }

  const handleAddToCart = () => {
    const isLegacyDiscount = Number(product.discount) > 0 && currentMrp === currentPrice;
    const sellPrice = isLegacyDiscount ? selectedVariant.price * (1 - Number(product.discount) / 100) : selectedVariant.price;
    const customizedProduct = { ...product, price: sellPrice, unit: selectedVariant.unit };
    addToCart(customizedProduct, `Added ${quantity} ${product.name} to your cart successfully!`);
    
    if (quantity > 1) {
      for (let i = 1; i < quantity; i++) {
        addToCart(customizedProduct, null, true); // Suppress duplicate toasts on loops
      }
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const xRaw = e.clientX - left;
    const yRaw = e.clientY - top;

    const x = Math.max(0, Math.min(xRaw, width));
    const y = Math.max(0, Math.min(yRaw, height));

    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    // lens size is 150px (75px half offset)
    setZoomParams({
      xPercent,
      yPercent,
      lensLeft: x - 75,
      lensTop: y - 75,
    });
  };

  const handleMouseLeave = () => {
    setZoomParams(null);
  };

  return (
    <div className="page-wrapper product-details-page">
      <div className="container">
        
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiChevronLeft /> Back to Shopping
        </button>

        <div className="product-view-container">
          
          {/* Left: Product Image Gallery */}
          <div className="product-gallery" style={{ position: 'relative' }}>
            <div 
              className={`main-image-wrapper ${zoomParams ? 'zooming' : ''}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {dynamicDiscount > 0 && <span className="pdp-discount-badge">{dynamicDiscount}% OFF</span>}
              <img src={activeImage} alt={product.name} className="main-product-image" key={activeImage} />
              
              {zoomParams && (
                <div 
                  className="zoom-lens" 
                  style={{
                    left: zoomParams.lensLeft,
                    top: zoomParams.lensTop
                  }} 
                />
              )}
            </div>
            
            {/* Amazon Zoom Overlay Pane */}
            {zoomParams && (
              <div 
                className="amazon-zoom-pane"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundPosition: `${zoomParams.xPercent}% ${zoomParams.yPercent}%`,
                  backgroundSize: '250% 250%'
                }}
              />
            )}
            
            <div className="thumbnail-track">
              {(product.images || [product.image, product.image, product.image]).map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail ${activeIdx === idx ? 'active' : ''}`}
                  onClick={() => { setActiveImage(img); setActiveIdx(idx); }}
                >
                  <img src={img} alt={`Thumb ${idx}`} />
                  {activeIdx !== idx && <div className="thumbnail-overlay"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="product-info-panel">
            <div className="pdp-header">
              <div className="pdp-top-tags">
                <span 
                  className="pdp-category" 
                  style={{ 
                    backgroundColor: `${categoryColors[product.category] || '#55b746'}15`, 
                    color: categoryColors[product.category] || '#55b746' 
                  }}
                >
                  {product.category}
                </span>
                {dynamicRating >= 4.7 && (
                  <span className="best-seller-tag">
                    🔥 Best Seller
                  </span>
                )}
              </div>
              <h1 className="pdp-title">{product.name}</h1>
              
              <div className="pdp-rating-row">
                <div className="pdp-stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={`star-icon ${i < Math.round(dynamicRating) ? 'filled' : ''}`} />
                  ))}
                </div>
                <span className="pdp-rating-text">{dynamicRating} / 5.0 ({reviewsCount} Reviews)</span>
                <span className="order-count-tag">
                   📦 <b>{(product.id * 7) % 500 + 120}+</b> orders recently
                </span>
              </div>
            </div>

            <div className="pdp-price-row">
              <div className="price-block">
                {dynamicDiscount > 0 ? (
                  <div className="pdp-deal-wrapper" style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    <span className="current-price" style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '1.5rem', fontWeight: 600 }}>
                      ₹{currentMrp.toFixed(0)}
                    </span>
                    <span className="current-price">
                      ₹{(Number(product.discount) > 0 && currentMrp === currentPrice ? currentPrice * (1 - Number(product.discount) / 100) : currentPrice).toFixed(2)}
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
                    value={selectedVariantIdx}
                    onChange={(val) => setSelectedVariantIdx(val)}
                    options={product.variants.map((v, idx) => {
                      const vPrice = Number(v.price) || 0;
                      const vMrp = Number(v.mrp) || vPrice;
                      const isLegacyDiscount = Number(product.discount) > 0 && vMrp === vPrice;
                      let disc = Number(product.discount) || 0;
                      if (!isLegacyDiscount && vMrp > vPrice) disc = Math.round(((vMrp - vPrice) / vMrp) * 100);
                      const isDiscounted = disc > 0;
                      const vSellPrice = isLegacyDiscount ? vPrice * (1 - disc / 100) : vPrice;
                      const priceLabel = isDiscounted 
                        ? <><span style={{textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.9em'}}>₹{(vMrp || vPrice).toFixed(0)}</span> <span style={{color: 'var(--primary-color)', fontWeight: 800}}>₹{vSellPrice.toFixed(2)}</span></>
                        : `₹${vPrice.toFixed(2)}`;
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
                  ((Number(product.discount) > 0 && currentMrp === currentPrice ? selectedVariant.price * (1 - Number(product.discount) / 100) : selectedVariant.price) * quantity).toFixed(2)
                }
              </button>
            </div>
          </div>
        </div>

        {/* Reviews System Integrated */}
        <ReviewsSection product={product} />

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
