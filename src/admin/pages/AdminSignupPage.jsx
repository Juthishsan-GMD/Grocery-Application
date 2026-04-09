import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiShield, FiMail, FiLock, FiUser, FiMapPin, FiPhone } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const G = {
  primary: "#4F46E5", // Indigo for Admin
  bg: "#f8fafc",
  text: "#0f172a",
  muted: "#64748b",
};

const css = `
  .admin-auth-container {
    min-height: 100vh;
    display: flex;
    background: ${G.bg};
    font-family: 'Inter', sans-serif;
  }

  .admin-left-hero {
    flex: 1;
    background: linear-gradient(rgba(79, 70, 229, 0.9), rgba(49, 46, 129, 0.95)), url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200');
    background-size: cover;
    background-position: center;
    padding: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
  }

  .admin-right-form {
    width: 600px;
    padding: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: white;
    overflow-y: auto;
  }

  .admin-field-group {
    margin-bottom: 1.5rem;
  }

  .admin-input-box {
    position: relative;
    display: flex;
    align-items: center;
  }

  .admin-input-box svg {
    position: absolute;
    left: 1rem;
    color: #94a3b8;
  }

  .admin-input-box input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 3rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .admin-input-box input:focus {
    border-color: ${G.primary};
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
    outline: none;
  }

  .admin-submit-btn {
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

  .admin-submit-btn:hover {
    background: #4338ca;
    transform: translateY(-2px);
  }
`;

export default function AdminSignupPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { showToast } = useCart();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { ...formData, role: 'admin' };

    try {
      const resp = await fetch(`http://localhost:5000/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      
      if (resp.ok) {
        localStorage.setItem("token", data.token);
        loginUser(data.user);
        showToast("Admin Registration Successful!");
        navigate("/admin");
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
    <div className="admin-auth-container">
      <style>{css}</style>
      
      <div className="admin-left-hero">
        <Link to="/" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", position: "absolute", top: "2rem", left: "2rem" }}>
          <FiArrowLeft /> Back to Shop
        </Link>
        <FiShield size={60} style={{ marginBottom: "2rem" }} />
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem" }}>Administrative <br/>Control Center</h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.9, maxWidth: "500px", lineHeight: 1.6 }}>
          Monitor platform performance, manage entire supply chains, and oversee global operations from one dedicated specialized dashboard.
        </p>
      </div>

      <div className="admin-right-form">
        <div style={{ maxWidth: "450px", margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: G.text, letterSpacing: "-1px" }}>
              Administrator Setup
            </h2>
            <p style={{ color: G.muted, marginTop: "0.5rem" }}>
              Register a new administrative authority for FreshBasket.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="admin-field-group">
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: G.muted }}>FULL NAME</label>
              <div className="admin-input-box">
                <FiUser />
                <input type="text" placeholder="Admin Name" required 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>

            <div className="admin-field-group">
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: G.muted }}>OFFICIAL EMAIL</label>
              <div className="admin-input-box">
                <FiMail />
                <input type="email" placeholder="admin@freshbasket.com" required 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div className="admin-field-group">
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: G.muted }}>CONTACT NUMBER</label>
              <div className="admin-input-box">
                <FiPhone />
                <input type="text" placeholder="+91 00000 00000" required 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <div className="admin-field-group">
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: G.muted }}>ADDRESS / OFFICE LOCATION</label>
              <div className="admin-input-box">
                <FiMapPin />
                <input type="text" placeholder="Location Details" required 
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>

            <div className="admin-field-group">
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: G.muted }}>SECURE PASSWORD</label>
              <div className="admin-input-box">
                <FiLock />
                <input type="password" placeholder="••••••••" required 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>

            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Initialize Admin Account"}
            </button>
          </form>

          <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.95rem" }}>
            <span style={{ color: G.muted }}>
              Already registered?
            </span>{" "}
            <Link to="/login" style={{ textDecoration: "none", color: G.primary, fontWeight: 700 }}>
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
