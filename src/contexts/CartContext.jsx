import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const toastTimerRef = React.useRef(null);

  const [cart, setCart] = useState(() => {
    try {
      const localData = localStorage.getItem('freshbasket_cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('freshbasket_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message) => {
    setToast({ id: Date.now(), message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product, customMessage = null, suppressToast = false) => {
    setCart((prev) => {
      const uniqueId = product.uniqueId || `${product.id}-${product.unit}`;
      const existingItem = prev.find(item => item.uniqueId === uniqueId);
      if (existingItem) {
        return prev.map(item => 
          item.uniqueId === uniqueId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, uniqueId }];
    });
    
    if (!suppressToast) {
      if (customMessage) {
        showToast(customMessage);
      } else {
        showToast(`${product.name} added to your cart!`);
      }
    }
  };

  const removeFromCart = (uniqueId) => {
    setCart((prev) => prev.filter(item => item.uniqueId !== uniqueId));
  };

  const updateQuantity = (uniqueId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(uniqueId);
      return;
    }
    setCart((prev) => prev.map(item => 
      item.uniqueId === uniqueId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.length;
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount, 
      cartTotal,
      toast,
      showToast
    }}>
      {children}
    </CartContext.Provider>
  );
};
