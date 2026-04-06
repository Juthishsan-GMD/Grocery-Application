/**
 * ─────────────────────────────────────────────────────────────────
 *  SellerAuthPage.jsx  —  /seller
 *
 *  Redesigned for FreshBasket Grocery App.
 *  Renders the Login / Register toggle for the Seller Dashboard.
 *  On success → navigates to /seller/dashboard
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

/* ── Design tokens: FreshBasket emerald theme ───────── */
const G = {
  primary: "#10B981",
  primaryLight: "#34D399",
  primaryDim: "rgba(16,185,129,0.1)",
  bg: "#f0fdf4",
  card: "#ffffff",
  border: "#dcfce7",
  borderFocus: "#10B981",
  text: "#064e3b",
  muted: "#059669",
  error: "#ef4444",
  errorBg: "rgba(239,68,68,0.05)",
  success: "#10B981",
  successBg: "rgba(16,185,129,0.05)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

  .seller-auth-root {
    min-height: 100vh;
    background: ${G.bg};
    display: flex;
    align-items: stretch;
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
    overflow: hidden;
  }

  /* ── Left decorative panel ── */
  .seller-auth-panel {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4rem 5rem;
    position: relative;
    background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
    color: white;
  }

  .seller-auth-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(52,211,153,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(16,185,129,0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  .seller-auth-panel-logo {
    font-size: 2.5rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -1px;
    margin-bottom: 0.25rem;
    line-height: 1;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .seller-auth-panel-logo span {
    color: #34D399;
  }

  .seller-auth-panel-sub {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #a7f3d0;
    margin-bottom: 4rem;
  }

  .seller-auth-panel-headline {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    color: #ffffff;
    line-height: 1.1;
    letter-spacing: -2px;
    margin-bottom: 1.5rem;
  }

  .seller-auth-panel-headline span {
    color: #34D399;
    display: block;
  }

  .seller-auth-panel-body {
    font-size: 1rem;
    color: #d1fae5;
    line-height: 1.6;
    max-width: 420px;
    margin-bottom: 3rem;
  }

  .seller-auth-panel-stats {
    display: flex;
    gap: 3rem;
  }

  .seller-auth-stat-number {
    font-size: 2rem;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
  }

  .seller-auth-stat-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6ee7b7;
    margin-top: 0.5rem;
  }

  /* ── Right form panel ── */
  .seller-auth-form-wrap {
    width: 520px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4rem;
    background: #ffffff;
    box-shadow: -10px 0 30px rgba(0,0,0,0.05);
    z-index: 10;
  }

  .seller-auth-tabs {
    display: flex;
    gap: 24px;
    margin-bottom: 2.5rem;
    border-bottom: 2px solid #f0fdf4;
  }

  .seller-auth-tab {
    padding: 0.75rem 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: #6b7280;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
  }

  .seller-auth-tab--active {
    color: #10B981;
    border-bottom-color: #10B981;
  }

  .seller-auth-form-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #064e3b;
    letter-spacing: -0.5px;
    margin-bottom: 0.5rem;
  }

  .seller-auth-form-hint {
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 2rem;
  }

  .seller-auth-alert {
    border-radius: 12px;
    padding: 1rem;
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 500;
  }

  .seller-auth-alert--error {
    background: #fef2f2;
    color: #ef4444;
    border: 1px solid #fee2e2;
  }

  .seller-auth-alert--success {
    background: #f0fdf4;
    color: #10B981;
    border: 1px solid #dcfce7;
  }

  .seller-field {
    margin-bottom: 1.25rem;
  }

  .seller-field-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .seller-field-input {
    width: 100%;
    background: #f9fafb;
    border: 2px solid #f3f4f6;
    border-radius: 12px;
    padding: 0.85rem 1rem;
    font-size: 0.95rem;
    color: #111827;
    outline: none;
    transition: all 0.2s;
  }

  .seller-field-input:focus {
    border-color: #10B981;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(16,185,129,0.1);
  }

  .seller-auth-submit {
    width: 100%;
    margin-top: 1rem;
    padding: 1rem;
    background: #10B981;
    color: #ffffff;
    font-size: 0.95rem;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(16,185,129,0.2);
  }

  .seller-auth-submit:hover {
    background: #059669;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(5,150,105,0.25);
  }

  .seller-auth-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0;
    color: #9ca3af;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .seller-auth-divider::before,
  .seller-auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #f3f4f6;
  }

  .seller-auth-back {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #6b7280;
    text-decoration: none;
    transition: color 0.2s;
  }

  .seller-auth-back:hover {
    color: #10B981;
  }

  @media (max-width: 1024px) {
    .seller-auth-panel { display: none; }
    .seller-auth-form-wrap { width: 100%; padding: 2.5rem; }
  }
`;

function Field({ label, type = "text", value, onChange, placeholder, error, autoFocus }) {
  const [show, setShow] = useState(false);
  const isPwd = type === "password";
  return (
    <div className="seller-field">
      <label className="seller-field-label">{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={isPwd && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="seller-field-input"
        />
        {isPwd && (
          <button type="button" onClick={() => setShow(s => !s)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b7280", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
            {show ? "HIDE" : "SHOW"}
          </button>
        )}
      </div>
      {error && <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem", fontWeight: 500 }}>{error}</div>}
    </div>
  );
}

function LoginForm({ onSwitch }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (form.email === 'seller@freshbasket.com' && form.password === 'seller123') {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify({ fullName: "Arjun Mehta", email: "seller@freshbasket.com", role: "seller" }));
      navigate("/seller/dashboard", { replace: true });
      return;
    }

    let users = [];
    try { users = JSON.parse(localStorage.getItem("sellerUsers") || "[]"); } catch {}
    const user = users.find(u => u.email.toLowerCase() === form.email.trim().toLowerCase());

    if (!user || user.password !== form.password) {
      setAlert({ type: "error", msg: "Invalid credentials. Please try again." });
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify({ fullName: user.fullName, email: user.email, role: "seller" }));
    navigate("/seller/dashboard", { replace: true });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="seller-auth-form-title">Welcome Back</div>
      <div className="seller-auth-form-hint">Sign in to manage your grocery store</div>

      {alert && <div className={`seller-auth-alert seller-auth-alert--${alert.type}`}>{alert.msg}</div>}

      <Field label="EMAIL ADDRESS" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="e.g. arjun@example.com" error={errors.email} autoFocus />
      <Field label="PASSWORD" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" error={errors.password} />

      <button type="submit" className="seller-auth-submit">SIGN IN TO HUB</button>

      <div className="seller-auth-divider"><span>New to FreshBasket?</span></div>
      <button type="button" onClick={onSwitch} style={{ width: "100%", padding: "1rem", background: "none", border: "2px solid #f3f4f6", borderRadius: "12px", color: "#374151", fontWeight: 700, cursor: "pointer" }}>CREATE SELLER ACCOUNT</button>
    </form>
  );
}

function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password || form.password.length < 6) errs.password = "Min 6 characters required";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    let users = [];
    try { users = JSON.parse(localStorage.getItem("sellerUsers") || "[]"); } catch {}
    if (users.find(u => u.email === form.email)) { setErrors({ email: "Email already exists" }); return; }

    users.push(form);
    localStorage.setItem("sellerUsers", JSON.stringify(users));
    setAlert({ type: "success", msg: "Account created! You can now sign in." });
    setTimeout(onSwitch, 1500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="seller-auth-form-title">Join FreshBasket</div>
      <div className="seller-auth-form-hint">Start selling your fresh produce today</div>

      {alert && <div className={`seller-auth-alert seller-auth-alert--${alert.type}`}>{alert.msg}</div>}

      <Field label="STORE OWNER NAME" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} placeholder="e.g. Arjun Mehta" error={errors.fullName} autoFocus />
      <Field label="EMAIL ADDRESS" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="e.g. arjun@example.com" error={errors.email} />
      <Field label="PASSWORD" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" error={errors.password} />

      <button type="submit" className="seller-auth-submit">CREATE ACCOUNT</button>
      <div className="seller-auth-divider"><span>Already a seller?</span></div>
      <button type="button" onClick={onSwitch} style={{ width: "100%", padding: "1rem", background: "none", border: "2px solid #f3f4f6", borderRadius: "12px", color: "#374151", fontWeight: 700, cursor: "pointer" }}>SIGN IN TO EXISTING HUB</button>
    </form>
  );
}

export default function SellerAuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") navigate("/seller/dashboard", { replace: true });
  }, [navigate]);

  return (
    <div className="seller-auth-root">
      <style>{css}</style>
      
      <div className="seller-auth-panel">
        <div className="seller-auth-panel-logo">
          <div style={{ width: 48, height: 48, background: "#10B981", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24 }}>FB</div>
          Fresh<span>Basket</span>
        </div>
        <div className="seller-auth-panel-sub">Official Seller Hub</div>

        <h1 className="seller-auth-panel-headline">
          Grow your <span>Fresh Business</span> with us.
        </h1>
        <p className="seller-auth-panel-body">
          Join India's fastest growing grocery network. Reach thousands of customers daily, manage orders seamlessly, and grow your revenue with advanced analytics.
        </p>

        <div className="seller-auth-panel-stats">
          <div><div className="seller-auth-stat-number">2M+</div><div className="seller-auth-stat-label">DAILY USERS</div></div>
          <div><div className="seller-auth-stat-number">10K+</div><div className="seller-auth-stat-label">ACTIVE STORES</div></div>
          <div><div className="seller-auth-stat-number">4.9★</div><div className="seller-auth-stat-label">AVS. RATING</div></div>
        </div>
      </div>

      <div className="seller-auth-form-wrap">
        <div style={{ marginBottom: "3rem" }}>
          <Link to="/" className="seller-auth-back">← BACK TO SHOP</Link>
        </div>

        <div className="seller-auth-tabs">
          <button className={`seller-auth-tab ${mode === 'login' ? 'seller-auth-tab--active' : ''}`} onClick={() => setMode('login')}>SIGN IN</button>
          <button className={`seller-auth-tab ${mode === 'register' ? 'seller-auth-tab--active' : ''}`} onClick={() => setMode('register')}>REGISTER</button>
        </div>

        {mode === "login" ? <LoginForm onSwitch={() => setMode("register")} /> : <RegisterForm onSwitch={() => setMode("login")} />}
      </div>
    </div>
  );
}
