import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const resp = await fetch('http://localhost:5000/api/categories');
      if (resp.ok) {
        const data = await resp.json();
        setDbCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('http://localhost:5000/api/products');
      if (resp.ok) {
        const data = await resp.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const categories = useMemo(() => {
    if (dbCategories.length > 0) {
      // Return only top-level categories for global navigation
      return dbCategories.filter(c => !c.parent_category_id);
    }
    const cats = new Set(products.map(p => String(p.category || 'General').trim()));
    return Array.from(cats).map(name => ({ id: name, name }));
  }, [dbCategories, products]);

  const addProduct = useCallback(async (product) => {
    try {
      const resp = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (resp.ok) {
        const newProd = await resp.json();
        setProducts(prev => [newProd, ...prev]);
        return { ok: true };
      }
      return { ok: false };
    } catch (err) {
      console.error(err);
      return { ok: false };
    }
  }, []);

  const updateProduct = useCallback(async (id, updatedData) => {
    try {
      const resp = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (resp.ok) {
        const updated = await resp.json();
        setProducts(prev => prev.map(p => String(p.id) === String(id) ? updated : p));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  const removeProduct = useCallback(async (id) => {
    try {
      const resp = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });
      if (resp.ok) {
        setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  const clearAllProducts = useCallback(() => {
    // This is less common in real DBs but we can filter local state for UI
    setProducts([]);
  }, []);

  const updateStock = useCallback(async (id, stock) => {
    try {
      const resp = await fetch(`http://localhost:5000/api/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      });
      if (resp.ok) {
        const updated = await resp.json();
        setProducts(prev => prev.map(p => String(p.id) === String(id) ? updated : p));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  const value = useMemo(() => ({
    products,
    categories,
    isLoading,
    addProduct,
    removeProduct,
    updateProduct,
    updateStock,
    clearAllProducts,
    refreshProducts: fetchProducts
  }), [products, categories, isLoading, addProduct, removeProduct, updateProduct, updateStock, clearAllProducts, fetchProducts]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider.');
  }
  return context;
};
