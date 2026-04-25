import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { 
  ArrowLeft, Upload, X, Plus, Image as ImageIcon, CheckCircle2, 
  AlertCircle, ShoppingBag, Package, Eye
} from "lucide-react";
import { useProducts } from "../../contexts/ProductContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../hooks/use-toast";

const UNIT_OPTIONS = ["1 kg", "500 g", "250 g", "100 g", "1 pc", "1 Pack", "1 Liter", "500 ml", "1 Dozen"];

const selectClass = "flex h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all duration-200 text-slate-800 dark:text-slate-200";

export default function AddProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { products, addProduct, updateProduct, refreshProducts } = useProducts();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "Fresh Vegetables",
    subCategory: "",
    price: "",
    mrp: "",
    stock: "",
    description: "",
    unit: "1 kg",
    images: [],
    featured: false,
    status: "active",
    variants: [{ unit: "1 kg", price: "", mrp: "", stock: "" }],
    is_active: true,
    categoryId: "",
    seller: "FreshBasket",
    newCategory: "",
    newCategoryImage: "",
    newSubCategory: "",
    newSubCategoryImage: "",
    showNewCategory: false,
    showNewSubCategory: false,
    brand: "",
    weight: "",
    height: "",
    breadth: "",
    length: ""
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.filter(c => !c.parent_category_id));
        
        // Handle subcategories if category is already selected (for edit mode)
        if (form.category) {
          const parent = data.find(c => c.name.toLowerCase() === form.category.toLowerCase());
          if (parent) {
            setSubCategories(data.filter(c => c.parent_category_id === parent.category_id));
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, [form.category]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (isEditMode && products.length) {
      const existing = products.find(p => String(p.id) === String(id));
      if (existing) {
        setForm(p => ({
          ...p,
          name: existing.name || "",
          sku: existing.sku || "",
          seller: existing.seller || "FreshBasket",
          category: existing.category || "Fresh Vegetables",
          subCategory: existing.subCategory || "",
          price: existing.price || "",
          mrp: existing.mrp || existing.price || "",
          stock: existing.stock || "",
          description: existing.description || "",
          unit: existing.unit || "1 kg",
          images: existing.images || (existing.image ? [existing.image] : []),
          featured: existing.featured || false,
          variants: (existing.variants && existing.variants.length > 0) 
            ? existing.variants.map(v => ({
                unit: v.unit || v.variant_value || "1 kg",
                price: v.price || existing.price || "",
                mrp: v.mrp || v.price || existing.mrp || existing.price || "",
                stock: v.stock || v.stock_quantity || ""
              })) 
            : [{ unit: existing.unit || "1 kg", price: existing.price || "", mrp: existing.mrp || existing.price || "", stock: existing.stock || "" }],
          brand: existing.brand || "",
          weight: existing.weight || "",
          length: existing.length || "",
          breadth: existing.breadth || "",
          height: existing.height || "",
          is_active: existing.is_active ?? true,
          categoryId: existing.categoryId || existing.category_id || ""
        }));
      }
    }
  }, [id, products, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const handleVariantChange = (index, field, value) => {
    setForm(p => {
      const newVars = [...p.variants];
      newVars[index][field] = value;
      if (index === 0) {
        return { ...p, variants: newVars, [field]: value };
      }
      return { ...p, variants: newVars };
    });
    if (errors[field]) setErrors(p => ({ ...p, [field]: "" }));
  };

  const addVariant = () => {
    setForm(p => ({ ...p, variants: [...p.variants, { unit: "500 g", price: "", mrp: "", stock: "50" }] }));
  };

  const removeVariant = (index) => {
    if (form.variants.length > 1) {
      setForm(p => ({ ...p, variants: p.variants.filter((_, i) => i !== index) }));
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "ADD_NEW") {
      setForm(p => ({ ...p, showNewCategory: true, category: "" }));
    } else {
      const parent = categories.find(c => c.name === value);
      setForm(p => ({ 
        ...p, 
        category: value, 
        categoryId: parent ? parent.category_id : "",
        subCategory: "", 
        showNewCategory: false 
      }));
      if (parent) {
        fetch('http://localhost:5000/api/categories')
          .then(res => res.json())
          .then(data => {
            setSubCategories(data.filter(c => c.parent_category_id === parent.category_id));
          });
      }
    }
  };

  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "ADD_NEW") {
      setForm(p => ({ ...p, showNewSubCategory: true, subCategory: "" }));
    } else {
      const sub = subCategories.find(s => s.name === value);
      setForm(p => ({ 
        ...p, 
        subCategory: value, 
        categoryId: sub ? sub.category_id : p.categoryId,
        showNewSubCategory: false 
      }));
    }
  };

  const createNewCategory = async (isSub = false) => {
    const name = isSub ? form.newSubCategory : form.newCategory;
    const img = isSub ? form.newSubCategoryImage : form.newCategoryImage;
    if (!name.trim()) return;

    let parentId = null;
    if (isSub) {
      const parentName = form.category.toLowerCase().trim();
      const parent = categories.find(c => c.name.toLowerCase().trim() === parentName);
      if (!parent) {
         toast({ variant: "destructive", title: "Wait", description: "Select a parent category first." });
         return;
      }
      parentId = parent.category_id;
    }

    setIsCreatingCategory(true);
    try {
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parent_category_id: parentId, image_url: img })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchCategories();
        if (isSub) {
          setForm(p => ({ 
            ...p, 
            subCategory: data.name, 
            categoryId: data.category_id, 
            showNewSubCategory: false, 
            newSubCategory: "",
            newSubCategoryImage: ""
          }));
          toast({ title: "Subcategory Added", description: `"${data.name}" added successfully.` });
        } else {
          setForm(p => ({ 
            ...p, 
            category: data.name, 
            categoryId: data.category_id,
            showNewCategory: false, 
            newCategory: "", 
            newCategoryImage: "",
            subCategory: "" 
          }));
          toast({ title: "Category Added", description: `"${data.name}" added successfully.` });
        }
      } else {
        toast({ variant: "destructive", title: "Action Failed", description: data.message || "Failed to create category." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save category." });
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(p => ({ ...p, images: [...(p.images || []), reader.result] }));
        if (errors.images) setErrors(p => ({ ...p, images: "" }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== index) }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.subCategory) errs.subCategory = "Please select a subcategory";
    if (!form.price || Number(form.price) <= 0) errs.price = "Valid price required";
    if (!form.stock && form.stock !== "0") errs.stock = "Stock count required";
    if (form.images.length === 0) errs.images = "Upload at least one product image";
    if (!form.description.trim()) errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    
    const formattedVariants = form.variants.map((v, i) => ({
      unit: v.unit || (i === 0 ? form.unit : "1 pc"),
      price: Number(v.price) || Number(form.price) || 0,
      mrp: Number(v.mrp) || Number(form.mrp) || Number((v.price) || form.price) || 0,
      stock: Number(v.stock) || 0
    }));

    const finalProduct = {
      ...form,
      category: form.category,
      categoryId: form.categoryId,
      subCategory: form.subCategory,
      price: Number(form.price),
      mrp: Number(form.mrp || form.price),
      stock: form.variants.reduce((acc, v) => acc + Number(v.stock || form.stock), 0),
      variants: formattedVariants,
      image: form.images[0],
      rating: 4.5,
      seller: form.seller || "FreshBasket",
      brand: form.brand,
      weight: Number(form.weight) || 0,
      length: Number(form.length) || 0,
      breadth: Number(form.breadth) || 0,
      height: Number(form.height) || 0,
      is_active: form.is_active,
      adminId: currentUser?.id
    };

    try {
      let result;
      if (isEditMode) {
        result = await updateProduct(id, finalProduct);
        if (result) {
           toast({ title: "Product Updated", description: `${finalProduct.name} has been updated.` });
           navigate("/admin/products");
        }
      } else {
        result = await addProduct(finalProduct);
        if (result?.ok) {
          setSuccessData({ 
            name: finalProduct.name, 
            category: finalProduct.category,
            image: finalProduct.image
          });
          toast({ title: "Product Added", description: `${finalProduct.name} is now live.` });
        }
      }
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Error", description: "Failed to save product." });
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="max-w-[1200px] mx-auto pb-10 px-4">
      {/* Page Header */}
      <div className="flex flex-col gap-5 mb-8 w-full mt-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/admin/products")} 
              className="h-10 w-10 flex items-center justify-center bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-slate-800 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-[24px] font-bold text-slate-800 dark:text-slate-100 m-0">
                {isEditMode ? "Edit Fresh Item" : "Add Fresh Item"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-[14px] m-0 mt-1">
                List a new grocery product to the marketplace
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" onClick={() => navigate("/admin/products")} className="rounded-xl border-slate-200 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Discard</Button>
             <Button 
               onClick={handleSubmit} 
               disabled={submitting} 
               className="px-8 h-11 rounded-xl bg-emerald-500 text-white font-semibold border-none hover:bg-emerald-600 shadow-sm"
             >
               {submitting ? "Processing..." : (isEditMode ? "Update Product" : "Publish Product")}
             </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-3 md:items-start">
          
          {/* Left Column: Form Details */}
          <div className="flex flex-col gap-6 md:col-span-2">
            
            {/* General Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <ShoppingBag size={20} className="text-emerald-500" />
                <h3 className="font-bold text-[18px] m-0 text-slate-800 dark:text-slate-100">Product Details</h3>
              </div>
              
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[14px] font-semibold mb-2 block text-slate-800 dark:text-slate-200">Product Name *</label>
                    <Input 
                      name="name" value={form.name} onChange={handleChange} 
                      placeholder="e.g. Organic Cavendish Bananas" 
                      className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus-visible:ring-emerald-500/20"
                    />
                    {errors.name && <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-[14px] font-semibold mb-2 block text-slate-800 dark:text-slate-200">SKU Code (Stock Keeping Unit)</label>
                    <Input 
                      name="sku" value={form.sku} onChange={handleChange} 
                      placeholder="e.g. FRSH-ORG-BAN-001" 
                      className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus-visible:ring-emerald-500/20 font-mono text-[13px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   <div className="flex flex-col gap-2">
                     <label className="text-[14px] font-semibold mb-1 block text-slate-800 dark:text-slate-200">Category *</label>
                     {!form.showNewCategory ? (
                       <select name="category" value={form.category} onChange={handleCategoryChange} className={selectClass}>
                         <option value="">Select Category</option>
                         {categories.map((c) => <option key={c.category_id} value={c.name}>{c.name}</option>)}
                         <option value="ADD_NEW" className="text-emerald-600 font-bold">+ Add New Category</option>
                       </select>
                     ) : (
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2 items-center">
                            <Input 
                              placeholder="Category Name" value={form.newCategory} 
                              onChange={e => setForm(p => ({ ...p, newCategory: e.target.value }))}
                              className="h-11 rounded-xl bg-slate-50 border-emerald-500/50 flex-1"
                            />
                            <Button variant="outline" onClick={() => setForm(p => ({ ...p, showNewCategory: false }))} className="h-11 w-11 p-0 rounded-xl shrink-0 border-slate-200"><X size={18} className="text-slate-400" /></Button>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="relative h-12 w-12 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 group">
                               {form.newCategoryImage ? <img src={form.newCategoryImage} className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-slate-300" />}
                               <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                 const f = e.target.files[0];
                                 if (f) {
                                   const r = new FileReader();
                                   r.onloadend = () => setForm(p => ({ ...p, newCategoryImage: r.result }));
                                   r.readAsDataURL(f);
                                 }
                               }} />
                             </div>
                             <div className="flex-1">
                                <Button type="button" onClick={() => createNewCategory(false)} disabled={isCreatingCategory || !form.newCategory.trim() || !form.newCategoryImage} className="h-8 w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg shadow-sm">
                                  {isCreatingCategory ? "Saving..." : "Save Category"}
                                </Button>
                             </div>
                          </div>
                        </div>
                     )}
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-[14px] font-semibold mb-1 block text-slate-800 dark:text-slate-200">Subcategory *</label>
                     {!form.showNewSubCategory ? (
                       <select name="subCategory" value={form.subCategory} onChange={handleSubCategoryChange} className={selectClass} disabled={!form.category}>
                         <option value="">Select Option</option>
                         {subCategories.map((s) => <option key={s.category_id} value={s.name}>{s.name}</option>)}
                         {form.category && <option value="ADD_NEW" className="text-emerald-600 font-bold">+ Add New Subcategory</option>}
                       </select>
                     ) : (
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2 items-center">
                            <Input 
                              placeholder="Subcategory Name" value={form.newSubCategory} 
                              onChange={e => setForm(p => ({ ...p, newSubCategory: e.target.value }))}
                              className="h-11 rounded-xl bg-slate-50 border-emerald-500/50 flex-1"
                            />
                            <Button variant="outline" onClick={() => setForm(p => ({ ...p, showNewSubCategory: false }))} className="h-11 w-11 p-0 rounded-xl shrink-0 border-slate-200"><X size={18} className="text-slate-400" /></Button>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="relative h-12 w-12 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 group">
                               {form.newSubCategoryImage ? <img src={form.newSubCategoryImage} className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-slate-300" />}
                               <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                 const f = e.target.files[0];
                                 if (f) {
                                   const r = new FileReader();
                                   r.onloadend = () => setForm(p => ({ ...p, newSubCategoryImage: r.result }));
                                   r.readAsDataURL(f);
                                 }
                               }} />
                             </div>
                             <div className="flex-1">
                                <Button type="button" onClick={() => createNewCategory(true)} disabled={isCreatingCategory || !form.newSubCategory.trim() || !form.newSubCategoryImage} className="h-8 w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg shadow-sm">
                                  {isCreatingCategory ? "Saving..." : "Save Subcategory"}
                                </Button>
                             </div>
                          </div>
                        </div>
                     )}
                     {errors.subCategory && <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.subCategory}</p>}
                   </div>
                </div>

                <div>
                  <label className="text-[14px] font-semibold mb-2 block text-slate-800 dark:text-slate-200">Description *</label>
                  <Textarea
                    name="description" value={form.description} onChange={handleChange} rows={6}
                    placeholder="Tell customers about the freshness, farm source, and benefits..."
                    className="rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 min-h-[150px] focus-visible:ring-emerald-500/20"
                  />
                  {errors.description && <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Specifications & Dimensions */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Package size={20} className="text-emerald-500" />
                <h3 className="font-bold text-[18px] m-0 text-slate-800 dark:text-slate-100">Specifications & Dimensions</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[14px] font-semibold mb-2 block text-slate-800 dark:text-slate-200">Brand Name</label>
                  <Input 
                    name="brand" value={form.brand} onChange={handleChange} 
                    placeholder="e.g. Organic Farms™" 
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus-visible:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-semibold mb-2 block text-slate-800 dark:text-slate-200">Weight (kg/unit)</label>
                  <Input 
                    name="weight" type="number" value={form.weight} onChange={handleChange} 
                    placeholder="0.5" 
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus-visible:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                <div>
                  <label className="text-[12px] font-bold text-slate-500 mb-1.5 uppercase block">Length (cm)</label>
                  <Input name="length" type="number" value={form.length} onChange={handleChange} placeholder="0" className="h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-500 mb-1.5 uppercase block">Breadth (cm)</label>
                  <Input name="breadth" type="number" value={form.breadth} onChange={handleChange} placeholder="0" className="h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-500 mb-1.5 uppercase block">Height (cm)</label>
                  <Input name="height" type="number" value={form.height} onChange={handleChange} placeholder="0" className="h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>
              </div>
            </div>

            {/* Images & Inventory */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <ImageIcon size={20} className="text-emerald-500" />
                <h3 className="font-bold text-[18px] m-0 text-slate-800 dark:text-slate-100">Images & Inventory</h3>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-[14px] font-semibold mb-3 block text-slate-800 dark:text-slate-200">Upload Product Images *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 group">
                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {form.images.length < 4 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer transition-colors bg-transparent hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                          <Upload size={20} className="text-slate-400" />
                        </div>
                        <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">Add Image</span>
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                  {errors.images && <p className="text-[12px] text-red-500 mt-3 flex items-center gap-1"><AlertCircle size={12} /> {errors.images}</p>}
                </div>

                <div className="h-[1px] bg-slate-100 dark:bg-slate-800" />

                <div className="flex items-center justify-between">
                  <label className="text-[14px] font-semibold block text-slate-800 dark:text-slate-200">Variants (Pricing & Stock) *</label>
                  <Button type="button" variant="outline" size="sm" onClick={addVariant} className="h-8 text-[12px] px-3 rounded-lg text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800"><Plus size={14} className="mr-1"/> Add Variant</Button>
                </div>

                <div className="flex flex-col gap-4">
                  {form.variants.map((v, index) => (
                    <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 relative">
                      {index > 0 && (
                        <button type="button" onClick={() => removeVariant(index)} className="absolute top-3 right-3 bg-red-500/10 text-red-500 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-red-500/20 transition-colors">
                          <X size={14} />
                        </button>
                      )}
                      <h4 className="text-[12px] font-bold mb-3 text-slate-500 dark:text-slate-400 uppercase tracking-widest">Variant {index + 1} {index === 0 && "(Primary)"}</h4>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[12px] font-semibold mb-2 block text-slate-700 dark:text-slate-300">Unit Weight</label>
                          <select value={v.unit} onChange={(e) => handleVariantChange(index, "unit", e.target.value)} className={`${selectClass} h-10 rounded-lg`}>
                            {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[12px] font-semibold mb-2 block text-slate-700 dark:text-slate-300">Sell Price (₹)</label>
                          <Input type="number" value={v.price} onChange={(e) => handleVariantChange(index, "price", e.target.value)} placeholder="99" className="h-10 rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                          {index === 0 && errors.price && <p className="text-[10px] text-red-500 mt-1">{errors.price}</p>}
                        </div>
                        <div>
                          <label className="text-[12px] font-semibold mb-2 block text-slate-700 dark:text-slate-300">MRP (₹)</label>
                          <Input type="number" value={v.mrp} onChange={(e) => handleVariantChange(index, "mrp", e.target.value)} placeholder="120" className="h-10 rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                        </div>
                        <div>
                          <label className="text-[12px] font-semibold mb-2 block text-slate-700 dark:text-slate-300">Stock Total</label>
                          <Input type="number" value={v.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} placeholder="100" className="h-10 rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                          {index === 0 && errors.stock && <p className="text-[10px] text-red-500 mt-1">{errors.stock}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="flex flex-col gap-6 sticky top-6 md:col-span-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-[14px] font-bold flex items-center gap-2 m-0 text-slate-800 dark:text-slate-100">
                  <span className="text-emerald-500"><ImageIcon size={16} /></span> Store Preview
                </h3>
              </div>
              
              <div className="p-6 flex justify-center bg-slate-50 dark:bg-slate-900/50">
                <div className="w-full max-w-[240px] bg-white dark:bg-[#313131] rounded-[20px] shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700 transition-all duration-300">
                  <div className="relative aspect-[4/5] bg-slate-100 dark:bg-[#404040] flex items-center justify-center">
                    {form.images[0] ? (
                      <img src={form.images[0]} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={40} className="text-slate-300 dark:text-slate-600 opacity-50" />
                    )}
                    {form.price && form.mrp && Number(form.mrp) > Number(form.price) && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                        {Math.round(((form.mrp - form.price) / form.mrp) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">{form.category || "CATEGORY"}</div>
                    <h4 className="font-bold text-[14px] m-0 truncate text-slate-800 dark:text-slate-100">{form.name || "Product Title"}</h4>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[18px] text-slate-800 dark:text-slate-100">₹{form.price || "0"}</span>
                      {form.mrp && <span className="text-[11px] text-slate-400 line-through">₹{form.mrp}</span>}
                      <span className="text-[11px] text-slate-500">/ {form.unit}</span>
                    </div>
                    <Button className="w-full h-9 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold text-[12px] border-none mt-1">
                      Add To Cart
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Featured Item</span>
                    <span className="text-[11px] text-slate-500">Show in recommended sections</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] w-full max-w-[420px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="relative h-32 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center overflow-hidden">
               <div className="bg-white dark:bg-slate-900 p-4 rounded-full shadow-lg relative z-10 animate-bounce-slow">
                 <CheckCircle2 className="text-emerald-500" size={48} strokeWidth={3} />
               </div>
            </div>
            <div className="p-8 pt-6 flex flex-col items-center text-center">
               <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 m-0 mb-2">Success!</h2>
               <p className="text-[15px] text-slate-500 dark:text-slate-400 m-0 mb-6">
                 <span className="font-bold">"{successData.name}"</span> is now live in the <span className="text-emerald-500 font-semibold">{successData.category}</span> catalog.
               </p>
               {successData.image && (
                 <div className="w-24 h-24 rounded-2xl border overflow-hidden mb-6 shadow-md shadow-emerald-500/10">
                   <img src={successData.image} alt="Product" className="w-full h-full object-cover" />
                 </div>
               )}
               <Button onClick={() => navigate("/admin/products")} className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold">
                 Back to Inventory
               </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}