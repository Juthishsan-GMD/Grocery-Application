import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiChevronLeft, FiCheckCircle, FiTruck, FiShield, FiMinus, FiPlus } from 'react-icons/fi';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import CustomSelect from '../../components/common/CustomSelect';
import ProductCard from '../components/ProductCard';
import ReviewsSection from '../components/ReviewsSection';

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
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6 text-[#10b981] text-[1.2rem] font-semibold">
        <div className="w-[50px] h-[50px] border-4 border-emerald-500/20 border-t-[#10b981] rounded-full animate-spin"></div>
        <p>Loading fresh produce...</p>
      </div>
    );
  }

  const dynamicRating = Number(product.rating || 0).toFixed(1);
  const reviewsCount = Number(product.reviewsCount || 0);

  let dynamicDiscount = Number(product.discount) || 0;
  const currentPrice = Number(selectedVariant.price) || Number(product.price) || 0;
  const currentMrp = Number(selectedVariant.mrp) || Number(product.mrp) || currentPrice;
  if (!dynamicDiscount && currentMrp > currentPrice) {
    dynamicDiscount = Math.round(((currentMrp - currentPrice) / currentMrp) * 100);
  }

  const handleAddToCart = () => {
    const isLegacyDiscount = Number(product.discount) > 0 && currentMrp === currentPrice;
    const sellPrice = isLegacyDiscount ? selectedVariant.price * (1 - Number(product.discount) / 100) : selectedVariant.price;
    const customizedProduct = { 
      ...product, 
      price: sellPrice, 
      unit: selectedVariant.unit,
      variant_id: selectedVariant.variant_id 
    };
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
    <div className="pb-24 bg-slate-100 min-h-screen pt-4">
      <div className="container">
        
        <button className="bg-transparent border-none text-base font-semibold text-gray-500 inline-flex items-center gap-2 cursor-pointer py-2 mb-8 transition-all duration-300 hover:text-[#10b981] hover:-translate-x-1" onClick={() => navigate(-1)}>
          <FiChevronLeft /> Back to Shopping
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 bg-white p-8 lg:p-12 rounded-[32px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.06)] items-start">
          
          {/* Left: Product Image Gallery */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-[100px]" style={{ position: 'relative' }}>
            <div 
              className={`group bg-white rounded-[32px] overflow-hidden h-[400px] lg:h-[520px] relative flex p-6 md:p-12 border border-black/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-emerald-500/10 ${zoomParams ? 'cursor-crosshair' : ''}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {dynamicDiscount > 0 && <span className="absolute top-8 left-8 bg-gradient-to-br from-[#ff4c4c] to-[#ff1a1a] text-white py-2.5 px-5 rounded-[14px] font-extrabold text-[0.9rem] z-10 shadow-[0_10px_20px_rgba(255,76,76,0.3)] uppercase tracking-[1px] before:content-['SALE_-'] before:mr-1 before:opacity-80 before:text-[0.75rem]">{dynamicDiscount}% OFF</span>}
              <img src={activeImage} alt={product.name} className="w-full h-full object-contain transition-all duration-[600ms] drop-shadow-[0_20px_30px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_30px_40px_rgba(0,0,0,0.15)]" key={activeImage} />
              
              {zoomParams && (
                <div 
                  className="absolute w-[150px] h-[150px] border-2 border-emerald-500/40 bg-white/20 pointer-events-none shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-xl backdrop-brightness-105" 
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
                className="absolute top-0 left-[calc(100%+4rem)] w-full h-[520px] bg-white border border-slate-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] rounded-[32px] bg-no-repeat z-[1000] pointer-events-none animate-[fadeInZoom_0.2s_ease-out_forwards]"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundPosition: `${zoomParams.xPercent}% ${zoomParams.yPercent}%`,
                  backgroundSize: '250% 250%',
                  animationName: 'fadeInZoom', // ensure it runs with custom keyframes just visually mapped
                  animationFillMode: 'forwards'
                }}
              >
                 <style dangerouslySetInnerHTML={{__html: `
                    @keyframes fadeInZoom {
                       from { opacity: 0; transform: scale(0.98); }
                       to { opacity: 1; transform: scale(1); }
                    }
                 `}} />
              </div>
            )}
            
            <div className="flex gap-5 justify-start p-2">
              {(product.images || [product.image, product.image, product.image]).map((img, idx) => (
                <div 
                  key={idx} 
                  className={`group w-[95px] h-[95px] rounded-[20px] p-2.5 relative cursor-pointer transition-all duration-400 overflow-hidden ${activeIdx === idx ? 'border-[#10b981] bg-white shadow-[0_10px_20px_rgba(16,185,129,0.15)] border-2' : 'bg-slate-50 border-2 border-slate-200 hover:-translate-y-1 hover:border-emerald-500/20 hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)]'}`}
                  onClick={() => { setActiveImage(img); setActiveIdx(idx); }}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain transition-transform duration-300" />
                  {activeIdx !== idx && <div className="absolute inset-0 bg-gray-50/60 backdrop-blur-[1px] transition-all duration-300 rounded-xl group-hover:bg-white/20"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-4 mb-6">
                <span 
                  className="text-[0.85rem] font-bold uppercase tracking-[1px] py-1.5 px-4 rounded-full inline-block border border-current" 
                  style={{ 
                    backgroundColor: `${categoryColors[product.category] || '#55b746'}15`, 
                    color: categoryColors[product.category] || '#55b746' 
                  }}
                >
                  {product.category}
                </span>
                {dynamicRating >= 4.7 && (
                  <span className="bg-amber-50 text-amber-600 text-[0.85rem] font-bold py-1.5 px-4 rounded-full border border-amber-200 shadow-[0_4px_10px_rgba(217,119,6,0.1)]">
                    🔥 Best Seller
                  </span>
                )}
              </div>
              <h1 className="text-[2.2rem] lg:text-[2.8rem] font-black text-gray-900 leading-[1.2] mb-4 tracking-[-0.5px]">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex gap-1 text-[1.1rem]">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} fill={i < Math.round(dynamicRating) ? 'currentColor' : 'none'} className={i < Math.round(dynamicRating) ? 'text-[#f59e0b]' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-gray-500 text-[0.95rem] font-semibold">{dynamicRating} / 5.0 ({reviewsCount} Reviews)</span>
                <span className="text-[0.9rem] text-gray-500 bg-gray-100 py-1 px-3 rounded-lg ml-0 sm:ml-4 border border-gray-200">
                   📦 <b className="text-gray-900">{Math.abs((String(product.id).length * 17) % 300) + 120}+</b> orders recently
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between mb-6 p-6 bg-gray-50 rounded-[20px] border border-gray-200 gap-4">
              <div className="flex items-baseline gap-2">
                {dynamicDiscount > 0 ? (
                  <div className="flex items-baseline gap-4" style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    <span className="text-[1.5rem] font-semibold text-gray-400 line-through">
                      ₹{currentMrp.toFixed(0)}
                    </span>
                    <span className="text-[2.5rem] font-extrabold text-[#10b981] leading-none">
                      ₹{(Number(product.discount) > 0 && currentMrp === currentPrice ? currentPrice * (1 - Number(product.discount) / 100) : currentPrice).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-[2.5rem] font-extrabold text-[#10b981] leading-none">₹{selectedVariant.price.toFixed(2)}</span>
                )}
                {(!product.variants || product.variants.length === 0) && (
                  <span className="text-[1.1rem] text-gray-500 font-semibold">/ {product.unit}</span>
                )}
              </div>
              <div className="flex items-center gap-2 font-bold text-gray-900 text-[0.9rem]">
                <span className="w-[10px] h-[10px] rounded-full bg-[#10b981] shadow-[0_0_0_3px_rgba(16,185,129,0.2)]"></span> In Stock (Ready to Ship)
              </div>
            </div>

            <p className="text-[1.1rem] text-gray-500 leading-[1.7] mb-8">
              Experience the finest quality freshness with our hand-picked <strong>{product.name}</strong>. Sourced directly from trusted, sustainable farms, this product undergoes rigorous quality checks to ensure you receive nothing but the absolute best. Perfect for your daily nutritional needs.
            </p>

            {/* Premium Trust Badges */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4 text-[1.05rem] font-semibold text-gray-900">
                <FiCheckCircle className="text-[#10b981] text-[1.4rem] bg-emerald-500/10 p-1.5 rounded-full w-[35px] h-[35px]" />
                <span>100% Organic certified</span>
              </div>
              <div className="flex items-center gap-4 text-[1.05rem] font-semibold text-gray-900">
                <FiTruck className="text-[#10b981] text-[1.4rem] bg-emerald-500/10 p-1.5 rounded-full w-[35px] h-[35px]" />
                <span>Same-day ultra-fast delivery</span>
              </div>
              <div className="flex items-center gap-4 text-[1.05rem] font-semibold text-gray-900">
                <FiShield className="text-[#10b981] text-[1.4rem] bg-emerald-500/10 p-1.5 rounded-full w-[35px] h-[35px]" />
                <span>Freshness guarantee policy</span>
              </div>
            </div>

            <hr className="border-none h-[2px] bg-gray-200 my-8" />

            {/* Variant Layout Integration */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
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
                        ? <><span style={{textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.9em'}}>₹{(vMrp || vPrice).toFixed(0)}</span> <span style={{color: '#10b981', fontWeight: 800}}>₹{vSellPrice.toFixed(2)}</span></>
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
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center bg-gray-100 rounded-2xl p-1.5 sm:p-1.5 border border-gray-200 sm:justify-start justify-center">
                <button 
                  className="w-[45px] h-[45px] rounded-xl border-none bg-white text-gray-900 text-[1.2rem] flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition-all duration-200 hover:bg-[#10b981] hover:text-white hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900 disabled:hover:translate-y-0" 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="w-[50px] text-center text-[1.25rem] font-extrabold text-gray-900">{quantity}</span>
                <button 
                  className="w-[45px] h-[45px] rounded-xl border-none bg-white text-gray-900 text-[1.2rem] flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition-all duration-200 hover:bg-[#10b981] hover:text-white hover:-translate-y-0.5" 
                  onClick={() => setQuantity(q => q + 1)}
                >
                  <FiPlus />
                </button>
              </div>

              <button className="flex-1 text-[1.2rem] p-4 rounded-2xl flex justify-center items-center gap-3 shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(16,185,129,0.4)] transition-all duration-300 bg-[#10b981] text-white font-bold border-none cursor-pointer" onClick={handleAddToCart}>
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
          <div className="mt-20 pt-16 border-t-2 border-dashed border-emerald-500/20">
            <div className="text-center mb-12">
              <h2 className="text-[2.5rem] font-extrabold text-gray-900 mb-2">You Might Also Like</h2>
              <p className="text-gray-500 text-[1.1rem]">Customers who viewed this item also looked at these fresh products.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-8">
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
