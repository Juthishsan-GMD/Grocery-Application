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
  const { adminLogin, loginUser } = useAuth();
  
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

    if (!isSignUp && formData.email === 'admin@freshbasket.com' && formData.password === 'admin123') {
      if (adminLogin(formData.email, formData.password)) {
        showToast('Welcome to the Admin Dashboard');
        navigate('/admin');
        return;
      }
    }

    if (!isSignUp && formData.email === 'seller@freshbasket.com' && formData.password === 'seller123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ fullName: 'Arjun Mehta', email: 'seller@freshbasket.com', role: 'seller' }));
      showToast('Welcome to the Seller Center');
      navigate('/seller/dashboard');
      return;
    }

    const users = JSON.parse(localStorage.getItem('grocery_users') || '[]');

    if (isSignUp) {
      const userExists = users.find(u => u.email === formData.email);
      if (userExists) {
        showToast('Email already registered! Please sign in.');
        return;
      }
      
      const newUser = { name: formData.name, email: formData.email, password: formData.password };
      users.push(newUser);
      localStorage.setItem('grocery_users', JSON.stringify(users));
      
      loginUser({ name: formData.name, email: formData.email, role: 'buyer' });
      showToast('Account created successfully!');
      
      localStorage.setItem('divine_customer_name', formData.name);
      localStorage.setItem('divine_customer_email', formData.email);
      
      navigate('/');
    } else {
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        loginUser({ name: user.name, email: user.email, role: 'buyer' });
        showToast(`Welcome back, ${user.name}!`);
        
        localStorage.setItem('divine_customer_name', user.name);
        localStorage.setItem('divine_customer_email', user.email);
        
        navigate('/');
      } else {
        showToast('Invalid email or password.');
      }
    }
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
