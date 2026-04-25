import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [toast, setToast] = useState(null);
  const toastTimerRef = React.useRef(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!currentUser) {
      // If not logged in, use local storage
      const localData = localStorage.getItem('freshbasket_cart');
      setCart(localData ? JSON.parse(localData) : []);
      return;
    }

    setLoading(true);
    try {
      const customerId = currentUser.customer_id || currentUser.id;
      const res = await fetch(`http://localhost:5000/api/cart/${customerId}`);
      if (res.ok) {
        const data = await res.json();
        // Map backend items to frontend structure
        const mappedItems = data.items.map(item => {
          const frontendId = item.variant_id ? `${item.product_id}-${item.variant_id}` : `${item.product_id}-${item.unit}`;
          return {
            ...item,
            id: item.product_id,
            uniqueId: item.cart_item_id, // Keep this for backend sync (CIT001)
            frontendId: frontendId,      // Use this for UI matching
            price: Number(item.cart_item_price),
            image: item.image,
            unit: item.unit,
            variant_id: item.variant_id
          };
        });
        setCart(mappedItems);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Sync local storage only if NOT logged in
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('freshbasket_cart', JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const showToast = (message) => {
    setToast({ id: Date.now(), message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  };

  const addToCart = async (product, customMessage = null, suppressToast = false) => {
    // Check available stock
    const availableStock = product.stock ?? product.stock_quantity ?? 999;
    
    if (!currentUser) {
      // Local storage logic for guests
      setCart((prev) => {
        const frontendId = product.variant_id ? `${product.id}-${product.variant_id}` : (product.uniqueId || `${product.id}-${product.unit}`);
        const existingItem = prev.find(item => item.frontendId === frontendId || item.uniqueId === frontendId);
        
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;
        if (currentQtyInCart + 1 > availableStock) {
          showToast(`Only ${availableStock} items available in stock!`);
          return prev;
        }

        if (existingItem) {
          return prev.map(item => 
            (item.frontendId === frontendId || item.uniqueId === frontendId) 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
        }
        return [...prev, { ...product, quantity: 1, frontendId, uniqueId: frontendId }];
      });
      if (cart.find(i => i.id === product.id)?.quantity + 1 <= availableStock) {
        showToast(customMessage || `${product.name} added to your cart!`);
      }
      return;
    }

    // Backend sync for logged in users
    try {
      const customerId = currentUser.customer_id || currentUser.id;
      
      // Basic check against local cart first to save a network request if obviously out of stock
      const inCart = cart.find(i => (i.product_id === product.id || i.id === product.id));
      if (inCart && inCart.quantity + 1 > availableStock) {
        showToast(`Only ${availableStock} items available in stock!`);
        return;
      }

      const res = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          productId: product.product_id || product.id,
          variantId: product.variant_id || null,
          quantity: 1,
          price: product.price
        })
      });

      if (res.ok) {
        await fetchCart(); // Refresh cart from server
        if (!suppressToast) {
          showToast(customMessage || `${product.name} added to your cart!`);
        }
      } else {
        const errData = await res.json();
        showToast(errData.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const removeFromCart = async (uniqueId) => {
    if (!currentUser) {
      setCart((prev) => prev.filter(item => item.uniqueId !== uniqueId));
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/cart/remove/${uniqueId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  const updateQuantity = async (uniqueId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(uniqueId);
      return;
    }

    // Find the item to check stock
    const item = cart.find(i => i.uniqueId === uniqueId);
    if (item) {
      const availableStock = item.stock ?? item.stock_quantity ?? 999;
      if (newQuantity > availableStock) {
        showToast(`Only ${availableStock} items available in stock!`);
        return;
      }
    }

    if (!currentUser) {
      setCart((prev) => prev.map(item => 
        item.uniqueId === uniqueId 
          ? { ...item, quantity: newQuantity } 
          : item
      ));
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId: uniqueId, quantity: newQuantity })
      });
      if (res.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  const clearCart = async () => {
    if (!currentUser) {
      setCart([]);
      return;
    }

    try {
      const customerId = currentUser.customer_id || currentUser.id;
      const res = await fetch(`http://localhost:5000/api/cart/clear/${customerId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCart([]);
      }
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading,
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
