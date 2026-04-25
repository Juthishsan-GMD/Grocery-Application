import { useState, useEffect, useCallback, useMemo } from "react";
import { StatCard } from "../../admin/components/StatCard";
import {
  FileBarChart, TrendingUp, ShoppingCart, Users, Search,
  Download, FileText, X, IndianRupee,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Skeleton, CustomTooltip } from "../../seller/components/sharedComponents";
import { fmtShort } from "../../seller/components/shared";

/* ─── CSV download helper ───────────────────────────────────────── */
function downloadCSV(rows, filename) {
  const headers = ["Order ID", "Product", "Qty", "Revenue", "Discount", "Payment", "Status", "GST"];
  const lines = [
    headers.join(","),
    ...rows.map(r =>
      [r.orderId, `"${r.product}"`, r.qty, r.revenue, r.discount, r.payment, r.status, r.gst].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Report Modal ──────────────────────────────────────────────── */
function ReportModal({ type, orders, onClose }) {
  const config = useMemo(() => {
    const now = new Date();
    const filtered = (orders || []).filter(o => {
      const d = new Date(o.placed_at);
      if (type === 'daily') return d.toDateString() === now.toDateString();
      if (type === 'weekly') return d > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (type === 'monthly') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (type === 'yearly') return d.getFullYear() === now.getFullYear();
      return true; // gst
    });

    const labels = {
      daily: { label: "Daily Report", subtitle: `Today — ${now.toLocaleDateString()}` },
      weekly: { label: "Weekly Report", subtitle: "Last 7 Days" },
      monthly: { label: "Monthly Report", subtitle: now.toLocaleString('default', { month: 'long', year: 'numeric' }) },
      yearly: { label: "Yearly Report", subtitle: `Financial Year ${now.getFullYear()}` },
      gst: { label: "GST Invoice Report", subtitle: "Full Period" },
    };

    return { ...labels[type], rows: filtered };
  }, [type, orders]);

  if (!config) return null;
  const rows = config.rows;

  const totalRevenue  = rows.reduce((s, r) => s + parseFloat(r.revenue || 0), 0);
  const totalDiscount = rows.reduce((s, r) => s + parseFloat(r.discount || 0), 0);
  const totalGST      = rows.reduce((s, r) => s + parseFloat(r.gst || 0), 0);
  const paidCount     = rows.filter(r => r.status === "Paid" || r.status === "Completed").length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-card z-10">
          <div>
            <h2 className="text-lg font-bold text-card-foreground">{config.label}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{config.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5 h-8 text-xs font-semibold"
              onClick={() => downloadCSV(rows, `${type}-report.csv`)}
            >
              <Download className="h-3.5 w-3.5" /> Download CSV
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-secondary rounded-md transition-colors text-muted-foreground ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Orders",   value: rows.length       },
              { label: "Total Revenue",  value: `₹${totalRevenue.toLocaleString("en-IN")}` },
              { label: "Total Discounts",value: `₹${totalDiscount.toLocaleString("en-IN")}` },
              { label: "GST Collected",  value: `₹${totalGST.toLocaleString("en-IN")}` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-secondary/40 p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
                <p className="text-sm font-bold text-card-foreground mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />
              Paid: <strong className="text-card-foreground ml-1">{paidCount}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-warning" />
              Pending/Other: <strong className="text-card-foreground ml-1">{rows.length - paidCount}</strong>
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-xs">
              <thead className="bg-secondary/50 border-b">
                <tr>
                  {["Order ID", "Product", "Qty", "Revenue", "Discount", "Payment", "Status", ...(type === "gst" ? ["GST"] : [])].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r, idx) => (
                  <tr key={`${r.orderId}-${idx}`} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-3 py-2.5 font-medium text-card-foreground font-mono text-[11px]">{r.orderId}</td>
                    <td className="px-3 py-2.5 text-card-foreground">{r.product}</td>
                    <td className="px-3 py-2.5 text-muted-foreground text-center">{r.qty}</td>
                    <td className="px-3 py-2.5 font-semibold text-card-foreground">₹{parseFloat(r.revenue).toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-success font-medium">₹{parseFloat(r.discount).toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{r.payment}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        r.status === "Paid" || r.status === "Completed" ? "bg-success/10 text-success"
                        : r.status === "Pending" ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    {type === "gst" && (
                      <td className="px-3 py-2.5 font-medium text-card-foreground">₹{parseFloat(r.gst).toLocaleString()}</td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-secondary/30 border-t">
                <tr>
                  <td className="px-3 py-2.5 font-bold text-card-foreground text-[11px]" colSpan={3}>Totals</td>
                  <td className="px-3 py-2.5 font-bold text-card-foreground">₹{totalRevenue.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2.5 font-bold text-success">₹{totalDiscount.toLocaleString("en-IN")}</td>
                  <td colSpan={type === "gst" ? 1 : 2} />
                  {type === "gst" && <td className="px-3 py-2.5 font-bold text-card-foreground">₹{totalGST.toLocaleString("en-IN")}</td>}
                  {type !== "gst" && <td />}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function ReportsPage() {
  const [search, setSearch]         = useState("");
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    kpis: {},
    revenueTrend: [],
    sellerComparison: [],
    topProducts: [],
    allOrders: []
  });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/finance/admin/reports');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredProducts = useMemo(() => {
    return (data.topProducts || []).filter(
      (p) =>
        p.item.toLowerCase().includes(search.toLowerCase()) ||
        p.seller.toLowerCase().includes(search.toLowerCase())
    );
  }, [data.topProducts, search]);

  const REPORT_BTNS = [
    { key: "daily",   label: "Daily Report",   variant: "outline" },
    { key: "weekly",  label: "Weekly Report",  variant: "outline" },
    { key: "monthly", label: "Monthly Report", variant: "outline" },
    { key: "yearly",  label: "Yearly Report",  variant: "outline" },
    { key: "gst",     label: "GST Invoice",    variant: "default" },
  ];

  const monthLabels = useMemo(() => {
    const d = new Date();
    return [
      new Date(d.getFullYear(), d.getMonth() - 2, 1).toLocaleString('default', { month: 'short' }),
      new Date(d.getFullYear(), d.getMonth() - 1, 1).toLocaleString('default', { month: 'short' }),
      new Date(d.getFullYear(), d.getMonth(), 1).toLocaleString('default', { month: 'short' }),
    ];
  }, []);

  return (
    <div className="space-y-5">
      <div className="page-header flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Sales Reports</h1>
          <p className="page-subtitle">Comprehensive sales analytics, seller comparisons, and downloadable reports</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {REPORT_BTNS.map(({ key, label, variant }) => (
            <Button
              key={key}
              variant={variant}
              size="sm"
              className="gap-1.5 h-8 text-xs font-semibold whitespace-nowrap"
              onClick={() => setActiveReport(key)}
            >
              {key === "gst" ? <FileText className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {loading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} h={100} r={12} />) : (
          <>
            <StatCard title="Total Sales (Qtr)" value={`${fmtShort(data.kpis?.totalSales || 0)}`} change="+100% Real-time" changeType="positive" icon={TrendingUp} />
            <StatCard title="Total Orders" value={data.kpis?.totalOrders || 0} change="Live Tracking" changeType="positive" icon={ShoppingCart} />
            <StatCard title="Avg. Order Value" value={`₹${Math.round(data.kpis?.avgOrderValue || 0)}`} change="Dynamic" changeType="positive" icon={FileBarChart} />
            <StatCard title="Active Customers" value={data.kpis?.activeCustomers || 0} change="Current Database" changeType="positive" icon={Users} />
          </>
        )}
      </div>

      <div className="chart-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="chart-title">Sales Revenue Trend</h3>
            <p className="chart-subtitle">Monthly revenue and order volume — last 9 months</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-info" /> Orders</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.revenueTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(25,95%,53%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(25,95%,53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(220,9%,46%)" axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="hsl(220,9%,46%)" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${fmtShort(v)}`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(220,9%,46%)" axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(25,95%,53%)" fill="url(#salesGrad)" strokeWidth={2.5} name="Revenue" />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(210,92%,55%)" strokeWidth={2.5} dot={false} name="Orders" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Seller Sales Comparison (Qtrly)</h3>
        <p className="chart-subtitle mb-4">Monthly sales by top sellers</p>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={data.sellerComparison} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" vertical={false} />
            <XAxis dataKey="seller" tick={{ fontSize: 10 }} stroke="hsl(220,9%,46%)" axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(220,9%,46%)" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${fmtShort(v)}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="month1" name={monthLabels[0]} fill="hsl(25,95%,53%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="month2" name={monthLabels[1]} fill="hsl(210,92%,55%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="month3" name={monthLabels[2]} fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Top Selling Products</h3>
        <p className="chart-subtitle mb-3">Best performing products this quarter</p>
        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9 bg-secondary border-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-secondary/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Seller</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Qty Sold</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Revenue</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={5} className="p-4"><Skeleton h={20} /></td></tr>) :
               filteredProducts.map((s, idx) => (
                <tr key={`${s.item}-${idx}`} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-semibold text-card-foreground text-left">{s.item}</td>
                  <td className="px-4 py-3 text-muted-foreground text-left">{s.seller}</td>
                  <td className="px-4 py-3 text-card-foreground font-medium text-right">{s.qty}</td>
                  <td className="px-4 py-3 font-bold text-card-foreground text-right">₹{parseFloat(s.value).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="badge-success text-[10px]">
                      {s.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm p-5">
        <h3 className="chart-title mb-1">Downloadable Reports</h3>
        <p className="chart-subtitle mb-4">Click any report to view details and download as CSV</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {REPORT_BTNS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveReport(key)}
              className="flex flex-col items-center gap-2 rounded-xl border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 p-4 text-center transition-all group"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                {key === "gst"
                  ? <FileText className="h-5 w-5 text-primary" />
                  : <IndianRupee className="h-5 w-5 text-primary" />
                }
              </div>
              <p className="text-xs font-semibold text-card-foreground leading-tight">{label}</p>
              <p className="text-[10px] text-muted-foreground">View &amp; Download</p>
            </button>
          ))}
        </div>
      </div>

      {activeReport && (
        <ReportModal type={activeReport} orders={data.allOrders} onClose={() => setActiveReport(null)} />
      )}
    </div>
  );
}
