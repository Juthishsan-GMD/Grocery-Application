import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiArrowUp } from 'react-icons/fi';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // 1. Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  // 2. Handle visibility of the floating button on scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      {isVisible && (
        <button 
          onClick={scrollToTop} 
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-[45px] h-[45px] md:w-[50px] md:h-[50px] rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 text-white border-none shadow-[0_10px_20px_rgba(5,150,105,0.3)] flex items-center justify-center text-[1.2rem] md:text-[1.5rem] cursor-pointer z-[2000] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards] hover:-translate-y-2 hover:scale-110 hover:shadow-[0_15px_30px_rgba(5,150,105,0.4)] outline-none" 
          aria-label="Scroll to top"
        >
          <FiArrowUp />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
