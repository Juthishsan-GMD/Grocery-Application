import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';
import { FiShoppingCart } from 'react-icons/fi';

import ProductCard from '../components/ProductCard';

const Home = () => {
  const { products, categories } = useProducts();
  const navigate = useNavigate();
  // const { addToCart } = useCart(); // Removed unused variable
  return (
    <>
      {/* Premium Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-20">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 bg-white overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#10b98118] rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#fbbf2410] rounded-full blur-[80px] animate-pulse-slow delay-700"></div>
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[#3b82f608] rounded-full blur-[60px] animate-pulse-slow delay-1000"></div>
        </div>

        <div className="container mx-auto relative z-10 px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            
            {/* Text Content */}
            <div className="flex-1 max-w-[850px] text-center lg:text-left translate-y-0 opacity-0 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-[#10b98112] text-[#059669] px-5 py-2.5 rounded-full font-bold text-[0.85rem] mb-8 border border-[#10b98125] uppercase tracking-wider shadow-sm">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#10b981] animate-ping"></span>
                Freshness Guaranteed Every Day
              </div>
              
              <h1 className="text-[3rem] sm:text-[4rem] lg:text-[5.5rem] font-black leading-[1.02] text-gray-900 mb-8 tracking-[-0.035em]">
                Quality <span className="text-[#059669] relative inline-block">
                  Groceries
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#10b98135]" viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 10 Q 50 0, 100 10 T 200 10" fill="none" stroke="currentColor" strokeWidth="6" />
                  </svg>
                </span> <br />
                at Your Fingerprints.
              </h1>
              
              <p className="text-[1.3rem] text-gray-500 mb-12 leading-[1.65] max-w-[650px] mx-auto lg:mx-0 font-medium">
                Experience the finest organic produce and daily essentials sourced directly from local farmers to your kitchen table.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-16">
                <button 
                  className="group relative bg-[#059669] text-white py-4.5 px-12 rounded-[22px] font-bold text-[1.15rem] overflow-hidden shadow-[0_20px_45px_-12px_rgba(5,150,105,0.45)] transition-all hover:scale-[1.03] active:scale-95"
                  onClick={() => navigate('/shop')}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start Shopping <FiShoppingCart className="transition-transform group-hover:translate-x-1.5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                <button 
                  className="group bg-white text-gray-900 py-4.5 px-12 rounded-[22px] font-bold text-[1.15rem] border-2 border-gray-100 hover:border-[#059669] hover:text-[#059669] transition-all hover:shadow-xl shadow-sm"
                  onClick={() => navigate('/shop')}
                >
                  View Offers
                </button>
              </div>

              {/* Trust Section */}
              <div className="flex items-center justify-center lg:justify-start gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <span className="text-[2.2rem] font-black text-gray-900 leading-none">5k+</span>
                  <span className="text-[0.75rem] uppercase font-extrabold tracking-[0.2em] text-gray-400 mt-2">Products</span>
                </div>
                <div className="w-[1px] h-12 bg-gray-200"></div>
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <span className="text-[2.2rem] font-black text-gray-900 leading-none">10k+</span>
                  <span className="text-[0.75rem] uppercase font-extrabold tracking-[0.2em] text-gray-400 mt-2">Customers</span>
                </div>
                <div className="w-[1px] h-12 bg-gray-200"></div>
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <span className="text-[2.2rem] font-black text-gray-900 leading-none">24/7</span>
                  <span className="text-[0.75rem] uppercase font-extrabold tracking-[0.2em] text-gray-400 mt-2">Support</span>
                </div>
              </div>
            </div>

            {/* Graphic Side */}
            <div className="flex-1 relative w-full max-w-[850px] animate-float-slow">
              <div className="relative group">
                {/* Main Hero Image with Glass Border */}
                <div className="relative z-10 rounded-[50px] overflow-hidden shadow-[0_60px_120px_-25px_rgba(0,0,0,0.18)] bg-white/40 backdrop-blur-sm p-5 transition-transform duration-1000 group-hover:scale-[1.015] border border-white/60">
                   <img 
                    src="/hero_banner.png" 
                    alt="Organic Basket" 
                    className="w-full h-auto rounded-[40px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                  />
                </div>

                {/* Floating Glassmorphic Badges */}
                <div className="absolute -top-12 -right-6 z-20 bg-white/85 backdrop-blur-2xl p-6 rounded-[28px] border border-white/50 shadow-[0_25px_60px_rgba(0,0,0,0.12)] flex items-center gap-5 animate-float-delayed">
                   <div className="w-14 h-14 bg-emerald-100/80 rounded-2xl flex items-center justify-center text-emerald-600 text-[1.6rem] shadow-inner">🚚</div>
                   <div>
                      <div className="font-black text-gray-900 text-sm tracking-tight">Rapid Delivery</div>
                      <div className="text-gray-500 text-xs font-bold">Within 30 Mins</div>
                   </div>
                </div>

                <div className="absolute -bottom-8 -left-8 z-20 bg-white/85 backdrop-blur-2xl p-6 rounded-[28px] border border-white/50 shadow-[0_25px_60px_rgba(0,0,0,0.12)] flex items-center gap-5 animate-float">
                   <div className="w-14 h-14 bg-amber-100/80 rounded-2xl flex items-center justify-center text-amber-600 text-[1.6rem] shadow-inner">🌱</div>
                   <div>
                      <div className="font-black text-gray-900 text-sm tracking-tight">100% Organic</div>
                      <div className="text-gray-500 text-xs font-bold">Pesticide Free</div>
                   </div>
                </div>

                {/* Ambient Decorative Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] rounded-full bg-[#10b98106] -z-1 animate-pulse"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Global Styles for Animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(60px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(1deg); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(-1deg); }
          }
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); opacity: 0.12; }
            50% { transform: scale(1.15); opacity: 0.25; }
          }
          
          .animate-fade-in-up { animation: fade-in-up 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          .animate-float { animation: float 8s ease-in-out infinite; }
          .animate-float-slow { animation: float 12s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; animation-delay: 2s; }
          .animate-pulse-slow { animation: pulse-slow 10s linear infinite; }
        `}} />
      </section>

      {/* Category Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[2.2rem] font-black text-gray-900 inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-[80px] after:h-[4px] after:bg-[#059669] after:rounded-full">
              Shop by Category
            </h2>
          </div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-10 w-fit mx-auto">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-500 cursor-pointer border border-gray-100 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(5,150,105,0.12)] hover:border-[#10b98140] group w-full max-w-[240px]"
                  onClick={() => navigate('/shop', { state: { category: category.name } })}
                >
                  <div className="w-full aspect-square overflow-hidden relative p-4">
                    <div className="w-full h-full rounded-2xl overflow-hidden">
                      <img src={category.image_url || category.image} alt={category.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                  </div>
                  <div className="p-6 pt-0 text-center">
                    <h3 className="text-[1.15rem] font-bold text-gray-900 mb-2 truncate">{category.name}</h3>
                    <span className="text-[0.85rem] text-[#059669] font-bold opacity-0 translate-y-3 transition-all duration-400 inline-block group-hover:opacity-100 group-hover:translate-y-0">Shop Now →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Top Deals Section */}
      <section className="py-24 bg-gradient-to-b from-emerald-50 to-gray-50 border-t border-[rgba(5,150,105,0.05)]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-[#55b746] after:rounded-sm">Top Deals of the Day</h2>
          </div>
          
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(285px,1fr))] gap-4 sm:gap-8 w-full">
            {products.filter(p => {
              if (Number(p.discount) > 0) return true;
              const hasVariants = p.variants && p.variants.length > 0;
              const defaultVariant = hasVariants ? p.variants[0] : { price: p.price, mrp: p.mrp };
              const currentPrice = Number(defaultVariant.price) || 0;
              const currentMrp = Number(defaultVariant.mrp) || currentPrice;
              return currentMrp > currentPrice;
            }).slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} cardType="home" />
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-[#55b746] after:rounded-sm">Trending Products</h2>
          </div>
          
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(285px,1fr))] gap-4 sm:gap-8 w-full">
            {products.length > 0 ? (
              products.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} cardType="home" />
              ))
            ) : (
              <div className="col-span-full text-center p-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl">
                <p className="text-[1.1rem] text-gray-500 mb-4">No products uploaded by the administrator yet.</p>
              </div>
            )}
          </div>

          <div className="flex justify-center items-center mt-14">
            <button className="bg-transparent border-2 border-[#55b746] text-[#55b746] hover:bg-[#55b746] hover:text-white transition-all duration-300 py-3 px-10 text-[1.1rem] rounded-lg font-semibold hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(5,150,105,0.15)]" onClick={() => navigate('/shop')}>
               View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 pb-20 bg-white border-t border-dashed border-[rgba(5,150,105,0.15)]">
        <div className="container mx-auto">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8">
            <div className="text-center py-8 px-4 bg-gray-50 rounded-2xl transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(5,150,105,0.1)]">
              <div className="text-5xl mb-5 flex items-center justify-center w-[80px] h-[80px] mx-auto bg-[rgba(5,150,105,0.1)] rounded-full text-[#55b746]">🚚</div>
              <h3 className="text-[1.25rem] font-bold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-500 text-[0.95rem] leading-snug">On all local orders above ₹499</p>
            </div>
            <div className="text-center py-8 px-4 bg-gray-50 rounded-2xl transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(5,150,105,0.1)]">
              <div className="text-5xl mb-5 flex items-center justify-center w-[80px] h-[80px] mx-auto bg-[rgba(5,150,105,0.1)] rounded-full text-[#55b746]">🌱</div>
              <h3 className="text-[1.25rem] font-bold text-gray-900 mb-2">100% Organic</h3>
              <p className="text-gray-500 text-[0.95rem] leading-snug">Sourced directly from local farms</p>
            </div>
            <div className="text-center py-8 px-4 bg-gray-50 rounded-2xl transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(5,150,105,0.1)]">
              <div className="text-5xl mb-5 flex items-center justify-center w-[80px] h-[80px] mx-auto bg-[rgba(5,150,105,0.1)] rounded-full text-[#55b746]">🛡️</div>
              <h3 className="text-[1.25rem] font-bold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-500 text-[0.95rem] leading-snug">100% safe & protected checkouts</p>
            </div>
            <div className="text-center py-8 px-4 bg-gray-50 rounded-2xl transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(5,150,105,0.1)]">
              <div className="text-5xl mb-5 flex items-center justify-center w-[80px] h-[80px] mx-auto bg-[rgba(5,150,105,0.1)] rounded-full text-[#55b746]">📞</div>
              <h3 className="text-[1.25rem] font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-500 text-[0.95rem] leading-snug">Dedicated team ready to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner Section */}
      <section className="py-8 pb-20 bg-white">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-[rgba(5,150,105,0.08)] rounded-[24px] py-12 px-6 sm:px-12 text-center border border-[rgba(5,150,105,0.15)] relative overflow-hidden shadow-sm">
            <div className="absolute -top-[50%] -left-[20%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(5,150,105,0.1)_0%,transparent_70%)] rounded-full z-[1]"></div>
            <div className="relative z-[2] max-w-[600px] mx-auto">
              <h2 className="text-[2.2rem] sm:text-[2.8rem] font-extrabold text-gray-900 mb-4 leading-tight">Get <span className="text-[#55b746]">20% Off</span> Your First Order</h2>
              <p className="text-[1.15rem] text-gray-500 mb-10 leading-[1.6]">Sign up today and get access to exclusive deals, premium farm-fresh produce, and priority delivery!</p>
              <button className="bg-[#55b746] text-white hover:bg-[#459a37] hover:-translate-y-0.5 transition-all py-4 px-12 text-[1.15rem] rounded-lg font-medium shadow-[0_4px_15px_rgba(5,150,105,0.3)]" onClick={() => navigate('/shop')}>Claim Offer Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#55b746] text-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left">
          <div className="flex-1">
            <h2 className="text-[2.2rem] font-bold mb-3 text-white">Join Our FreshBasket Family</h2>
            <p className="text-[1.1rem] opacity-90 leading-[1.6]">Subscribe to our newsletter for daily health tips, fresh arrivals, and surprise coupons.</p>
          </div>
          <form className="flex flex-col sm:flex-row gap-3 w-full max-w-[500px] mx-auto md:mx-0" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" required className="flex-1 py-4 px-6 border-none rounded-full text-[1rem] outline-none shadow-[0_4px_15px_rgba(0,0,0,0.1)] text-gray-900" />
            <button type="submit" className="rounded-full py-4 px-8 bg-gray-900 text-white min-w-[130px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:bg-white hover:text-gray-900 transition-colors sm:w-auto w-full font-medium">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Home;
