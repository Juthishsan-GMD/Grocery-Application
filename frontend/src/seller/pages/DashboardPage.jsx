import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IndianRupee, ShoppingBag, Package, Users, Edit2, Shield, 
  TrendingUp, ArrowUpRight, ArrowDownRight, MoreVertical, ExternalLink,
  Plus, Calendar, Filter, Download, Zap, Award, Target
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader, SectionHeader, Skeleton, CustomTooltip, EmptyState } from '../components/sharedComponents';
import { 
  fmtShort, statusColor, avatarBg 
} from '../components/shared';
import { useAuth } from '../../contexts/AuthContext';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const StatCard = ({ label, value, sub, icon: Icon, color, bg, onClick, growth, trend }) => (
  <motion.div 
    variants={itemVariants}
    onClick={onClick}
    className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 relative overflow-hidden group ${onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 dark:shadow-black/40' : ''}`}
  >
    <div className="absolute -right-2 -top-2 w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
    
    <div className="flex items-center justify-between relative z-10">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={22} className={color} />
      </div>
      {growth && (
        <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {growth}%
        </div>
      )}
    </div>

    <div className="relative z-10">
      <div className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mb-1">{label}</div>
      <div className="text-[24px] font-black text-slate-800 dark:text-slate-100 leading-tight">{value}</div>
      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
        <Zap size={10} className="text-amber-500" /> {sub}
      </div>
    </div>
  </motion.div>
);

export default function DashboardPage({ products, orders, loading }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const safeProducts = useMemo(() => Array.isArray(products) ? products : [], [products]);
  const safeOrders = useMemo(() => Array.isArray(orders) ? orders : [], [orders]);

  const [revenueFilter, setRevenueFilter] = useState("weekly");
  const [data, setData] = useState({ 
    stats: {}, 
    trend: [], 
    categories: [], 
    topProducts: [], 
    growth: [] 
  });
  const [fetching, setFetching] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!currentUser?.id) return;
    setFetching(true);
    try {
      const res = await fetch(`http://localhost:5000/api/finance/seller/${currentUser.id}/analytics?range=${revenueFilter}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch dashboard analytics:", err);
    } finally {
      setFetching(false);
    }
  }, [currentUser?.id, revenueFilter]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const totalRevenueVal = useMemo(() => {
    return safeOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  }, [safeOrders]);

  const stats = [
    { 
      label: "Total Revenue", 
      value: fmtShort(data.stats?.totalRevenue || 0), 
      sub: "Net platform earnings", 
      icon: IndianRupee, 
      color: "text-emerald-500", 
      bg: "bg-emerald-500/10", 
      growth: 12.5,
      trend: "up",
      onClick: () => navigate('/seller/analytics') 
    },
    { 
      label: "Active Orders", 
      value: data.stats?.totalOrders || 0, 
      sub: "Orders this period", 
      icon: ShoppingBag, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10", 
      growth: 8.2,
      trend: "up",
      onClick: () => navigate('/seller/orders') 
    },
    { 
      label: "Avg. Order Value", 
      value: `₹${Math.round(data.stats?.avgOrderValue || 0)}`, 
      sub: "Revenue per order", 
      icon: Target, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10", 
      growth: 4.1,
      trend: "up"
    },
    { 
      label: "Total Inventory", 
      value: safeProducts.length, 
      sub: "Active listings", 
      icon: Package, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10", 
      onClick: () => navigate('/seller/products') 
    },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-6 w-full pb-10"
    >
      <div className="flex items-center justify-between">
        <PageHeader title="Dashboard" subtitle={`Monitor your store performance and sales metrics in real-time.`} />
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-xl bg-emerald-500 text-white text-[13px] font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Profile Banner */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-3xl p-7 flex flex-col md:flex-row items-center gap-6 overflow-hidden relative shadow-2xl border border-white/5"
      >
        <div className="absolute right-0 top-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100" fill="none" stroke="white" strokeWidth="0.5" />
            <path d="M0 80 C 30 20 60 20 100 80" fill="none" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        
        <div className="relative group shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-0.5 shadow-xl shadow-emerald-500/20 transform group-hover:rotate-6 transition-transform duration-300">
            <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-[24px] font-black text-emerald-400">
              {(currentUser?.name || "S").split(" ").map(n => n[0]).join("")}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow-lg">
            <Shield size={12} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
            <h2 className="text-[24px] font-black text-white tracking-tight">{currentUser?.storeName || "FreshBasket™"}</h2>
            <div className="flex items-center justify-center md:justify-start gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              <Award size={12} /> Premier Store
            </div>
          </div>
          <p className="text-slate-400 text-[14px] font-medium flex items-center justify-center md:justify-start gap-2">
            {currentUser?.name || "Seller"} <span className="opacity-30">•</span> {currentUser?.email}
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-5">
            {[
              { val: "4.9★", label: "Store Rating", icon: Award, color: "text-amber-400" },
              { val: safeOrders.length, label: "Total Orders", icon: ShoppingBag, color: "text-blue-400" },
              { val: fmtShort(totalRevenueVal), label: "Gross Volume", icon: TrendingUp, color: "text-emerald-400" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <div className={`text-[18px] font-bold ${stat.color} flex items-center gap-1.5`}>
                  <stat.icon size={14} /> {stat.val}
                </div>
                <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-3 shrink-0">
          <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[13px] font-bold hover:bg-white/10 transition-all flex items-center gap-2">
            <Edit2 size={14} /> Customize Store
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[13px] font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-2">
            <ExternalLink size={14} /> View Live Shop
          </button>
        </div>
      </motion.div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                <h3 className="font-black text-[18px] text-slate-800 dark:text-slate-100 tracking-tight">Revenue Analytics</h3>
              </div>
              <p className="text-[12px] text-slate-400 font-medium">Tracking your earnings growth across time periods.</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
              {["weekly", "monthly", "yearly"].map(f => (
                <button 
                  key={f} 
                  onClick={() => setRevenueFilter(f)} 
                  className={`px-4 py-2 text-[11px] font-black rounded-lg transition-all capitalize tracking-wider ${revenueFilter === f ? "bg-white dark:bg-slate-700 text-emerald-500 shadow-sm" : "bg-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-[300px]">
            {fetching ? <Skeleton w="100%" h="100%" r={20} /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={v => `₹${v}`} />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    strokeWidth={3} 
                    fill="url(#chartGradient)" 
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
            <h3 className="font-black text-[18px] text-slate-800 dark:text-slate-100 tracking-tight">Sales Breakdown</h3>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            {fetching ? <Skeleton w="100%" h={200} r={20} /> : (
              <>
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {data.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-[24px] font-black text-slate-800 dark:text-slate-100">{data.categories.length}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categories</div>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {data.categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color || COLORS[i % COLORS.length] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{cat.name}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{cat.value}%</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Horizontal Bar */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
              <h3 className="font-black text-[18px] text-slate-800 dark:text-slate-100 tracking-tight">Best Selling Products</h3>
            </div>
            <button className="text-[12px] font-bold text-slate-400 hover:text-emerald-500 transition-colors">View All Metrics</button>
          </div>

          <div className="flex flex-col gap-5">
            {fetching ? Array(5).fill(0).map((_, i) => <Skeleton key={i} h={40} r={12} />) : (
              data.topProducts.map((p, i) => {
                const maxRevenue = Math.max(...data.topProducts.map(tp => tp.revenue));
                const percentage = (p.revenue / maxRevenue) * 100;
                return (
                  <div key={i} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[13px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{p.item}</div>
                      <div className="text-[12px] font-black text-slate-800 dark:text-slate-100">₹{p.revenue.toLocaleString()}</div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full bg-gradient-to-r ${i === 0 ? 'from-emerald-400 to-emerald-600' : 'from-slate-400 to-slate-500 opacity-60'}`}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{p.qty} Units Sold</div>
                      <div className="text-[10px] text-emerald-500 font-black">+12% Growth</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Recent Transactions List */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
              <h3 className="font-black text-[18px] text-slate-800 dark:text-slate-100 tracking-tight">Recent Orders</h3>
            </div>
            <button 
              onClick={() => navigate('/seller/orders')}
              className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-black hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
            >
              ORDER LOG
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {loading ? Array(5).fill(0).map((_, i) => <Skeleton key={i} h={54} r={16} />) :
              safeOrders.length > 0 ? safeOrders.slice(0, 5).map((o, i) => {
                const sc = statusColor(o?.status || "Pending");
                return (
                  <motion.div 
                    key={`order-${o?.id || i}`} 
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-transparent hover:border-emerald-500/20 hover:bg-white dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-black text-white shrink-0 shadow-lg ${avatarBg(o?.customer_name || "User")}`}>
                      {(o?.customer_name || "U").split(" ").map(w => w[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-500 transition-colors">{o?.customer_name || "Unknown"}</div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                        <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">{o?.id || "N/A"}</span>
                        <span>{new Date(o?.placed_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[15px] font-black text-slate-800 dark:text-slate-100">₹{Number(o?.total_amount || 0).toLocaleString()}</div>
                      <div className={`text-[10px] font-black uppercase tracking-tighter mt-1 ${sc.text}`}>{o?.status || "Pending"}</div>
                    </div>
                  </motion.div>
                );
              }) : <EmptyState title="No orders found" sub="Start selling to see your orders here." icon={ShoppingBag} />}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

