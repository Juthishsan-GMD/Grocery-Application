import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Plus, Package, Eye, Edit, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useProducts } from "../../contexts/ProductContext";
import { useState, useMemo } from "react";
import ProductViewModal from "../../components/common/ProductViewModal";

const CHART_COLORS = [
  '#10b981', // Emerald 500
  '#f59e0b', // Amber 500
  '#3b82f6', // Blue 500
  '#ef4444', // Red 500
  '#8b5cf6', // Violet 500
  '#ec4899', // Pink 500
  '#06b6d4', // Cyan 500
];

export default function ProductsPage() {
  const navigate = useNavigate();
  const { products: allProducts, removeProduct, updateProduct } = useProducts();

  // Derive category stock data dynamically
  const dynamicStockData = useMemo(() => {
    const categories = Array.from(new Set(allProducts.map(p => p.category || "General")));
    return categories.map(cat => {
      const catProducts = allProducts.filter(p => p.category === cat);
      const activeProducts = catProducts.filter(p => p.stock > 0);
      return {
        name: String(cat).split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        value: catProducts.length,
        active: activeProducts.length
      };
    });
  }, [allProducts]);

  const [viewProduct, setViewProduct] = useState(null);
  const products = allProducts;

  const getStatus = (product) => {
    if (product.stock === 0) return "Out of Stock";
    if (product.stock < 50) return "Low Stock";
    return "Active";
  };

  const filtered = products.map(p => ({ ...p, status: getStatus(p) }));

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      removeProduct(id);
    }
  };

  const handleView = (product) => {
    setViewProduct(product);
  };

  const handleEdit = (product) => {
    navigate(`/admin/products/edit/${product.id}`);
  };

  return (
    <>
      <ProductViewModal product={viewProduct} onClose={() => setViewProduct(null)} />
      <div className="space-y-6">
        <div className="page-header flex items-center justify-between">
          <div>
            <h1 className="page-title">Products</h1>
            <p className="page-subtitle">Manage product catalog, inventory, and listings</p>
          </div>
          <Button onClick={() => navigate("/admin/products/add")} className="bg-emerald-500 hover:bg-emerald-600 rounded-xl px-6 h-11"><Plus className="h-4 w-4 mr-2" />Add Product</Button>
        </div>

        {/* Products Table Section */}
        <div className="bg-card border border-border rounded-[24px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search fresh items..." className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" />
            </div>
            <div className="flex items-center gap-3">
               <Button variant="outline" className="h-11 rounded-xl px-4 border-slate-200"><Package className="w-4 h-4 mr-2" /> Export CSV</Button>
            </div>
          </div>
          
          <div className="overflow-x-auto bg-white dark:bg-slate-900">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[30%] text-left">Product Detail</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[15%] text-left">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[12%] text-right">Price</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[10%] text-right">Inventory</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[10%] text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[8%] text-center">Unit</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[15%] text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((p) => {
                   const status = getStatus(p);
                   return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                            {p.image && (p.image.startsWith("http") || p.image.startsWith("data:") || p.image.startsWith("/")) ? (
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl bg-emerald-50 text-emerald-600 font-bold">{p.name ? p.name[0] : "🍏"}</div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{p.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase tracking-wide">{p.sku || `GRO-${p.id.toString().slice(-4)}`}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-100 italic">₹{Number(p.price || 0).toFixed(2)}</span>
                          {p.mrp > p.price && <span className="text-[10px] text-slate-400 line-through">₹{p.mrp}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <span className={`font-bold text-sm ${p.stock < 10 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>{p.stock}</span>
                         <span className="text-[10px] text-slate-400 ml-1">left</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-tight ${
                           status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' :
                           status === 'Low Stock' ? 'bg-amber-500/10 text-amber-600' :
                           'bg-rose-500/10 text-rose-600'
                         }`}>
                           {status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="text-[11px] font-medium text-slate-500">{p.unit || '1 pc'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleView(p)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 transition-all font-bold" title="View"><Eye size={16} /></button>
                          <button onClick={() => handleEdit(p)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 transition-all font-bold" title="Edit"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(p.id)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all font-bold" title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Stock Pie Chart Section - Moved Below */}
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="chart-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10">
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Department Inventory Split</h3>
                <p className="text-sm text-slate-500 mt-1">Real-time product distribution across your categories</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-black text-emerald-500">{allProducts.length}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total SKU's</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
              <div className="h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dynamicStockData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      strokeWidth={0}
                      animationDuration={1500}
                      animationBegin={200}
                    >
                      {dynamicStockData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '20px', 
                        border: 'none', 
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.95)'
                      }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                 <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Legend & Statistics</div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {dynamicStockData.map((item, index) => (
                     <div key={item.name} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                       <div className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                       <div className="flex-1 min-w-0">
                         <div className="text-[13px] font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</div>
                         <div className="text-[10px] text-slate-500">{item.active} Active listings</div>
                       </div>
                       <div className="text-[14px] font-black text-slate-800 dark:text-slate-100">{item.value}</div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}