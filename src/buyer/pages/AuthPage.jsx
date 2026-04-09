import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useCart();
  const { loginUser } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/signup');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsSignUp(location.pathname === '/signup');
  }, [location.pathname]);

  const toggleMode = () => {
    const nextRoute = isSignUp ? '/login' : '/signup';
    navigate(nextRoute, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
    const baseUrl = 'http://localhost:5000';

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        loginUser(data.user);
        
        showToast(isSignUp ? 'Account created successfully!' : `Welcome back, ${data.user.name}!`);
        
        localStorage.setItem('divine_customer_name', data.user.name);
        localStorage.setItem('divine_customer_email', data.user.email);
        
        // Redirect based on role
        if (data.user.role === 'admin') navigate('/admin');
        else if (data.user.role === 'seller') navigate('/seller/dashboard');
        else navigate('/');
      } else {
        showToast(data.message || 'Authentication failed.');
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-stretch justify-center bg-white relative overflow-hidden h-auto md:h-[100vh] min-h-[calc(100vh-80px)] -mb-16">
      <div className="absolute rounded-full blur-[80px] z-0 opacity-60 w-[50vh] h-[50vh] bg-emerald-500/20 -top-[10%] -left-[10%]"></div>
      <div className="absolute rounded-full blur-[80px] z-0 opacity-60 w-[60vh] h-[60vh] bg-amber-500/15 -bottom-[15%] -right-[10%]"></div>
      
      <div className="w-full max-w-full h-auto md:h-full min-h-[calc(100vh-80px)] rounded-none shadow-none bg-transparent relative overflow-hidden z-10">
        
        {/* SIGN IN FORM */}
        <div className={`md:absolute relative h-full w-full md:w-1/2 transition-all duration-700 ease-[cubic-bezier(0.86,0,0.07,1)] flex-col justify-center px-8 md:px-16 bg-transparent py-12 md:py-0 ${isSignUp ? 'hidden md:flex md:-translate-x-[10%] opacity-0 pointer-events-none' : 'flex opacity-100 z-20 md:left-0'}`}>
          <div className="w-full max-w-[420px] mx-auto md:mt-12">
            <h1 className="text-[2.6rem] font-extrabold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500 mb-10 text-[1.1rem]">Sign in to your FreshBasket account.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-5 flex flex-col gap-2">
                <label className="text-[0.9rem] text-gray-900 font-semibold">Email Address</label>
                <div className="relative flex items-center">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[1.1rem] pointer-events-none z-10" />
                  <input type="email" placeholder="name@example.com" required 
                    className="w-full py-4 pr-5 pl-14 border-2 border-gray-200 rounded-xl bg-white text-base transition-all duration-300 focus:border-[#10b981] focus:shadow-[0_4px_15px_rgba(16,185,129,0.1)] outline-none text-gray-900"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="mb-5 flex flex-col gap-2">
                <div className="flex justify-between">
                  <label className="text-[0.9rem] text-gray-900 font-semibold">Password</label>
                  <a href="#/" className="text-[0.85rem] text-[#10b981] font-semibold no-underline">Forgot?</a>
                </div>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[1.1rem] pointer-events-none z-10" />
                  <input type="password" placeholder="••••••••" required 
                    className="w-full py-4 pr-5 pl-14 border-2 border-gray-200 rounded-xl bg-white text-base transition-all duration-300 focus:border-[#10b981] focus:shadow-[0_4px_15px_rgba(16,185,129,0.1)] outline-none text-gray-900"
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full p-4 rounded-xl text-[1.1rem] font-semibold mt-6 flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(16,185,129,0.3)] bg-[#10b981] text-white hover:-translate-y-0.5 transition-all border-none cursor-pointer" disabled={loading}>
                {loading ? 'Processing...' : 'Sign In'} <FiArrowRight />
              </button>
            </form>
            
            {/* Mobile-only toggle */}
            <div className="md:hidden mt-8 text-center text-gray-500">
               <p>New Here?</p>
               <button onClick={toggleMode} className="bg-transparent border-none text-[#10b981] font-bold cursor-pointer mt-2 hover:underline">Create an Account</button>
            </div>
          </div>
        </div>

        {/* SIGN UP FORM */}
        <div className={`md:absolute relative h-full w-full md:w-1/2 transition-all duration-700 ease-[cubic-bezier(0.86,0,0.07,1)] flex-col justify-center px-8 md:px-16 bg-transparent py-12 md:py-0 ${isSignUp ? 'flex opacity-100 z-50 pointer-events-auto md:translate-x-[100%]' : 'hidden md:flex md:left-0 opacity-0 z-10 pointer-events-none md:translate-x-[10%]'}`}>
          <div className="w-full max-w-[420px] mx-auto md:mt-12">
            <h1 className="text-[2.6rem] font-extrabold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 mb-10 text-[1.1rem]">Join us to shop fresh & organic.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-5 flex flex-col gap-2">
                <label className="text-[0.9rem] text-gray-900 font-semibold">Full Name</label>
                <div className="relative flex items-center">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[1.1rem] pointer-events-none z-10" />
                  <input type="text" placeholder="Username" required 
                    className="w-full py-4 pr-5 pl-14 border-2 border-gray-200 rounded-xl bg-white text-base transition-all duration-300 focus:border-[#10b981] focus:shadow-[0_4px_15px_rgba(16,185,129,0.1)] outline-none text-gray-900"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div className="mb-5 flex flex-col gap-2">
                <label className="text-[0.9rem] text-gray-900 font-semibold">Email Address</label>
                <div className="relative flex items-center">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[1.1rem] pointer-events-none z-10" />
                  <input type="email" placeholder="name@example.com" required 
                    className="w-full py-4 pr-5 pl-14 border-2 border-gray-200 rounded-xl bg-white text-base transition-all duration-300 focus:border-[#10b981] focus:shadow-[0_4px_15px_rgba(16,185,129,0.1)] outline-none text-gray-900"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="mb-5 flex flex-col gap-2">
                <label className="text-[0.9rem] text-gray-900 font-semibold">Password</label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[1.1rem] pointer-events-none z-10" />
                  <input type="password" placeholder="Create a strong password" required 
                    className="w-full py-4 pr-5 pl-14 border-2 border-gray-200 rounded-xl bg-white text-base transition-all duration-300 focus:border-[#10b981] focus:shadow-[0_4px_15px_rgba(16,185,129,0.1)] outline-none text-gray-900"
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full p-4 rounded-xl text-[1.1rem] font-semibold mt-6 flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(16,185,129,0.3)] bg-[#10b981] text-white hover:-translate-y-0.5 transition-all border-none cursor-pointer" disabled={loading}>
                {loading ? 'Creating...' : 'Sign Up'} <FiArrowRight />
              </button>
              
              <div className="mt-6 text-center text-[0.9rem] text-slate-500 flex flex-col gap-1">
                <span>Are you a seller?</span>
                <button type="button" onClick={() => navigate('/seller')} className="bg-transparent border-none text-[#10b981] font-bold cursor-pointer text-[0.95rem] transition-all duration-200 hover:underline hover:-translate-y-[1px]">
                  Register as Seller
                </button>
              </div>
              <div className="mt-2 text-center text-[0.9rem] text-slate-500 flex flex-col gap-1">
                <span>Are you an Admin?</span>
                <button type="button" onClick={() => navigate('/admin/signup')} className="bg-transparent border-none text-[#4F46E5] font-bold cursor-pointer text-[0.95rem] transition-all duration-200 hover:underline hover:-translate-y-[1px]">
                  Register as Admin
                </button>
              </div>
            </form>
            
            {/* Mobile-only toggle */}
            <div className="md:hidden mt-8 text-center text-gray-500">
               <p>One of Us?</p>
               <button onClick={toggleMode} className="bg-transparent border-none text-[#10b981] font-bold cursor-pointer mt-2 hover:underline">Sign In Now</button>
            </div>
          </div>
        </div>

        {/* OVERLAY PANEL */}
        <div className={`hidden md:block absolute top-0 h-full left-1/2 w-1/2 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200')] bg-center bg-cover z-10 transition-transform duration-700 ease-[cubic-bezier(0.86,0,0.07,1)] overflow-hidden ${isSignUp ? '-translate-x-full' : ''}`}>
          <div className={`absolute inset-0 transition-all duration-500 ${isSignUp ? 'bg-gradient-to-br from-[#022c1e]/75 to-[#059669]/85' : 'bg-gradient-to-br from-[#059669]/85 to-[#022c1e]/75'}`}></div>
          <div className="absolute inset-0 z-20 w-full h-full text-white">
            <div className={`absolute inset-0 flex flex-col justify-center items-center text-center px-16 transition-all duration-700 ease-[cubic-bezier(0.86,0,0.07,1)] ${isSignUp ? 'opacity-0 translate-x-[50px] pointer-events-none' : 'opacity-100 translate-x-0 pointer-events-auto'}`}>
              <h2 className="text-[3rem] font-extrabold mb-4 leading-[1.1]">New Here?</h2>
              <p className="text-[1.2rem] leading-[1.5] opacity-90 mb-10 max-w-[400px]">Discover thousands of fresh organic products waiting for you.</p>
              <button className="border-2 border-white text-white px-12 py-4 text-[1.1rem] bg-transparent rounded-full cursor-pointer hover:bg-white hover:text-[#10b981] hover:scale-105 transition-all" type="button" onClick={toggleMode}>Create an Account</button>
            </div>
            <div className={`absolute inset-0 flex flex-col justify-center items-center text-center px-16 transition-all duration-700 ease-[cubic-bezier(0.86,0,0.07,1)] ${isSignUp ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-[50px] pointer-events-none'}`}>
              <h2 className="text-[3rem] font-extrabold mb-4 leading-[1.1]">One of Us?</h2>
              <p className="text-[1.2rem] leading-[1.5] opacity-90 mb-10 max-w-[400px]">Sign in with your email to track your orders and shop fast.</p>
              <button className="border-2 border-white text-white px-12 py-4 text-[1.1rem] bg-transparent rounded-full cursor-pointer hover:bg-white hover:text-[#10b981] hover:scale-105 transition-all" type="button" onClick={toggleMode}>Sign In Now</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
