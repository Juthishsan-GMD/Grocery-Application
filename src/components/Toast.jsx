import React from 'react';
import { useCart } from '../context/CartContext';
import { FiCheckCircle } from 'react-icons/fi';
import '../styles/Toast.css';

const Toast = () => {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="toast-container animate-toast">
      <div className="toast-content glassmorphism-toast">
        <div className="toast-icon-wrapper">
          <FiCheckCircle className="toast-check-icon" />
        </div>
        <span className="toast-message">{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
