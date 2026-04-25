import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  CheckCircle2, Store, CreditCard, FileText,
  ShieldCheck, UploadCloud, ChevronRight, ChevronLeft,
  MapPin, Check, Sparkles, Building2, Receipt, Landmark,
  ShoppingBag, ScrollText, BadgeCheck, User, Mail, Phone,
  Lock, Globe, AlertCircle
} from "lucide-react";

/* ── X (Twitter) SVG — removed from lucide-react ── */
const Twitter = ({ style }) => (
  <svg style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Instagram = ({ style }) => (
  <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Facebook = ({ style }) => (
  <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

/* ── Indian States ──────────────────────────────────────────────── */
const IN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
  "Puducherry","Chandigarh","Dadra & Nagar Haveli","Daman & Diu","Lakshadweep","Andaman & Nicobar",
];

/* ── initial state ──────────────────────────────────────────────── */
const INIT_STATE = {
  basic: {
    fullName: "", email: "", mobile: "",
    otp: "", mobileVerified: false, otpSent: false, otpTimer: 0, devOtp: "",
  },
  business: {
    businessType: "", businessName: "", address: "",
    city: "", state: "", pincode: "", country: "India",
  },
  tax: { panNumber: "", gstin: "" },
  bank: { accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "", accountType: "Savings" },
  store: {
    storeName: "", storeDescription: "",
    pickupAddress: "", returnAddress: "",
    instagramUrl: "", facebookUrl: "", twitterUrl: "",
    logoFile: null, logoPreview: "",
  },
  compliance: {
    termsAccepted: false, privacyAccepted: false, sellerPolicyAccepted: false,
  },
  kyc: {
    kycType: "pan_aadhaar",
    panNumber: "", aadhaarNumber: "",
    gstinNumber: "",
    documentNumber: "",
    documentFile: null, documentPreview: "",
  },
};

/* ── Validators ─────────────────────────────────────────────────── */
const V = {
  required: v => (v && String(v).trim() ? null : "This field is required"),
  email: v => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email address"),
  mobile: v => (/^\d{10}$/.test(v) ? null : "Enter a valid 10-digit mobile number"),
  pan: v => (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v.toUpperCase()) ? null : "Enter a valid PAN (e.g. ABCDE1234F)"),
  gstin: v => (!v || /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(v.toUpperCase()) ? null : "Enter a valid GSTIN"),
  ifsc: v => (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(v.toUpperCase()) ? null : "Enter a valid IFSC code"),
  pincode: v => (/^\d{6}$/.test(v) ? null : "Enter a valid 6-digit pincode"),
  aadhaar: v => (/^\d{12}$/.test(v) ? null : "Enter a valid 12-digit Aadhaar number"),
  url: v => (!v || /^(https?:\/\/)?([\w.-]+\.[\w.]{2,})(\/\S*)?$/.test(v) ? null : "Enter a valid URL"),
};

/* ── Styles ──────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  :root {
    --green: #16a34a;
    --green-light: #22c55e;
    --green-pale: #dcfce7;
    --green-mid: #86efac;
    --accent: #0ea5e9;
    --surface: #ffffff;
    --surface-2: #f8fafc;
    --border: #e2e8f0;
    --text-1: #0f172a;
    --text-2: #475569;
    --text-3: #94a3b8;
    --red: #ef4444;
    --red-pale: #fef2f2;
  }

  .fb-root { font-family: 'Plus Jakarta Sans', sans-serif; }
  .fb-body { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(22,163,74,0.35); }
    70%  { box-shadow: 0 0 0 10px rgba(22,163,74,0); }
    100% { box-shadow: 0 0 0 0 rgba(22,163,74,0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes dotBounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40%           { transform: scale(1);   opacity: 1; }
  }

  .step-animate { animation: fadeSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .verified-pulse { animation: pulse-ring 1.5s ease-out; }

  .fb-input {
    width: 100%; padding: 13px 16px;
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 12px; font-size: 14px; color: var(--text-1);
    font-family: 'DM Sans', sans-serif; font-weight: 500;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .fb-input::placeholder { color: var(--text-3); font-weight: 400; }
  .fb-input:focus {
    border-color: var(--green);
    box-shadow: 0 0 0 4px rgba(22,163,74,0.1);
  }
  .fb-input.error {
    border-color: var(--red);
    box-shadow: 0 0 0 4px rgba(239,68,68,0.08);
  }
  .fb-input:disabled { background: var(--surface-2); color: var(--text-3); cursor: not-allowed; }

  .fb-label {
    display: block; margin-bottom: 7px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; color: var(--text-2);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fb-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: 12px;
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    color: white; font-size: 14px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; cursor: pointer;
    box-shadow: 0 4px 20px rgba(22,163,74,0.3);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .fb-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(22,163,74,0.4);
  }
  .fb-btn-primary:active { transform: scale(0.97); }
  .fb-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .fb-btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 12px 20px; border-radius: 12px;
    background: transparent; color: var(--text-2);
    font-size: 14px; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid var(--border); cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .fb-btn-ghost:hover { background: var(--surface-2); color: var(--text-1); }
  .fb-btn-ghost:disabled { opacity: 0.3; cursor: not-allowed; }

  .fb-btn-soft {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 11px 20px; border-radius: 10px;
    background: var(--green-pale); color: var(--green);
    font-size: 13px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid var(--green-mid); cursor: pointer;
    transition: background 0.15s;
  }
  .fb-btn-soft:hover { background: #bbf7d0; }

  .fb-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 24px;
    box-shadow: 0 4px 25px rgba(15,23,42,0.06);
  }

  .fb-info-banner {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 16px 20px; border-radius: 14px;
  }

  .progress-track {
    width: 100%; height: 6px; background: #e2e8f0;
    border-radius: 999px; overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #16a34a, #22c55e);
    border-radius: 999px;
    transition: width 0.5s cubic-bezier(0.34,1.56,0.64,1);
  }

  .sidebar-step {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 14px; border-radius: 14px;
    border: 1.5px solid transparent;
    text-align: left; width: 100%;
    cursor: default; transition: background 0.2s, border-color 0.2s;
    background: transparent;
  }
  .sidebar-step.active {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border-color: #bbf7d0;
  }
  .sidebar-step.done { cursor: pointer; }
  .sidebar-step.done:hover { background: var(--surface-2); }

  .step-dot {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; flex-shrink: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.3s;
  }
  .step-dot.pending { background: #f1f5f9; color: var(--text-3); }
  .step-dot.active  { background: #16a34a; color: white; box-shadow: 0 0 0 4px rgba(22,163,74,0.2); }
  .step-dot.done    { background: #16a34a; color: white; }

  .drag-zone {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    border: 2px dashed #cbd5e1;
    border-radius: 20px; padding: 48px 24px;
    text-align: center; cursor: pointer;
    transition: all 0.2s ease;
    background: #f8fafc;
    width: 100%; box-sizing: border-box;
  }
  .drag-zone:hover, .drag-zone.highlight {
    border-color: var(--green);
    background: #f0fdf4;
  }
  .drag-zone.has-file { border-color: var(--green); background: #f0fdf4; }
  .drag-zone.errored  { border-color: var(--red); background: var(--red-pale); }

  .check-card {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 18px 20px; border-radius: 14px;
    border: 1.5px solid var(--border);
    cursor: pointer; transition: border-color 0.2s, background 0.2s;
    background: var(--surface);
  }
  .check-card.checked {
    border-color: #86efac;
    background: linear-gradient(135deg, #f0fdf4, #f7fffe);
  }
  .check-box {
    width: 22px; height: 22px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid var(--border); transition: all 0.2s; flex-shrink: 0; margin-top: 1px;
  }
  .check-box.checked { background: #16a34a; border-color: #16a34a; }

  .kyc-tab {
    padding: 9px 18px; border-radius: 10px;
    font-size: 12px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; cursor: pointer; transition: all 0.2s;
    color: var(--text-3); background: transparent;
  }
  .kyc-tab.active { background: white; color: var(--green); box-shadow: 0 2px 8px rgba(15,23,42,0.08); }

  .saving-dot {
    display: inline-block; width: 7px; height: 7px;
    border-radius: 50%; background: var(--green);
    animation: dotBounce 1.2s infinite;
  }
  .saving-dot:nth-child(2) { animation-delay: 0.2s; }
  .saving-dot:nth-child(3) { animation-delay: 0.4s; }

  .hero-gradient {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #064e3b 100%);
  }
`;

/* ── Reusable Field Components ───────────────────────────────────── */
const Input = ({ label, section, field, req, data, errors, update, icon: Icon, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label className="fb-label">
      {label} {req && <span style={{ color: "#16a34a" }}>*</span>}
    </label>
    <div style={{ position: "relative" }}>
      {Icon && (
        <Icon style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          width: 15, height: 15, color: "#94a3b8", pointerEvents: "none"
        }} />
      )}
      <input
        value={data[section][field] || ""}
        onChange={e => update(section, field, e.target.value)}
        className={`fb-input${errors[field] ? " error" : ""}`}
        style={Icon ? { paddingLeft: 38 } : {}}
        {...props}
      />
    </div>
    {errors[field] && (
      <p style={{ fontSize: 11, color: "#ef4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
        <AlertCircle style={{ width: 11, height: 11, flexShrink: 0 }} />
        {errors[field]}
      </p>
    )}
  </div>
);

const Select = ({ label, section, field, req, options, data, errors, update }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label className="fb-label">
      {label} {req && <span style={{ color: "#16a34a" }}>*</span>}
    </label>
    <div style={{ position: "relative" }}>
      <select
        value={data[section][field] || ""}
        onChange={e => update(section, field, e.target.value)}
        className={`fb-input${errors[field] ? " error" : ""}`}
        style={{ appearance: "none", cursor: "pointer", paddingRight: 40 }}
      >
        <option value="">Select option</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronRight style={{
        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%) rotate(90deg)",
        width: 15, height: 15, color: "#94a3b8", pointerEvents: "none"
      }} />
    </div>
    {errors[field] && (
      <p style={{ fontSize: 11, color: "#ef4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
        <AlertCircle style={{ width: 11, height: 11 }} />{errors[field]}
      </p>
    )}
  </div>
);

const Textarea = ({ label, section, field, req, data, errors, update, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label className="fb-label">
      {label} {req && <span style={{ color: "#16a34a" }}>*</span>}
    </label>
    <textarea
      value={data[section][field] || ""}
      onChange={e => update(section, field, e.target.value)}
      className={`fb-input${errors[field] ? " error" : ""}`}
      style={{ minHeight: 100, resize: "vertical" }}
      {...props}
    />
    {errors[field] && (
      <p style={{ fontSize: 11, color: "#ef4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
        <AlertCircle style={{ width: 11, height: 11 }} />{errors[field]}
      </p>
    )}
  </div>
);

const SectionDivider = ({ icon: Icon, title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "8px 0" }}>
    <div style={{
      width: 30, height: 30, borderRadius: 8, background: "#f0fdf4",
      border: "1.5px solid #86efac", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon style={{ width: 15, height: 15, color: "#16a34a" }} />
    </div>
    <span style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{title}</span>
    <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
export default function SellerOnboarding() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [data, setData] = useState(INIT_STATE);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState("draft");
  const draftTimer = useRef(null);
  const timerRef = useRef(null);

  const STEPS = [
    { id: 1, key: "basic",      label: "Basic Info",    desc: "Personal details",    icon: User },
    { id: 2, key: "business",   label: "Business",      desc: "Business details",    icon: Building2 },
    { id: 3, key: "tax",        label: "Tax Details",   desc: "PAN & GSTIN",         icon: Receipt },
    { id: 4, key: "bank",       label: "Bank Details",  desc: "Account info",        icon: Landmark },
    { id: 5, key: "store",      label: "Store Setup",   desc: "Your storefront",     icon: ShoppingBag },
    { id: 6, key: "compliance", label: "Agreements",    desc: "Legal & policies",    icon: ScrollText },
    { id: 7, key: "kyc",        label: "KYC",           desc: "Verification docs",   icon: BadgeCheck },
  ];

  /* ── Startup ────────────────────────────────────────────────────── */
  useEffect(() => {
    // TEMPORARY BYPASS FOR TESTING: Comment out redirect to dashboard
    // const isDone = localStorage.getItem("fb_onboarding_done");
    // if (isDone === "true") { navigate("/seller/dashboard", { replace: true }); return; }
    
    const draft = localStorage.getItem("fb_onboarding_draft");
    if (draft) {
      try { const parsed = JSON.parse(draft); setData(d => ({ ...d, ...parsed })); } catch(e) {}
    } else if (currentUser) {
      setData(d => ({
        ...d,
        basic: { ...d.basic, fullName: currentUser.name || "", email: currentUser.email || "", mobile: currentUser.phone || "" },
        store: { ...d.store, storeName: currentUser.storeName || "" }
      }));
    }
  }, [navigate, currentUser]);

  /* ── Auto-save ──────────────────────────────────────────────────── */
  const autoSave = useCallback((newData) => {
    setSaveStatus("saving");
    clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      const safeData = JSON.parse(JSON.stringify(newData, (k, v) =>
        (k === "logoFile" || k === "bannerFile" || k === "documentFile") ? undefined : v));
      localStorage.setItem("fb_onboarding_draft", JSON.stringify(safeData));
      setSaveStatus("saved");
    }, 1000);
  }, []);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const update = (section, field, val) => {
    setData(prev => {
      const nd = { ...prev, [section]: { ...prev[section], [field]: val } };
      autoSave(nd); return nd;
    });
    setErrors(prev => { const n = {...prev}; delete n[field]; return n; });
  };
  const setErr = (field, msg) => setErrors(prev => ({ ...prev, [field]: msg }));

  const handleSendOTP = () => {
    const err = V.mobile(data.basic.mobile);
    if (err) return setErr("mobile", err);
    const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setData(prev => ({ ...prev, basic: { ...prev.basic, otpSent: true, otpTimer: 30, devOtp: fakeOtp } }));
    timerRef.current = setInterval(() => {
      setData(prev => {
        if (prev.basic.otpTimer <= 1) { clearInterval(timerRef.current); return { ...prev, basic: { ...prev.basic, otpTimer: 0 } }; }
        return { ...prev, basic: { ...prev.basic, otpTimer: prev.basic.otpTimer - 1 } };
      });
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (!data.basic.otp) return setErr("otp", "Enter OTP");
    if (data.basic.otp !== data.basic.devOtp) return setErr("otp", "Invalid OTP. Try again.");
    setData(prev => ({ ...prev, basic: { ...prev.basic, mobileVerified: true, otpSent: false } }));
    clearInterval(timerRef.current);
  };

  /* ── Validation ─────────────────────────────────────────────────── */
  const validateStep = (s) => {
    let errs = {};
    if (s === 1) {
      errs.fullName = V.required(data.basic.fullName);
      errs.email = V.email(data.basic.email);
      errs.mobile = V.mobile(data.basic.mobile);
      if (!data.basic.mobileVerified) errs.mobileAuth = "Please verify your mobile number.";
    } else if (s === 2) {
      errs.businessType = V.required(data.business.businessType);
      errs.businessName = V.required(data.business.businessName);
      errs.address = V.required(data.business.address);
      errs.city = V.required(data.business.city);
      errs.state = V.required(data.business.state);
      errs.pincode = V.pincode(data.business.pincode);
    } else if (s === 3) {
      errs.panNumber = V.pan(data.tax.panNumber);
      if (data.tax.gstin) errs.gstin = V.gstin(data.tax.gstin);
    } else if (s === 4) {
      errs.accountHolderName = V.required(data.bank.accountHolderName);
      errs.bankName = V.required(data.bank.bankName);
      errs.accountNumber = V.required(data.bank.accountNumber);
      errs.ifscCode = V.ifsc(data.bank.ifscCode);
      errs.accountType = V.required(data.bank.accountType);
    } else if (s === 5) {
      errs.storeName = V.required(data.store.storeName);
      errs.pickupAddress = V.required(data.store.pickupAddress);
      if (data.store.instagramUrl) errs.instagramUrl = V.url(data.store.instagramUrl);
      if (data.store.facebookUrl) errs.facebookUrl = V.url(data.store.facebookUrl);
    } else if (s === 6) {
      if (!data.compliance.termsAccepted)       errs.termsAccepted = "Must accept terms.";
      if (!data.compliance.privacyAccepted)     errs.privacyAccepted = "Must accept privacy policy.";
      if (!data.compliance.sellerPolicyAccepted) errs.sellerPolicyAccepted = "Must accept seller policy.";
    } else if (s === 7) {
      if (data.kyc.kycType === "pan_aadhaar") {
        errs.panNumberKyc = V.pan(data.kyc.panNumber);
        errs.aadhaarNumberKyc = V.aadhaar(data.kyc.aadhaarNumber);
      } else if (data.kyc.kycType === "gstin") {
        errs.gstinNumberKyc = V.gstin(data.kyc.gstinNumber);
      } else if (data.kyc.kycType === "business_reg") {
        errs.documentNumber = V.required(data.kyc.documentNumber);
      }
      if (!data.kyc.documentPreview) errs.documentFile = "Please upload the required document.";
    }
    const finalErrs = {};
    for (const [k, v] of Object.entries(errs)) { if (v) finalErrs[k] = v; }
    setErrors(finalErrs);
    return Object.keys(finalErrs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) { setStep(s => Math.min(7, s + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };
  const handlePrev = () => { setStep(s => Math.max(1, s - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleSubmit = async () => {
    if (validateStep(7)) {
      setSaveStatus("saving");
      try {
        const response = await fetch('http://localhost:5000/api/sellers/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sellerId: currentUser?.id || currentUser?.seller_id,
            ...data
          })
        });

        if (response.ok) {
          localStorage.setItem("fb_onboarding_done", "true");
          localStorage.removeItem("fb_onboarding_draft");
          navigate("/seller/dashboard");
        } else {
          const err = await response.json();
          alert(err.message || "Failed to submit onboarding");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred during submission");
      } finally {
        setSaveStatus("saved");
      }
    }
  };

  const handleFile = (section, field, previewField, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setData(prev => {
        const nd = { ...prev, [section]: { ...prev[section], [field]: file, [previewField]: ev.target.result } };
        autoSave(nd); return nd;
      });
      setErrors(prev => { const n = {...prev}; delete n[field]; return n; });
    };
    reader.readAsDataURL(file);
  };

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;
  const CurrentStepIcon = STEPS[step - 1].icon;

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="fb-root" style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      <style>{styles}</style>

      {/* ── Header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1.5px solid #e2e8f0",
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
        boxShadow: "0 2px 20px rgba(15,23,42,0.06)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
          }}>🛒</div>
          <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 20, color: "#0f172a", letterSpacing: "-0.03em" }}>
            Fresh<span style={{ color: "#16a34a" }}>Basket</span>
          </span>
          <span style={{
            fontSize: 10, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase",
            color: "#16a34a", background: "#dcfce7", padding: "3px 10px", borderRadius: 6,
            border: "1.5px solid #86efac", marginLeft: 6,
          }}>Seller Hub</span>
        </div>

        {/* Save status + progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            {saveStatus === "saving" && (
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8" }}>
                <span style={{ display: "flex", gap: 3 }}>
                  <span className="saving-dot"/><span className="saving-dot"/><span className="saving-dot"/>
                </span> Saving draft
              </span>
            )}
            {saveStatus === "saved" && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#16a34a", fontWeight: 600 }}>
                <CheckCircle2 style={{ width: 15, height: 15 }} /> Draft saved
              </span>
            )}
          </div>
          <div style={{
            fontFamily: "'Plus Jakarta Sans'", fontSize: 13, fontWeight: 700, color: "#475569",
            background: "#f8fafc", border: "1.5px solid #e2e8f0", padding: "6px 14px", borderRadius: 10,
          }}>
            Step <span style={{ color: "#16a34a" }}>{step}</span> / {STEPS.length}
          </div>
        </div>
      </header>

      {/* ── Top progress bar ── */}
      <div style={{ height: 3, background: "#e2e8f0" }}>
        <div style={{
          height: "100%", width: `${(step / STEPS.length) * 100}%`,
          background: "linear-gradient(90deg, #16a34a, #22c55e)",
          transition: "width 0.5s ease",
        }} />
      </div>

      {/* ── Main ── */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 28, alignItems: "flex-start" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 260, flexShrink: 0, position: "sticky", top: 84 }}
          className="hidden md:block">
          <div className="fb-card" style={{ padding: 20 }}>
            {/* Mini hero */}
            <div style={{
              background: "linear-gradient(135deg, #0f172a 0%, #064e3b 100%)",
              borderRadius: 14, padding: "20px 16px", marginBottom: 20, position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -20, right: -20, width: 80, height: 80,
                borderRadius: "50%", background: "rgba(34,197,94,0.15)",
              }}/>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#86efac", marginBottom: 6 }}>Setup Progress</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 28, color: "white", lineHeight: 1 }}>
                {Math.round(progressPct)}%
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#94a3b8", marginTop: 4 }}>complete</div>
              <div className="progress-track" style={{ marginTop: 14 }}>
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {STEPS.map((s) => {
                const isDone = step > s.id;
                const isActive = step === s.id;
                const StepIcon = s.icon;
                return (
                  <button
                    key={s.id}
                    disabled={!isDone && !isActive}
                    onClick={() => isDone && setStep(s.id)}
                    className={`sidebar-step${isActive ? " active" : isDone ? " done" : ""}`}
                    style={{ opacity: (!isDone && !isActive) ? 0.45 : 1 }}
                  >
                    <div className={`step-dot${isDone ? " done" : isActive ? " active" : " pending"}`}>
                      {isDone ? <Check style={{ width: 14, height: 14 }} /> : <StepIcon style={{ width: 13, height: 13 }} />}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 13, fontWeight: 700, color: isActive ? "#15803d" : isDone ? "#0f172a" : "#475569" }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{s.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Form Card ── */}
        <div className="fb-card step-animate" key={step} style={{ flex: 1, padding: "40px 48px", minHeight: 600 }}>

          {/* Step header */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 16, paddingBottom: 28,
            borderBottom: "1.5px solid #f1f5f9", marginBottom: 36,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 20px rgba(22,163,74,0.25)",
            }}>
              <CurrentStepIcon style={{ width: 24, height: 24, color: "white" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", color: "#16a34a", marginBottom: 4 }}>
                Step {step} of {STEPS.length}
              </div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>
                {STEPS[step - 1].label}
              </h1>
              <p className="fb-body" style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
                Fill in your {STEPS[step - 1].desc.toLowerCase()} to get your store live.
              </p>
            </div>
          </div>

          {/* ── Step Content ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* STEP 1 */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Input label="Full Name" section="basic" field="fullName" req placeholder="e.g. Ramesh Kumar" icon={User} data={data} errors={errors} update={update} />
                  <Input label="Email Address" section="basic" field="email" req placeholder="partner@email.com" type="email" icon={Mail} data={data} errors={errors} update={update} />
                </div>

                {/* Mobile verification */}
                <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Phone style={{ width: 15, height: 15, color: "#16a34a" }} />
                    <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 13, color: "#0f172a" }}>Mobile Verification</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <Input
                        label="Mobile Number"
                        section="basic" field="mobile" req
                        placeholder="10-digit number" maxLength={10}
                        disabled={data.basic.otpSent || data.basic.mobileVerified}
                        icon={Phone} data={data} errors={errors} update={update}
                      />
                    </div>
                    {!data.basic.otpSent && !data.basic.mobileVerified && (
                      <button className="fb-btn-soft" onClick={handleSendOTP} style={{ flexShrink: 0, marginBottom: errors.mobile ? 22 : 0 }}>
                        <Sparkles style={{ width: 14, height: 14 }} /> Send OTP
                      </button>
                    )}
                    {data.basic.otpSent && !data.basic.mobileVerified && (
                      <>
                        <div style={{ flex: 1, minWidth: 140 }}>
                          <Input label="Enter OTP" section="basic" field="otp" req placeholder="6-digit code" maxLength={6} icon={Lock} data={data} errors={errors} update={update} />
                        </div>
                        <button className="fb-btn-primary" onClick={handleVerifyOTP} style={{ flexShrink: 0, marginBottom: errors.otp ? 22 : 0 }}>
                          Verify
                        </button>
                      </>
                    )}
                    {data.basic.mobileVerified && (
                      <div className="verified-pulse" style={{
                        padding: "12px 18px", background: "#dcfce7", border: "1.5px solid #86efac",
                        borderRadius: 12, display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
                      }}>
                        <ShieldCheck style={{ width: 16, height: 16, color: "#16a34a" }} />
                        <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 13, color: "#15803d" }}>Verified!</span>
                      </div>
                    )}
                  </div>
                  {data.basic.otpSent && !data.basic.mobileVerified && (
                    <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, fontFamily: "monospace", background: "#fef9c3", color: "#92400e", padding: "3px 10px", borderRadius: 6, border: "1px solid #fde68a" }}>
                        Dev OTP: {data.basic.devOtp}
                      </span>
                      {data.basic.otpTimer > 0
                        ? <span style={{ fontSize: 12, color: "#94a3b8" }}>Resend in {data.basic.otpTimer}s</span>
                        : <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, cursor: "pointer" }} onClick={handleSendOTP}>↺ Resend OTP</span>}
                    </div>
                  )}
                  {errors.mobileAuth && (
                    <p style={{ fontSize: 11, color: "#ef4444", marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
                      <AlertCircle style={{ width: 11, height: 11 }} />{errors.mobileAuth}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Select label="Business Type" section="business" field="businessType" req options={["Individual","Proprietorship","Partnership","Private Limited","LLP"]} data={data} errors={errors} update={update} />
                  <Input label="Business / Entity Name" section="business" field="businessName" req placeholder="As per legal docs" icon={Building2} data={data} errors={errors} update={update} />
                </div>
                <SectionDivider icon={MapPin} title="Registered Address" />
                <Textarea label="Complete Address" section="business" field="address" req placeholder="Building, Street, Area..." data={data} errors={errors} update={update} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                  <Input label="City" section="business" field="city" req placeholder="e.g. Mumbai" data={data} errors={errors} update={update} />
                  <Select label="State" section="business" field="state" req options={IN_STATES} data={data} errors={errors} update={update} />
                  <Input label="Pincode" section="business" field="pincode" req placeholder="6 digits" maxLength={6} data={data} errors={errors} update={update} />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div className="fb-info-banner" style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe" }}>
                  <AlertCircle style={{ width: 18, height: 18, color: "#3b82f6", flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 13, color: "#1e40af" }}>Tax compliance is required</div>
                    <p style={{ fontSize: 12, color: "#3b82f6", marginTop: 3, lineHeight: 1.5 }}>A valid PAN is mandatory to sell on FreshBasket. GSTIN is optional but recommended for full feature access.</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Input label="Business PAN Number" section="tax" field="panNumber" req placeholder="ABCDE1234F" maxLength={10} icon={Receipt} data={data} errors={errors} update={update} />
                  <div>
                    <Input label="GSTIN (Optional)" section="tax" field="gstin" placeholder="22AAAAA0000A1Z5" maxLength={15} icon={FileText} data={data} errors={errors} update={update} />
                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>Leave blank if operating under exemption limit</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div className="fb-info-banner" style={{ background: "#f0fdf4", border: "1.5px solid #86efac" }}>
                  <CreditCard style={{ width: 18, height: 18, color: "#16a34a", flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 13, color: "#15803d" }}>Secure Payments</div>
                    <p style={{ fontSize: 12, color: "#16a34a", marginTop: 3, lineHeight: 1.5 }}>Payouts are settled directly into this account within 2 business days of delivery. Bank-grade encryption.</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Input label="Account Holder Name" section="bank" field="accountHolderName" req placeholder="As per bank records" icon={User} data={data} errors={errors} update={update} />
                  <Input label="Bank Name" section="bank" field="bankName" req placeholder="e.g. HDFC Bank" icon={Landmark} data={data} errors={errors} update={update} />
                  <Input label="Account Number" section="bank" field="accountNumber" req placeholder="XXXXXXXXXXXX" type="password" icon={Lock} data={data} errors={errors} update={update} />
                  <Input label="IFSC Code" section="bank" field="ifscCode" req placeholder="e.g. HDFC0001234" maxLength={11} data={data} errors={errors} update={update} />
                  <Input label="UPI ID (Optional)" section="bank" field="upiId" placeholder="username@bank" data={data} errors={errors} update={update} />
                  <Select label="Account Type" section="bank" field="accountType" req options={["Savings", "Current"]} data={data} errors={errors} update={update} />
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Input label="Store Display Name" section="store" field="storeName" req placeholder="e.g. Fresh Garden Mart" icon={Store} data={data} errors={errors} update={update} />
                  <div />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Textarea label="Store Description (Optional)" section="store" field="storeDescription" placeholder="Tell customers what makes your store special..." data={data} errors={errors} update={update} />
                  </div>
                </div>

                <SectionDivider icon={MapPin} title="Addressing" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Textarea label="Pickup Address" section="store" field="pickupAddress" req placeholder="Where should couriers pick up orders?" data={data} errors={errors} update={update} />
                  <Textarea label="Return Address (Optional)" section="store" field="returnAddress" placeholder="If different from pickup address" data={data} errors={errors} update={update} />
                </div>

                <SectionDivider icon={Sparkles} title="Store Branding" />

                {/* Logo upload */}
                <div>
                  <label className="fb-label">Store Logo</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <div style={{
                      width: 90, height: 90, borderRadius: 18,
                      border: "2px dashed #cbd5e1", background: "#f8fafc",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden", flexShrink: 0, position: "relative", cursor: "pointer",
                    }}>
                      {data.store.logoPreview
                        ? <img src={data.store.logoPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Logo" />
                        : <Store style={{ width: 30, height: 30, color: "#cbd5e1" }} />}
                      <input type="file" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} onChange={(e) => handleFile("store", "logoFile", "logoPreview", e)} accept="image/*" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Upload your logo</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Recommended: 400×400px · Max 2MB · PNG or JPG</div>
                      <label style={{
                        display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10,
                        padding: "8px 16px", background: "#f1f5f9", border: "1.5px solid #e2e8f0",
                        borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#475569",
                        fontFamily: "'Plus Jakarta Sans'", position: "relative",
                      }}>
                        <UploadCloud style={{ width: 14, height: 14 }} /> Browse file
                        <input type="file" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} onChange={(e) => handleFile("store", "logoFile", "logoPreview", e)} accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                <SectionDivider icon={Globe} title="Social Media (Optional)" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                  <Input label="Instagram" section="store" field="instagramUrl" placeholder="instagram.com/yourstore" icon={Instagram} data={data} errors={errors} update={update} />
                  <Input label="Facebook" section="store" field="facebookUrl" placeholder="facebook.com/yourstore" icon={Facebook} data={data} errors={errors} update={update} />
                  <Input label="Twitter / X" section="store" field="twitterUrl" placeholder="twitter.com/yourstore" icon={Twitter} data={data} errors={errors} update={update} />
                </div>
              </div>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "20px 24px", marginBottom: 8 }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 6 }}>Seller Guidelines & Legal</div>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                    By partnering with FreshBasket, you agree to maintain high quality standards for all grocery items, ensure timely order processing, and handle customer data securely.
                  </p>
                </div>

                {[
                  { id: "termsAccepted",       title: "Terms & Conditions",  desc: "I have read and agree to the FreshBasket Seller Agreement." },
                  { id: "privacyAccepted",      title: "Privacy Policy",      desc: "I agree to the processing of data as per the Privacy Policy." },
                  { id: "sellerPolicyAccepted", title: "Quality Policy",      desc: "I commit to supplying fresh, non-expired, and authentic goods only." },
                ].map(chk => (
                  <label key={chk.id} className={`check-card${data.compliance[chk.id] ? " checked" : ""}`}>
                    <div className={`check-box${data.compliance[chk.id] ? " checked" : ""}`}>
                      {data.compliance[chk.id] && <Check style={{ width: 13, height: 13, color: "white" }} />}
                    </div>
                    <div>
                      <input type="checkbox" style={{ display: "none" }} checked={data.compliance[chk.id]}
                        onChange={e => {
                          setData(prev => ({...prev, compliance: {...prev.compliance, [chk.id]: e.target.checked}}));
                          setErrors(prev => { const n={...prev}; delete n[chk.id]; return n; });
                        }} />
                      <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{chk.title}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{chk.desc}</div>
                    </div>
                  </label>
                ))}

                {(errors.termsAccepted || errors.privacyAccepted || errors.sellerPolicyAccepted) &&
                  <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                    <AlertCircle style={{ width: 13, height: 13 }} /> You must accept all agreements to proceed.
                  </p>}
              </div>
            )}

            {/* STEP 7 */}
            {step === 7 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {/* KYC type tabs */}
                <div style={{ display: "flex", gap: 4, padding: 5, background: "#f1f5f9", borderRadius: 14, width: "fit-content" }}>
                  {[
                    { id: "pan_aadhaar",  label: "PAN / Aadhaar" },
                    { id: "gstin",        label: "GST Certificate" },
                    { id: "business_reg", label: "Business Reg." },
                  ].map(tab => (
                    <button key={tab.id} className={`kyc-tab${data.kyc.kycType === tab.id ? " active" : ""}`}
                      onClick={() => update("kyc", "kycType", tab.id)}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {data.kyc.kycType === "pan_aadhaar" && (
                    <>
                      <Input label="PAN Card Number" section="kyc" field="panNumber" req placeholder="ABCDE1234F" maxLength={10} data={data} errors={errors} update={update} />
                      <Input label="Aadhaar Card Number" section="kyc" field="aadhaarNumber" req placeholder="12-digit number" maxLength={12} data={data} errors={errors} update={update} />
                    </>
                  )}
                  {data.kyc.kycType === "gstin" && (
                    <Input label="GSTIN Number" section="kyc" field="gstinNumber" req placeholder="22AAAAA0000A1Z5" maxLength={15} data={data} errors={errors} update={update} />
                  )}
                  {data.kyc.kycType === "business_reg" && (
                    <Input label="Registration Number" section="kyc" field="documentNumber" req placeholder="Udyam / CIN / Shop Act No." data={data} errors={errors} update={update} />
                  )}
                </div>

                {/* Document upload */}
                <div>
                  <label className="fb-label">Upload Document <span style={{ color: "#16a34a" }}>*</span></label>
                  <label className={`drag-zone${errors.documentFile ? " errored" : data.kyc.documentPreview ? " has-file" : ""}`}>
                    <input type="file" style={{ display: "none" }} accept="image/*,.pdf" onChange={(e) => handleFile("kyc", "documentFile", "documentPreview", e)} />
                    {data.kyc.documentPreview ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: 14, background: "#dcfce7",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <FileText style={{ width: 24, height: 24, color: "#16a34a" }} />
                        </div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, color: "#15803d" }}>Document Uploaded!</div>
                        <div style={{ fontSize: 12, color: "#16a34a", textDecoration: "underline" }}>Click to replace file</div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: 14, background: "#f1f5f9",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <UploadCloud style={{ width: 24, height: 24, color: "#94a3b8" }} />
                        </div>
                        <div>
                          <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, color: "#16a34a", fontSize: 14 }}>Click to upload</span>
                          <span style={{ fontSize: 14, color: "#64748b" }}> or drag & drop</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>PDF, JPG, PNG — Max 5MB</div>
                      </div>
                    )}
                  </label>
                  {errors.documentFile && (
                    <p style={{ fontSize: 11, color: "#ef4444", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                      <AlertCircle style={{ width: 11, height: 11 }} />{errors.documentFile}
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ── Navigation ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: 32, marginTop: 36,
            borderTop: "1.5px solid #f1f5f9",
          }}>
            <button className="fb-btn-ghost" onClick={handlePrev} disabled={step === 1}>
              <ChevronLeft style={{ width: 16, height: 16 }} /> Back
            </button>

            {step < STEPS.length ? (
              <button className="fb-btn-primary" onClick={handleNext}>
                Continue <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            ) : (
              <button className="fb-btn-primary" onClick={handleSubmit} disabled={saveStatus === "saving"}
                style={{ padding: "14px 36px", background: saveStatus === "saving" ? "#86efac" : "linear-gradient(135deg, #16a34a, #15803d)" }}>
                {saveStatus === "saving"
                  ? <><span style={{ display: "flex", gap: 3 }}><span className="saving-dot"/><span className="saving-dot"/><span className="saving-dot"/></span> Submitting...</>
                  : <><CheckCircle2 style={{ width: 18, height: 18 }} /> Complete Setup</>}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}