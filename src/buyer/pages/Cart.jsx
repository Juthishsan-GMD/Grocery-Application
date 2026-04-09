import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag, FiCheckCircle, FiX, FiUser, FiMapPin, FiPhone, FiCreditCard } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';

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

  const PLATFORM_FEE = 5.00;
  const [showBillDetails, setShowBillDetails] = useState(false);

  const tax = cartTotal * 0.05; // 5% mock tax
  const shipping = cartTotal > 500 ? 0 : 40; // Free shipping over ₹500
  const billTotal = tax + shipping + PLATFORM_FEE;
  const finalTotal = cartTotal + billTotal;

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
      <div className="pt-[120px] min-h-[80vh] bg-gray-50 pb-20 flex justify-center items-center px-4">
        <div className="text-center bg-white p-10 md:p-16 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] max-w-[500px] w-full">
          <div className="w-[100px] h-[100px] bg-[rgba(16,185,129,0.1)] rounded-full flex items-center justify-center mx-auto mb-8">
            <FiShoppingBag className="text-[3rem] text-[#10b981]" />
          </div>
          <h2 className="text-[2rem] font-extrabold text-gray-900 mb-4">Your Cart is Empty!</h2>
          <p className="text-gray-500 leading-[1.6] mb-10">Looks like you haven't added any fresh groceries to your cart yet.</p>
          <button className="bg-[#10b981] text-white hover:bg-[#059669] transition-all px-8 py-3 rounded-lg font-bold flex items-center justify-center mx-auto gap-2 group" onClick={() => navigate('/shop')}>
            Start Shopping <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[120px] min-h-[80vh] bg-gray-50 pb-20">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12 items-start">
        
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-200">
            <h1 className="text-[1.8rem] sm:text-[2.2rem] font-extrabold text-gray-900">Shopping Cart</h1>
            <span className="bg-[rgba(16,185,129,0.15)] text-[#10b981] px-4 py-1.5 rounded-full font-bold text-[1rem]">{cartCount} Items</span>
          </div>

          <div className="flex flex-col gap-6">
            {cart.map((item) => (
              <div key={item.uniqueId} className="flex flex-wrap lg:flex-nowrap items-center bg-white p-6 rounded-[20px] shadow-sm gap-6 transition-all duration-300 border border-transparent hover:shadow-md hover:border-[rgba(16,185,129,0.2)] relative">
                <div className="w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-[150px]">
                  <span className="text-[0.8rem] text-gray-500 uppercase tracking-[0.5px] font-semibold mb-1 block">{item.category}</span>
                  <h3 className="text-[1.15rem] font-bold text-gray-900 mb-1">{item.name}</h3>
                  <span className="text-[0.9rem] text-gray-500">{item.unit}</span>
                </div>

                <div className="flex items-center bg-gray-100 rounded-full p-1">
                  <button 
                    className="w-8 h-8 rounded-full border-none bg-white text-gray-900 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_2px_5px_rgba(0,0,0,0.05)] hover:bg-[#10b981] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-transparent disabled:hover:text-gray-900" 
                    onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="font-bold w-10 text-center text-gray-900">{item.quantity}</span>
                  <button 
                    className="w-8 h-8 rounded-full border-none bg-white text-gray-900 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_2px_5px_rgba(0,0,0,0.05)] hover:bg-[#10b981] hover:text-white" 
                    onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="w-full lg:w-[120px] text-left lg:text-right mt-4 lg:mt-0">
                  <span className="text-[1.25rem] font-extrabold text-[#10b981]">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>

                <button 
                  className="absolute top-[-10px] right-[-10px] lg:static lg:w-10 lg:h-10 w-8 h-8 rounded-full border border-red-100 bg-red-50 text-red-500 flex items-center justify-center cursor-pointer transition-all duration-300 shrink-0 hover:bg-red-500 hover:text-white hover:rotate-12 shadow-sm" 
                  onClick={() => removeFromCart(item.uniqueId)}
                  title="Remove Item"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside className="w-full lg:w-[380px] lg:sticky lg:top-[120px]">
          <div className="bg-white rounded-[20px] p-8 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-[rgba(16,185,129,0.1)]">
            <h3 className="text-[1.4rem] font-extrabold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">Order Summary</h3>
            
            <div className="flex justify-between mb-[1.2rem] text-[1rem] text-gray-500 font-medium">
              <span>Item Subtotal</span>
              <span className="text-gray-900 font-semibold">₹{cartTotal.toFixed(2)}</span>
            </div>

            <div className={`my-4 overflow-hidden transition-all duration-300 rounded-2xl border ${showBillDetails ? 'bg-white border-[#10b981] shadow-[0_4px_15px_rgba(16,185,129,0.08)]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="p-4 flex justify-between items-center cursor-pointer text-[0.95rem] font-bold text-gray-900 select-none" onClick={() => setShowBillDetails(!showBillDetails)}>
                <span>Extra Charges & Taxes</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-[#10b981] font-extrabold">+₹{billTotal.toFixed(2)}</span>
                  <FiPlus className={`text-[1.1rem] text-gray-500 transition-transform duration-300 ${showBillDetails ? 'rotate-45 text-[#10b981]' : ''}`} />
                </div>
              </div>

              {showBillDetails && (
                <div className="px-4 pb-4 flex flex-col gap-3 border-t border-slate-100 pt-4 animate-fade-in">
                  <div className="flex justify-between text-[0.85rem] text-gray-500 font-medium">
                    <span>Estimated GST (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[0.85rem] text-gray-500 font-medium">
                    <span>Delivery Fee</span>
                    <span>{shipping === 0 ? <strong className="text-[#10b981] font-bold">FREE</strong> : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-[0.85rem] text-gray-500 font-medium">
                    <span>Platform Fee</span>
                    <span>₹{PLATFORM_FEE.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="h-[2px] bg-gray-200 my-6 rounded-sm"></div>
            
            <div className="flex justify-between mb-8 text-[1.3rem] text-gray-900 font-extrabold">
              <span>Total</span>
              <span className="text-[#10b981] text-[1.6rem]">₹{finalTotal.toFixed(2)}</span>
            </div>

            <button className="w-full p-[1.2rem] text-[1.1rem] rounded-xl flex justify-center items-center gap-3 shadow-[0_8px_20px_rgba(16,185,129,0.3)] bg-[#10b981] text-white font-bold hover:-translate-y-1 transition-all group" onClick={handleProceedToCheckout}>
              Proceed to Checkout <FiArrowRight className="transition-transform group-hover:translate-x-2" />
            </button>
            
            <div className="flex items-center justify-center gap-2 text-gray-500 text-[0.85rem] mt-6 font-medium">
              <FiLock className="text-[#10b981] text-lg" /> 
              <span>Secure Encrypted Checkout</span>
            </div>
          </div>
        </aside>

      </div>

      {/* Checkout Information Modal Overlay */}
      {showCheckoutModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm flex items-center justify-center z-[9999] animate-fade-in p-4">
          <div className="bg-white w-full max-w-[600px] rounded-[24px] p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
            <button className="absolute top-6 right-6 bg-transparent border-none text-[1.6rem] text-slate-400 cursor-pointer transition-all hover:text-red-500 hover:scale-110 hover:rotate-90" onClick={() => setShowCheckoutModal(false)}><FiX /></button>
            <div className="text-center mb-8">
              <h2 className="text-[2rem] font-extrabold text-gray-900 mb-2">Secure Checkout</h2>
              <p className="text-gray-500 text-[1rem]">Please provide your shipping details to complete the order.</p>
            </div>
            
            <form className="flex flex-col gap-5" onSubmit={processOrder}>
              <div className="flex flex-col gap-2 text-left">
                <label className="text-[0.9rem] font-bold text-gray-900">Full Name</label>
                <div className="relative flex items-center group/input">
                  <FiUser className="absolute left-4 text-slate-400 text-[1.2rem] transition-colors group-focus-within/input:text-[#10b981]" />
                  <input type="text" required placeholder="Name" value={checkoutData.name} onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})} className="w-full py-4 pr-4 pl-12 border border-gray-200 rounded-xl font-medium text-[0.95rem] transition-all bg-slate-50 outline-none focus:border-[#10b981] focus:bg-white focus:ring-4 focus:ring-[#10b981]/10 text-gray-900" />
                </div>
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="text-[0.9rem] font-bold text-gray-900">Phone Number</label>
                <div className="relative flex items-center group/input">
                  <FiPhone className="absolute left-4 text-slate-400 text-[1.2rem] transition-colors group-focus-within/input:text-[#10b981]" />
                  <input type="tel" required placeholder="+91 9876543210" pattern="[0-9]{10,12}" value={checkoutData.phone} onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})} className="w-full py-4 pr-4 pl-12 border border-gray-200 rounded-xl font-medium text-[0.95rem] transition-all bg-slate-50 outline-none focus:border-[#10b981] focus:bg-white focus:ring-4 focus:ring-[#10b981]/10 text-gray-900" />
                </div>
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="text-[0.9rem] font-bold text-gray-900">Shipping Address</label>
                <div className="relative flex flex-col group/input">
                  <FiMapPin className="absolute top-4 left-4 text-slate-400 text-[1.2rem] transition-colors group-focus-within/input:text-[#10b981]" />
                  <textarea required placeholder="Home/Apt/Street Details" rows="2" value={checkoutData.address} onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})} className="w-full py-4 pr-4 pl-12 border border-gray-200 rounded-xl font-medium text-[0.95rem] transition-all bg-slate-50 outline-none focus:border-[#10b981] focus:bg-white focus:ring-4 focus:ring-[#10b981]/10 text-gray-900 resize-none"></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[0.9rem] font-bold text-gray-900">City</label>
                  <input type="text" required placeholder="New Delhi" value={checkoutData.city} onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})} className="w-full py-4 px-4 border border-gray-200 rounded-xl font-medium text-[0.95rem] transition-all bg-slate-50 outline-none focus:border-[#10b981] focus:bg-white focus:ring-4 focus:ring-[#10b981]/10 text-gray-900" />
                </div>
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[0.9rem] font-bold text-gray-900">Pin Code</label>
                  <input type="text" required placeholder="110001" value={checkoutData.pincode} onChange={(e) => setCheckoutData({...checkoutData, pincode: e.target.value})} className="w-full py-4 px-4 border border-gray-200 rounded-xl font-medium text-[0.95rem] transition-all bg-slate-50 outline-none focus:border-[#10b981] focus:bg-white focus:ring-4 focus:ring-[#10b981]/10 text-gray-900" />
                </div>
              </div>

              {/* Mock Payment Integration */}
              <div className="flex items-center gap-5 bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] p-5 rounded-xl mt-4 text-left">
                <FiCreditCard className="text-[2.2rem] text-[#10b981]" />
                <div className="flex flex-col">
                  <strong className="text-[1.2rem] text-gray-900">Total: ₹{finalTotal.toFixed(2)}</strong>
                  <span className="text-[0.85rem] text-[#10b981] font-semibold">Pay on Delivery (Cash/UPI)</span>
                </div>
              </div>

              <button type="submit" className="w-full py-4 px-6 text-[1.15rem] font-bold mt-3 border-none flex justify-center items-center gap-3 shadow-[0_10px_25px_rgba(16,185,129,0.25)] bg-[#10b981] text-white rounded-xl transition-all hover:bg-[#059669] hover:-translate-y-0.5 group">
                Confirm & Place Order <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm flex items-center justify-center z-[9999] animate-fade-in p-4">
          <div className="bg-white w-full max-w-[450px] rounded-[24px] p-10 px-8 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <div className="w-[80px] h-[80px] bg-[rgba(16,185,129,0.1)] text-[#10b981] rounded-full flex items-center justify-center mx-auto mb-6 text-[2.5rem]">
              <FiCheckCircle className="animate-[scalePop_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_0.2s_both]" />
            </div>
            <h2 className="text-[1.8rem] font-extrabold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-500 line-clamp-2 leading-[1.5] mb-8">Your order has been confirmed. Fresh groceries are heading your way!</p>
            
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 mb-8 text-left">
              <div className="flex justify-between mb-2 text-[0.95rem]">
                <span className="text-gray-500">Order Number:</span> <strong className="text-gray-900">#FB-{Math.floor(100000 + Math.random() * 900000)}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-2 text-[0.95rem]">
                <span className="text-gray-500">Order Total:</span> <strong className="text-gray-900">₹{finalTotal.toFixed(2)}</strong>
              </div>
            </div>

            <button className="w-full py-4 text-[1.1rem] font-bold rounded-xl bg-[#10b981] text-white transition-colors hover:bg-[#059669]" onClick={closeSuccessAndClear}>
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
