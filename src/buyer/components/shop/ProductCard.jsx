import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../../../contexts/CartContext';
import CustomSelect from '../../../components/common/CustomSelect';
import '../../../styles/components/ProductCard.css';

const categoryColors = {
  'Fresh Vegetables': '#10b981',
  'Fresh Fruits': '#fbbf24',
  'Dairy & Eggs': '#3b82f6',
  'Breads & Bakery': '#d97706',
  'Beverages': '#ef4444',
  'Snacks': '#a855f7'
};

const ProductCard = ({ product, cardType = 'shop' }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  
  // Safely coerce price to number
  const safePrice = Number(product.price) || 0;
  const safeMrp = Number(product.mrp) || safePrice;
  
  const hasVariants = product.variants && product.variants.length > 0;
  const initialVariant = hasVariants ? product.variants[0] : { unit: product.unit || '1 pc', price: safePrice };
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);

  const currentPrice = Number(selectedVariant.price) || safePrice;
  const uniqueId = `${product.id}-${selectedVariant.unit}`;
  const cartItem = cart.find(item => item.uniqueId === uniqueId);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const handleVariantChange = (idx) => {
    setSelectedVariant(product.variants[idx]);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const discount = Number(product.discount) || 0;
    const sellPrice = discount > 0 ? currentPrice * (1 - discount / 100) : currentPrice;
    addToCart({ ...product, price: sellPrice, unit: selectedVariant.unit });
  };

  const incrementQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(uniqueId, qtyInCart + 1);
  };

  const decrementQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qtyInCart === 1) {
      removeFromCart(uniqueId);
    } else {
      updateQuantity(uniqueId, qtyInCart - 1);
    }
  };

  const cardClass = cardType === 'home' ? 'product-card' : 'shop-card';
  const imgClass = cardType === 'home' ? 'product-image-container' : 'shop-image-container';
  const contentClass = cardType === 'home' ? 'product-content' : 'shop-content';

  return (
    <div className={cardClass} style={{ '--category-color': categoryColors[product.category] || '#55b746' }}>
      <div className="card-top-accent"></div>
      {product.discount > 0 && (
        <div className="discount-badge">{product.discount}% OFF</div>
      )}
      <div className={`${cardType}-actions-hover product-actions-hover`}>
        <button className="icon-btn heart-btn" title="Add to wishlist" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><FiHeart /></button>
      </div>
      
      <Link to={`/product/${product.id}`} className="card-link-wrapper">
        <div className={imgClass}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>
        <div className={`${contentClass} core-info`}>
          <div className="product-meta-row">
            <span 
              className={`${cardType}-category product-category-tag`} 
              style={{ color: 'var(--category-color)', background: 'color-mix(in srgb, var(--category-color) 12%, transparent)' }}
            >
              {product.category}
            </span>
            {Number(product.rating) > 4.7 && <span className="hot-deal-badge">🔥 Hot</span>}
          </div>
          <h3 className={`${cardType}-name product-name`}>{product.name}</h3>
          <div className={`${cardType}-rating product-rating`}>
            <div className="stars-small">
              <FiStar className="star-icon filled" />
              <span>{Number(product.rating).toFixed(1)}</span>
            </div>
            <span className="orders-mini">
              📦 {Math.abs((typeof product.id === 'number' ? product.id * 3 : String(product.id).length * 7) % 100) + 40}+
            </span>
          </div>
        </div>
      </Link>

      <div className={`${contentClass} interactive-footer`}>
        
        {/* Modern Variant Selector */}
        {hasVariants && (
          <div className="variant-selector-wrapper">
            <CustomSelect 
              value={product.variants.indexOf(selectedVariant)}
              onChange={handleVariantChange}
              options={product.variants.map((v, idx) => {
                const vPrice = Number(v.price) || 0;
                const disc = Number(product.discount) || 0;
                const isDiscounted = disc > 0;
                const vSellPrice = isDiscounted ? vPrice * (1 - disc / 100) : vPrice;
                const priceLabel = isDiscounted 
                  ? <><span className="original-price strike-out">₹{vPrice.toFixed(0)}</span> <span className="deal-price">₹{vSellPrice.toFixed(2)}</span></>
                  : `₹${vPrice.toFixed(2)}`;
                return {
                  value: idx,
                  label: <span style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>{v.unit} - {priceLabel}</span>
                };
              })}
            />
          </div>
        )}

        <div className={`${cardType}-footer product-footer`}>
          <div className="price-container">
            {(Number(product.discount) || 0) > 0 ? (
              <div className="deal-price-wrapper">
                 <span className={`${cardType}-price original-price strike-out`}>
                    ₹{currentPrice.toFixed(0)}
                 </span>
                 <span className={`${cardType}-price deal-price product-price`}>
                    ₹{(currentPrice * (1 - (Number(product.discount) || 0) / 100)).toFixed(2)}
                 </span>
              </div>
            ) : (
                 <span className={`${cardType}-price product-price`}>₹{currentPrice.toFixed(2)}</span>
            )}
            {!hasVariants && <span className={`${cardType}-unit product-unit`}>/ {product.unit || '1 pc'}</span>}
          </div>
          
          {qtyInCart > 0 ? (
            <div className="card-qty-controls" onClick={(e) => e.stopPropagation()}>
              <button className="qty-btn dec-btn" onClick={decrementQty}><FiMinus /></button>
              <span className="qty-val">{qtyInCart}</span>
              <button className="qty-btn inc-btn" onClick={incrementQty}><FiPlus /></button>
            </div>
          ) : (
            <button className="add-to-cart-btn btn" onClick={handleAdd}>
               Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
