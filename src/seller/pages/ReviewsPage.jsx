import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { PageHeader } from '../components/sharedComponents';
import { avatarBg } from '../components/shared';

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-[460px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-[16px] text-slate-800 dark:text-slate-100 m-0">{title}</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors border-none bg-transparent cursor-pointer">
          <X size={18} />
        </button>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  </div>
);

const StarRating = ({ rating, size = 13 }) => (
  <div className="flex gap-[2px] items-center">
    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={size} fill={s <= Math.round(rating) ? "#10B981" : "none"} color={s <= Math.round(rating) ? "#10B981" : "#d1d5db"} className="transition-all" />)}
  </div>
);

export default function ReviewsPage({ reviews, setReviews }) {
  const [activeTab, setActiveTab] = useState("reviews");
  const [filterRating, setFilterRating] = useState(null);
  const [selectedProductFilter, setSelectedProductFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [showAddReview, setShowAddReview] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const [newReview, setNewReview] = useState({
    productId: "", rating: 0, title: "", description: "", images: []
  });

  const products = [
    { id: "P001", name: "Fresh Organic Apples (1kg)", category: "Fruits" },
    { id: "P002", name: "Premium Sona Masoori Rice (5kg)", category: "Grains" },
    { id: "P003", name: "Cold-Pressed Groundnut Oil (1L)", category: "Oils" }
  ];

  const aiInsights = {
    sentiment: "disappointed",
    issues: [
      { label: "Delivery Delays", percentage: 40, color: "#ef4444" },
      { label: "Packaging Damage", percentage: 35, color: "#f59e0b" },
      { label: "Missing Items", percentage: 25, color: "#3b82f6" }
    ]
  };

  const getProduct = (productId) => {
    return products.find(p => p.id === productId) || { id: productId, name: "Product Unavailable", category: "Unknown" };
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    const remainingSlots = maxImages - newReview.images.length;
    
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed per review`);
      return;
    }
    
    files.slice(0, remainingSlots).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setNewReview(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setNewReview(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== indexToRemove) }));
  };

  const submitNewReview = () => {
    if (!newReview.productId || !newReview.rating || !newReview.title || !newReview.description) return;
    
    const newReviewObj = {
      id: Date.now(),
      orderId: `ORD-${Math.floor(Math.random() * 100000)}`,
      productId: newReview.productId,
      customer: "Current User",
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.description,
      date: new Date().toLocaleDateString(),
      reviewImages: newReview.images,
      verified: true
    };
    
    setReviews(prev => [newReviewObj, ...prev]);
    setShowAddReview(false);
    setNewReview({ productId: "", rating: 0, title: "", description: "", images: [] });
  };

  const filteredReviews = reviews
    .filter(r => activeTab === "reviews")
    .filter(r => {
      if (selectedProductFilter !== "all" && r.productId !== selectedProductFilter) return false;
      if (filterRating && r.rating !== filterRating) return false;
      if (searchTerm && !(r.comment || "").toLowerCase().includes(searchTerm.toLowerCase()) && !r.title?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "latest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return 0;
    });

  const selectReview = (id) => {
    setSelectedReviews(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      setShowBulkActions(next.length > 0);
      return next;
    });
  };

  const inputClass = "h-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-[13px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-shadow";

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <PageHeader title="Reviews" subtitle="Manage and monitor customer reviews" />
        <button onClick={() => setShowAddReview(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[13px] px-5 py-2.5 rounded-xl border-none cursor-pointer transition-colors shadow-sm">
          + Add Review
        </button>
      </div>

      <div className="flex gap-6 border-b-2 border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {["Reviews", "Widget", "Questions"].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab.toLowerCase())} 
            className={`whitespace-nowrap px-1 py-3 text-[14px] font-bold border-b-2 bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer ${activeTab === tab.toLowerCase() ? 'text-emerald-500 border-emerald-500' : 'text-slate-400 dark:text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            My {tab} {tab === "Reviews" && `(${reviews.length})`}
          </button>
        ))}
      </div>

      <div className="bg-amber-500/5 border border-amber-500/20 border-l-4 border-l-amber-500 rounded-xl p-5 shadow-sm">
        <div className="font-bold text-[14px] text-slate-800 dark:text-slate-200 mb-4">Customer Insights (AI Analysis)</div>
        <div className="flex gap-6 flex-wrap">
          {aiInsights.issues.map(issue => (
            <div key={issue.label} className="flex items-center gap-2.5 min-w-[200px] flex-1">
              <div className="h-1.5 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div style={{ width: `${issue.percentage}%`, background: issue.color }} className="h-full rounded-full" />
              </div>
              <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-400 w-32">{issue.percentage}% {issue.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <input type="text" placeholder="Search reviews..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={inputClass} />
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className={inputClass}>
          <option value="all">Date Range: All Time</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
        <select value={selectedProductFilter} onChange={(e) => setSelectedProductFilter(e.target.value)} className={inputClass}>
          <option value="all">All Products</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filterRating || ""} onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)} className={inputClass}>
          <option value="">Star Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={inputClass}>
          <option value="latest">Sort By: Latest</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
        {filteredReviews.length === 0 ? (
          <div className="col-span-full bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-16 text-center">
            <div className="text-[16px] font-bold text-slate-700 dark:text-slate-300 mb-4">No reviews found</div>
            <button onClick={() => setShowAddReview(true)} className="bg-emerald-500 text-white font-semibold text-[13px] px-5 py-2.5 rounded-xl border-none cursor-pointer">Write a Review</button>
          </div>
        ) : (
          filteredReviews.map(r => {
            const product = getProduct(r.productId);
            const isSelected = selectedReviews.includes(r.id);
            return (
              <div key={r.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl relative shadow-sm hover:shadow-md transition-shadow">
                <input type="checkbox" checked={isSelected} onChange={() => selectReview(r.id)} className="absolute top-5 left-4 w-4 h-4 cursor-pointer text-emerald-500 rounded" />
                <div className="p-5 pl-12 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[12px] font-bold text-slate-400">Order-{r.orderId || r.id}</span>
                    <div className="flex items-center gap-2">
                       <StarRating rating={r.rating} size={14} />
                       <span className="text-[11px] font-medium text-slate-500">{r.date}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-[11px] font-medium text-slate-500">Item:</span>
                    <div className="text-[13px] font-bold text-emerald-600 dark:text-emerald-500 mt-0.5">{product.name}</div>
                  </div>
                  
                  <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed mb-4 flex-1">
                    {(r.comment || "").length > 150 ? `${(r.comment || "").substring(0, 150)}...` : (r.comment || "")}
                  </p>
                  
                  <div className="flex justify-between items-end gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white ${avatarBg(r.customer || "User")}`}>
                        {(r.customer || "U").split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{r.customer}</div>
                        {r.verified && <span className="text-[10px] font-bold text-emerald-500 mt-0.5">Verified</span>}
                      </div>
                    </div>
                    {r.reviewImages?.length > 0 && (
                      <div className="flex gap-1.5">
                         {r.reviewImages.slice(0, 3).map((img, i) => <img key={i} src={img} alt="review" className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showAddReview && (
        <Modal title="Write a Review" onClose={() => setShowAddReview(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 block">Product *</label>
              <select value={newReview.productId} onChange={(e) => setNewReview({ ...newReview, productId: e.target.value })} className={inputClass}>
                 <option value="">Select a product</option>
                 {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Rating *</label>
              <div className="flex gap-1.5">
                 {[1, 2, 3, 4, 5].map(star => (
                   <button key={star} onClick={() => setNewReview({ ...newReview, rating: star })} className="text-[28px] bg-transparent border-none cursor-pointer hover:scale-110 transition-transform">
                     {star <= newReview.rating ? '★' : '☆'}
                   </button>
                 ))}
              </div>
            </div>
            <div>
               <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 block">Title *</label>
               <input value={newReview.title} onChange={e => setNewReview({ ...newReview, title: e.target.value })} className={inputClass} placeholder="Summary of your review" />
            </div>
            <div>
               <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2 block">Review *</label>
               <textarea value={newReview.description} onChange={e => setNewReview({ ...newReview, description: e.target.value })} className={`${inputClass} min-h-[100px] py-3`} placeholder="Tell others about your experience..." />
            </div>
            <div className="mt-2 flex justify-end gap-3">
               <button onClick={() => setShowAddReview(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent font-semibold text-[13px] text-slate-700 dark:text-slate-300 cursor-pointer">Cancel</button>
               <button onClick={submitNewReview} className="px-5 py-2.5 rounded-xl border-none bg-emerald-500 hover:bg-emerald-600 font-semibold text-[13px] text-white cursor-pointer shadow-sm">Submit Review</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
