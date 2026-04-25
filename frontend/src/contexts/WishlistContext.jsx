import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!currentUser) {
      const saved = localStorage.getItem('freshbasket_wishlist');
      setWishlist(saved ? JSON.parse(saved) : []);
      return;
    }

    setLoading(true);
    try {
      const userId = currentUser.id || currentUser.customer_id;
      const res = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const mappedItems = data.items.map(item => {
          const images = Array.isArray(item.images) ? item.images : [];
          return {
            ...item,
            id: item.product_id,
            image: images.length > 0 ? images[0] : item.image,
            images: images,
            rating: Number(item.average_rating || 0).toFixed(1),
            reviewsCount: Number(item.reviews_count || 0),
            category: item.parent_category_name || item.category_name || "General",
            variants: (Array.isArray(item.variant_items) ? item.variant_items : []).map(v => ({
              ...v,
              unit: v.variant_value,
              stock: v.stock_quantity,
              mrp: v.mrp || v.price
            }))
          };
        });
        setWishlist(mappedItems);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Sync guest wishlist to local storage
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('freshbasket_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  const toggleWishlist = async (product) => {
    if (!currentUser) {
      setWishlist(prev => {
        const isExist = prev.some(item => item.id === product.id);
        if (isExist) {
          return prev.filter(item => item.id !== product.id);
        } else {
          return [...prev, product];
        }
      });
      return;
    }

    try {
      const userId = currentUser.id || currentUser.customer_id;
      const res = await fetch('http://localhost:5000/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: product.product_id || product.id
        })
      });

      if (res.ok) {
        await fetchWishlist();
      }
    } catch (err) {
      console.error("Toggle wishlist error:", err);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item.product_id || item.id) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
