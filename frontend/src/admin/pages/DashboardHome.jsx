import { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { StatCard } from "../../admin/components/StatCard";
import { Input } from "../../components/ui/input";
import { useProducts } from "../../contexts/ProductContext";
import { useAdminSearch } from "../../admin/contexts/AdminSearchContext";
import {
  IndianRupee, TrendingUp, ShoppingCart, Package, Users, Percent, Award, TrendingDown,
  Clock, CheckCircle2, Store, Search, Star
} from "lucide-react";

const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const fmtShort = (n) => {
  const num = Number(n || 0);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
  return `₹${num}`;
};

/* Renders a product image correctly:
   - base64 / http URL  → <img>
   - emoji string       → styled emoji tile
   - missing           → package icon placeholder
*/
function ProductImage({ src, name, size = 40 }) {
  const [imgError, setImgError] = useState(false);

  const isRealImage =
    src &&
    !imgError &&
    (src.startsWith("data:image") || src.startsWith("http") || src.startsWith("/"));

  const isEmoji = src && !isRealImage && /\p{Emoji}/u.test(src);

  return (
    <div
      className="shrink-0 rounded-lg border bg-secondary/60 flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size, minWidth: size }}
    >
      {isRealImage ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : isEmoji ? (
        <span style={{ fontSize: size * 0.5, lineHeight: 1 }}>{src}</span>
      ) : (
        <Package className="text-muted-foreground" style={{ width: size * 0.4, height: size * 0.4 }} />
      )}
    </div>
  );
}

const revenueData = [
  { month: "Jul", revenue: 485000, orders: 3200, profit: 143000 },
  { month: "Aug", revenue: 510000, orders: 3580, profit: 152000 },
  { month: "Sep", revenue: 495000, orders: 3400, profit: 146000 },
  { month: "Oct", revenue: 548000, orders: 3760, profit: 172000 },
  { month: "Nov", revenue: 675000, orders: 4520, profit: 213000 },
  { month: "Dec", revenue: 802000, orders: 5800, profit: 287000 },
  { month: "Jan", revenue: 568000, orders: 3980, profit: 173000 },
  { month: "Feb", revenue: 595000, orders: 4200, profit: 187000 },
  { month: "Mar", revenue: 735000, orders: 5100, profit: 238000 },
];

const categoryData = [
  { name: "Vegetables", value: 32 },
  { name: "Fruits", value: 28 },
  { name: "Dairy & Eggs", value: 18 },
  { name: "Beverages", value: 12 },
  { name: "Snacks", value: 10 },
];

const COLORS = [
  "hsl(25, 95%, 53%)", "hsl(210, 92%, 55%)", "hsl(152, 69%, 40%)",
  "hsl(280, 65%, 55%)", "hsl(38, 92%, 50%)"
];

const weeklySalesData = [
  { name: "Mon", sales: 12400, orders: 84 },
  { name: "Tue", sales: 15800, orders: 102 },
  { name: "Wed", sales: 11200, orders: 76 },
  { name: "Thu", sales: 18600, orders: 124 },
  { name: "Fri", sales: 22400, orders: 156 },
  { name: "Sat", sales: 28900, orders: 198 },
  { name: "Sun", sales: 19300, orders: 134 },
];

const monthlySalesData = [
  { name: "Oct", sales: 89000, orders: 620 },
  { name: "Nov", sales: 76000, orders: 840 },
  { name: "Dec", sales: 102000, orders: 1020 },
  { name: "Jan", sales: 65000, orders: 420 },
  { name: "Feb", sales: 54000, orders: 980 },
  { name: "Mar", sales: 73000, orders: 560 },
];

const yearlySalesData = [
  { name: "2020", sales: 2850000, orders: 18400 },
  { name: "2021", sales: 3420000, orders: 22100 },
  { name: "2022", sales: 4180000, orders: 27300 },
  { name: "2023", sales: 5640000, orders: 35800 },
  { name: "2024", sales: 6920000, orders: 44200 },
  { name: "2025", sales: 7350000, orders: 48600 },
];

const salesSummary = {
  weekly:  { total: "₹1,28,600", orders: 874,   growth: "+12.4%", label: "vs last week"  },
  monthly: { total: "₹4,59,000", orders: 4440,  growth: "+8.7%",  label: "vs last month" },
  yearly:  { total: "₹73.5L",    orders: 48600, growth: "+18.2%", label: "vs last year"  },
};

const productPerformance = [
  { rank: 1, name: "Organic Tomatoes",  unitsSold: 2840, reviews: 4.8, reviewCount: 1240, performance: 96 },
  { rank: 2, name: "Fresh Milk (1L)",    unitsSold: 3200, reviews: 4.6, reviewCount: 2180, performance: 91 },
  { rank: 3, name: "Alphonso Mangoes",  unitsSold: 1850, reviews: 4.7, reviewCount: 890,  performance: 88 },
  { rank: 4, name: "Free-range Eggs",   unitsSold: 4100, reviews: 4.5, reviewCount: 3420, performance: 85 },
  { rank: 5, name: "Sourdough Bread",    unitsSold: 1560, reviews: 4.4, reviewCount: 680,  performance: 79 },
];

const orderStatusStyle = {
  Delivered: "badge-success", Shipped: "badge-info", Processing: "badge-warning", Cancelled: "badge-danger", Pending: "badge-warning"
};

const activityIcons = {
  Order: CheckCircle2,
  Product: Package,
  Return: Clock,
  Payout: IndianRupee,
  Store: Store
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : star - 0.5 <= rating
              ? "fill-amber-200 text-amber-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-1 text-[10px] text-muted-foreground font-medium">{rating}</span>
    </div>
  );
}

function PerformanceBar({ value }) {
  const color =
    value >= 90
      ? "hsl(152, 69%, 40%)"
      : value >= 80
      ? "hsl(25, 95%, 53%)"
      : "hsl(38, 92%, 50%)";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold text-card-foreground w-8 text-right">{value}%</span>
    </div>
  );
}

export default function DashboardHome() {
  const { products } = useProducts();
  const { searchQuery: search, setSearchQuery: setSearch } = useAdminSearch();

  const [data, setData] = useState({ 
    stats: {}, 
    revenueTrend: [], 
    weeklyTrend: [], 
    yearlyTrend: [], 
    categoryData: [], 
    recentOrders: [] 
  });
  const [loading, setLoading] = useState(true);
  const [category, setCategory]     = useState("All");
  const [status, setStatus]         = useState("All");
  const [stockLevel, setStockLevel] = useState("All");
  const [dateSort, setDateSort]     = useState("Newest First");
  const [salesPeriod, setSalesPeriod] = useState("monthly");

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/finance/admin/stats');
      const json = await res.json();
      if (json.categoryData) {
        json.categoryData = json.categoryData.map(c => ({
          ...c,
          value: parseFloat(c.value)
        }));
      }
      setData(json);
    } catch (err) {
      console.error("Failed to fetch admin dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatus = (product) => (product?.stock === 0 ? "Out of Stock" : "Active");

  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    let result = safeProducts.map(p => ({ ...p, status: getStatus(p) }));
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }
    if (category !== "All")   result = result.filter(p => p.category === category);
    if (status !== "All")     result = result.filter(p => p.status === status);
    if (stockLevel !== "All") {
      result = result.filter(p => {
        if (stockLevel === "Low Stock")    return p.stock > 0 && p.stock < 10;
        if (stockLevel === "Medium Stock") return p.stock >= 10 && p.stock <= 20;
        if (stockLevel === "High Stock")   return p.stock > 20;
        return true;
      });
    }
    result.sort((a, b) => {
      const dA = new Date(a.dateCreated || "2000-01-01").getTime();
      const dB = new Date(b.dateCreated || "2000-01-01").getTime();
      return dateSort === "Newest First" ? dB - dA : dA - dB;
    });
    return result;
  }, [products, search, category, status, stockLevel, dateSort]);

  const extractedCategories  = Array.isArray(products) ? products.map(p => p.category).filter(Boolean) : [];
  const predefinedCategories = ["All", "Vegetables", "Fruits", "Dairy & Eggs", "Bakery"];
  const uniqueCategories     = [...new Set([...predefinedCategories, ...extractedCategories])];

  const currentSalesData = useMemo(() => {
    let source = [];
    if (salesPeriod === "weekly")  source = data?.weeklyTrend || [];
    if (salesPeriod === "monthly") source = data?.revenueTrend || [];
    if (salesPeriod === "yearly")  source = data?.yearlyTrend || [];

    return source.map(item => ({
      name: item.name || item.month,
      sales: parseFloat(item.sales || item.revenue || 0),
      orders: parseInt(item.orders || 0)
    }));
  }, [data, salesPeriod]);

  const currentSummary = {
    total: fmt(data?.stats?.totalRevenue || 0),
    orders: data?.stats?.totalOrders || 0,
    growth: "+0%",
    label: "Real-time"
  };

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Store Dashboard</h1>
        <p className="page-subtitle">Your store overview and real-time analytics</p>
      </div>

      {/* Product Search & Database Section */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden mb-6">
        <div className="p-4 bg-secondary/10 border-b border-border/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative w-full lg:max-w-md flex items-center">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search products by name or category..."
                className="pl-9 bg-background h-9 text-sm border-border/70 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { value: category, setter: setCategory, options: uniqueCategories },
                { value: status,   setter: setStatus,   options: ["All", "Active", "Out of Stock"] },
                { value: stockLevel, setter: setStockLevel, options: ["All", "Low Stock", "Medium Stock", "High Stock"] },
                { value: dateSort, setter: setDateSort, options: ["Newest First", "Oldest First"] },
              ].map((sel, i) => (
                <select
                  key={i}
                  className="h-9 rounded-md border border-border/70 bg-background px-3 text-xs text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                  value={sel.value}
                  onChange={(e) => sel.setter(e.target.value)}
                >
                  {sel.options.map(o => <option key={o}>{o}</option>)}
                </select>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-secondary/30">
                <th className="w-16 pl-5 text-left"></th>
                <th className="text-center min-w-[180px]">Product Name</th>
                <th className="text-left px-4">Category</th>
                <th className="text-left px-4">Seller</th>
                <th className="text-right px-4">Price</th>
                <th className="text-right px-4">Stock</th>
                <th className="text-left pl-6 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? filteredProducts.map(p => (
                <tr key={p.id} className="align-middle hover:bg-secondary/20 transition-colors">
                  <td className="py-3 pl-5 pr-2">
                    <ProductImage src={p.image} name={p.name} size={42} />
                  </td>
                  <td className="text-center py-3">
                    <div className="inline-block text-left max-w-full">
                      <p className="font-semibold text-card-foreground text-sm">{p.name}</p>
                      {p.description && (
                        <p className="text-[10px] text-muted-foreground truncate max-w-[180px] mt-0.5 mx-auto">{p.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-left">
                    {p.category
                      ? <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary/80 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{p.category}</span>
                      : <span className="text-muted-foreground text-xs">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-left">
                    <span className="text-card-foreground font-medium text-xs">{p.seller || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-col items-end">
                      <p className="text-card-foreground font-bold text-sm">
                        {String(p.price).startsWith("$") || String(p.price).startsWith("₹")
                          ? p.price
                          : `₹${Number(p.price).toLocaleString("en-IN")}`}
                      </p>
                      {p.mrp && (
                        <p className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/50">
                          {String(p.mrp).startsWith("$") || String(p.mrp).startsWith("₹")
                            ? p.mrp
                            : `₹${Number(p.mrp).toLocaleString("en-IN")}`}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`tabular-nums font-semibold text-sm ${Number(p.stock) < 10 ? 'text-destructive' : 'text-card-foreground'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="pl-6 pr-4 py-3 text-left">
                    <span className={p.status === "Active" ? "badge-success" : "badge-danger"}>{p.status}</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center text-muted-foreground py-10">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm">No products found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue"    value={loading || !data?.stats?.totalRevenue ? "..." : fmt(data.stats.totalRevenue)}  todayValue="Real-time" change="+0% today"       changeType="positive" icon={IndianRupee} />
        <StatCard title="Total Orders"     value={loading ? "..." : (data?.stats?.totalOrders || 0)}  todayValue="Real-time"      change="Across platform"             changeType="positive" icon={ShoppingCart} />
        <StatCard title="Total Products"   value={loading ? "..." : (data?.stats?.totalProducts || 0)}  todayValue="Real-time"        change="Active catalog"             changeType="positive" icon={Package} />
        <StatCard title="Total Customers"  value={loading ? "..." : (data?.stats?.totalCustomers || 0)}  todayValue="Real-time"       change="Registered users"       changeType="positive" icon={Users} />
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard title="Profit Margin"               value={loading ? "..." : `${data?.stats?.profitMargin || 0}%`}       change="Gross platform fee"  changeType="positive" icon={Percent} />
        <StatCard title="Platform Profit"    value={loading || !data?.stats?.netProfit ? "..." : fmt(data.stats.netProfit)} change="Total commission"    changeType="positive" icon={Award} />
        <StatCard title="Top Category"   value={data?.categoryData?.[0]?.name || "N/A"}      change="Highest contributor"   changeType="positive" icon={TrendingUp} />
      </div>

      {/* Revenue & Category Chart */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 chart-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="chart-title">Revenue & Profit Analytics</h3>
              <p className="chart-subtitle">Monthly revenue breakdown — last 9 months</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" />Profit</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.revenueTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(25,95%,53%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(25,95%,53%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(152,69%,40%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(152,69%,40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(220,9%,46%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(220,9%,46%)" tickFormatter={(v) => fmtShort(v)} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [fmt(v)]} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(25,95%,53%)"  fill="url(#revGrad)"  strokeWidth={2} />
              <Area type="monotone" dataKey="profit"  stroke="hsl(152,69%,40%)" fill="url(#profGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Sales by Category</h3>
          <p className="chart-subtitle">Revenue distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart key={data.categoryData?.length || 0}>
              <Pie
                data={data.categoryData || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                isAnimationActive={false}
              >
                {(data.categoryData || []).map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [`${v}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {data.categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-card-foreground">{c.name}</span>
                </span>
                <span className="font-semibold text-card-foreground">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Toggle + Product Performance Ranking */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Sales with Toggle Tabs */}
        <div className="chart-card">
          <h3 className="chart-title">Sales Overview</h3>
          <p className="chart-subtitle">Toggle between weekly, monthly &amp; yearly data</p>

          {/* Toggle Tabs */}
          <div className="flex gap-1 p-1 bg-secondary/60 rounded-lg w-fit mt-3 mb-4">
            {[
              { key: "weekly",  label: "Weekly"  },
              { key: "monthly", label: "Monthly" },
              { key: "yearly",  label: "Yearly"  },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSalesPeriod(key)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  salesPeriod === key
                    ? "bg-card text-card-foreground shadow-sm"
                    : "text-muted-foreground hover:text-card-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Summary Row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg bg-secondary/40 p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Total Sales</p>
              <p className="text-base font-bold text-card-foreground mt-0.5">{currentSummary.total}</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Orders</p>
              <p className="text-base font-bold text-card-foreground mt-0.5">{currentSummary.orders.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Growth</p>
              <p className="text-base font-bold text-success mt-0.5">{currentSummary.growth}</p>
              <p className="text-[9px] text-muted-foreground">{currentSummary.label}</p>
            </div>
          </div>

          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={currentSalesData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(220,9%,46%)" />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke="hsl(220,9%,46%)"
                tickFormatter={(v) => fmtShort(v)}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                formatter={(v, name) => [
                  name === "sales" ? fmt(v) : v,
                  name === "sales" ? "Sales" : "Orders",
                ]}
              />
              <Bar dataKey="sales" name="Sales" fill="hsl(25,95%,53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Performance Ranking */}
        <div className="chart-card">
          <div className="mb-4">
            <h3 className="chart-title">Product Performance Ranking</h3>
            <p className="chart-subtitle">Units sold, customer reviews &amp; overall performance score</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left pb-2.5 text-muted-foreground font-semibold uppercase tracking-wide text-[10px] pr-2">#</th>
                  <th className="text-left pb-2.5 text-muted-foreground font-semibold uppercase tracking-wide text-[10px] pr-3">Product Name</th>
                  <th className="text-right pb-2.5 text-muted-foreground font-semibold uppercase tracking-wide text-[10px] pr-3">Units Sold</th>
                  <th className="text-left pb-2.5 text-muted-foreground font-semibold uppercase tracking-wide text-[10px] pr-3">Customer Reviews</th>
                  <th className="text-left pb-2.5 text-muted-foreground font-semibold uppercase tracking-wide text-[10px]">Overall Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {(data?.productPerformance || []).length > 0 ? (data.productPerformance.map((p) => (
                  <tr key={p.rank} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 pr-2">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${
                        p.rank === 1 ? "bg-amber-100 text-amber-700"
                        : p.rank === 2 ? "bg-slate-100 text-slate-600"
                        : p.rank === 3 ? "bg-orange-100 text-orange-700"
                        : "bg-secondary text-muted-foreground"
                      }`}>
                        {p.rank}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-medium text-card-foreground leading-tight">{p.name}</p>
                    </td>
                    <td className="py-3 pr-3 text-right">
                      <span className="font-semibold text-card-foreground">{Number(p.unitsSold || 0).toLocaleString()}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <StarRating rating={Number(p.reviews || 0).toFixed(1)} />
                      <p className="text-[9px] text-muted-foreground mt-0.5">{p.reviewCount || 0} reviews</p>
                    </td>
                    <td className="py-3 min-w-[110px]">
                      <PerformanceBar value={p.performance || 0} />
                    </td>
                  </tr>
                ))) : (
                  <tr><td colSpan={5} className="text-center py-4 text-muted-foreground">No performance data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Orders + Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="border-b px-5 py-3">
            <h3 className="chart-title">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Time</th></tr></thead>
              <tbody>
                {data.recentOrders.length > 0 ? data.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="font-medium text-card-foreground">{o.id}</td>
                    <td className="text-card-foreground">{o.customer}</td>
                    <td className="text-muted-foreground">{o.items}</td>
                    <td className="font-medium text-card-foreground">₹{Number(o.total).toLocaleString()}</td>
                    <td><span className={orderStatusStyle[o.status] || "badge-warning"}>{o.status}</span></td>
                    <td className="text-muted-foreground text-xs">{o.time}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="text-center py-4">No recent orders</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Recent Activity</h3>
          <p className="chart-subtitle mb-3">Latest updates</p>
          <div className="space-y-3">
            {[
              { text: "System analysis complete", time: "Just now", icon: activityIcons.Store },
              { text: "Finance tables re-synced", time: "10 min ago", icon: activityIcons.Payout },
              { text: "Order monitoring active", time: "25 min ago", icon: activityIcons.Order }
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="mt-0.5 rounded bg-secondary p-1">
                  <a.icon className="h-3 w-3 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-card-foreground leading-snug">{a.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
