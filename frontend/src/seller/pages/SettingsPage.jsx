import React, { useState, useEffect, useCallback } from 'react';
import { User, Lock, Bell, Zap, ToggleLeft, ToggleRight, Check, Landmark } from 'lucide-react';
import { PageHeader } from '../components/sharedComponents';
import { SELLER } from '../components/shared';
import { useAuth } from '../../contexts/AuthContext';

export default function SettingsPage({ dark, setDark }) {
  const { currentUser, loginUser } = useAuth();
  const [notifPrefs, setNotifPrefs] = useState({ orders: true, payments: true, reviews: false, messages: true });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(false);
  
  const [form, setForm] = useState({
    storeName: currentUser?.storeName || "",
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || ""
  });

  const [bankForm, setBankForm] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    accountType: "Savings"
  });

  const fetchBankDetails = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/sellers/bank/${currentUser.id || currentUser.seller_id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.bank_account_id) {
          setBankForm({
            accountHolderName: data.account_holder_name || "",
            bankName: data.bank_name || "",
            accountNumber: data.account_number || "",
            ifscCode: data.ifsc_code || "",
            upiId: data.upi_id || "",
            accountType: data.account_type || "Savings"
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch bank details", err);
    }
  }, [currentUser?.id, currentUser?.seller_id]);

  useEffect(() => {
    if (currentUser) {
      fetchBankDetails();
    }
  }, [currentUser, fetchBankDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankForm(prev => ({ ...prev, [name]: value }));
  };

  const save = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const resp = await fetch(`http://localhost:5000/api/auth/profile/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          role: currentUser.role || 'seller' 
        })
      });
      
      const data = await resp.json();
      
      if (resp.ok) {
        loginUser(data.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.message || 'Failed to update settings');
      }
    } catch (err) {
      alert('A network error occurred while saving your settings.');
    } finally {
      setLoading(false);
    }
  };

  const saveBank = async () => {
    setBankLoading(true);
    try {
      const resp = await fetch(`http://localhost:5000/api/sellers/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sellerId: currentUser.id || currentUser.seller_id,
          bank: bankForm,
          tax: { gstin: currentUser.gstin || "" },
          store: { storeName: form.storeName, storeDescription: currentUser.storeDescription || "" }
        })
      });
      
      if (resp.ok) {
        alert("Bank details updated successfully");
      } else {
        alert('Failed to update bank details');
      }
    } catch (err) {
      alert('A network error occurred.');
    } finally {
      setBankLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-[13px] text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all";

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      <PageHeader title="Settings" subtitle="Manage your account & preferences" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          {/* Profile Settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="font-bold text-[15px] mb-6 flex items-center gap-2.5 text-slate-800 dark:text-slate-100 placeholder-emerald-500">
              <User size={18} className="text-emerald-500" /> Profile Settings
            </div>
            
            <div className="flex flex-col gap-4">
              {[
                { label: "Store Name", name: "storeName" },
                { label: "Full Name", name: "name" },
                { label: "Email Address", name: "email" },
                { label: "Phone Number", name: "phone" }
              ].map((f) => (
                <div key={f.name}>
                  <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">{f.label}</label>
                  <input name={f.name} value={form[f.name]} onChange={handleChange} className={inputClasses} />
                </div>
              ))}
            </div>
            
            <button onClick={save} disabled={loading} className="mt-6 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl px-6 py-2.5 text-[13px] font-bold cursor-pointer transition-colors disabled:opacity-70 shadow-sm w-fit">
              {loading ? "Saving..." : saved ? <><Check size={16} /> Saved Successfully!</> : "Save Changes"}
            </button>
          </div>

          {/* Banking Settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="font-bold text-[15px] mb-6 flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
              <Landmark size={18} className="text-emerald-500" /> Banking Information
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">Holder Name</label>
                  <input name="accountHolderName" value={bankForm.accountHolderName} onChange={handleBankChange} className={inputClasses} placeholder="As per bank" />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">Bank Name</label>
                  <input name="bankName" value={bankForm.bankName} onChange={handleBankChange} className={inputClasses} placeholder="e.g. HDFC" />
                </div>
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">Account Number</label>
                <input name="accountNumber" value={bankForm.accountNumber} onChange={handleBankChange} className={inputClasses} placeholder="XXXXXXXXXXXX" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">IFSC Code</label>
                  <input name="ifscCode" value={bankForm.ifscCode} onChange={handleBankChange} className={inputClasses} placeholder="IFSC0001234" />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">Type</label>
                  <select name="accountType" value={bankForm.accountType} onChange={handleBankChange} className={inputClasses}>
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">UPI ID (Optional)</label>
                <input name="upiId" value={bankForm.upiId} onChange={handleBankChange} className={inputClasses} placeholder="user@bank" />
              </div>
            </div>
            
            <button onClick={saveBank} disabled={bankLoading} className="mt-6 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white border-none rounded-xl px-6 py-2.5 text-[13px] font-bold cursor-pointer transition-colors disabled:opacity-70 shadow-sm w-fit">
              {bankLoading ? "Updating..." : "Update Bank Details"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Security Settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="font-bold text-[15px] mb-6 flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
              <Lock size={18} className="text-emerald-500" /> Security Updates
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: "Current Password", name: "current_password" },
                { label: "New Password", name: "new_password" },
                { label: "Confirm Password", name: "confirm_password" }
              ].map((f) => (
                <div key={f.name} className="flex-1">
                  <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">{f.label}</label>
                  <input type="password" placeholder="••••••••" className={inputClasses} />
                </div>
              ))}
            </div>
            <button className="mt-5 bg-transparent border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl px-6 py-2.5 text-[13px] font-bold cursor-pointer transition-colors w-fit">
              Update Password
            </button>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="font-bold text-[15px] mb-5 flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
              <Bell size={18} className="text-emerald-500" /> Notifications
            </div>
            <div className="flex flex-col">
              {Object.entries(notifPrefs).map(([k, v], index, arr) => (
                <div key={k} className={`flex items-center justify-between py-3 ${index !== arr.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                  <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 capitalize">{k} notifications</span>
                  <button onClick={() => setNotifPrefs(p => ({ ...p, [k]: !p[k] }))} className="bg-transparent border-none p-0 cursor-pointer flex items-center">
                    {v ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-slate-300 dark:text-slate-600" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance & Location */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="font-bold text-[15px] mb-5 flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
              <Zap size={18} className="text-emerald-500" /> General settings
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <div className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">Dark Mode</div>
                <div className="text-[12px] text-slate-500 mt-0.5">Toggle dark/light theme experience</div>
              </div>
              <button onClick={() => setDark(p => !p)} className="bg-transparent border-none p-0 cursor-pointer flex items-center">
                {dark ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-slate-300 dark:text-slate-600" />}
              </button>
            </div>
            
            <div>
              <div className="text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-2">Store Operation Area</div>
              <input defaultValue={SELLER.location || "Mumbai, India"} className={inputClasses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
