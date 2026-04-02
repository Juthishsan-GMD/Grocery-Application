import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import CustomSelect from './CustomSelect';
import '../styles/ProductCard.css';

const ProductCard = ({ product, cardType = 'shop' }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  
  const hasVariants = product.variants && product.variants.length > 0;
  const initialVariant = hasVariants ? product.variants[0] : { unit: product.unit, price: product.price };
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);

  const uniqueId = `${product.id}-${selectedVariant.unit}`;
  const cartItem = cart.find(item => item.uniqueId === uniqueId);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const handleVariantChange = (idx) => {
    setSelectedVariant(product.variants[idx]);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, price: selectedVariant.price, unit: selectedVariant.unit });
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
    <div className={cardClass}>
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
          <span className={`${cardType}-category product-category`}>{product.category}</span>
          <h3 className={`${cardType}-name product-name`}>{product.name}</h3>
          <div className={`${cardType}-rating product-rating`}>
            <FiStar className="star-icon filled" />
            <span>{product.rating}</span>
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
              options={product.variants.map((v, idx) => ({
                value: idx,
                label: `${v.unit} - ₹${v.price.toFixed(2)}`
              }))}
            />
          </div>
        )}

        <div className={`${cardType}-footer product-footer`}>
          <div className="price-container">
            <span className={`${cardType}-price product-price`}>₹{selectedVariant.price.toFixed(2)}</span>
            {!hasVariants && <span className={`${cardType}-unit product-unit`}>/ {product.unit}</span>}
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
