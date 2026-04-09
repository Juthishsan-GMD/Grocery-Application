/**
 * ─────────────────────────────────────────────────────────────────
 *  SellerAuthPage.jsx  —  /seller
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiShoppingBag, FiMail, FiLock, FiUser, FiInfo, FiCheckCircle, FiUploadCloud } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const G = {
  primary: "#10B981",
  bg: "#f8fafc",
  text: "#0f172a",
  muted: "#64748b",
};

const css = `
  .seller-auth-container {
    min-height: 100vh;
    display: flex;
    background: ${G.bg};
    font-family: 'Inter', sans-serif;
  }

  .seller-left-hero {
    flex: 1;
    background: linear-gradient(rgba(16, 185, 129, 0.9), rgba(6, 78, 59, 0.95)), url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=1200');
    background-size: cover;
    background-position: center;
    padding: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
  }

  .seller-right-form {
    width: 600px;
    padding: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: white;
    overflow-y: auto;
  }

  .seller-field-group {
    margin-bottom: 1.5rem;
  }

  .seller-input-box {
    position: relative;
    display: flex;
    align-items: center;
  }

  .seller-input-box svg {
    position: absolute;
    left: 1rem;
    color: #94a3b8;
  }

  .seller-input-box input, .seller-input-box select {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 3rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .seller-input-box input:focus {
    border-color: ${G.primary};
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    outline: none;
  }

  .seller-submit-btn {
    width: 100%;
    padding: 1rem;
    background: ${G.primary};
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .seller-submit-btn:hover {
    background: #059669;
    transform: translateY(-2px);
  }

  .step-indicator {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .step-dot {
    flex: 1;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
  }

  .step-dot.active {
    background: ${G.primary};
  }
`;

export default function SellerAuthPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { showToast } = useCart();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    storeName: "",
    businessType: "Individual",
    phone: "",
    address: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Always use signup endpoint for sellers here
    const endpoint = "/api/auth/signup";
    const payload = { ...formData, role: 'seller' };

    try {
      const resp = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      
      if (resp.ok) {
        localStorage.setItem("token", data.token);
        loginUser(data.user);
        showToast("Registration Complete! Welcome to FreshBasket.");
        navigate("/seller/dashboard");
      } else {
        showToast(data.message || "Registration failed");
      }
    } catch (err) {
      showToast("Server error. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-auth-container">
      <style>{css}</style>
      
      <div className="seller-left-hero">
        <Link to="/" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", position: "absolute", top: "2rem", left: "2rem" }}>
          <FiArrowLeft /> Back to Shop
        </Link>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "1rem" }}>Partner with <br/>FreshBasket</h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.9, maxWidth: "500px", lineHeight: 1.6 }}>
          Reach millions of customers, manage inventory across cities, and get paid instantly. Your growth story starts here.
        </p>
        <div style={{ marginTop: "3rem", display: "flex", gap: "2rem" }}>
          <div><h3 style={{ fontSize: "2rem" }}>10k+</h3><p style={{ opacity: 0.8 }}>Active Sellers</p></div>
          <div><h3 style={{ fontSize: "2rem" }}>50+</h3><p style={{ opacity: 0.8 }}>Cities covered</p></div>
        </div>
      </div>

      <div className="seller-right-form">
        <div style={{ maxWidth: "450px", margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: G.text }}>
              Create Seller Account
            </h2>
            <p style={{ color: G.muted, marginTop: "0.5rem" }}>
              Register your business and start selling on FreshBasket
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="seller-field-group">
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: G.muted }}>STORE OWNER NAME</label>
              <div className="seller-input-box">
                <FiUser />
                <input type="text" placeholder="e.g. Ramesh Kumar" required 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>

            <div className="seller-field-group">
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: G.muted }}>BUSINESS / STORE NAME</label>
              <div className="seller-input-box">
                <FiShoppingBag />
                <input type="text" placeholder="e.g. Fresh Garden Mart" required 
                  value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} />
              </div>
            </div>

            <div className="seller-field-group">
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: G.muted }}>EMAIL ADDRESS</label>
              <div className="seller-input-box">
                <FiMail />
                <input type="email" placeholder="partner@email.com" required 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div className="seller-field-group">
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: G.muted }}>PASSWORD</label>
              <div className="seller-input-box">
                <FiLock />
                <input type="password" placeholder="••••••••" required 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>

            <button type="submit" className="seller-submit-btn" disabled={loading}>
              {loading ? "Processing..." : "Register My Business"}
            </button>
          </form>

          <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.95rem" }}>
            <span style={{ color: G.muted }}>
              Already have a seller account?
            </span>{" "}
            <Link 
              to="/login"
              style={{ textDecoration: "none", color: G.primary, fontWeight: 700 }}
            >
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
