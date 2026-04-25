import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiLock, FiChevronDown, FiChevronUp, FiTag, FiTruck, FiShield, FiCreditCard, FiSmartphone, FiHome, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

// ── GST rate ──────────────────────────────────────────────────
const GST_RATE = 0.05; // 5%
const PLATFORM_FEE = 5.00; // Flat ₹5 platform fee
const COD_CHARGE = 10.00; // Extra charge for COD
// ── Helpers ───────────────────────────────────────────────────
const fmt = (n) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const validate = {
  name:    v => !v.trim() ? 'Full name is required' : v.trim().length < 2 ? 'Enter a valid name' : '',
  email:   v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Enter a valid email' : '',
  phone:   v => !/^[6-9]\d{9}$/.test(v.replace(/\s/g, '')) ? 'Enter a valid 10-digit mobile number' : '',
  pincode: v => !/^\d{6}$/.test(v.trim()) ? 'Enter a valid 6-digit pincode' : '',
  door:    v => !v.trim() ? 'Door / flat number is required' : '',
  street:  v => !v.trim() ? 'Street / area is required' : '',
  city:    v => !v.trim() ? 'City is required' : '',
  state:   v => !v.trim() ? 'State is required' : '',
  card:    v => !/^\d{16}$/.test(v.replace(/\s/g, '')) ? 'Enter a valid 16-digit card number' : '',
  expiry:  v => !/^(0[1-9]|1[0-2])\/\d{2}$/.test(v) ? 'Format: MM/YY' : '',
  cvv:     v => !/^\d{3,4}$/.test(v) ? 'Enter 3 or 4 digit CVV' : '',
  upi:     v => !/^[\w.\-+]+@[\w]+$/.test(v.trim()) ? 'Enter a valid UPI ID (e.g. name@upi)' : '',
};

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry'];

// ── Step indicator ────────────────────────────────────────────
const StepBar = ({ step }) => (
  <div className="flex items-center justify-center gap-0 pt-10 pb-[30px] px-4 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
    {['Delivery', 'Payment', 'Confirm'].map((s, i) => (
      <React.Fragment key={s}>
        <div className={`flex flex-col items-center gap-3 text-[0.85rem] font-extrabold relative transition-all duration-400 uppercase tracking-[0.5px] ${step === i + 1 ? 'text-[#10b981]' : step > i + 1 ? 'text-[#10b981]' : 'text-slate-400'}`}>
          <div className={`w-[42px] h-[42px] rounded-[14px] flex items-center justify-center border-2 text-base font-extrabold shrink-0 transition-all duration-400 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] ${step === i + 1 ? 'bg-[#10b981] text-white border-[#10b981] shadow-[0_10px_15px_-3px_rgba(85,183,70,0.3)] -translate-y-0.5' : step > i + 1 ? 'bg-[#10b981] text-white border-[#10b981]' : 'bg-white border-slate-200 text-slate-400'}`}>
            {step > i + 1 ? <FiCheckCircle size={14} /> : i + 1}
          </div>
          <span>{s}</span>
        </div>
        {i < 2 && <div className={`w-16 sm:w-[100px] h-1 -mt-[25px] mx-2 sm:mx-[20px] rounded-[10px] transition-all duration-400 ${step > i + 1 ? 'bg-[#10b981] shadow-[0_2px_4px_rgba(16,185,129,0.2)]' : 'bg-slate-200'}`} />}
      </React.Fragment>
    ))}
  </div>
);

// ── Section wrapper ───────────────────────────────────────────
const Section = ({ title, children }) => (
  <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] hover:border-slate-200">
    <h3 className="text-[1.25rem] font-bold text-slate-800 m-0 mb-[25px] flex items-center gap-[10px] before:content-[''] before:w-[5px] before:h-[24px] before:bg-[#10b981] before:rounded-[10px]">{title}</h3>
    {children}
  </div>
);

// ── Field ─────────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="mb-4 last:mb-0">
    <label className="block text-[0.8rem] font-semibold text-gray-500 mb-2">{label}</label>
    {children}
    {error && <span className="flex items-center gap-1.5 text-[0.75rem] text-red-500 mt-1.5 font-medium"><FiAlertCircle size={12} /> {error}</span>}
  </div>
);

// ════════════════════════════════════════════════════════════
//  ORDER SUMMARY (right column)
// ════════════════════════════════════════════════════════════
const OrderSummary = ({ cartItems, couponCode, setCouponCode, couponData, setCouponData, couponError, setCouponError, paymentMethod }) => {
  const [open, setOpen] = useState(true);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [inputCode, setInputCode] = useState(couponCode);
  const [isValidating, setIsValidating] = useState(false);

  const subtotal  = cartItems.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
  const savings   = cartItems.reduce((s, i) => s + ((i.originalPrice ?? i.price) - i.price) * (i.quantity || 1), 0);
  const delivery  = subtotal >= 499 ? 0 : 40;
  const gst       = subtotal * GST_RATE;

  let couponDisc = 0;
  if (couponData) {
    if (couponData.type === 'Percentage') {
      couponDisc = subtotal * (couponData.discount_percent / 100);
      if (couponData.max_discount && couponDisc > couponData.max_discount) {
        couponDisc = couponData.max_discount;
      }
    } else {
      couponDisc = couponData.discount_percent; // For fixed amount, it's stored in the same column usually or I should check schema
    }
    
    // Safety check for min order value
    if (couponData.min_order_value && subtotal < couponData.min_order_value) {
      couponDisc = 0;
    }
  }

  const codFee    = paymentMethod === 'cod' ? COD_CHARGE : 0;
  const billTotal = delivery + gst + PLATFORM_FEE + codFee;
  const total = subtotal + billTotal - couponDisc;

  const handleApplyCoupon = async () => {
    const code = inputCode.trim().toUpperCase();
    if (!code) { setCouponError('Enter a coupon code'); return; }
    
    try {
      setIsValidating(true);
      const res = await fetch(`http://localhost:5000/api/coupons/validate/${code}`);
      const data = await res.json();
      
      if (res.ok) {
        if (data.min_order_value && subtotal < data.min_order_value) {
          setCouponError(`Minimum order ₹${data.min_order_value} required for this coupon.`);
          setCouponData(null);
          return;
        }
        setCouponData(data);
        setCouponCode(code);
        setCouponError('');
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        setCouponData(null);
      }
    } catch (err) {
      setCouponError('Error validating coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponData(null);
    setCouponCode('');
    setInputCode('');
    setCouponError('');
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] lg:sticky lg:top-6 overflow-hidden">
      <div className="p-6 text-[1.2rem] font-extrabold text-slate-800 bg-white border-b border-slate-100 flex justify-between items-center cursor-pointer" onClick={() => setOpen(o => !o)}>
        <span>Order Summary ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
        {open ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
      </div>

      {open && (
        <>
          {/* Items */}
          <div className="p-6 flex flex-col gap-5 max-h-[400px] overflow-y-auto scrollbar-thin">
            {cartItems.map(item => (
              <div key={item.uniqueId} className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img src={item.image} alt={item.name} className="w-[72px] h-[72px] object-cover rounded-2xl bg-slate-50 border border-slate-100"
                    onError={e => e.target.style.display = 'none'} />
                  <span className="absolute -top-1.5 -right-1.5 min-w-[24px] h-[24px] bg-slate-800 text-white rounded-lg text-[0.7rem] font-black flex items-center justify-center border-2 border-white">{item.quantity || 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-extrabold text-slate-800 m-0 mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{item.name} - {item.unit}</p>
                  <p className="text-[0.8rem] font-semibold text-slate-500 m-0">{item.category}</p>
                </div>
                <span className="text-[1.05rem] font-black text-slate-800 shrink-0">₹{fmt(item.price * (item.quantity || 1))}</span>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="p-4 sm:p-6 sm:py-4 border-b border-gray-200 bg-gray-50 flex flex-col">
            <div className="flex items-center gap-3 text-gray-500">
              <FiTag size={15} />
              {couponData ? (
                <div className="flex items-center gap-2.5 flex-1">
                  <span className="text-[0.85rem] font-bold text-[#10b981] bg-emerald-50 py-1.5 px-3 rounded-lg border border-dashed border-emerald-300">{couponData.code} applied ✓</span>
                  <button className="text-[0.8rem] text-red-500 bg-transparent border-none cursor-pointer font-medium" onClick={handleRemoveCoupon}>Remove</button>
                </div>
              ) : (
                <>
                  <input 
                    className="flex-1 py-2.5 px-3.5 border border-gray-300 rounded-[10px] text-[0.9rem] text-gray-900 bg-white outline-none font-medium focus:border-[#10b981]" 
                    placeholder="Enter coupon code"
                    value={inputCode} 
                    onChange={e => { setInputCode(e.target.value.toUpperCase()); setCouponError(''); }} 
                  />
                  <button 
                    className="py-2.5 px-[18px] bg-gray-900 text-white border-none rounded-[10px] text-[0.85rem] font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-700 disabled:opacity-50" 
                    onClick={handleApplyCoupon}
                    disabled={isValidating}
                  >
                    {isValidating ? '...' : 'Apply'}
                  </button>
                </>
              )}
            </div>
            {couponError && <p className="text-[0.75rem] text-red-500 mt-2 font-medium">{couponError}</p>}
            <p className="text-[0.75rem] text-gray-500 mt-2">Check your seller's shop for active promo codes!</p>
          </div>

          {/* Price rows */}
          <div className="p-6 border-b border-gray-200 flex flex-col gap-1.5">
            <div className="flex justify-between text-[0.9rem] py-1 text-gray-500">
              <span>Subtotal ({cartItems.reduce((n, i) => n + (i.quantity || 1), 0)} items)</span>
              <span>₹{fmt(subtotal)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-[0.9rem] py-1 text-[#10b981] font-semibold">
                <span>Product Discount</span>
                <span>−₹{fmt(savings)}</span>
              </div>
            )}
            {couponDisc > 0 && (
              <div className="flex justify-between text-[0.9rem] py-1 text-[#10b981] font-semibold">
                <span>Coupon ({couponData.code})</span>
                <span>−₹{fmt(couponDisc)}</span>
              </div>
            )}
            <div className="flex justify-between text-[0.9rem] py-1 text-gray-500">
              <span>Item Total ({cartItems.reduce((n, i) => n + (i.quantity || 1), 0)} items)</span>
              <span>₹{fmt(subtotal)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-[0.9rem] py-1 text-[#10b981] font-semibold">
                <span>Direct Savings</span>
                <span>−₹{fmt(savings)}</span>
              </div>
            )}
            {couponDisc > 0 && (
              <div className="flex justify-between text-[0.9rem] py-1 text-[#10b981] font-semibold">
                <span>Coupon Discount ({couponData.code})</span>
                <span>−₹{fmt(couponDisc)}</span>
              </div>
            )}
            
            {/* COLLAPSIBLE BILL DETAILS */}
            <div className={`my-3 overflow-hidden transition-all duration-300 rounded-xl border ${showBillDetails ? 'bg-white border-[#10b981] shadow-[0_4px_12px_rgba(16,185,129,0.08)]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="p-[14px_16px] flex justify-between items-center cursor-pointer text-[0.9rem] font-bold text-gray-900 select-none" onClick={() => setShowBillDetails(!showBillDetails)}>
                <span>Taxes & Extra Charges</span>
                <div className="flex items-center gap-2 text-[#10b981]">
                  <span>+₹{fmt(billTotal)}</span>
                  {showBillDetails ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                </div>
              </div>
              
              {showBillDetails && (
                <div className="px-4 pb-4 flex flex-col gap-2 border-t border-slate-100 pt-3 animate-fade-in">
                  <div className="flex justify-between text-[0.85rem] text-gray-500 py-0.5">
                    <span>Delivery Fee</span>
                    <span>{delivery === 0 ? <span className="text-[#10b981] font-bold">FREE</span> : `₹${fmt(delivery)}`}</span>
                  </div>
                  <div className="flex justify-between text-[0.85rem] text-gray-500 py-0.5">
                    <span>GST (5%)</span>
                    <span>₹{fmt(gst)}</span>
                  </div>
                  <div className="flex justify-between text-[0.85rem] text-gray-500 py-0.5">
                    <span>Platform Fee</span>
                    <span>₹{fmt(PLATFORM_FEE)}</span>
                  </div>
                  {codFee > 0 && (
                    <div className="flex justify-between text-[0.85rem] text-gray-500 py-0.5">
                      <span>COD Handling Fee</span>
                      <span>₹{fmt(codFee)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between font-extrabold text-[1.25rem] text-[#10b981] mt-[15px] pt-[15px] border-t-2 border-dashed border-gray-200">
              <span>Total Payable</span>
              <span>₹{fmt(total)}</span>
            </div>
            {(savings + couponDisc) > 0 && (
              <div className="mt-4 bg-emerald-50 text-emerald-700 text-[0.85rem] font-bold p-3 rounded-xl text-center border border-dashed border-emerald-300">
                🎉 You're saving ₹{fmt(savings + couponDisc)} on this order!
              </div>
            )}
          </div>

          {/* Trust */}
          <div className="flex justify-between p-4 sm:p-6 text-[0.75rem] text-gray-500 font-semibold bg-gray-50">
            <span className="flex items-center gap-1.5"><FiShield size={14} /> Secure Payment</span>
            <span className="flex items-center gap-1.5"><FiTruck size={14} /> Fast Delivery</span>
            <span className="flex items-center gap-1.5"><FiLock size={14} /> Safe & Private</span>
          </div>
        </>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
//  STEP 1 — DELIVERY DETAILS
// ════════════════════════════════════════════════════════════
const DeliveryStep = ({ data, setData, onNext, savedAddresses, selectedAddressId, setSelectedAddressId }) => {
  const [errors, setErrors] = useState({});

  // Pre-fill from localStorage if logged in
  useEffect(() => {
    const name  = localStorage.getItem('divine_customer_name')  || '';
    const email = localStorage.getItem('divine_customer_email') || '';
    setData(d => ({
      ...d,
      name:  d.name  || name,
      email: d.email || email,
    }));
  }, []);

  const set = (k, v) => {
    setData(d => ({ ...d, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  const handleNext = () => {
    if (selectedAddressId !== 'new') {
      onNext();
      return;
    }
    const fields = ['name', 'email', 'phone', 'door', 'street', 'city', 'state', 'pincode'];
    const newErr = {};
    fields.forEach(f => {
      const err = validate[f]?.(data[f] || '');
      if (err) newErr[f] = err;
    });
    if (Object.keys(newErr).length) { setErrors(newErr); return; }
    onNext();
  };

  const inp = (k, props = {}) => (
    <input
      className={`w-full border rounded-[10px] py-3 px-[14px] font-['Inter',sans-serif] text-[0.95rem] text-gray-900 outline-none transition-all duration-300 focus:border-[#10b981] focus:bg-white focus:shadow-[0_0_0_3px_rgba(85,183,70,0.15)] ${errors[k] ? 'border-red-500 bg-red-50' : 'bg-gray-50 border-gray-300'}`}
      value={data[k] || ''}
      onChange={e => set(k, e.target.value)}
      {...props}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      {savedAddresses.length > 0 && (
        <Section title="Select Delivery Address">
          <div className="flex flex-col gap-3">
            {savedAddresses.map(addr => (
              <label key={addr.address_id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedAddressId === addr.address_id ? 'border-[#10b981] bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}>
                <input type="radio" name="address" checked={selectedAddressId === addr.address_id} onChange={() => setSelectedAddressId(addr.address_id)} className="mt-1 accent-[#10b981]" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800">{addr.full_name}</span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">{addr.address_type}</span>
                  </div>
                  <p className="text-[13px] text-slate-500 m-0">{addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-[13px] text-slate-500 m-0 mt-1">Mobile: {addr.phone}</p>
                </div>
              </label>
            ))}
            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedAddressId === 'new' ? 'border-[#10b981] bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}>
              <input type="radio" name="address" checked={selectedAddressId === 'new'} onChange={() => setSelectedAddressId('new')} className="accent-[#10b981]" />
              <span className="font-bold text-slate-800">Add New Address</span>
            </label>
          </div>
        </Section>
      )}

      {selectedAddressId === 'new' && (
        <>
          <Section title="Contact Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name *" error={errors.name}>
                {inp('name', { placeholder: 'Ramesh Kumar' })}
              </Field>
              <Field label="Email Address *" error={errors.email}>
                {inp('email', { type: 'email', placeholder: 'you@email.com' })}
              </Field>
            </div>
            <Field label="Mobile Number *" error={errors.phone}>
              {inp('phone', { type: 'tel', placeholder: '9876543210', maxLength: 10 })}
            </Field>
          </Section>

          <Section title="Delivery Address">
            <Field label="Door / Flat Number *" error={errors.door}>
              {inp('door', { placeholder: 'No. 12, 3rd Floor' })}
            </Field>
            <Field label="Street / Area / Landmark *" error={errors.street}>
              {inp('street', { placeholder: 'Anna Nagar, Near Park' })}
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="City *" error={errors.city}>
                {inp('city', { placeholder: 'Chennai' })}
              </Field>
              <Field label="Pincode *" error={errors.pincode}>
                {inp('pincode', { placeholder: '600001', maxLength: 6 })}
              </Field>
            </div>
            <Field label="State *" error={errors.state}>
              <select
                className={`w-full border rounded-[10px] py-3 px-[14px] font-['Inter',sans-serif] text-[0.95rem] text-gray-900 outline-none transition-all duration-300 focus:border-[#10b981] focus:bg-white focus:shadow-[0_0_0_3px_rgba(85,183,70,0.15)] ${errors.state ? 'border-red-500 bg-red-50' : 'bg-gray-50 border-gray-300'}`}
                value={data.state || ''}
                onChange={e => set('state', e.target.value)}
              >
                <option value="">Select State</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </Section>
        </>
      )}

      <button className="w-full p-4 bg-[#10b981] border-none rounded-xl text-white text-base font-bold cursor-pointer shadow-[0_4px_12px_rgba(85,183,70,0.25)] transition-all duration-300 hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(85,183,70,0.3)]" onClick={handleNext}>
        Continue to Payment →
      </button>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
//  STEP 2 — PAYMENT
// ════════════════════════════════════════════════════════════
const PaymentStep = ({ onNext, onBack, method, setMethod, card, setCard, upi, setUpi, upiApp, setUpiApp, net, setNet }) => {
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    onNext();
  };

  const PayMethod = ({ id, icon, label }) => (
    <button
      className={`flex flex-col items-center justify-center gap-3 py-6 px-4 bg-white border-2 rounded-[20px] cursor-pointer text-[0.9rem] font-extrabold transition-all duration-300 relative overflow-hidden group hover:-translate-y-[3px] ${method === id ? 'border-[#10b981] bg-emerald-50 text-green-800 shadow-[0_10px_25px_-5px_rgba(85,183,70,0.15)]' : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
      onClick={() => { setMethod(id); setErrors({}); }}
    >
      <div className={`text-[1.8rem] mb-1 transition-all duration-300 ${method === id ? 'text-[#10b981] scale-110' : 'text-slate-400 group-hover:text-slate-500'}`}>
        {icon}
      </div>
      <span>{label}</span>
      {method === id && (
        <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#10b981] text-white rounded-full flex items-center justify-center text-[0.7rem]">✓</div>
      )}
    </button>
  );

  return (
    <div className="flex flex-col gap-6">
      <Section title="Select Payment Method">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-4 mb-6">
          <PayMethod id="prepaid"    icon={<FiCreditCard />}  label="Secure Online Payment" />
          <PayMethod id="cod"        icon={<FiTruck />}       label="Cash on Delivery" />
        </div>
      </Section>

      {method === 'prepaid' && (
        <Section title="Secure Online Payment">
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 leading-[1.6] text-base text-green-800 flex flex-col gap-3 items-start">
             <p>🚀 Fast, Secure & Reliable.</p>
             <p>Pay via UPI, Cards, NetBanking or Wallets on the next page.</p>
             <div className="flex gap-2 text-[0.75rem] font-bold mt-2 text-gray-500">
                <span className="px-2 py-1 bg-white border border-gray-200 rounded">UPI</span>
                <span className="px-2 py-1 bg-white border border-gray-200 rounded">CARDS</span>
                <span className="px-2 py-1 bg-white border border-gray-200 rounded">BANKS</span>
                <span className="px-2 py-1 bg-white border border-gray-200 rounded">WALLETS</span>
             </div>
          </div>
        </Section>
      )}

      {/* COD */}
      {method === 'cod' && (
        <Section title="Cash on Delivery">
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 leading-[1.6] text-base text-green-800 flex flex-col gap-3 items-start">
            <p>💰 Pay in cash when your order arrives at your doorstep.</p>
            <p>Note: COD is available for orders up to ₹5,000.</p>
          </div>
        </Section>
      )}

      <div className="flex gap-4 items-center">
        <button className="py-[15px] px-6 bg-white border border-gray-300 rounded-xl text-gray-500 text-[0.95rem] font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50" onClick={onBack}>← Back</button>
        <button className="flex-1 p-4 bg-gradient-to-br from-[#10b981] to-[#059669] border-none rounded-xl text-white text-base font-bold cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] disabled:opacity-50" onClick={handleNext}>Review Order →</button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
//  STEP 3 — CONFIRM
// ════════════════════════════════════════════════════════════
const ConfirmStep = ({ delivery, cartItems, couponData, onBack, onPlace, isProcessing, paymentMethod }) => {
  const subtotal   = cartItems.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
  const savings    = cartItems.reduce((s, i) => s + ((i.originalPrice ?? i.price) - i.price) * (i.quantity || 1), 0);
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const gst        = subtotal * GST_RATE;
  let couponDisc   = 0;
  if (couponData) {
    if (couponData.type === 'Percentage') {
      couponDisc = subtotal * (couponData.discount_percent / 100);
      if (couponData.max_discount && couponDisc > couponData.max_discount) {
        couponDisc = couponData.max_discount;
      }
    } else {
      couponDisc = couponData.discount_percent;
    }
    if (couponData.min_order_value && subtotal < couponData.min_order_value) {
      couponDisc = 0;
    }
  }
  const codFee      = paymentMethod === 'cod' ? COD_CHARGE : 0;
  const billTotal = deliveryFee + gst + PLATFORM_FEE + codFee;
  const total = subtotal + billTotal - couponDisc;

  return (
    <div className="flex flex-col gap-6">
      <Section title="Delivery Address">
        <div className="bg-gray-50 rounded-xl p-5 text-[0.95rem] leading-[1.6] text-gray-900 border border-gray-200">
          <p className="font-bold text-[1.05rem] text-[#10b981] mb-2">{delivery.name}</p>
          <p>{delivery.door}, {delivery.street}</p>
          <p>{delivery.city} — {delivery.pincode}</p>
          <p>{delivery.state}</p>
          <p className="mt-2">📱 {delivery.phone} &nbsp;|&nbsp; ✉️ {delivery.email}</p>
        </div>
      </Section>

      <Section title="Order Items">
        {cartItems.map(item => (
          <div key={item.uniqueId} className="flex justify-between text-[0.9rem] py-2.5 border-b border-gray-200 font-medium last:border-none">
            <span>{item.name} ({item.unit}) × {item.quantity || 1}</span>
            <span>₹{fmt(item.price * (item.quantity || 1))}</span>
          </div>
        ))}
      </Section>

      <Section title="Price Breakdown">
        <div className="bg-gray-50 rounded-xl p-5 text-[0.95rem] leading-[1.6] text-gray-900 border border-gray-200">
          <div className="flex justify-between text-[0.9rem] py-1.5 text-gray-500"><span>Subtotal</span><span>₹{fmt(subtotal)}</span></div>
          {savings > 0 && <div className="flex justify-between text-[0.9rem] py-1.5 text-[#10b981] font-semibold"><span>Product Discount</span><span>−₹{fmt(savings)}</span></div>}
          {couponDisc > 0 && <div className="flex justify-between text-[0.9rem] py-1.5 text-[#10b981] font-semibold"><span>Coupon ({couponData.code})</span><span>−₹{fmt(couponDisc)}</span></div>}
          <div className="flex justify-between text-[0.9rem] py-1.5 text-gray-500"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
          <div className="flex justify-between text-[0.9rem] py-1.5 text-gray-500"><span>GST (5%)</span><span>+₹{fmt(gst)}</span></div>
          <div className="flex justify-between text-[0.9rem] py-1.5 text-gray-500"><span>Platform Fee</span><span>+₹{fmt(PLATFORM_FEE)}</span></div>
          {codFee > 0 && <div className="flex justify-between text-[0.9rem] py-1.5 text-gray-500"><span>COD Fee</span><span>+₹{fmt(codFee)}</span></div>}
          <div className="flex justify-between font-extrabold text-[1.15rem] text-gray-900 mt-2.5 pt-2.5 border-t-2 border-dashed border-gray-200"><span>Total Payable</span><span>₹{fmt(total)}</span></div>
        </div>
      </Section>

      <div className="flex gap-4 items-center">
        <button className="py-[15px] px-6 bg-white border border-gray-300 rounded-xl text-gray-500 text-[0.95rem] font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50" onClick={onBack} disabled={isProcessing}>← Back</button>
        <button className="flex-1 p-4 bg-gradient-to-br from-[#10b981] to-[#059669] border-none rounded-xl text-white text-base font-bold cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] disabled:opacity-50" onClick={onPlace} disabled={isProcessing}>
          <FiLock size={16} /> {isProcessing ? 'Processing Order...' : `Place Order · ₹${fmt(total)}`}
        </button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
//  SUCCESS
// ════════════════════════════════════════════════════════════
const OrderSuccess = ({ orderId, name }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-[540px] mx-auto my-[80px] text-center bg-white rounded-[24px] p-[40px_24px] md:p-[56px_48px] shadow-lg border border-gray-200">
      <div className="text-[4rem] mb-6">🎉</div>
      <h2 className="text-[1.8rem] text-[#10b981] font-extrabold m-0 mb-3">Order Placed Successfully!</h2>
      <p className="text-[1rem] text-gray-500 m-0 mb-6">Thank you, <strong>{name}</strong>! Your order has been confirmed.</p>
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-[10px] p-[12px_24px] text-[1rem] text-gray-900 mx-auto mb-5 inline-block">Order ID: <strong>{orderId}</strong></div>
      <p className="text-[0.85rem] text-gray-500 mb-8">You will receive a confirmation email shortly.</p>
      <div className="flex justify-center">
        <button className="w-full sm:w-auto p-4 px-8 bg-[#10b981] border-none rounded-xl text-white text-base font-bold cursor-pointer shadow-[0_4px_12px_rgba(85,183,70,0.25)] transition-all duration-300 hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(85,183,70,0.3)]" onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
//  MAIN CheckoutPage
// ════════════════════════════════════════════════════════════
const CheckoutPage = () => {
  const { cart: cartItems, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [step,          setStep]          = useState(1);
  const [delivery,      setDelivery]      = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [orderId,       setOrderId]       = useState('');
  const [placed,        setPlaced]        = useState(false);

  // Payment states lifted for global summary access
  const [method, setMethod] = useState('prepaid');
  const [card,   setCard]   = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upi,    setUpi]    = useState('');
  const [upiApp, setUpiApp] = useState('');
  const [net,    setNet]    = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');

  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:5000/api/addresses/customer/${currentUser.id || currentUser.customer_id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setSavedAddresses(data);
            const defaultAddr = data.find(a => a.is_default) || data[0];
            setSelectedAddressId(defaultAddr.address_id);
          }
        })
        .catch(err => console.error(err));
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedAddressId !== 'new') {
      const addr = savedAddresses.find(a => a.address_id === selectedAddressId);
      if (addr) {
        setDelivery({
          name: addr.full_name,
          email: currentUser?.email || '',
          phone: addr.phone,
          door: addr.address_line_1,
          street: addr.address_line_2 || '',
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          addressId: addr.address_id
        });
      }
    } else {
      setDelivery(d => ({ ...d, addressId: null }));
    }
  }, [selectedAddressId, savedAddresses, currentUser]);

  useEffect(() => {
    if (cartItems.length === 0 && !placed) navigate('/cart');
  }, [cartItems, placed, navigate]);

  // Ensure scroll top on dynamic step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Auto scroll to top when order is placed
  useEffect(() => {
    if (placed) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [placed]);

  const [isProcessing, setIsProcessing] = useState(false);
  const deliveryInfo = delivery; // Capture current delivery state

  const handlePlace = () => {
    // Determine if it's COD or Online Payment
    const isCOD = method === 'cod';
    
    if (!isCOD) {
      if (!window.Razorpay) {
        alert("Razorpay implementation is currently loading. Please wait a moment or try refreshing.");
        return;
      }
      
      setIsProcessing(true);
      
      // We calculate the total exactly as done in OrderSummary
      const subtotal  = cartItems.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
      const delivery_fee = subtotal >= 499 ? 0 : 40;
      const gst       = subtotal * GST_RATE;
      let couponDisc = 0;
      if (couponData) {
        if (couponData.type === 'Percentage') {
          couponDisc = subtotal * (couponData.discount_percent / 100);
          if (couponData.max_discount && couponDisc > couponData.max_discount) couponDisc = couponData.max_discount;
        } else {
          couponDisc = couponData.discount_percent;
        }
        if (couponData.min_order_value && subtotal < couponData.min_order_value) couponDisc = 0;
      }
      const totalPayable = subtotal + delivery_fee + gst + PLATFORM_FEE + (method === 'cod' ? COD_CHARGE : 0) - couponDisc;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_placeholder", 
        amount: Math.round(totalPayable * 100), // Amount in paise
        currency: "INR",
        name: "FreshBasket™",
        description: `Order for ${deliveryInfo.name}`,
        image: "https://freshbasket-grocery.vercel.app/favicon.svg",
        handler: function (response) {
          // Success Callback
          const id = 'ORD-' + Date.now().toString().slice(-8);
          processOrderSuccess(id, response.razorpay_payment_id);
        },
        prefill: {
          name: deliveryInfo.name,
          email: deliveryInfo.email,
          contact: deliveryInfo.phone
        },
        theme: {
          color: "#10b981"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Normal COD Flow
      setIsProcessing(true);
      const id = 'ORD-' + Date.now().toString().slice(-8);
      processOrderSuccess(id);
    }
  };

  const processOrderSuccess = async (id, transactionId = null) => {
    setOrderId(id);
    
    const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_ORDER_TEMPLATE_ID;
    const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    // Financial calculations with strict Number conversion
    const subtotal = cartItems.reduce((s, i) => s + (Number(i.price || 0) * (i.quantity || 1)), 0);
    const deliveryFee = subtotal >= 499 ? 0 : 40;
    const gst = subtotal * GST_RATE;
    let couponDisc = 0;
    if (couponData) {
      if (couponData.type === 'Percentage') {
        couponDisc = subtotal * (couponData.discount_percent / 100);
        if (couponData.max_discount && couponDisc > couponData.max_discount) couponDisc = couponData.max_discount;
      } else {
        couponDisc = couponData.discount_percent;
      }
      if (couponData.min_order_value && subtotal < couponData.min_order_value) couponDisc = 0;
    }
    const codFee = method === 'cod' ? COD_CHARGE : 0;
    const totalAmount = subtotal + deliveryFee + gst + PLATFORM_FEE + codFee - couponDisc;

    try {
      const customerId = currentUser?.customer_id || currentUser?.id || null;

      // 1. Get or Create Address to get address_id
      let addressId = delivery.addressId;
      if (!addressId) {
        console.log('Registering shipping address...');
        const addrRes = await fetch('http://localhost:5000/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId,
            fullName: delivery.name,
            phone: delivery.phone,
            addressLine1: delivery.door,
            addressLine2: delivery.street,
            city: delivery.city,
            state: delivery.state,
            pincode: delivery.pincode,
            addressType: 'Home'
          })
        });
        
        if (!addrRes.ok) {
          throw new Error('Could not save shipping address. Please check your details.');
        }

        const addrData = await addrRes.json();
        addressId = addrData.address_id;

        if (!addressId) {
          throw new Error('Server failed to generate an address ID.');
        }
      }

      // 2. Map items for backend order_items table
      const mappedItems = cartItems.map(item => ({
        productId: item.product_id || item.id,
        variantId: item.variant_id || null,
        sellerId: item.seller_id || null,
        quantity: item.quantity || 1,
        unitPrice: Number(item.price || 0),
        totalPrice: Number(item.price || 0) * (item.quantity || 1)
      }));

      // 3. Save order to database
      console.log('Sending order payload to server...');
      const orderRes = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          addressId,
          couponId: couponData?.code || null,
          items: mappedItems,
          subtotal: Number(subtotal),
          discountAmount: Number(couponDisc),
          taxAmount: Number(gst),
          shippingCharge: Number(deliveryFee + PLATFORM_FEE + codFee),
          totalAmount: Number(totalAmount),
          paymentMethod: method === 'cod' ? 'COD' : 'Online',
          transactionId: transactionId,
          gatewayName: transactionId ? 'Razorpay' : 'Manual'
        })
      });
      
      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || 'The server rejected the order.');
      }

      const orderData = await orderRes.json();
      console.log('Order finalized securely:', orderData);
      
      // Construct EmailJS details
      const orderItemsHtml = cartItems.map(item => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 0; text-align: left;">
            <div style="font-weight: 600; color: #111827;">${item.name}</div>
            <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">QTY: ${item.quantity || 1} &times; ${item.unit}</div>
          </td>
          <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #10b981;">
            ₹${(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
          </td>
        </tr>
      `).join('');

      const templateParams = {
        to_name: delivery.name || 'Customer',
        to_email: delivery.email,
        order_id: id,
        order_items_html: orderItemsHtml,
        subtotal: `₹${subtotal.toLocaleString('en-IN')}`,
        shipping: deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`,
        total: `₹${totalAmount.toLocaleString('en-IN')}`,
        delivery_address: `${delivery.door}, ${delivery.street}`
      };

      if (delivery.email) {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      }

      // Finalize on frontend
      setIsProcessing(false);
      clearCart();
      setPlaced(true);

    } catch (err) {
      console.error('Checkout Processing Error:', err);
      alert(`⚠️ Order Failed: ${err.message}\n\nPlease check your internet or try again.`);
      setIsProcessing(false);
    }
  };

  if (placed) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif] text-gray-900 pb-[80px]">
        <OrderSuccess orderId={orderId} name={delivery.name || 'Devotee'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif] text-gray-900 pb-[80px]">
      <div className="flex items-center justify-between bg-white px-8 py-4 border-b border-gray-200 text-base font-bold text-[#10b981] shadow-sm">
        <div className="flex items-center gap-2">🛒 FreshBasket — Secure Checkout</div>
        <div className="flex items-center gap-2 text-[0.85rem] text-gray-500 font-medium"><FiLock size={14} /> SSL Secured</div>
      </div>

      <StepBar step={step} />

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_420px] gap-8 max-w-[1200px] mx-auto mt-8 px-6">
        {/* LEFT — form steps */}
        <div className="flex flex-col gap-6">
          {step === 1 && (
            <DeliveryStep
              data={delivery}
              setData={setDelivery}
              onNext={() => setStep(2)}
              savedAddresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
            />
          )}
          {step === 2 && (
            <PaymentStep
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
              method={method} setMethod={setMethod}
              card={card} setCard={setCard}
              upi={upi} setUpi={setUpi}
              upiApp={upiApp} setUpiApp={setUpiApp}
              net={net} setNet={setNet}
            />
          )}
          {step === 3 && (
            <ConfirmStep
              delivery={delivery}
              cartItems={cartItems}
              couponData={couponData}
              onBack={() => setStep(2)}
              onPlace={handlePlace}
              isProcessing={isProcessing}
              paymentMethod={method}
            />
          )}
        </div>

        {/* RIGHT — order summary */}
        <div className="w-full">
          <OrderSummary
            cartItems={cartItems}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            couponData={couponData}
            setCouponData={setCouponData}
            couponError={couponError}
            setCouponError={setCouponError}
            paymentMethod={method}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;