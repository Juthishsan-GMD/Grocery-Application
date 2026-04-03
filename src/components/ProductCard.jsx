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
    const sellPrice = product.discount > 0 ? selectedVariant.price * (1 - product.discount / 100) : selectedVariant.price;
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
              options={product.variants.map((v, idx) => {
                const isDiscounted = product.discount > 0;
                const vSellPrice = isDiscounted ? v.price * (1 - product.discount / 100) : v.price;
                const priceLabel = isDiscounted 
                  ? <><span className="original-price strike-out">₹{v.price.toFixed(0)}</span> <span className="deal-price">₹{vSellPrice.toFixed(2)}</span></>
                  : `₹${v.price.toFixed(2)}`;
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
            {product.discount > 0 ? (
              <div className="deal-price-wrapper">
                 <span className={`${cardType}-price original-price strike-out`}>
                    ₹{selectedVariant.price.toFixed(0)}
                 </span>
                 <span className={`${cardType}-price deal-price product-price`}>
                    ₹{(selectedVariant.price * (1 - product.discount / 100)).toFixed(2)}
                 </span>
              </div>
            ) : (
                 <span className={`${cardType}-price product-price`}>₹{selectedVariant.price.toFixed(2)}</span>
            )}
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
