import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy login action
    console.log('Logging in with', formData);
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your FreshBasket account to continue shopping.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-flex">
                <label>Password</label>
                <a href="#/" className="forgot-password">Forgot password?</a>
              </div>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-btn">
              Sign In <FiArrowRight className="btn-icon" />
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup" className="auth-link">Create Account</Link></p>
          </div>
        </div>

        <div className="auth-image-panel">
          <div className="panel-content">
            <h2>Fresh Groceries, <br/> Delivered Fast.</h2>
            <p>Join thousands of happy customers who get their daily essentials delivered right to their doorstep.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
