import React, { useState, useEffect } from 'react';
import { FiStar, FiThumbsUp, FiImage, FiPlus, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import '../../../styles/components/ReviewsSection.css';

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
    <section className="reviews-section-modern">
      <div className="section-divider"></div>
      
      <div className="reviews-layout">
        {/* Left Sidebar: Ratings Summary */}
        <div className="reviews-sidebar">
          <h2 className="reviews-title">Customer reviews</h2>
          
          <div className="overall-rating-card">
            <div className="rating-number">
              <span className="big-num">{averageRating}</span>
              <span className="small-num">out of 5</span>
            </div>
            <div className="rating-stars-full">
               <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.4rem', fontSize: '1.4rem' }}>
                 {[...Array(5)].map((_, i) => (
                   <FiStar key={i} className={`star-icon ${i < Math.round(averageRating) ? 'filled' : ''}`} />
                 ))}
               </div>
               <p className="total-ratings-text">{reviews.length} global ratings</p>
            </div>
          </div>

          <div className="star-bars">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="star-bar-row">
                <span className="star-label">{star} star</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${distribution[star]}%` }}></div>
                </div>
                <span className="bar-percent">{distribution[star].toFixed(0)}%</span>
              </div>
            ))}
          </div>

          <div className="review-cta-card">
            <h3>Review this product</h3>
            <p>Share your thoughts with other customers</p>
            <button className="write-review-btn" onClick={() => setShowReviewForm(true)}>Write a product review</button>
          </div>
        </div>

        {/* Right Content: Insights, Images, & Detailed Reviews */}
        <div className="reviews-main-content">
          
          {/* AI-like Insights */}
          <div className="reviews-insights">
             <h3>Customers say</h3>
             <p className="insight-text">
               Customers praise the <b>freshness</b> and <b>natural taste</b> of these organic tomatoes. They particularly appreciate the <b>durable packaging</b> and the <b>consistent quality</b> compared to local stores. While some find the price slightly premium, most agree it's <b>value for money</b> for high-quality organic produce.
             </p>
             <div className="insight-tags">
               {['Freshness', 'Organic', 'Quality', 'Natural', 'Fast Delivery'].map(tag => (
                 <span key={tag} className="insight-tag">
                   <FiChevronRight className="tag-icon" /> {tag}
                 </span>
               ))}
             </div>
          </div>

          {/* User Image Gallery */}
          {allImages.length > 0 && (
            <div className="reviews-images-gallery">
              <div className="gallery-header">
                <h3>Reviews with images</h3>
                <button className="see-all-images">See all photos</button>
              </div>
              <div className="gallery-track">
                {allImages.map((img, idx) => (
                  <div key={idx} className="gallery-item">
                    <img src={img} alt={`Review ${idx}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Individual Review List */}
          <div className="detailed-reviews-list">
            <div className="list-filters">
              <h3>Top reviews from India</h3>
              <select className="review-sort-select">
                <option>Top Reviews</option>
                <option>Most Recent</option>
              </select>
            </div>

            {reviews.map(review => (
              <div key={review.id} className="review-card-modern">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="reviewer-name">{review.user}</span>
                </div>
                
                <div className="review-rating-line">
                  <div className="stars-small">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`star-icon ${i < review.rating ? 'filled' : ''}`} />
                    ))}
                  </div>
                  <span className="review-title">{review.title}</span>
                </div>
                
                <p className="review-date">Reviewed in India on {review.date}</p>
                
                <p className="review-comment">{review.comment}</p>
                
                {(review.images?.length > 0 || review.videos?.length > 0) && (
                  <div className="review-multimedia">
                    {review.videos?.map((vid, i) => (
                      <div key={`v-${i}`} className="pdp-review-video-container">
                        <video src={vid} controls className="pdp-review-video" />
                      </div>
                    ))}
                    {review.images?.map((img, i) => (
                      <img key={`i-${i}`} src={img} alt="review" className="pdp-review-img" />
                    ))}
                  </div>
                )}
                
                <div className="review-actions">
                  <button className="helpful-btn">
                    Helpful
                  </button>
                  <span className="helpful-count">| Report</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Submission Modal (Overlay) */}
      {showReviewForm && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <div className="modal-header">
              <h2>Create Review</h2>
              <button className="close-modal" onClick={() => setShowReviewForm(false)}>✕</button>
            </div>
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group">
                <label>Overall rating</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FiStar 
                      key={star} 
                      className={`star-icon ${star <= newReview.rating ? 'filled' : ''}`} 
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    />
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Add a headline</label>
                <input 
                  type="text" 
                  placeholder="What's most important to know?"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Add Multimedia Content</label>
                <div className="modern-media-input">
                  <div className="media-type-switch">
                    <button type="button" className={mediaType === 'image' ? 'active' : ''} onClick={() => setMediaType('image')}>Photo</button>
                    <button type="button" className={mediaType === 'video' ? 'active' : ''} onClick={() => setMediaType('video')}>Video</button>
                  </div>
                  <div className="url-input-row">
                    <input 
                      type="url" 
                      placeholder={`Paste ${mediaType} URL here...`}
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                    />
                    <button type="button" className="add-url-btn" onClick={addMedia}><FiPlus /></button>
                  </div>
                </div>
                
                <div className="media-previews-track">
                  {newReview.images.map((url, i) => (
                    <div key={`img-${i}`} className="media-preview-item">
                      <img src={url} alt="Uploaded" />
                      <button type="button" onClick={() => removeImage(i)}>✕</button>
                    </div>
                  ))}
                  {newReview.videos.map((url, i) => (
                    <div key={`vid-${i}`} className="media-preview-item video-preview">
                      <video src={url} />
                      <button type="button" onClick={() => removeVideo(i)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Add a written review</label>
                <textarea 
                  placeholder="What did you like or dislike? How did you use this product?"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-review-btn">Submit</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
