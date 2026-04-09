import React from 'react';
import { FiTarget, FiHeart, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

const About = () => {
  return (
    <div className="pt-20 min-h-[80vh] bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-center text-white bg-[url('https://images.unsplash.com/photo-1543168256-4154004ceead?auto=format&fit=crop&q=80&w=1600')] bg-center bg-cover">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-emerald-500/80 z-10"></div>
        <div className="container relative z-20 max-w-[800px] mx-auto px-4">
          <h1 className="text-[2.5rem] md:text-[3.5rem] font-extrabold mb-4 drop-shadow-md">Freshness Delivered to Your Doorstep</h1>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed">We are reimagining the way you shop for daily groceries. Bringing the farm closer to your home sustainably and reliably.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto flex flex-col md:flex-row items-center gap-16 py-24 px-6 md:px-4">
        <div className="flex-1">
          <h2 className="text-3xl md:text-[2.5rem] font-extrabold text-slate-800 mb-6">Our Core Mission</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            At FreshBasket, our mission is simple: to make high-quality, fresh, and organic foods accessible to everyone. We believe that eating healthy shouldn't be a luxury, and shopping shouldn't be a chore.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-lg font-semibold text-slate-800">
              <FiCheckCircle className="text-emerald-500 text-2xl" />
              <span>100% Organic Sourcing</span>
            </div>
            <div className="flex items-center gap-4 text-lg font-semibold text-slate-800">
              <FiCheckCircle className="text-emerald-500 text-2xl" />
              <span>Same-Day Delivery</span>
            </div>
            <div className="flex items-center gap-4 text-lg font-semibold text-slate-800">
              <FiCheckCircle className="text-emerald-500 text-2xl" />
              <span>Support Local Farmers</span>
            </div>
          </div>
        </div>
        <div className="flex-1 relative w-full">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600" alt="Fresh Produce" className="w-full rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-4 transition-transform duration-700 ease-in-out cursor-pointer" />
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <h2 className="text-[2.5rem] font-extrabold text-slate-800 mb-4">Why Choose FreshBasket?</h2>
            <p className="text-lg text-slate-600">Our values dictate everything we do, from sourcing to delivery.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-12 md:p-8 lg:p-12 bg-slate-50 rounded-[20px] text-center transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] border border-transparent hover:-translate-y-2.5 hover:shadow-[0_15px_35px_rgba(5,150,105,0.1)] hover:border-emerald-500/20 hover:bg-white group">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 text-3xl transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110">
                <FiTarget />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Unmatched Quality</h3>
              <p className="text-slate-600 leading-relaxed">We handpick every item from verified local farms to ensure you get the freshest produce possible.</p>
            </div>
            
            <div className="p-12 md:p-8 lg:p-12 bg-slate-50 rounded-[20px] text-center transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] border border-transparent hover:-translate-y-2.5 hover:shadow-[0_15px_35px_rgba(5,150,105,0.1)] hover:border-emerald-500/20 hover:bg-white group">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 text-3xl transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110">
                <FiHeart />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Community First</h3>
              <p className="text-slate-600 leading-relaxed">By bypassing giant chains, we push profits directly back into the hands of community farmers.</p>
            </div>
            
            <div className="p-12 md:p-8 lg:p-12 bg-slate-50 rounded-[20px] text-center transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] border border-transparent hover:-translate-y-2.5 hover:shadow-[0_15px_35px_rgba(5,150,105,0.1)] hover:border-emerald-500/20 hover:bg-white group">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 text-3xl transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110">
                <FiTrendingUp />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Sustainable Growth</h3>
              <p className="text-slate-600 leading-relaxed">We utilize eco-friendly packaging and optimized delivery routes to reduce our carbon footprint globally.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
