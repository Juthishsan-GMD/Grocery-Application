// ProductsPage – managed via ProductContext
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Plus, Package, Star, Eye, Edit, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useProducts } from "../../contexts/ProductContext";

const categoryStock = [
  { name: "Vegetables", products: 120, active: 110, color: '#10b981' },
  { name: "Fruits", products: 85, active: 80, color: '#fbbf24' },
  { name: "Dairy", products: 45, active: 42, color: '#3b82f6' },
  { name: "Bakery", products: 30, active: 28, color: '#d97706' },
  { name: "Beverages", products: 60, active: 55, color: '#ef4444' },
  { name: "Snacks", products: 50, active: 48, color: '#a855f7' },
];

const statusStyle = {
  Active: "badge-success", "Low Stock": "badge-warning", "Out of Stock": "badge-danger", Inactive: "badge-neutral",
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const { products: allProducts, removeProduct, updateProduct } = useProducts();
  
  // No need for local state, use context directly
  const products = allProducts;

  // Determine status based on stock
  const getStatus = (product) => {
    if (product.stock === 0) return "Out of Stock";
    if (product.stock < 50) return "Low Stock";
    return "Active";
  };

  // Format products
  const filtered = products.map(p => ({ ...p, status: getStatus(p) }));

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      removeProduct(id);
    }
  };

  const handleView = (product) => {
    alert(`Viewing: ${product.name}\n\nCategory: ${product.category}\nSeller: ${product.seller}\nPrice: ${product.price}\nStock: ${product.stock}\n\n${product.description}`);
  };

  const handleEdit = (product) => {
    const newName = prompt("Edit product name:", product.name);
    if (newName && newName !== product.name) {
      const newPrice = Number(prompt("Edit price:", product.price));
      const newStock = Number(prompt("Edit stock:", product.stock.toString()));
      if (!isNaN(newPrice) && !isNaN(newStock)) {
        updateProduct(product.id, { name: newName, price: newPrice, stock: newStock });
        alert("Product updated successfully!");
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage product catalog, inventory, and listings</p>
        </div>
        <Button onClick={() => navigate("/admin/products/add")}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
      </div>

      {/* Category Stock Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="chart-card bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Stock Overview by Category</h3>
              <p className="text-sm text-muted-foreground">Monitoring active inventory across all departments</p>
            </div>
            <div className="flex gap-4 text-xs font-medium">
               <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary/20"></span> Total</div>
               <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-accent"></span> Active</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryStock} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="products" name="Total Products" fill="hsl(var(--primary) / 0.15)" radius={[6, 6, 0, 0]} barSize={40} />
              <Bar dataKey="active" name="Active Listings" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>



      {/* Products Table Section */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search fresh items..." className="pl-10 h-10 rounded-xl" />
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="h-10 rounded-xl px-4"><Package className="w-4 h-4 mr-2" /> Export CSV</Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/30">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground w-[30%] text-left">Product Detail</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground w-[15%] text-left">Category</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground w-[12%] text-right">Price</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground w-[10%] text-right">Inventory</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground w-[10%] text-center">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground w-[8%] text-center">Unit</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground w-[15%] text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => {
                 const status = getStatus(p);
                 return (
                  <tr key={p.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl border border-border overflow-hidden bg-secondary flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                          {p.image && (p.image.startsWith("http") || p.image.startsWith("data:") || p.image.startsWith("/")) ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl bg-primary/5">{p.image || "🍏"}</div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-sm text-foreground truncate">{p.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground mt-0.5 uppercase tracking-wide">{p.sku || `GRO-${p.id.toString().slice(-4)}`}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/5 text-primary border border-primary/10">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">₹{Number(p.price || 0).toFixed(2)}</span>
                        {p.mrp > p.price && <span className="text-[10px] text-muted-foreground line-through">₹{p.mrp}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className={`font-bold text-sm ${p.stock < 10 ? 'text-destructive' : 'text-foreground'}`}>{p.stock}</span>
                       <span className="text-[10px] text-muted-foreground ml-1">in stock</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${
                         status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                         status === 'Low Stock' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                         'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                       }`}>
                         {status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="text-xs font-medium text-muted-foreground">{p.unit || '1 pc'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleView(p)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-secondary border border-transparent hover:border-border transition-all" title="View"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                        <button onClick={() => handleEdit(p)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-secondary border border-transparent hover:border-border transition-all" title="Edit"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                        <button onClick={() => handleDelete(p.id)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all" title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></button>
                      </div>
                    </td>
                  </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}