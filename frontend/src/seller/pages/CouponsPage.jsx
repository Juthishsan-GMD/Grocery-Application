import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Plus, Trash2, Edit2, Calendar, XCircle, Percent, IndianRupee } from 'lucide-react';
import { PageHeader, Skeleton } from '../components/sharedComponents';
import { useAuth } from '../../contexts/AuthContext';

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-[16px] text-slate-800 dark:text-slate-100 m-0">{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 border-none bg-transparent cursor-pointer transition-colors">
          <XCircle size={18} />
        </button>
      </div>
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
);

export default function CouponsPage() {
  const { currentUser } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'Percentage',
    discountPercent: '',
    maxDiscount: '',
    minOrderValue: '',
    maxUsage: '',
    validUntil: '',
    isActive: true
  });

  const fetchCoupons = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/coupons/seller/${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (err) {
      console.error("Fetch coupons failed:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingCoupon 
      ? `http://localhost:5000/api/coupons/${editingCoupon.coupon_id}`
      : 'http://localhost:5000/api/coupons';
    const method = editingCoupon ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, sellerId: currentUser?.id })
      });
      if (res.ok) {
        fetchCoupons();
        setShowModal(false);
        setEditingCoupon(null);
        setFormData({
          code: '',
          type: 'Percentage',
          discountPercent: '',
          maxDiscount: '',
          minOrderValue: '',
          maxUsage: '',
          validUntil: '',
          isActive: true
        });
      } else {
        const error = await res.json();
        alert(error.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Save coupon failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCoupons();
    } catch (err) {
      console.error("Delete coupon failed:", err);
    }
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      discountPercent: coupon.discount_percent || '',
      maxDiscount: coupon.max_discount || '',
      minOrderValue: coupon.min_order_value || '',
      maxUsage: coupon.max_usage || '',
      validUntil: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
      isActive: coupon.is_active
    });
    setShowModal(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center">
        <PageHeader title="Coupons & Offers" subtitle="Manage your discount codes and promotional offers" />
        <button 
          onClick={() => { setEditingCoupon(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 border-none cursor-pointer"
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {loading ? <Skeleton h={300} r={20} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map(coupon => (
            <div key={coupon.coupon_id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className={`absolute top-0 right-0 p-1.5 px-3 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider ${coupon.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {coupon.is_active ? 'Active' : 'Inactive'}
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Tag size={24} />
                </div>
                <div>
                  <h4 className="m-0 text-[18px] font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-tight">{coupon.code}</h4>
                  <p className="m-0 text-[12px] text-slate-500">{coupon.type} Discount</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500">Value:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{coupon.type === 'Percentage' ? `${coupon.discount_percent}%` : `₹${coupon.discount_percent}`}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500">Min. Order:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">₹{coupon.min_order_value || 0}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500">Expires:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Calendar size={12} /> {coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500">Usage:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{coupon.used_count} / {coupon.max_usage || '∞'}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => openEdit(coupon)}
                  className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white transition-all font-bold text-[12px] border-none cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(coupon.coupon_id)}
                  className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border-none cursor-pointer flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {coupons.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <div className="text-[3rem] mb-4">🎫</div>
              <h3 className="text-slate-800 dark:text-slate-100 font-bold m-0 mb-2">No Coupons Created Yet</h3>
              <p className="text-slate-500 text-[14px] max-w-xs mx-auto mb-6">Create your first discount coupon to attract more customers and increase sales.</p>
              <button 
                onClick={() => { setEditingCoupon(null); setShowModal(true); }}
                className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold border-none cursor-pointer"
              >
                Create Coupon Now
              </button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <Modal 
          title={editingCoupon ? "Edit Coupon" : "Create New Coupon"} 
          onClose={() => { setShowModal(false); setEditingCoupon(null); }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Coupon Code *</label>
              <input 
                required
                placeholder="e.g. SAVE20, WELCOME50"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all uppercase"
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Discount Type</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 outline-none"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Discount Value *</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    {formData.type === 'Percentage' ? <Percent size={14} /> : <IndianRupee size={14} />}
                  </div>
                  <input 
                    required
                    type="number"
                    placeholder="20"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 outline-none"
                    value={formData.discountPercent}
                    onChange={e => setFormData({...formData, discountPercent: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Min Order (₹)</label>
                <input 
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 outline-none"
                  value={formData.minOrderValue}
                  onChange={e => setFormData({...formData, minOrderValue: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Max Discount (₹)</label>
                <input 
                  type="number"
                  placeholder="No Limit"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 outline-none"
                  value={formData.maxDiscount}
                  onChange={e => setFormData({...formData, maxDiscount: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Valid Until</label>
                <input 
                  type="date"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 outline-none"
                  value={formData.validUntil}
                  onChange={e => setFormData({...formData, validUntil: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Max Usage</label>
                <input 
                  type="number"
                  placeholder="No Limit"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 outline-none"
                  value={formData.maxUsage}
                  onChange={e => setFormData({...formData, maxUsage: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="isActive"
                className="w-4 h-4 accent-emerald-500"
                checked={formData.isActive}
                onChange={e => setFormData({...formData, isActive: e.target.checked})}
              />
              <label htmlFor="isActive" className="text-[13px] font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Coupon is active and ready for use</label>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button"
                onClick={() => { setShowModal(false); setEditingCoupon(null); }}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-400 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 rounded-xl border-none bg-emerald-500 text-white font-bold cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                {editingCoupon ? "Update Coupon" : "Create Coupon"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
