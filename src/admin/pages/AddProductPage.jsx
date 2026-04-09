import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ArrowLeft, Upload, X, Plus, Image as ImageIcon, CheckCircle2, AlertCircle, ShoppingBasket } from "lucide-react";
import { useProducts } from "../../contexts/ProductContext";
import { useToast } from "../../hooks/use-toast";

const categoryOptions = ["Fresh Vegetables", "Fresh Fruits", "Dairy & Eggs", "Breads & Bakery", "Beverages", "Snacks"];

const subcategoryOptions = {
  "Fresh Vegetables": ["Root", "Leafy Greens", "Cruciferous", "Marrows"],
  "Fresh Fruits":     ["Citrus", "Berries", "Tropical", "Melons"],
  "Dairy & Eggs":     ["Milk", "Cheese", "Yogurt", "Eggs"],
  "Breads & Bakery":  ["Breads", "Pastries", "Cakes", "Cookies"],
  "Beverages":        ["Juices", "Tea", "Coffee", "Water", "Soft Drinks"],
  "Snacks":           ["Chips", "Nuts", "Chocolates", "Popcorn"],
};

const unitOptions = ["1 kg", "500 g", "250 g", "100 g", "1 pc", "1 Pack", "1 Liter", "500 ml", "1 Dozen"];

const selectClass = "flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200";

export default function AddProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { products, addProduct, updateProduct, clearAllProducts } = useProducts();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "", sku: "", seller: "FreshBasket", category: "Fresh Vegetables", subCategory: "", price: "", mrp: "", stock: "",
    description: "", unit: "1 kg", images: [], featured: false,
    variants: [{ unit: "1 kg", price: "", mrp: "", stock: "" }]
  });
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && products.length) {
      const existing = products.find(p => String(p.id) === String(id));
      if (existing) {
        setForm({
          name: existing.name || "",
          sku: existing.sku || "",
          seller: existing.seller || "FreshBasket",
          category: existing.category || "Fresh Vegetables",
          subCategory: existing.subCategory || "",
          price: existing.price || "",
          mrp: existing.mrp || "",
          stock: existing.stock || "",
          description: existing.description || "",
          unit: existing.unit || "1 kg",
          images: existing.images || (existing.image ? [existing.image] : []),
          featured: existing.featured || false,
          variants: existing.variants && existing.variants.length > 0 ? existing.variants : [{ unit: existing.unit || "1 kg", price: existing.price || "", mrp: existing.mrp || "", stock: existing.stock || "" }]
        });
      }
    }
  }, [id, products, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleVariantChange = (index, field, value) => {
    setForm(p => {
      const newVars = [...p.variants];
      newVars[index][field] = value;
      // Sync first variant with root fields for easy backwards compatibility
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
    handleChange(e);
    setForm((p) => ({ ...p, subCategory: "" }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((p) => ({ ...p, images: [...p.images, reader.result] }));
        if (errors.images) setErrors((p) => ({ ...p, images: "" }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== index) }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())                               errs.name        = "Product name is required";
    if (!form.subCategory)                               errs.subCategory = "Please select a subcategory";
    if (!form.price || Number(form.price) <= 0)          errs.price       = "Valid price required";
    if (!form.mrp   || Number(form.mrp)   <= 0)          errs.mrp         = "MRP is required";
    if (Number(form.price) > Number(form.mrp))           errs.price       = "Price cannot exceed MRP";
    if (!form.stock && form.stock !== "0")               errs.stock       = "Stock count required";
    if (form.images.length === 0)                        errs.images      = "Upload at least one product image";
    if (!form.description.trim())                        errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);

    const price    = Number(form.price);
    const mrp      = Number(form.mrp);
    const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const formattedVariants = form.variants.map((v, i) => ({
      unit: v.unit || (i === 0 ? form.unit : "1 pc"),
      price: Number(v.price) || price,
      mrp: Number(v.mrp) || mrp,
      stock: Number(v.stock) || 0
    }));

    const product = {
      sku:           form.sku.trim() || `GRO-${Date.now()}`,
      name:          form.name.trim(),
      seller:        form.seller.trim(),
      category:      form.category,
      subCategory:   form.subCategory,
      price,
      mrp,
      stock:         form.variants.reduce((acc, v) => acc + Number(v.stock || form.stock), 0),
      description:   form.description.trim(),
      image:         form.images[0],
      images:        form.images,
      discount,
      unit:          form.unit,
      variants:      formattedVariants,
      rating:        4.5,
      featured:      form.featured,
    };

    if (!isEditMode) {
      const result = await addProduct(product);
      setSubmitting(false);

      if (result.ok) {
        toast({ title: "✅ Product Live!", description: `${product.name} is now available in the store.` });
        navigate("/admin/products");
      } else {
        toast({ title: "Error", description: "Could not save to database. Check server connection.", variant: "destructive" });
      }
    } else {
      const result = await updateProduct(id, product);
      setSubmitting(false);
      if (result) {
        toast({ title: "✅ Product Updated!", description: `${product.name} has been successfully updated.` });
        navigate("/admin/products");
      } else {
        toast({ title: "Error", description: "Failed to update product in database.", variant: "destructive" });
      }
    }
  };

  const currentSubcategories = subcategoryOptions[form.category] || [];

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/products")} className="h-10 w-10 flex items-center justify-center hover:bg-secondary rounded-xl transition-colors border border-border shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{isEditMode ? "Edit Fresh Item" : "Add Fresh Item"}</h1>
            <p className="text-muted-foreground">{isEditMode ? "Update your grocery product details" : "List a new grocery product to the marketplace"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" onClick={() => navigate("/admin/products")}>Discard</Button>
           <Button onClick={handleSubmit} disabled={submitting} className="px-8 border border-primary/20">
             {submitting ? "Processing..." : (isEditMode ? "Update Product" : "Publish Product")}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Form Logic */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <ShoppingBasket className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Product Details</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Product Name *</label>
                <Input 
                  name="name" value={form.name} onChange={handleChange} 
                  placeholder="e.g. Organic Cavendish Bananas" 
                  className="h-12 rounded-xl"
                />
                {errors.name && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                   <label className="text-sm font-semibold mb-1.5 block">Category *</label>
                   <select name="category" value={form.category} onChange={handleCategoryChange} className={selectClass}>
                     {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
                <div>
                   <label className="text-sm font-semibold mb-1.5 block">Subcategory *</label>
                   <select name="subCategory" value={form.subCategory} onChange={handleChange} className={selectClass}>
                     <option value="">Select Option</option>
                     {currentSubcategories.map((s) => <option key={s} value={s}>{s}</option>)}
                   </select>
                   {errors.subCategory && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.subCategory}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1.5 block">Description *</label>
                <textarea
                  name="description" value={form.description} onChange={handleChange} rows={4}
                  placeholder="Tell customers about the freshness, farm source, and benefits..."
                  className="flex min-h-[120px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all transition-duration-200"
                />
                {errors.description && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Pricing & Logistics */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Images & Inventory</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold mb-3 block">Upload Product Images *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted group shadow-sm">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 w-7 h-7 bg-destructive/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 4 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary">Add Image</span>
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
                {errors.images && <p className="text-xs text-destructive mt-3 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.images}</p>}
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold block">Variants (Pricing & Stock) *</label>
                <Button type="button" variant="outline" size="sm" onClick={addVariant} className="h-8 text-xs px-2"><Plus className="w-4 h-4 mr-1"/> Add Variant</Button>
              </div>
              
              <div className="space-y-4">
                {form.variants.map((v, index) => (
                  <div key={index} className="p-4 border border-border rounded-xl bg-background/50 relative group">
                    {index > 0 && (
                      <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 right-2 text-destructive opacity-50 hover:opacity-100 bg-destructive/10 p-1 rounded-full">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <h4 className="text-xs font-bold mb-3 text-muted-foreground uppercase tracking-wider">Variant {index + 1} {index === 0 && "(Primary)"}</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs font-semibold mb-1 cursor-pointer block">Unit Weight</label>
                        <select value={v.unit} onChange={(e) => handleVariantChange(index, "unit", e.target.value)} className={selectClass} style={{ height: '40px' }}>
                          {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1 block">Sell Price (₹)</label>
                        <Input type="number" value={v.price} onChange={(e) => handleVariantChange(index, "price", e.target.value)} placeholder="99" className="h-10" />
                        {index === 0 && errors.price && <p className="text-[10px] text-destructive mt-1">{errors.price}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1 block">MRP (₹)</label>
                        <Input type="number" value={v.mrp} onChange={(e) => handleVariantChange(index, "mrp", e.target.value)} placeholder="120" className="h-10" />
                        {index === 0 && errors.mrp && <p className="text-[10px] text-destructive mt-1">{errors.mrp}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1 block">Stock Total</label>
                        <Input type="number" value={v.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} placeholder="100" className="h-10" />
                        {index === 0 && errors.stock && <p className="text-[10px] text-destructive mt-1">{errors.stock}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Preview & Options */}
        <div className="space-y-6">
          {/* Card Preview */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm sticky top-4">
            <div className="p-4 bg-secondary/50 border-b border-border">
              <h3 className="text-sm font-bold flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Store Preview</h3>
            </div>
            <div className="p-6 flex justify-center bg-dots">
              <div className="w-full max-w-[240px] bg-white rounded-2xl shadow-xl overflow-hidden border border-border transition-all hover:translate-y-[-5px]">
                <div className="relative aspect-[4/5] bg-secondary">
                  {form.images[0] ? (
                    <img src={form.images[0]} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-10 h-10 opacity-20" />
                    </div>
                  )}
                  {form.price && form.mrp && Number(form.mrp) > Number(form.price) && (
                    <div className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                      {Math.round(((form.mrp - form.price) / form.mrp) * 100)}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary">{form.category}</div>
                  <h4 className="font-bold text-sm truncate">{form.name || "Product Title"}</h4>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">₹{form.price || "0"}</span>
                    {form.mrp && <span className="text-[10px] text-muted-foreground line-through">₹{form.mrp}</span>}
                    <span className="text-[10px] text-muted-foreground">/ {form.unit}</span>
                  </div>
                  <button className="w-full h-9 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all">
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-border space-y-4">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-secondary transition-all cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                    className="w-5 h-5 rounded-md border-input text-primary focus:ring-primary cursor-pointer" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold group-hover:text-primary transition-colors">Featured Item</span>
                  <span className="text-[10px] text-muted-foreground">Show in recommended sections</span>
                </div>
                {form.featured && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
              </label>

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <div className="flex items-start gap-3">
                   <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                   <div>
                     <p className="text-xs font-bold text-primary mb-1">Visibility Status</p>
                     <p className="text-[10px] text-primary/60 leading-relaxed">Once published, this product will be immediately discoverable in the shop category.</p>
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