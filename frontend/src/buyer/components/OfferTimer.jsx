import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl w-[70px] sm:w-[85px] py-4 shadow-lg">
      <div className="text-[2rem] sm:text-[2.5rem] font-black text-white font-mono leading-none mb-1">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-[0.8rem] text-white/70 font-semibold uppercase tracking-wider">{label}</div>
    </div>
  );

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[32px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-10 md:gap-16 text-white relative shadow-2xl border border-white/5">
          <div className="flex-[1.2] z-[2]">
            <span className="inline-block bg-[rgba(85,183,70,0.15)] text-[#55b746] py-2 px-5 rounded-full font-bold text-[0.85rem] uppercase tracking-[1.5px] border border-[rgba(85,183,70,0.3)] mb-8 animate-[pulse_2s_infinite_ease-in-out]">Limited Time Offer</span>
            <h2 className="text-[2.5rem] md:text-[3.5rem] font-black leading-[1.1] mb-6 bg-gradient-to-r from-white to-[#55b746] bg-clip-text text-transparent inline-block">Deal of the Week</h2>
            <p className="text-[1.1rem] text-white/80 mb-10 max-w-[500px] leading-[1.6]">
              Get up to <span className="text-amber-400 font-extrabold text-[1.3rem] mx-1">50% OFF</span> on all premium organic vegetables and fruits. Freshly harvested, delivered directly to your doorstep.
            </p>
            <div className="flex items-center gap-2 sm:gap-4 mb-10">
              <TimerBox value={timeLeft.days} label="Days" />
              <div className="text-[2rem] font-bold text-white/30 pb-6">:</div>
              <TimerBox value={timeLeft.hours} label="Hours" />
              <div className="text-[2rem] font-bold text-white/30 pb-6">:</div>
              <TimerBox value={timeLeft.minutes} label="Mins" />
              <div className="text-[2rem] font-bold text-white/30 pb-6">:</div>
              <TimerBox value={timeLeft.seconds} label="Secs" />
            </div>
            <button className="bg-[#55b746] text-white hover:bg-[#459a37] hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(85,183,70,0.3)] transition-all py-4 px-8 text-[1.1rem] rounded-lg font-bold" onClick={() => navigate('/shop')}>
              Shop the Deal Now
            </button>
          </div>
          <div className="flex-1 relative flex justify-center w-full mt-10 md:mt-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(85,183,70,0.3)_0%,transparent_70%)] rounded-full z-[1]"></div>
            <img 
              src="/special_deal.png" 
              alt="Special Grocery Deal" 
              className="relative z-[2] w-full max-w-[400px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferTimer;
