import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag, FiCheckCircle, FiX, FiUser, FiMapPin, FiPhone, FiCreditCard } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const tax = cartTotal * 0.05; // 5% mock tax
  const shipping = cartTotal > 500 ? 0 : 40; // Free shipping over ₹500
  const finalTotal = cartTotal + tax + shipping;

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const processOrder = (e) => {
    e.preventDefault();
    setShowCheckoutModal(false);
    setShowSuccessModal(true);
  };

  const closeSuccessAndClear = () => {
    setShowSuccessModal(false);
    clearCart();
    navigate('/shop');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="empty-cart-content">
          <div className="empty-icon-wrapper">
            <FiShoppingBag className="empty-icon" />
          </div>
          <h2>Your Cart is Empty!</h2>
          <p>Looks like you haven't added any fresh groceries to your cart yet.</p>
          <button className="btn btn-primary shop-now-btn" onClick={() => navigate('/shop')}>
            Start Shopping <FiArrowRight className="btn-icon" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container cart-container">
        
        <div className="cart-main">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            <span className="cart-count-badge">{cartCount} Items</span>
          </div>

          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.uniqueId} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="item-details">
                  <span className="item-category">{item.category}</span>
                  <h3 className="item-name">{item.name}</h3>
                  <span className="item-unit">{item.unit}</span>
                </div>

                <div className="item-quantity-controls">
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="item-price-total">
                  <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>

                <button 
                  className="remove-btn" 
                  onClick={() => removeFromCart(item.uniqueId)}
                  title="Remove Item"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside className="cart-sidebar">
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span className="summary-val">₹{cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Estimated Tax (5%)</span>
              <span className="summary-val">₹{tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span className="summary-val">
                {shipping === 0 ? <strong className="free-shipping">FREE</strong> : `₹${shipping.toFixed(2)}`}
              </span>
            </div>
            
            {shipping > 0 && (
              <div className="shipping-notice">
                Add ₹{(500 - cartTotal).toFixed(2)} more for free shipping!
              </div>
            )}

            <div className="summary-divider"></div>
            
            <div className="summary-row total-row">
              <span>Total</span>
              <span className="total-val">₹{finalTotal.toFixed(2)}</span>
            </div>

            <button className="btn btn-primary checkout-btn" onClick={handleProceedToCheckout}>
              Proceed to Checkout <FiArrowRight className="btn-icon" />
            </button>
            
            <div className="secure-checkout">
              <FiLock className="secure-icon" /> 
              <span>Secure Encrypted Checkout</span>
            </div>
          </div>
        </aside>

      </div>

      {/* Checkout Information Modal Overlay */}
      {showCheckoutModal && (
        <div className="checkout-modal-overlay">
          <div className="checkout-info-modal">
            <button className="close-modal-btn" onClick={() => setShowCheckoutModal(false)}><FiX /></button>
            <div className="checkout-header-block">
              <h2>Secure Checkout</h2>
              <p>Please provide your shipping details to complete the order.</p>
            </div>
            
            <form className="checkout-form" onSubmit={processOrder}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <FiUser className="input-icon" />
                  <input type="text" required placeholder="Name" value={checkoutData.name} onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <FiPhone className="input-icon" />
                  <input type="tel" required placeholder="+91 9876543210" pattern="[0-9]{10,12}" value={checkoutData.phone} onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Shipping Address</label>
                <div className="input-with-icon">
                  <FiMapPin className="input-icon" />
                  <textarea required placeholder="Home/Apt/Street Details" rows="2" value={checkoutData.address} onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}></textarea>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" required placeholder="New Delhi" value={checkoutData.city} onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Pin Code</label>
                  <input type="text" required placeholder="110001" value={checkoutData.pincode} onChange={(e) => setCheckoutData({...checkoutData, pincode: e.target.value})} />
                </div>
              </div>

              {/* Mock Payment Integration */}
              <div className="payment-mock-badge">
                <FiCreditCard className="pay-icon" />
                <div className="pay-text">
                  <strong>Total: ₹{finalTotal.toFixed(2)}</strong>
                  <span>Pay on Delivery (Cash/UPI)</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary place-order-btn">
                Confirm & Place Order <FiArrowRight className="btn-icon" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="checkout-modal-overlay">
          <div className="checkout-modal">
            <div className="success-icon-wrapper">
              <FiCheckCircle className="success-icon animate-pop" />
            </div>
            <h2>Order Placed Successfully!</h2>
            <p className="order-confirm-text">Your order has been confirmed. Fresh groceries are heading your way!</p>
            
            <div className="receipt-box">
              <div className="receipt-row"><span>Order Number:</span> <strong>#FB-{Math.floor(100000 + Math.random() * 900000)}</strong></div>
              <div className="receipt-row"><span>Order Total:</span> <strong>₹{finalTotal.toFixed(2)}</strong></div>
            </div>

            <button className="btn btn-primary continue-btn" onClick={closeSuccessAndClear}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple lock icon for checkout security visually
const FiLock = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

export default Cart;
