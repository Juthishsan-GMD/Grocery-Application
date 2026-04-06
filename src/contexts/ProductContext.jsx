import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ProductContext = createContext();

const STORAGE_KEY = 'grocery_db_products';
const DELETED_KEY = 'grocery_db_deleted_ids';

// ── Pure helpers (synchronous, no React) ─────────────────────────────────────

const readProducts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readDeleted = () => {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

// Returns only non-deleted products from localStorage
const getVisibleProducts = () => {
  const stored = readProducts();
  const deletedStrs = readDeleted().map(id => String(id).trim());
  return stored.filter(p => !deletedStrs.includes(String(p.id).trim()));
};

// ── Provider ─────────────────────────────────────────────────────────────────

export const ProductProvider = ({ children }) => {
  // ✅ KEY FIX: lazy initializer reads localStorage on the VERY FIRST render
  // (not after useEffect, so Shop page sees products immediately)
  const [products, setProducts] = useState(() => getVisibleProducts());

  const syncFromStorage = useCallback(() => {
    setProducts(getVisibleProducts());
  }, []);

  // Keep in sync with any external writes (cross-tab, admin adds, seller adds)
  useEffect(() => {
    const handleUpdate = () => syncFromStorage();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('groceryProductsUpdated', handleUpdate);

    // Polling fallback (catches missed events)
    const interval = setInterval(syncFromStorage, 1500);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('groceryProductsUpdated', handleUpdate);
      clearInterval(interval);
    };
  }, [syncFromStorage]);

  // ── Derived: unique categories ────────────────────────────────────────────
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => String(p.category || 'General').trim()));
    return Array.from(cats);
  }, [products]);

  // ── addProduct ────────────────────────────────────────────────────────────
  const addProduct = useCallback(async (product) => {
    const current = readProducts();
    const isDuplicate = current.some(
      p => String(p.id).trim() === String(product.id).trim()
    );
    if (isDuplicate) return { ok: false, reason: 'duplicate' };

    // Compress base64 images before saving
    let image = product.image;
    if (image && image.startsWith('data:image')) {
      image = await compressImage(image);
    }

    const finalProduct = {
      ...product,
      id:     product.id || `prod-${Date.now()}`,
      image,
      images: product.images?.length > 0 ? product.images : [image],
    };

    try {
      const updated = [...current, finalProduct];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('groceryProductsUpdated'));
      syncFromStorage();
      return { ok: true };
    } catch {
      return { ok: false, reason: 'quota' };
    }
  }, [syncFromStorage]);

  // ── removeProduct ─────────────────────────────────────────────────────────
  const removeProduct = useCallback((id) => {
    const current  = readProducts();
    const deleted  = readDeleted();
    const updated  = current.filter(p => String(p.id).trim() !== String(id).trim());
    const newDel   = Array.from(new Set([...deleted, String(id).trim()]));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(DELETED_KEY, JSON.stringify(newDel));
    window.dispatchEvent(new Event('groceryProductsUpdated'));
    syncFromStorage();
  }, [syncFromStorage]);

  // ── updateProduct ─────────────────────────────────────────────────────────
  const updateProduct = useCallback((id, updatedData) => {
    const current = readProducts();
    const index   = current.findIndex(p => String(p.id).trim() === String(id).trim());
    if (index === -1) return false;

    current[index] = { ...current[index], ...updatedData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('groceryProductsUpdated'));
    syncFromStorage();
    return true;
  }, [syncFromStorage]);

  // ── clearAllProducts ──────────────────────────────────────────────────────
  const clearAllProducts = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DELETED_KEY);
    window.dispatchEvent(new Event('groceryProductsUpdated'));
    syncFromStorage();
  }, [syncFromStorage]);

  const value = useMemo(() => ({
    products,
    categories,
    isLoading: false,
    addProduct,
    removeProduct,
    updateProduct,
    clearAllProducts,
  }), [products, categories, addProduct, removeProduct, updateProduct, clearAllProducts]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider.');
  }
  return context;
};

// ── Image compression helper ──────────────────────────────────────────────────

function compressImage(base64, maxSize = 800, quality = 0.7) {
  return new Promise((resolve) => {
    if (!base64 || !base64.startsWith('data:image')) { resolve(base64); return; }
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width  = maxSize;
        } else {
          width  = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
}
