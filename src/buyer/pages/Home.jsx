import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { categories } from '../../constants/data';
import { useProducts } from '../../contexts/ProductContext';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';

import ProductCard from '../components/shop/ProductCard';
import OfferTimer from '../components/shop/OfferTimer';

const Home = () => {
  const { products } = useProducts();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  return (
    <>
      {/* Hero Section */}
      <section className="py-[4rem] pt-[11rem] bg-gradient-to-br from-white to-[rgba(85,183,70,0.05)] min-h-[90vh] flex items-center overflow-hidden">
        <div className="container mx-auto flex items-center justify-between gap-16 flex-col-reverse lg:flex-row text-center lg:text-left px-4 animate-fade-in">
          <div className="flex-1 max-w-[600px] flex flex-col items-center lg:items-start mx-auto lg:mx-0">
            <span className="inline-block bg-[rgba(85,183,70,0.1)] text-[#55b746] py-2 px-5 rounded-full font-semibold text-[0.9rem] mb-6 border border-[rgba(85,183,70,0.2)]">100% Organic Products</span>
            <h1 className="text-[2.2rem] sm:text-[2.8rem] lg:text-[3.5rem] font-extrabold leading-[1.1] text-gray-900 mb-6 tracking-[-1px]">
              Fresh groceries, <br />
              delivered to your door.
            </h1>
            <p className="text-[1.15rem] text-gray-500 mb-10 leading-[1.6]">
              Experience the finest quality fruits, vegetables, and daily essentials sourced directly from local farms. Get free delivery on your first order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12 justify-center lg:justify-start">
              <button className="bg-[#55b746] text-white hover:bg-[#459a37] hover:-translate-y-0.5 hover:shadow-md transition-all py-[0.8rem] px-[2rem] text-[1.1rem] rounded-lg font-medium" onClick={() => navigate('/shop')}>Shop Now</button>
              <button className="bg-transparent border border-[#55b746] text-[#55b746] hover:bg-[#55b746] hover:text-white transition-all py-[0.8rem] px-[2rem] text-[1.1rem] rounded-lg font-medium" onClick={() => navigate('/shop')}>Explore Offers</button>
            </div>
            <div className="flex gap-12 pt-8 border-t border-gray-100 justify-center lg:justify-start w-full">
              <div className="text-center lg:text-left">
                <h4 className="text-[1.5rem] text-gray-900 font-bold">5k+</h4>
                <p className="text-gray-500 text-[0.9rem] font-medium">Products</p>
              </div>
              <div className="text-center lg:text-left">
                <h4 className="text-[1.5rem] text-gray-900 font-bold">10k+</h4>
                <p className="text-gray-500 text-[0.9rem] font-medium">Customers</p>
              </div>
              <div className="text-center lg:text-left">
                <h4 className="text-[1.5rem] text-gray-900 font-bold">24/7</h4>
                <p className="text-gray-500 text-[0.9rem] font-medium">Support</p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative flex justify-center items-center w-full max-w-[600px]">
            <div className="absolute w-full pt-[100%] max-w-[500px] max-h-[500px] bg-[radial-gradient(circle,rgba(85,183,70,0.15)_0%,rgba(85,183,70,0)_70%)] rounded-full z-[1] animate-[pulse_4s_ease-in-out_infinite_alternate]" style={{ width: '500px', height: '500px', paddingTop: 0 }}></div>
            <img 
              src="/hero_banner.png" 
              alt="Fresh colorful groceries spilling from basket" 
              className="relative z-[2] w-full rounded-[20px] shadow-xl md:[transform:perspective(1000px)_rotateY(-5deg)] md:hover:[transform:perspective(1000px)_rotateY(0deg)_scale(1.02)] transition-transform duration-500 lg:transform-none"
            />
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-8 after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-[#55b746] after:rounded-sm inline-block relative">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-8 mt-12 w-full">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] cursor-pointer border border-transparent hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(5,150,105,0.15)] hover:border-[rgba(5,150,105,0.3)] group"
                onClick={() => navigate('/shop', { state: { category: category.name } })}
              >
                <div className="w-full aspect-square overflow-hidden relative">
                  <img src={category.image} alt={category.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-[1.1rem] font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <span className="text-[0.9rem] text-[#55b746] font-medium opacity-0 translate-y-2.5 transition-all duration-300 inline-block group-hover:opacity-100 group-hover:translate-y-0">Explore →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Timer Section */}
      <OfferTimer />

      {/* Top Deals Section */}
      <section className="py-24 bg-gradient-to-b from-emerald-50 to-gray-50 border-t border-[rgba(5,150,105,0.05)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-[#55b746] after:rounded-sm">Top Deals of the Day</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
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
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-[#55b746] after:rounded-sm">Trending Products</h2>
          </div>
          
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 sm:gap-8 w-full">
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
        <div className="container mx-auto px-4">
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
        <div className="container mx-auto px-4">
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
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left">
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
