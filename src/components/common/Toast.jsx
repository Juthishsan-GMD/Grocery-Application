import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { FiCheckCircle } from 'react-icons/fi';

const Toast = () => {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none animate-[slideUpFade_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards] w-[90%] sm:w-auto pb-[env(safe-area-inset-bottom)]">
      <style>{`
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translate(-50%, 20px) scale(0.9); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
      `}</style>
      <div className="flex items-center justify-center sm:justify-start gap-4 bg-emerald-500/95 backdrop-blur-md p-3 pr-6 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.3)] text-white border border-white/20 mx-auto w-full">
        <div className="bg-white text-emerald-500 w-8 h-8 rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.1)] shrink-0">
          <FiCheckCircle className="text-[1.2rem]" />
        </div>
        <span className="text-[0.95rem] font-semibold tracking-[0.3px]">{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
