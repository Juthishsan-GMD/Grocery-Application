import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import '../styles/AuthAnimated.css';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useCart();
  
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/signup');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    setIsSignUp(location.pathname === '/signup');
  }, [location.pathname]);

  const toggleMode = () => {
    const nextRoute = isSignUp ? '/login' : '/signup';
    navigate(nextRoute, { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast(isSignUp ? 'Account created successfully!' : 'Welcome back to FreshBasket!');
    // Save minimal data to clear checkout form
    if (isSignUp && formData.name) localStorage.setItem('divine_customer_name', formData.name);
    if (formData.email) localStorage.setItem('divine_customer_email', formData.email);
    
    navigate('/');
  };

  return (
    <div className={`auth-split-wrapper ${isSignUp ? 'is-signup' : ''}`}>
      
      {/* Background blobs for extra sauce */}
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>

      {/* The Floating Split Container */}
      <div className="split-container">
        
        {/* SIGN IN FORM (Left aligned by default) */}
        <div className="form-panel login-panel">
          <div className="form-content">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your FreshBasket account.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input type="email" placeholder="name@example.com" required 
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <div className="label-flex">
                  <label>Password</label>
                  <a href="#/" className="forgot-password">Forgot?</a>
                </div>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input type="password" placeholder="••••••••" required 
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary auth-btn">
                Sign In <FiArrowRight className="btn-icon" />
              </button>
            </form>
          </div>
        </div>

        {/* SIGN UP FORM (Right aligned, hidden under image by default) */}
        <div className="form-panel signup-panel">
          <div className="form-content">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join us to shop fresh & organic.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input type="text" placeholder="Username" required 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input type="email" placeholder="name@example.com" required 
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input type="password" placeholder="Create a strong password" required 
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary auth-btn">
                Sign Up <FiArrowRight className="btn-icon" />
              </button>
            </form>
          </div>
        </div>

        {/* OVERLAY PANEL (The sliding image block) */}
        <div className="overlay-panel">
          <div className="overlay-content">
            {/* Login Overlay Text (Visible when on Sign In) */}
            <div className="overlay-text overlay-login-text">
              <h2>New Here?</h2>
              <p>Discover thousands of fresh organic products waiting for you.</p>
              <button className="btn btn-outline overlay-btn" type="button" onClick={toggleMode}>Create an Account</button>
            </div>
            
            {/* Signup Overlay Text (Visible when on Sign Up) */}
            <div className="overlay-text overlay-signup-text">
              <h2>One of Us?</h2>
              <p>Sign in with your email to track your orders and shop fast.</p>
              <button className="btn btn-outline overlay-btn" type="button" onClick={toggleMode}>Sign In Now</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
