/**
 * ─────────────────────────────────────────────────────────────────
 *  SellerAuthPage.jsx  —  /seller
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiShoppingBag, FiMail, FiLock, FiUser } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

export default function SellerAuthPage() {
  const navigate = useNavigate();
  const { loginUser, currentUser, loading: authLoading } = useAuth();
  const { showToast } = useCart();
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && currentUser) {
      const isDone = localStorage.getItem("fb_onboarding_done") === "true";
      navigate(isDone ? "/seller/dashboard" : "/seller/onboarding", { replace: true });
    }
  }, [authLoading, currentUser, navigate]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    storeName: "",
    businessType: "Individual",
    phone: "",
    address: ""
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!formData.email) {
      showToast("Please enter your email first.");
      return;
    }
    setOtpLoading(true);
    try {
      const resp = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, role: "seller" })
      });
      const data = await resp.json();
      if (resp.ok) {
        showToast("OTP sent to your email!");
        setOtpSent(true);
      } else {
        showToast(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      showToast("Server error. Check backend.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Always use signup endpoint for sellers here
    const endpoint = "/api/auth/signup";
    const payload = { ...formData, role: 'seller' };

    try {
      console.log("[SellerAuthPage] Sending signup request to backend...");
      const resp = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      console.log("[SellerAuthPage] Response received:", { ok: resp.ok, status: resp.status, data });
      
      if (resp.ok) {
        console.log("[SellerAuthPage] Registration successful. Clearing stale state...");
        localStorage.setItem("token", data.token);
        localStorage.removeItem("fb_onboarding_done"); // Force clear any stale flag
        
        console.log("[SellerAuthPage] Logging in user via context...");
        loginUser(data.user);
        showToast("Registration Complete! Welcome to FreshBasket.");
        
        console.log("[SellerAuthPage] Redirecting to /seller/onboarding...");
        navigate("/seller/onboarding");
      } else {
        console.warn("[SellerAuthPage] Registration failed:", data.message);
        showToast(data.message || "Registration failed");
      }
    } catch (err) {
      showToast("Server error. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* Left Hero Section */}
      <div className="flex-1 relative p-16 flex flex-col justify-center text-white bg-[linear-gradient(rgba(16,185,129,0.9),rgba(6,78,59,0.95)),url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-white no-underline hover:opacity-80 transition-opacity">
          <FiArrowLeft /> Back to Shop
        </Link>
        <h1 className="text-[3.5rem] font-extrabold mb-4 leading-tight">Partner with <br/>FreshBasket</h1>
        <p className="text-[1.2rem] opacity-90 max-w-[500px] leading-relaxed">
          Reach millions of customers, manage inventory across cities, and get paid instantly. Your growth story starts here.
        </p>
        <div className="mt-12 flex gap-8">
          <div><h3 className="text-[2rem] font-bold">10k+</h3><p className="opacity-80">Active Sellers</p></div>
          <div><h3 className="text-[2rem] font-bold">50+</h3><p className="opacity-80">Cities covered</p></div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-[600px] p-16 flex flex-col justify-center bg-white overflow-y-auto">
        <div className="max-w-[450px] mx-auto w-full">
          <div className="mb-10">
            <h2 className="text-[2rem] font-extrabold text-slate-900 leading-tight transition-colors duration-200">
              Create Seller Account
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Register your business and start selling on FreshBasket
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[0.85rem] font-semibold text-slate-500 tracking-wider">STORE OWNER NAME</label>
              <div className="relative flex items-center group">
                <FiUser className="absolute left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh Kumar" 
                  required 
                  className="w-full py-3.5 pr-4 pl-12 border-[1.5px] border-slate-200 rounded-xl text-base transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-300"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[0.85rem] font-semibold text-slate-500 tracking-wider">BUSINESS / STORE NAME</label>
              <div className="relative flex items-center group">
                <FiShoppingBag className="absolute left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="e.g. Fresh Garden Mart" 
                  required 
                  className="w-full py-3.5 pr-4 pl-12 border-[1.5px] border-slate-200 rounded-xl text-base transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-300"
                  value={formData.storeName} 
                  onChange={e => setFormData({...formData, storeName: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[0.85rem] font-semibold text-slate-500 tracking-wider">EMAIL ADDRESS</label>
              <div className="relative flex items-center group">
                <FiMail className="absolute left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="email" 
                  placeholder="partner@email.com" 
                  required 
                  className="w-full py-3.5 pr-4 pl-12 border-[1.5px] border-slate-200 rounded-xl text-base transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-300"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  disabled={otpSent}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[0.85rem] font-semibold text-slate-500 tracking-wider">OTP VERIFICATION</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  required 
                  className="flex-1 py-3.5 px-4 border-[1.5px] border-slate-200 rounded-xl text-base transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-300"
                  value={formData.otp} 
                  onChange={e => setFormData({...formData, otp: e.target.value})} 
                  disabled={!otpSent}
                />
                <button 
                  type="button" 
                  onClick={handleSendOtp} 
                  disabled={otpLoading}
                  className="px-6 py-3.5 bg-emerald-100 text-emerald-700 rounded-xl font-bold cursor-pointer transition-colors hover:bg-emerald-200 disabled:opacity-50 border-none whitespace-nowrap"
                >
                  {otpLoading ? "Sending..." : (otpSent ? "Resend OTP" : "Send OTP")}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[0.85rem] font-semibold text-slate-500 tracking-wider">PASSWORD</label>
              <div className="relative flex items-center group">
                <FiLock className="absolute left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="w-full py-3.5 pr-4 pl-12 border-[1.5px] border-slate-200 rounded-xl text-base transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-300"
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full p-4 bg-emerald-500 text-white rounded-xl text-[1.1rem] font-bold cursor-pointer transition-all hover:bg-emerald-600 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 active:translate-y-0"
            >
              {loading ? "Processing..." : "Register My Business"}
            </button>
          </form>

          <div className="mt-8 text-center text-[0.95rem]">
            <span className="text-slate-500 font-medium">
              Already have a seller account?
            </span>{" "}
            <Link 
              to="/login"
              className="no-underline text-emerald-500 font-bold hover:text-emerald-600 transition-colors border-b-2 border-emerald-500/20 hover:border-emerald-500"
            >
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
