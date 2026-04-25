import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import CustomSelect from '../../components/common/CustomSelect';

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
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  // Safely coerce price to number
  const safePrice = Number(product.price) || 0;
  const safeMrp = Number(product.mrp) || safePrice;
  
  const hasVariants = product.variants && product.variants.length > 0;
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const selectedVariant = hasVariants && product.variants[selectedVariantIdx] ? product.variants[selectedVariantIdx] : { unit: product.unit || '1 pc', price: safePrice, mrp: safeMrp };
  const currentPrice = Number(selectedVariant.price) || safePrice;
  const currentMrp = Number(selectedVariant.mrp) || safeMrp;
  
  let dynamicDiscount = Number(product.discount) || 0;
  if (!dynamicDiscount && currentMrp > currentPrice) {
    dynamicDiscount = Math.round(((currentMrp - currentPrice) / currentMrp) * 100);
  }

  const frontendId = selectedVariant.variant_id ? `${product.id}-${selectedVariant.variant_id}` : `${product.id}-${selectedVariant.unit}`;
  const cartItem = cart.find(item => item.frontendId === frontendId || item.uniqueId === frontendId);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  // Use the uniqueId from the cart item (might be CIT001 or PRO-VAR) for operations
  const activeUniqueId = cartItem ? cartItem.uniqueId : frontendId;

  const dynamicRating = Number(product.rating || 0).toFixed(1);

  const handleVariantChange = (idx) => {
    setSelectedVariantIdx(idx);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isLegacyDiscount = Number(product.discount) > 0 && currentMrp === currentPrice;
    const sellPrice = isLegacyDiscount ? currentPrice * (1 - Number(product.discount) / 100) : currentPrice;
    addToCart({ 
      ...product, 
      price: sellPrice, 
      unit: selectedVariant.unit,
      variant_id: selectedVariant.variant_id 
    });
  };

  const incrementQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(activeUniqueId, qtyInCart + 1);
  };

  const decrementQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qtyInCart === 1) {
      removeFromCart(activeUniqueId);
    } else {
      updateQuantity(activeUniqueId, qtyInCart - 1);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isWished = isInWishlist(product.id);

  return (
    <div 
      className="bg-white rounded-2xl p-4 relative transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-sm flex flex-col border border-transparent hover:shadow-[0_15px_35px_rgba(5,150,105,0.15)] hover:-translate-y-2 hover:border-[rgba(5,150,105,0.3)] group/card" 
      style={{ '--category-color': categoryColors[product.category] || '#55b746' }}
    >
      <div className="absolute top-0 left-0 right-0 h-[5px] rounded-t-xl opacity-80 z-[5]" style={{ backgroundColor: 'var(--category-color)' }}></div>
      
      {dynamicDiscount > 0 && (
        <div className="absolute top-4 left-4 bg-[#ff5252] text-white px-3 py-1 rounded text-xs font-bold z-[2] shadow-sm">{dynamicDiscount}% OFF</div>
      )}
      
      <div className="absolute top-4 right-4 z-[2] opacity-0 translate-x-2.5 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:translate-x-0">
        <button 
          className="bg-white border border-gray-200 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-gray-500 transition-colors shadow-sm hover:text-[#ff5252] hover:border-[#ff5252]" 
          title={isWished ? "Remove from wishlist" : "Add to wishlist"} 
          onClick={handleWishlistToggle}
        >
          <FiHeart fill={isWished ? "#ff5252" : "none"} color={isWished ? "#ff5252" : "currentColor"} />
        </button>
      </div>
      
      <Link to={`/product/${product.id}`} className="no-underline text-inherit flex-1 flex flex-col">
        <div className="w-full h-[140px] sm:h-[200px] md:h-[240px] rounded-lg overflow-hidden mb-6">
          <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
        </div>
        <div className="flex flex-col flex-none pb-0">
          <div className="flex justify-between items-center mb-2.5">
            <span 
              className="text-[0.72rem] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-[0.5px]" 
              style={{ color: 'var(--category-color)', background: 'color-mix(in srgb, var(--category-color) 12%, transparent)' }}
            >
              {product.category}
            </span>
            {dynamicRating >= 4.7 && <span className="bg-red-50 text-red-500 text-[0.7rem] font-extrabold px-2 py-1 rounded uppercase border border-red-100">🔥 Hot</span>}
          </div>
          <h3 className="text-[1.25rem] font-bold text-gray-900 mb-4 leading-[1.4] flex-1">{product.name}</h3>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-bold text-[0.9rem] text-gray-900">
              <FiStar className="text-[#fbbf24] fill-[#fbbf24]" />
              <span>{dynamicRating}</span>
              <span className="text-[0.85em] ml-0.5 text-gray-500">({product.reviewsCount || 0})</span>
            </div>
            <span className="text-[0.75rem] text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded">
              📦 {Math.abs((typeof product.id === 'number' ? product.id * 3 : String(product.id).length * 7) % 100) + 40}+
            </span>
          </div>
        </div>
      </Link>

      <div className="flex-none flex flex-col gap-3 pt-2">
        
        {/* Modern Variant Selector */}
        {hasVariants && (
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <CustomSelect 
              value={selectedVariantIdx}
              onChange={handleVariantChange}
              options={product.variants.map((v, idx) => {
                const vPrice = Number(v.price) || 0;
                const vMrp = Number(v.mrp) || vPrice;
                const isLegacyDiscount = Number(product.discount) > 0 && vMrp === vPrice;
                let disc = Number(product.discount) || 0;
                if (!isLegacyDiscount && vMrp > vPrice) disc = Math.round(((vMrp - vPrice) / vMrp) * 100);
                const isDiscounted = disc > 0;
                const vSellPrice = isLegacyDiscount ? vPrice * (1 - disc / 100) : vPrice;
                const priceLabel = isDiscounted 
                  ? <><span className="line-through text-gray-400 text-[0.85rem] font-medium tracking-tight">₹{(vMrp || vPrice).toFixed(0)}</span> <span className="text-[#059669] text-[0.95rem] font-bold">₹{vSellPrice.toFixed(2)}</span></>
                  : `₹${vPrice.toFixed(2)}`;
                return {
                  value: idx,
                  label: <span className="flex items-center gap-2">{v.unit} - {priceLabel}</span>
                };
              })}
            />
          </div>
        )}

        <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-4 mt-1">
          <div className="flex flex-col">
            {dynamicDiscount > 0 ? (
              <div className="flex flex-row items-baseline gap-2">
                 <span className="line-through text-gray-400 text-[0.85rem] font-medium">
                    ₹{currentMrp.toFixed(0)}
                 </span>
                 <span className="text-[#059669] text-[1.1rem] font-extrabold">
                    ₹{(Number(product.discount) > 0 && currentMrp === currentPrice ? currentPrice * (1 - Number(product.discount) / 100) : currentPrice).toFixed(2)}
                 </span>
              </div>
            ) : (
                 <span className="text-[#059669] text-[1.1rem] font-extrabold">₹{currentPrice.toFixed(2)}</span>
            )}
            {!hasVariants && <span className="text-[0.8rem] text-gray-500">/ {product.unit || '1 pc'}</span>}
          </div>
          
          {qtyInCart > 0 ? (
            <div className="flex items-center justify-between bg-[#059669] rounded-xl overflow-hidden h-[40px] w-[110px] shadow-[0_4px_10px_rgba(16,185,129,0.2)]" onClick={(e) => e.stopPropagation()}>
              <button className="bg-transparent border-none w-[35px] h-full flex items-center justify-center cursor-pointer text-white text-[1.1rem] transition-colors hover:bg-black/10" onClick={decrementQty}><FiMinus /></button>
              <span className="font-extrabold text-white text-[1rem]">{qtyInCart}</span>
              <button className="bg-transparent border-none w-[35px] h-full flex items-center justify-center cursor-pointer text-white text-[1.1rem] transition-colors hover:bg-black/10" onClick={incrementQty}><FiPlus /></button>
            </div>
          ) : (
            <button className="bg-white text-[#059669] border-2 border-[#059669] px-5 py-2 font-bold rounded-lg transition-all hover:bg-[#059669] hover:text-white group-hover/card:bg-[#059669] group-hover/card:text-white sm:group-hover/card:scale-105 group-hover/card:shadow-[0_5px_15px_rgba(5,150,105,0.2)]" onClick={handleAdd}>
               Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
