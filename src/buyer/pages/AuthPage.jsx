import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/pages/AuthAnimated.css';

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
    <div className={`auth-split-wrapper ${isSignUp ? 'is-signup' : ''}`}>
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>
      <div className="split-container">
        
        {/* SIGN IN FORM */}
        <div className="form-panel login-panel">
          <div className="form-content">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your FreshBasket account.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="auth-input-wrapper">
                  <FiMail className="auth-input-icon" />
                  <input type="email" placeholder="name@example.com" required 
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <div className="label-flex">
                  <label>Password</label>
                  <a href="#/" className="forgot-password">Forgot?</a>
                </div>
                <div className="auth-input-wrapper">
                  <FiLock className="auth-input-icon" />
                  <input type="password" placeholder="••••••••" required 
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Sign In'} <FiArrowRight className="btn-icon" />
              </button>
            </form>
          </div>
        </div>

        {/* SIGN UP FORM */}
        <div className="form-panel signup-panel">
          <div className="form-content">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join us to shop fresh & organic.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="auth-input-wrapper">
                  <FiUser className="auth-input-icon" />
                  <input type="text" placeholder="Username" required 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="auth-input-wrapper">
                  <FiMail className="auth-input-icon" />
                  <input type="email" placeholder="name@example.com" required 
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="auth-input-wrapper">
                  <FiLock className="auth-input-icon" />
                  <input type="password" placeholder="Create a strong password" required 
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? 'Creating...' : 'Sign Up'} <FiArrowRight className="btn-icon" />
              </button>
              
              <div className="seller-redirect">
                <span>Are you a seller?</span>
                <button type="button" onClick={() => navigate('/seller')} className="seller-link">
                  Register as Seller
                </button>
              </div>
              <div className="seller-redirect" style={{ marginTop: '0.5rem' }}>
                <span>Are you an Admin?</span>
                <button type="button" onClick={() => navigate('/admin/signup')} className="seller-link" style={{ color: '#4F46E5' }}>
                  Register as Admin
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* OVERLAY PANEL */}
        <div className="overlay-panel">
          <div className="overlay-content">
            <div className="overlay-text overlay-login-text">
              <h2>New Here?</h2>
              <p>Discover thousands of fresh organic products waiting for you.</p>
              <button className="btn btn-outline overlay-btn" type="button" onClick={toggleMode}>Create an Account</button>
            </div>
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
