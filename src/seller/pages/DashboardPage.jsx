import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IndianRupee, ShoppingBag, Package, Users, Edit2, Shield, TrendingUp, TrendingDown 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageHeader, SectionHeader, Skeleton, CustomTooltip } from '../components/sharedComponents';
import { 
  SELLER, genWeeklyData, genYesterdayData, genMonthlyData, fmtShort, statusColor, avatarBg 
} from '../components/shared';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardPage({ products, orders, loading }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  const [revenueFilter, setRevenueFilter] = useState("weekly");
  
  // Calculate real revenue from orders
  const totalRevenueVal = useMemo(() => {
    return safeOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  }, [safeOrders]);

  const mostSoldCount = useMemo(() => safeProducts.filter(p => p && p.sold > 5).length, [safeProducts]);
  const leastSoldCount = useMemo(() => safeProducts.filter(p => p && (p.sold || 0) < 5).length, [safeProducts]);
  const cancelledCount = useMemo(() => safeOrders.filter(o => o && o.status === "Cancelled").length, [safeOrders]);

  const stats = [
    { label: "Total Revenue", value: fmtShort(totalRevenueVal), sub: "Lifetime earnings", icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10", onClick: () => navigate('/seller/analytics') },
    { label: "Most Sold Products", value: mostSoldCount || 0, sub: `${mostSoldCount} active sellers`, icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-400/10", onClick: () => navigate('/seller/products?view=most') },
    { label: "Least Sold Products", value: leastSoldCount || 0, sub: `${leastSoldCount} needs focus`, icon: Package, color: "text-emerald-400", bg: "bg-emerald-400/10", onClick: () => navigate('/seller/products?view=least') },
    { label: "Cancelled Orders", value: cancelledCount || 0, sub: `${cancelledCount} order issues`, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", onClick: () => navigate('/seller/products?view=cancelled') },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader title="Dashboard" subtitle={`Welcome back, ${currentUser?.name?.split(" ")[0] || "Seller"}! `} />

      <div className="bg-gradient-to-br from-[#1a1208] via-[#2d1e08] to-[#1a1208] rounded-2xl p-6 md:px-7 flex items-center gap-5 overflow-hidden relative shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="absolute -right-10 -top-10 w-[200px] h-[200px] rounded-full bg-[#c9a14a]/[0.08]" />
        <div className="absolute right-15 -bottom-15 w-[160px] h-[160px] rounded-full bg-[#c9a14a]/[0.05]" />
        
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-[#f0c97a] text-[22px] font-bold shrink-0 shadow-[0_0_0_4px_rgba(201,161,74,0.3)] flex items-center justify-center text-white z-10">
          {(currentUser?.name || "S").split(" ").map(n => n[0]).join("")}
        </div>
        
        <div className="flex-1 z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[20px] font-bold text-white">{currentUser?.storeName || "FreshBasket™"}</span>
            <span className="flex items-center gap-1 bg-[#c9a14a]/20 border border-[#c9a14a]/40 text-emerald-500 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              <Shield size={10} /> Verified Seller
            </span>
          </div>
          <div className="text-white/60 text-[13px]">{currentUser?.name || "Seller"} · {currentUser?.email} · Member since {currentUser?.joined || "Jan 2024"}</div>
          
          <div className="flex gap-5 mt-3">
            {[["4.8★", "Rating"], [safeOrders.length, "Sales"], [fmtShort(totalRevenueVal), "Revenue"]].map(([v, l]) => (
              <div key={l}>
                <div className="text-emerald-500 font-bold text-[16px]">{v}</div>
                <div className="text-white/50 text-[11px]">{l}</div>
              </div>
            ))}
          </div>
        </div>
        
        <button className="z-10 shrink-0 flex items-center gap-2 text-[13px] font-semibold text-[#c9a14a] bg-[#c9a14a]/10 px-4 py-2 rounded-xl transition-colors hover:bg-[#c9a14a]/20">
          <Edit2 size={14} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div 
            key={i} 
            onClick={s.onClick} 
            className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex gap-3.5 items-start transition-all duration-200 ${s.onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md dark:shadow-black/20' : ''}`}
          >
            {loading ? (
              <><Skeleton w={44} h={44} r={12} /><div className="flex-1 min-w-0"><Skeleton w="60%" h={14} /><div className="mt-2"><Skeleton w="80%" h={22} /></div></div></>
            ) : (
              <>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                  <s.icon size={20} className={s.color} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 mb-1 truncate">{s.label}</div>
                  <div className="text-[22px] font-bold text-slate-800 dark:text-slate-100 leading-none">{s.value}</div>
                  <div className="text-[11px] text-green-600 dark:text-green-500 mt-1">{s.sub}</div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-4">
          <div>
            <div className="font-bold text-[16px] text-slate-800 dark:text-slate-100 mb-1">Revenue Analytics</div>
            {loading ? <Skeleton w={160} h={36} /> : (
              <div className="flex items-baseline gap-2.5">
                <span className="text-[28px] font-bold text-emerald-500">{fmtShort(totalRevenueVal)}</span>
              </div>
            )}
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {["weekly", "yesterday", "monthly"].map(f => (
              <button 
                key={f} 
                onClick={() => setRevenueFilter(f)} 
                className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-all capitalize ${revenueFilter === f ? "bg-emerald-500 text-white shadow-sm" : "bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        {loading ? <Skeleton w="100%" h={220} r={12} /> : (
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={genWeeklyData()} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} stroke="currentColor" className="text-slate-400" />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={55} stroke="currentColor" className="text-slate-400" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#goldGrad)" dot={false} activeDot={{ r: 5, fill: "#10B981" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="w-full mx-auto max-w-[800px] flex self-center mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 w-full">
          <SectionHeader title="Recent Orders" action="View All" />
          <div className="flex flex-col gap-2.5 mt-3.5">
            {loading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} h={48} r={10} />) :
              safeOrders.length > 0 ? safeOrders.slice(0, 5).map((o, i) => {
                const sc = statusColor(o?.status || "Pending");
                return (
                  <div key={`order-${o?.id || i}`} className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80">
                    <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-medium text-white shrink-0 ${avatarBg(o?.customer_name || "User")}`}>
                      {(o?.customer_name || "U").split(" ").map(w => w[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate">{o?.customer_name || "Unknown"}</div>
                      <div className="text-[11px] text-slate-500">{o?.id || "N/A"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">{fmtShort(o?.total_amount || 0)}</div>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full inline-block mt-0.5 font-medium ${sc.bg} ${sc.text}`}>{o?.status || "Pending"}</span>
                    </div>
                  </div>
                );
              }) : <div className="text-center py-5 text-slate-500 text-[13px]">No orders yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
