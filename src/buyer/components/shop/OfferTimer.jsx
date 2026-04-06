import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/pages/Home.css'; // Reusing Home.css for styles

const OfferTimer = () => {
  const navigate = useNavigate();
  
  // Set the target date (e.g., 2 days from now)
  const [targetDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000));
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimerBox = ({ value, label }) => (
    <div className="timer-box">
      <div className="timer-value">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="timer-label">{label}</div>
    </div>
  );

  return (
    <section className="offer-timer-section">
      <div className="container">
        <div className="offer-timer-card">
          <div className="offer-content">
            <span className="offer-badge">Limited Time Offer</span>
            <h2 className="offer-title">Deal of the Week</h2>
            <p className="offer-description">
              Get up to <span className="highlight-discount">50% OFF</span> on all premium organic vegetables and fruits. Freshly harvested, delivered directly to your doorstep.
            </p>
            <div className="timer-display">
              <TimerBox value={timeLeft.days} label="Days" />
              <div className="timer-separator">:</div>
              <TimerBox value={timeLeft.hours} label="Hours" />
              <div className="timer-separator">:</div>
              <TimerBox value={timeLeft.minutes} label="Mins" />
              <div className="timer-separator">:</div>
              <TimerBox value={timeLeft.seconds} label="Secs" />
            </div>
            <button className="btn btn-primary offer-btn" onClick={() => navigate('/shop')}>
              Shop the Deal Now
            </button>
          </div>
          <div className="offer-image-container">
            <div className="offer-image-blob"></div>
            <img 
              src="/special_deal.png" 
              alt="Special Grocery Deal" 
              className="offer-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferTimer;
