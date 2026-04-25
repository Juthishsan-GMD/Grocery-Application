import { useState, useEffect } from "react";
import { StatCard } from "../../admin/components/StatCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, CreditCard, AlertCircle, CheckCircle2, RefreshCcw, Landmark, Loader2 } from "lucide-react";

const statusStyles = {
  Success: "badge-success",
  Completed: "badge-success",
  Failed: "badge-danger",
  Pending: "badge-warning",
  Refunded: "badge-info",
};

const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const fmtShort = (n) => {
  const num = Number(n || 0);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 10000) return `₹${(num / 1000).toFixed(1)}k`;
  return `₹${num}`;
};

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalCollected: 0,
    successfulTxns: 0,
    failedTxns: 0,
    pendingRefunds: 0,
    todayCollected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/payments');
      const data = await res.json();
      if (res.ok) {
        setPayments(data.payments || []);
        setStats(data.stats || {
          totalCollected: 0,
          successfulTxns: 0,
          failedTxns: 0,
          pendingRefunds: 0
        });
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.id?.toLowerCase().includes(search.toLowerCase()) ||
      p.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      p.customer?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-emerald-500">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="font-bold text-lg">Loading transaction data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Payments & Refunds</h1>
        <p className="page-subtitle">Track incoming payments, failed transactions, and process customer refunds</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Collected" 
          value={fmt(stats.totalCollected)} 
          todayValue={fmt(stats.todayCollected).replace('₹', '')} 
          icon={Landmark} 
        />
        <StatCard title="Successful Txns" value={stats.successfulTxns.toString()} icon={CheckCircle2} />
        <StatCard title="Failed Txns"     value={stats.failedTxns.toString()} icon={AlertCircle} />
        <StatCard title="Pending Refunds" value={stats.pendingRefunds.toString()} icon={RefreshCcw} />
      </div>

      {/* Payment List Section */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Payment ID, Order ID, or Customer"
              className="pl-9 bg-secondary border-none h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["All", "Completed", "Failed", "Pending", "Refunded"].map((s) => (
              <Button
                key={s}
                variant={s === statusFilter ? "default" : "outline"}
                size="sm"
                className="h-9 text-xs"
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-[12%] text-left">Payment ID</th>
                <th className="w-[12%] text-left">Order ID</th>
                <th className="w-[22%] text-left">Customer / Seller</th>
                <th className="w-[12%] text-right">Amount</th>
                <th className="w-[15%] text-left">Method</th>
                <th className="w-[15%] text-left">Date & Time</th>
                <th className="w-[12%] text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="font-semibold text-card-foreground text-left">{p.id}</td>
                  <td className="text-muted-foreground text-left font-mono text-[11px] hover:text-primary cursor-pointer transition-colors">{p.orderId}</td>
                  <td className="text-left">
                    <p className="font-bold text-card-foreground">{p.customer || 'Guest'}</p>
                    <p className="text-[10px] text-muted-foreground">{p.seller || 'N/A'}</p>
                  </td>
                  <td className="text-card-foreground font-bold text-right">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                  <td className="text-left text-muted-foreground">
                    <span className="flex items-center gap-1.5 text-xs text-card-foreground/80">
                      <CreditCard className="h-3 w-3" /> {p.method}
                    </span>
                  </td>
                  <td className="text-[11px] text-muted-foreground text-left leading-tight">
                    <p className="text-card-foreground/70">{new Date(p.date).toLocaleDateString()}</p>
                    <p className="font-mono text-[10px]">{new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="text-center">
                    <span className={statusStyles[p.status] || "badge-warning"}>{p.status}</span>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 opacity-20" />
                      <p>No transactions match the selected filters.</p>
                    </div>
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

