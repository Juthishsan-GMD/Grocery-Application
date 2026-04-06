import { defaultProducts } from '../constants/data';

const STORAGE_KEY = "grocery_db_products";

export const getAllProducts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    // This is used by some admin dashboards for internal counts
    return stored ? JSON.parse(stored) : defaultProducts;
  } catch {
    return defaultProducts;
  }
};

export const saveProduct = (formData) => {
  const products = getAllProducts();
  const imageValue = formData.image
    || (Array.isArray(formData.images) && formData.images.length > 0 ? formData.images[0] : null)
    || "📦";
  
  const newProduct = {
    ...formData,
    id: `admin-${Date.now()}`,
    sold: Math.floor(Math.random() * 500),
    rating: (Math.random() * 2 + 3).toFixed(1),
    image: imageValue,
    price: Number(formData.price),
    mrp: Number(formData.mrp),
    stock: parseInt(formData.stock),
  };
  
  products.push(newProduct);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return newProduct;
};

export const deleteProduct = (id) => {
  const products = getAllProducts();
  const filtered = products.filter((p) => String(p.id) !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const updateProduct = (id, updatedData) => {
  const products = getAllProducts();
  const index = products.findIndex((p) => String(p.id) === String(id));
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }
};