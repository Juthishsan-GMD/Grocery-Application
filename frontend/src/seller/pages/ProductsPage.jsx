import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, Filter, Plus, Eye, Edit2, Trash2, TrendingUp, TrendingDown, 
  AlertCircle, ArrowLeft, Upload, ImageIcon, CheckCircle2, ShoppingBag, X, Package
} from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";
import ProductViewModal from "../../components/common/ProductViewModal";
import { PageHeader, Skeleton, BackButton } from '../components/sharedComponents';
import { SELLER, CATEGORIES as CATEGORY_OPTIONS, fmt, fmtShort, avatarBg, isImg } from '../components/shared';

// const SUBCATEGORY_OPTIONS = { ... } // Removed unused variable

const UNIT_OPTIONS = ["1 kg", "500 g", "250 g", "100 g", "1 pc", "1 Pack", "1 Liter", "500 ml", "1 Dozen"];

const selectClass = "flex h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all duration-200 text-slate-800 dark:text-slate-200";

const EmptyState = ({ icon: Icon, title, sub }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
    <Icon size={40} className="text-slate-300 dark:text-slate-600 mb-4" />
    <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</div>
    <div className="text-[13px] text-slate-500 dark:text-slate-400">{sub}</div>
  </div>
);

function ProductEditor({ editProduct, onSave, onCancel, dark }) {
  const [form, setForm] = useState({
    name: editProduct?.name || "",
    sku: editProduct?.sku || "",
    category: editProduct?.category ? editProduct.category.trim() : "",
    subCategory: editProduct?.subCategory || editProduct?.subcategory || "",
    price: editProduct?.price || "",
    mrp: editProduct?.mrp || editProduct?.price || "",
    stock: editProduct?.stock || "",
    description: editProduct?.description || "",
    unit: editProduct?.unit || "1 kg",
    images: editProduct?.images || (editProduct?.image ? [editProduct.image] : []),
    featured: editProduct?.featured || false,
    status: editProduct?.status || "active",
    variants: (editProduct?.variants && editProduct.variants.length > 0) 
      ? editProduct.variants.map(v => ({
          unit: v.unit || v.variant_value || "1 kg",
          price: v.price || editProduct.price || "",
          mrp: v.mrp || v.price || editProduct.mrp || editProduct.price || "",
          stock: v.stock || v.stock_quantity || ""
        }))
      : [{ unit: editProduct?.unit || "1 kg", price: editProduct?.price || "", mrp: editProduct?.mrp || editProduct?.price || "", stock: editProduct?.stock || "" }],
    is_active: editProduct?.is_active ?? true,
    categoryId: editProduct?.categoryId || editProduct?.category_id || "",
    newCategory: "",
    newCategoryImage: "",
    newSubCategory: "",
    newSubCategoryImage: "",
    showNewCategory: false,
    showNewSubCategory: false,
    brand: editProduct?.brand || "",
    weight: editProduct?.weight || "",
    height: editProduct?.height || "",
    breadth: editProduct?.breadth || "",
    length: editProduct?.length || ""
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const { toast } = useToast();



  const fetchCategories = React.useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      if (res.ok) {
        const data = await res.json();
        const mainCats = data.filter(c => !c.parent_category_id);
        setCategories(mainCats);
        
        // If we have a category selected, find its subcategories
        if (form.category) {
          const parent = mainCats.find(c => c.name.toLowerCase().trim() === form.category.toLowerCase().trim());
          if (parent) {
            // Update form with standard case from DB so select dropdown matches
            if (parent.name !== form.category) {
              setForm(p => ({ ...p, category: parent.name, categoryId: parent.category_id }));
            }
            setSubCategories(data.filter(c => c.parent_category_id === parent.category_id));
          } else {
            setSubCategories([]);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, [form.category]);
 
   React.useEffect(() => {
     fetchCategories();
   }, [fetchCategories]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const createNewCategory = async (isSub = false) => {
    const name = isSub ? form.newSubCategory : form.newCategory;
    const img = isSub ? form.newSubCategoryImage : form.newCategoryImage;
    if (!name.trim()) return;

    let parentId = null;
    if (isSub) {
      const parent = categories.find(c => c.name.toLowerCase().trim() === form.category.toLowerCase().trim());
      if (!parent) return;
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
          setForm(p => ({ ...p, subCategory: data.name, categoryId: data.category_id, showNewSubCategory: false, newSubCategory: "", newSubCategoryImage: "" }));
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
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create category." });
    } finally {
      setIsCreatingCategory(false);
    }
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
      setForm(p => ({ ...p, showNewCategory: true }));
    } else {
      const parent = categories.find(c => c.name === value);
      setForm(p => ({ 
        ...p, 
        category: value, 
        categoryId: parent?.category_id || "", 
        subCategory: "", 
        showNewCategory: false 
      }));
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

  const handlePublish = async () => {
    if (!validate()) return;
    setSubmitting(true);
    
    const formattedVariants = form.variants.map((v, i) => ({
      unit: v.unit || (i === 0 ? form.unit : "1 pc"),
      price: Number(v.price) || Number(form.price) || 0,
      mrp: Number(v.mrp) || Number(form.mrp) || Number((v.price) || form.price) || 0,
      stock: Number(v.stock) || 0
    }));

    const finalProduct = {
      ...form,
      id: editProduct?.id || `seller-${Date.now()}`,
      category: form.category.trim(),
      subCategory: (form.subCategory || "").trim(),
      price: Number(form.price),
      mrp: Number(form.mrp || form.price),
      stock: form.variants.reduce((acc, v) => acc + Number(v.stock || form.stock), 0),
      variants: formattedVariants,
      image: form.images[0],
      isNew: !editProduct,
      rating: editProduct?.rating || 4.5,
      seller: SELLER.storeName,
      brand: form.brand,
      weight: Number(form.weight) || 0,
      length: Number(form.length) || 0,
      breadth: Number(form.breadth) || 0,
      height: Number(form.height) || 0,
      is_active: form.is_active
    };

    await onSave(finalProduct);
    setSubmitting(false);
  };



  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="flex flex-col gap-5 mb-8 w-full">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onCancel} 
              className="h-10 w-10 flex items-center justify-center bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-slate-800 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-[24px] font-bold text-slate-800 dark:text-slate-100 m-0">
                {editProduct ? "Edit Fresh Item" : "Add Fresh Item"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-[14px] m-0 mt-1">
                List a new grocery product to the marketplace
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" onClick={onCancel} className="rounded-xl border-slate-200 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Discard</Button>
             <Button 
               onClick={handlePublish} 
               disabled={submitting} 
               className="px-8 h-11 rounded-xl bg-emerald-500 text-white font-semibold border-none hover:bg-emerald-600 shadow-sm"
             >
               {submitting ? "Processing..." : "Publish Product"}
             </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-3 md:items-start">
          
          {/* Left Column: Form Details */}
          <div className="flex flex-col gap-6 md:col-span-2">
            
            {/* General Information Card */}
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
                            <Button variant="outline" onClick={() => setForm(p => ({ ...p, showNewCategory: false }))} className="h-11 w-11 p-0 rounded-xl shrink-0"><X size={18} /></Button>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="relative h-12 w-12 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer group">
                               {form.newCategoryImage ? <img src={form.newCategoryImage || form.newSubCategoryImage} alt="Category" className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-slate-300" />}
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
                                <Button type="button" onClick={() => createNewCategory(false)} disabled={!form.newCategory.trim() || !form.newCategoryImage} className="h-8 w-full bg-emerald-500 text-white text-xs rounded-lg shadow-sm">Save Category</Button>
                             </div>
                          </div>
                        </div>
                     )}
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-[14px] font-semibold mb-1 block text-slate-800 dark:text-slate-200">Subcategory *</label>
                     {!form.showNewSubCategory ? (
                       <select name="subCategory" value={form.subCategory} onChange={(e) => {
                         const v = e.target.value;
                         if (v === "ADD_NEW") {
                           setForm(p => ({ ...p, showNewSubCategory: true }));
                         } else {
                           const sub = subCategories.find(s => s.name === v);
                           setForm(p => ({ ...p, subCategory: v, categoryId: sub?.category_id || p.categoryId }));
                         }
                       }} className={selectClass} disabled={!form.category}>
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
                            <Button variant="outline" onClick={() => setForm(p => ({ ...p, showNewSubCategory: false }))} className="h-11 w-11 p-0 rounded-xl shrink-0"><X size={18} /></Button>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="relative h-12 w-12 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer group">
                               {form.newSubCategoryImage ? <img src={form.newSubCategoryImage} alt="Subcategory" className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-slate-300" />}
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
                                <Button type="button" onClick={() => createNewCategory(true)} disabled={!form.newSubCategory.trim() || !form.newSubCategoryImage} className="h-8 w-full bg-emerald-500 text-white text-xs rounded-lg shadow-sm">Save Subcategory</Button>
                             </div>
                          </div>
                        </div>
                     )}
                     {errors.subCategory && <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.subCategory}</p>}
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

            {/* Specifications & Dimensions Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
               
               <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Package size={20} className="text-emerald-500" />
                <h3 className="font-bold text-[18px] m-0 text-slate-800 dark:text-slate-100">Specifications & Dimensions</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[14px] font-semibold mb-2 block text-slate-800 dark:text-slate-200">Brand Name</label>
                  <Input 
                    name="brand" value={form.brand} onChange={handleChange} 
                    placeholder="e.g. FreshFarm Organics" 
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" 
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

            {/* Images & Inventory Card */}
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

          {/* Right Column: Sidebar Preview */}
          <div className="flex flex-col gap-6 sticky top-6 md:col-span-1">
            
            {/* Live Preview Card */}
            {/* Live Preview Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-[14px] font-bold flex items-center gap-2 m-0 text-slate-800 dark:text-slate-100">
                  <span className="text-emerald-500"><ImageIcon size={16} /></span> Store Preview
                </h3>
              </div>
              
              <div className="aspect-[3/4] p-4 flex items-center justify-center bg-transparent">
                <div className="w-full bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-none">
                  <div className="aspect-square rounded-xl bg-slate-50 dark:bg-slate-900 mb-6 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800">
                    {form.images[0] ? (
                      <img src={form.images[0]} alt="Product Preview" className="w-full h-full object-cover animate-in zoom-in-95 duration-300" />
                    ) : (
                      <ImageIcon size={48} className="text-slate-200 dark:text-slate-700" />
                    )}
                  </div>
                  <div className="px-1 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2 block">{form.category || "CATEGORY"}</span>
                    <h4 className="text-[16px] font-bold text-slate-800 dark:text-slate-100 mb-1 truncate">{form.name || "Product Name"}</h4>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[18px] font-black text-slate-900 dark:text-slate-100 font-mono">₹{form.price || "0"}</span>
                      {form.mrp && Number(form.mrp) > Number(form.price) && (
                         <span className="text-[12px] text-slate-400 line-through font-mono">₹{form.mrp}</span>
                      )}
                      <span className="text-[11px] text-slate-500">/ {form.unit}</span>
                    </div>
                    <Button disabled className="w-full h-10 rounded-xl bg-emerald-500/10 text-emerald-600 border-none font-bold text-[12px] opacity-100">Add To Cart</Button>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex flex-col gap-4">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:border-emerald-500/50 transition-colors">
                  <input 
                    type="checkbox" 
                    name="featured" 
                    checked={form.featured} 
                    onChange={handleChange}
                    className="w-[18px] h-[18px] rounded text-emerald-500 focus:ring-emerald-500 cursor-pointer border-slate-300"
                  />
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Featured Item</span>
                    <span className="text-[11px] text-slate-500">Show in recommended sections</span>
                  </div>
                  {form.featured && <CheckCircle2 size={16} className="text-emerald-500 ml-auto" />}
                </label>

                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/10">
                  <div className="flex items-start gap-3">
                     <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                     <div>
                       <p className="text-[12px] font-bold text-emerald-600 dark:text-emerald-500 m-0 mb-1">Visibility Status</p>
                       <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500/80 m-0 leading-relaxed">Once published, this product will be immediately discoverable in the shop category.</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage({ products, setProducts, dark, loading, orders = [], hookAddProduct, removeProduct, updateProduct }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search || "");
  const viewMode = searchParams.get("view");

  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editorView, setEditorView] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [view, setView] = useState("table");
  const [successData, setSuccessData] = useState(null);
  const { toast } = useToast();

  const availableCategories = useMemo(() => CATEGORY_OPTIONS, []);
  const filterCategories = ["All", ...availableCategories];

  const safeProducts = products || [];
  const safeOrders = orders || [];
  
  const filtered = safeProducts.filter(p => {
    if (!p) return false;
    const pCat = (p.category || "").toLowerCase().trim();
    const selCat = catFilter.toLowerCase().trim();
    const matchesCat = selCat === "all" || pCat === selCat;
    const matchesSearch = (p.name || "").toLowerCase().includes((search || "").toLowerCase());
    return matchesCat && matchesSearch;
  });

  const topProducts = [...safeProducts].sort((a, b) => (b?.sold || 0) - (a?.sold || 0)).slice(0, 5);
  const leastSoldProducts = [...safeProducts].sort((a, b) => (a?.sold || 0) - (b?.sold || 0)).slice(0, 5);

  const cancelledProducts = (() => {
    try {
      if (!safeOrders || !Array.isArray(safeOrders) || safeOrders.length === 0) return [];
      const cancelCountMap = {};
      safeOrders.forEach(order => {
        if (order?.status === "cancelled") {
          (order?.items || []).forEach(item => {
            if (item?.productId) cancelCountMap[item.productId] = (cancelCountMap[item.productId] || 0) + (item?.quantity || 0);
          });
        }
      });
      return safeProducts
        .filter(p => cancelCountMap[p.id] > 0 || p.status === "cancelled")
        .map(p => ({ ...p, cancelledCount: cancelCountMap[p.id] || 0 }))
        .sort((a, b) => (b?.cancelledCount || 0) - (a?.cancelledCount || 0))
        .slice(0, 5);
    } catch {
      return [];
    }
  })();

  const enhancedCancelledProducts = useMemo(() => {
    return cancelledProducts || [];
  }, [cancelledProducts]);

  const [cancelledProductsData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cancelledProductsData")) || enhancedCancelledProducts;
    } catch {
      return enhancedCancelledProducts;
    }
  });

  const openAdd = () => { setEditProduct(null); setEditorView(true); };
  const openEdit = (p) => { if (!p) return; setEditProduct(p); setEditorView(true); };
  const deleteProduct = (id) => { if (id) removeProduct(id); };
  
  const saveProduct = async (productData) => {
    try {
      if (editProduct) {
        const success = await updateProduct(editProduct.id, productData);
        toast({ title: success ? "Product Updated" : "Update Failed", description: success ? "Your changes have been saved." : "Could not save changes.", variant: success ? "default" : "destructive" });
      } else {
        const result = await hookAddProduct(productData);
        if (result?.ok) {
           setSuccessData({
             name: productData.name,
             category: productData.category,
             image: productData.image
           });
           toast({ title: "Product Published", description: "Your new product is live." });
        } else {
           toast({ title: "Publish Failed", description: "Could not save the new product.", variant: "destructive" });
        }
      }
      setEditorView(false);
      setEditProduct(null);
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong while saving.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-5 w-full">
        <div className="flex items-center justify-between">
          <PageHeader title="Products" subtitle="Loading products..." />
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#d4af37] text-white rounded-lg text-[13px] font-semibold opacity-60 cursor-not-allowed"><Plus size={15} /> Add Product</button>
        </div>
        <Skeleton w="100%" h={300} r={16} />
      </div>
    );
  }

  // --- Views for Most/Least Sold ---
  const renderListCard = (title, subtitle, icon, data, highlightColorClass, valueColorClass) => (
    <div className="flex flex-col gap-5">
      <BackButton />
      <PageHeader title={title} subtitle={subtitle} />
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          {icon}
          <div className="font-bold text-[16px] text-slate-800 dark:text-slate-100">{title}</div>
        </div>
        <div className="flex flex-col gap-3">
          {data.length > 0 ? data.map((p, i) => (
            <div key={p?.id || i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold ${i === 0 ? "bg-emerald-500 text-white" : i === 1 ? "bg-[#d4af37] text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`}>
                {i + 1}
              </span>
              <div className={`w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center text-[14px] font-bold ${isImg(p.imageData || p.image) ? "bg-transparent" : avatarBg(p?.name || "P") + " text-white"}`}>
                {isImg(p.imageData || p.image) ? <img src={p.imageData || p.image} alt={p.name} className="w-full h-full object-cover" /> : (p?.name ? p.name[0] : "P")}
              </div>
              <div className="flex-1 overflow-hidden min-w-0">
                <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate">{p?.name || "Product"}</div>
                <div className="text-[11px] text-slate-500">{p?.sold || 0} sold</div>
              </div>
              <div className={`text-[13px] font-bold ${valueColorClass}`}>{fmtShort(p?.price || 0)}</div>
            </div>
          )) : <div className="text-center py-10 text-slate-500">No data available</div>}
        </div>
        {data.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div className="text-[12px] text-slate-500">Total sold</div>
            <div className={`text-[16px] font-bold ${valueColorClass}`}>{data.reduce((sum, p) => sum + (p?.sold || 0), 0)}</div>
          </div>
        )}
      </div>
    </div>
  );

  if (viewMode === "most") return renderListCard("Top Products", "Your best-selling products by units sold", <TrendingUp size={18} className="text-emerald-500" />, topProducts, "text-white", "text-emerald-500");
  if (viewMode === "least") return renderListCard("Least Sold Products", "Your lowest-performing products by units sold", <TrendingDown size={18} className="text-red-500" />, leastSoldProducts, "text-slate-500", "text-red-500");

  // --- View for Cancelled ---
  if (viewMode === "cancelled") {
    return (
      <div className="flex flex-col gap-5">
        <BackButton />
        <PageHeader title="Cancelled Products" subtitle="Products with the highest cancellation rate" />
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <AlertCircle size={18} className="text-amber-500" />
            <div className="font-bold text-[16px] text-slate-800 dark:text-slate-100">Cancelled Products Data</div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full border-collapse text-left whitespace-nowrap min-w-[700px]">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 text-[12px] font-semibold text-slate-500 dark:text-slate-400">Product Name</th>
                  <th className="p-3.5 text-[12px] font-semibold text-slate-500 dark:text-slate-400">Admin Approval</th>
                  <th className="p-3.5 text-[12px] font-semibold text-slate-500 dark:text-slate-400">Tracking ID</th>
                  <th className="p-3.5 text-[12px] font-semibold text-slate-500 dark:text-slate-400">Shiprocket Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                {cancelledProductsData.length > 0 ? cancelledProductsData.map((p, i) => (
                  <tr key={`cancel-${p.id || i}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-3.5 text-[13px] font-medium text-slate-800 dark:text-slate-200">{p.productName || p.name || "Product"}</td>
                    <td className="p-3.5">
                      <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${p.adminApproval === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : p.adminApproval === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'}`}>
                        {p.adminApproval || "Pending"}
                      </span>
                    </td>
                    <td className="p-3.5 text-[12px] font-mono text-slate-500">{p.trackingId || "—"}</td>
                    <td className="p-3.5">
                      <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${p.shiprocketStatus === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : p.shiprocketStatus === 'In Transit' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : p.shiprocketStatus === 'Returned' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {p.shiprocketStatus || "Not Shipped"}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center p-12">
                       <div className="text-3xl mb-3">✅</div>
                       <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 mb-1">No cancelled products</div>
                       <div className="text-[13px] text-slate-500">All your orders are going through smoothly</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Products View ---
  return (
    <div className="flex flex-col gap-5 w-full relative">
      {viewProduct && <ProductViewModal product={viewProduct} onClose={() => setViewProduct(null)} />}
      
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
               <Button onClick={() => setSuccessData(null)} className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold">
                 Back to Inventory
               </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader title="Products" subtitle={`${safeProducts.length} products in your store`} />
        <button onClick={openAdd} className="bg-gradient-to-r from-[#d4af37] to-[#aa8421] text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-1.5 border-none cursor-pointer">
          <Plus size={15} /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
            <Search size={16} className="text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="bg-transparent border-none outline-none w-full text-[13px] text-slate-800 dark:text-slate-200" />
          </div>
          <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
            {filterCategories.map(c => (
              <button 
                key={c} onClick={() => setCatFilter(c)} 
                className={`whitespace-nowrap px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-all border ${catFilter === c ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <button onClick={() => setView(v => v === "table" ? "grid" : "table")} className="h-[42px] w-[42px] flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No products found" sub="Try adjusting your search or filters" />
      ) : view === "table" ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px] text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
              <tr>
                {["Product", "SKU", "Category", "Price", "Stock", "Sold", "Actions"].map(h => (
                  <th key={h} className="p-4 text-[12px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filtered.map((p, i) => p && (
                <tr key={`row-${p.id || i}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-[12px] font-bold ${isImg(p.imageData || p.image) ? 'bg-transparent' : avatarBg(p.name || 'P') + ' text-white'}`}>
                        {isImg(p.imageData || p.image) ? <img src={p.imageData || p.image} alt={p.name} className="w-full h-full object-cover" /> : (p.name ? p.name[0] : "P")}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 truncate">{p.name || "Product"}</div>
                        {p.description && <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{p.description}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[12px] text-slate-500 font-mono">{p.sku || "—"}</td>
                  <td className="p-4 text-[12px]">
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-medium">{p.category || "General"}</span>
                  </td>
                  <td className="p-4 text-[13px] font-bold text-slate-800 dark:text-slate-200">{fmt(p.price || 0)}</td>
                  <td className={`p-4 text-[13px] font-medium ${(p.stock || 0) < 5 ? "text-red-500" : "text-slate-600 dark:text-slate-400"}`}>{p.stock || 0}</td>
                  <td className="p-4 text-[13px] text-slate-600 dark:text-slate-400">{p.sold || 0}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <button onClick={() => setViewProduct(p)} className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors cursor-pointer border-none"><Eye size={14} /></button>
                       <button onClick={() => openEdit(p)} className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors cursor-pointer border-none"><Edit2 size={14} /></button>
                       <button onClick={() => deleteProduct(p.id)} className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer border-none"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p, i) => p && (
            <div key={`grid-${p.id || i}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col hover:-translate-y-1 transition-transform group">
              <div className={`w-full h-[180px] rounded-xl overflow-hidden mb-4 flex items-center justify-center text-[48px] font-bold ${isImg(p.imageData || p.image) ? 'bg-slate-100 dark:bg-slate-800' : avatarBg(p.name || 'P') + ' text-white'}`}>
                 {isImg(p.imageData || p.image) ? <img src={p.imageData || p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : (p.name ? p.name[0] : "P")}
              </div>
              <div className="flex-1 flex flex-col">
                 <div className="text-[15px] font-bold mb-1 text-slate-800 dark:text-slate-100">{p.name || "Product"}</div>
                 {p.sku && <div className="text-[11px] text-slate-500 mb-2 font-mono">SKU: {p.sku}</div>}
                 {p.description && <div className="text-[12px] text-slate-500 mb-3 line-clamp-2 leading-relaxed">{p.description}</div>}
                 <div className="text-[12px] text-slate-500 font-medium mt-auto mb-2">{p.category || "General"} · <span className={(p.stock || 0) < 5 ? 'text-red-500 font-bold' : ''}>Stock: {p.stock || 0}</span></div>
                 <div className="text-[18px] font-black text-emerald-500 mb-4">{fmt(p.price || 0)}</div>
                 <div className="flex gap-2">
                   <button onClick={() => setViewProduct(p)} className="flex-1 py-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 font-semibold text-[13px] rounded-xl transition-colors border-none cursor-pointer"><Eye size={14} className="mx-auto" /></button>
                   <button onClick={() => openEdit(p)} className="flex-1 py-2 bg-gradient-to-r from-[#d4af37] to-[#aa8421] text-white hover:shadow-md hover:brightness-110 font-semibold text-[13px] rounded-xl transition-all border-none cursor-pointer"><Edit2 size={13} className="mx-auto" /></button>
                   <button onClick={() => deleteProduct(p.id)} className="flex-1 py-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 font-semibold text-[13px] rounded-xl transition-colors border-none cursor-pointer"><Trash2 size={14} className="mx-auto" /></button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editorView && (
        <div className="fixed inset-0 w-full h-full bg-white dark:bg-[#0f172a] z-[100] overflow-y-auto pt-8 px-4 sm:px-8 shadow-2xl">
          <ProductEditor editProduct={editProduct} onSave={saveProduct} onCancel={() => setEditorView(false)} dark={dark} />
        </div>
      )}
    </div>
  );
}
