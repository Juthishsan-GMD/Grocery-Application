import React, { useState, useEffect } from 'react';
import { FiStar, FiThumbsUp, FiImage, FiPlus, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';

const ReviewsSection = ({ product }) => {
  const { currentUser } = useAuth();
  const storageKey = `reviews_product_${product.id}`;

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    const customReviews = saved ? JSON.parse(saved) : [];
    const defaultReviews = product.reviews || [];
    return [...customReviews, ...defaultReviews];
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '', images: [], videos: [] });
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');

  useEffect(() => {
    const customOnly = reviews.filter(r => r.isCustom);
    localStorage.setItem(storageKey, JSON.stringify(customOnly));
  }, [reviews, storageKey]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    const customReviews = saved ? JSON.parse(saved) : [];
    const defaultReviews = product.reviews || [];
    setReviews([...customReviews, ...defaultReviews]);
  }, [product.id, storageKey, product.reviews]);

  const addMedia = () => {
    if (!mediaUrl) return;
    if (mediaType === 'image') {
      setNewReview({ ...newReview, images: [...newReview.images, mediaUrl] });
    } else {
      setNewReview({ ...newReview, videos: [...newReview.videos, mediaUrl] });
    }
    setMediaUrl('');
  };

  const removeImage = (id) => setNewReview({...newReview, images: newReview.images.filter((_, i) => i !== id)});
  const removeVideo = (id) => setNewReview({...newReview, videos: newReview.videos.filter((_, i) => i !== id)});

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : Number(product.rating).toFixed(1);

  const getStarDistribution = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => counts[r.rating]++);
    const total = reviews.length || 1;
    return Object.fromEntries(Object.entries(counts).map(([star, count]) => [star, (count / total) * 100]));
  };

  const distribution = getStarDistribution();
  const allImages = reviews.flatMap(r => r.images || []);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const review = {
      id: Date.now(),
      user: currentUser ? currentUser.name : "Guest User",
      rating: parseInt(newReview.rating),
      date: new Date().toISOString().split('T')[0],
      title: newReview.title,
      comment: newReview.comment,
      images: newReview.images,
      videos: newReview.videos || [],
      helpful: 0,
      isCustom: true
    };
    setReviews([review, ...reviews]);
    setShowReviewForm(false);
    setNewReview({ rating: 5, title: '', comment: '', images: [], videos: [] });
  };

  return (
    <section className="mt-20 pt-16 border-t border-gray-200">
      
      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-12 md:gap-16 max-w-[1400px] mx-auto">
        {/* Left Sidebar: Ratings Summary */}
        <div className="flex flex-col gap-8 md:sticky md:top-[100px] h-max">
          <h2 className="text-[1.8rem] font-extrabold text-gray-900 mb-2">Customer reviews</h2>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2.5">
              <span className="text-[2.8rem] font-black text-gray-900">{averageRating}</span>
              <span className="text-[1.1rem] text-gray-500 font-semibold">out of 5</span>
            </div>
            <div className="flex flex-col gap-1.5">
               <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.4rem', fontSize: '1.4rem' }}>
                 {[...Array(5)].map((_, i) => (
                   <FiStar key={i} fill={i < Math.round(averageRating) ? 'currentColor' : 'none'} className={i < Math.round(averageRating) ? 'text-amber-400' : 'text-gray-300'} />
                 ))}
               </div>
               <p className="text-[0.95rem] text-gray-500 font-medium">{reviews.length} global ratings</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-5">
                <span className="text-[0.9rem] font-semibold text-[#3b82f6] min-w-[50px] cursor-pointer hover:underline hover:text-[#c45500]">{star} star</span>
                <div className="flex-1 h-[22px] bg-[#f0f2f2] border border-[#d5d9d9] rounded-[4px] overflow-hidden shadow-[inset_0_2px_5px_rgba(0,0,0,0.05)]">
                  <div className="h-full bg-[#de7921] border-r border-[#c45500] transition-all duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ width: `${distribution[star]}%` }}></div>
                </div>
                <span className="text-[0.9rem] font-semibold text-[#3b82f6] min-w-[40px] text-right">{distribution[star].toFixed(0)}%</span>
              </div>
            ))}
          </div>

          <div className="p-10 bg-gray-50 rounded-[20px] border border-gray-200 text-center">
            <h3 className="text-[1.2rem] font-extrabold mb-2">Review this product</h3>
            <p className="text-[0.95rem] text-gray-500 mb-6">Share your thoughts with other customers</p>
            <button className="w-full p-3 bg-white border border-[#d5d9d9] rounded-lg font-semibold text-gray-900 cursor-pointer shadow-[0_2px_5px_rgba(213,217,217,0.5)] transition-all duration-200 hover:bg-[#f7fafa] hover:border-[#adb1b1]" onClick={() => setShowReviewForm(true)}>Write a product review</button>
          </div>
        </div>

        {/* Right Content: Insights, Images, & Detailed Reviews */}
        <div className="flex flex-col gap-14">
          
          {/* AI-like Insights */}
          <div className="bg-white p-8 rounded-[20px] border border-black/5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)]">
             <h3 className="text-[1.4rem] font-extrabold mb-4">Customers say</h3>
             <p className="text-[1.05rem] leading-[1.6] text-gray-600 mb-6">
               Customers praise the <b>freshness</b> and <b>natural taste</b> of these organic tomatoes. They particularly appreciate the <b>durable packaging</b> and the <b>consistent quality</b> compared to local stores. While some find the price slightly premium, most agree it's <b>value for money</b> for high-quality organic produce.
             </p>
             <div className="flex flex-wrap gap-4">
               {['Freshness', 'Organic', 'Quality', 'Natural', 'Fast Delivery'].map(tag => (
                 <span key={tag} className="flex items-center gap-2 text-[0.9rem] font-bold text-[#007185] bg-[#f0f7f8] py-2 px-4 rounded-full cursor-pointer transition-all duration-200 hover:bg-[#e1f1f3] hover:text-[#004d5a]">
                   <FiChevronRight className="text-xl" /> {tag}
                 </span>
               ))}
             </div>
          </div>

          {/* User Image Gallery */}
          {allImages.length > 0 && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[1.4rem] font-extrabold">Reviews with images</h3>
                <button className="text-[#007185] text-sm font-semibold hover:underline">See all photos</button>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
                {allImages.map((img, idx) => (
                  <div key={idx} className="min-w-[160px] h-[160px] rounded-2xl overflow-hidden cursor-pointer border border-gray-200 group">
                    <img src={img} alt={`Review ${idx}`} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Individual Review List */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[1.4rem] font-extrabold">Top reviews from India</h3>
              <select className="border border-gray-300 rounded-lg py-1.5 px-3 bg-white text-sm shadow-sm outline-none">
                <option>Top Reviews</option>
                <option>Most Recent</option>
              </select>
            </div>

            {reviews.map(review => (
              <div key={review.id} className="pb-12 mb-12 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] text-white flex items-center justify-center font-bold text-[0.9rem]">
                    {review.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-base font-semibold text-gray-900">{review.user}</span>
                </div>
                
                <div className="flex items-center gap-4 mb-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} fill={i < review.rating ? 'currentColor' : 'none'} className={`text-[1.1rem] ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-[1.1rem] font-extrabold text-gray-900">{review.title}</span>
                </div>
                
                <p className="text-[0.9rem] text-[#565959] mb-5">Reviewed in India on {review.date}</p>
                
                <p className="text-[1.05rem] leading-[1.5] text-[#0f1111] mb-6 whitespace-pre-line">{review.comment}</p>
                
                {(review.images?.length > 0 || review.videos?.length > 0) && (
                  <div className="flex flex-col gap-6 mb-6">
                    {review.videos?.map((vid, i) => (
                      <div key={`v-${i}`} className="w-full max-w-[400px] rounded-2xl overflow-hidden bg-black mb-4 aspect-video">
                        <video src={vid} controls className="w-full h-full" />
                      </div>
                    ))}
                    <div className="flex gap-4 flex-wrap">
                      {review.images?.map((img, i) => (
                        <img key={`i-${i}`} src={img} alt="review" className="w-[120px] h-[120px] rounded-2xl object-cover border border-gray-200" />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <button className="py-2 px-8 bg-white border border-[#d5d9d9] rounded-lg font-semibold text-[0.9rem] cursor-pointer shadow-[0_2px_5px_rgba(213,217,217,0.5)] mr-6">
                    Helpful
                  </button>
                  <span className="text-[0.9rem] text-[#565959] font-semibold">| Report</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Submission Modal (Overlay) */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[12px] z-[9999] flex items-center justify-center p-6 animate-[fadeIn_0.3s_ease]">
          <div className="bg-white w-full max-w-[650px] max-h-[90vh] rounded-[32px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="p-[1.8rem_2.5rem] border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-[1.5rem] font-black text-gray-900 tracking-[-0.5px]">Create Review</h2>
              <button className="w-[40px] h-[40px] rounded-full bg-slate-50 border border-slate-200 text-[1.2rem] cursor-pointer text-gray-500 flex items-center justify-center transition-all duration-200 hover:bg-red-50 hover:text-red-500 hover:rotate-90" onClick={() => setShowReviewForm(false)}>✕</button>
            </div>
            <form onSubmit={handleReviewSubmit} className="p-10 overflow-y-auto flex-1 flex flex-col gap-8">
              <div className="form-group">
                <label className="block text-base font-extrabold mb-3 text-slate-800">Overall rating</label>
                <div className="flex gap-3 text-[2.2rem] text-slate-200">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FiStar 
                      key={star} 
                      fill={star <= newReview.rating ? 'currentColor' : 'none'}
                      className={`cursor-pointer transition-all duration-300 hover:scale-125 hover:text-amber-400 ${star <= newReview.rating ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]' : ''}`} 
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    />
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="block text-base font-extrabold mb-3 text-slate-800">Add a headline</label>
                <input 
                  type="text" 
                  placeholder="What's most important to know?"
                  className="w-full p-5 border-[1.5px] border-slate-200 rounded-2xl text-[1.05rem] outline-none transition-all duration-200 bg-slate-50 focus:border-[#007185] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,113,133,0.08)]"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="block text-base font-extrabold mb-3 text-slate-800">Add Multimedia Content</label>
                <div className="flex flex-col gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="flex gap-4">
                    <button type="button" className={`flex-1 py-2.5 rounded-lg border bg-white font-bold text-[0.9rem] cursor-pointer transition-all duration-200 ${mediaType === 'image' ? 'bg-[#007185] text-white border-[#007185]' : 'border-[#d5d9d9]'}`} onClick={() => setMediaType('image')}>Photo</button>
                    <button type="button" className={`flex-1 py-2.5 rounded-lg border bg-white font-bold text-[0.9rem] cursor-pointer transition-all duration-200 ${mediaType === 'video' ? 'bg-[#007185] text-white border-[#007185]' : 'border-[#d5d9d9]'}`} onClick={() => setMediaType('video')}>Video</button>
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="url" 
                      placeholder={`Paste ${mediaType} URL here...`}
                      className="w-full p-5 border-[1.5px] border-slate-200 rounded-2xl text-[1.05rem] outline-none transition-all duration-200 bg-white focus:border-[#007185] focus:shadow-[0_0_0_4px_rgba(0,113,133,0.08)] !m-0"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                    />
                    <button type="button" className="bg-gray-900 text-white border-none w-[45px] shrink-0 rounded-xl flex items-center justify-center text-[1.2rem] cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-black" onClick={addMedia}><FiPlus /></button>
                  </div>
                </div>
                
                <div className="flex gap-4 flex-wrap mt-4">
                  {newReview.images.map((url, i) => (
                    <div key={`img-${i}`} className="relative w-[80px] h-[80px] rounded-xl overflow-hidden border-2 border-slate-200">
                      <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                      <button type="button" className="absolute top-[2px] right-[2px] bg-black/60 text-white border-none w-[20px] h-[20px] rounded-full text-[0.7rem] cursor-pointer flex items-center justify-center" onClick={() => removeImage(i)}>✕</button>
                    </div>
                  ))}
                  {newReview.videos.map((url, i) => (
                    <div key={`vid-${i}`} className="relative w-[80px] h-[80px] rounded-xl overflow-hidden border-2 border-slate-200">
                      <video src={url} className="w-full h-full object-cover" />
                      <button type="button" className="absolute top-[2px] right-[2px] bg-black/60 text-white border-none w-[20px] h-[20px] rounded-full text-[0.7rem] cursor-pointer flex items-center justify-center" onClick={() => removeVideo(i)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="block text-base font-extrabold mb-3 text-slate-800">Add a written review</label>
                <textarea 
                  placeholder="What did you like or dislike? How did you use this product?"
                  className="w-full p-5 border-[1.5px] border-slate-200 rounded-2xl text-[1.05rem] outline-none transition-all duration-200 bg-slate-50 focus:border-[#007185] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,113,133,0.08)] min-h-[150px]"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="p-4 bg-[#de7921] text-white border-none rounded-xl font-bold text-[1.1rem] cursor-pointer shadow-[0_4px_10px_rgba(222,121,33,0.3)] transition-all duration-200 hover:bg-[#c45500] hover:-translate-y-0.5">Submit</button>
            </form>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          `}} />
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
