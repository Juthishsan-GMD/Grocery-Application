import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { PageHeader, Skeleton, CustomTooltip } from '../components/sharedComponents';
import { fmtShort } from '../components/shared';
import { useAuth } from '../../contexts/AuthContext';

// const fmtK  = (v) => `₹${(v / 1000).toFixed(0)}k`; // Removed unused variable

export default function AnalyticsPage({ loading: globalLoading, orders }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [dateRange, setDateRange] = useState("weekly");
  const [analytics, setAnalytics] = useState({
    stats: { totalRevenue: 0, netEarnings: 0, totalOrders: 0 },
    trend: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("revenue");

  const fetchAnalytics = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/finance/seller/${currentUser.id}/analytics?range=${dateRange}`);
      const data = await res.json();
      setAnalytics(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch seller analytics:", err);
      setLoading(false);
    }
  }, [currentUser?.id, dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const revTotal = analytics.stats.totalRevenue;
  const chartData = analytics.trend;
  const PIE_DATA = analytics.categories;
  
  const revPct = 12.5; 
  const revUp = true;

  return (
    <div className="flex flex-col gap-5 w-full">
      <button 
        onClick={() => navigate("/seller/dashboard")}
        className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 rounded-lg text-[13px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader title="Analytics & Reports" subtitle={`Track your business performance${revTotal ? ` - Total Revenue: ${fmtShort(revTotal)}` : ''}`} />
        <div className="flex gap-1.5 flex-wrap p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto no-scrollbar border border-slate-200 dark:border-slate-700">
          {["weekly", "monthly", "yearly"].map(f => (
            <button 
              key={f} onClick={() => setDateRange(f)} 
              className={`px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all capitalize border ${dateRange === f ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
          <div>
            <div className="font-bold text-[16px] mb-1.5 text-slate-800 dark:text-slate-100">Revenue Analytics</div>
            {loading ? <Skeleton w={160} h={36} /> : (
              <div className="flex items-baseline gap-2.5">
                <span className="text-[28px] font-bold text-emerald-500">{fmtShort(revTotal)}</span>
                <span className={`text-[13px] flex items-center gap-1.5 font-medium ${revUp ? "text-emerald-500" : "text-red-500"}`}>
                  {revUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {revUp ? "+" : ""}{revPct}% vs previous
                </span>
              </div>
            )}
          </div>
        </div>
        {loading ? <Skeleton w="100%" h={220} r={12} /> : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsGoldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800/60" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} stroke="currentColor" className="text-slate-400" />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={55} stroke="currentColor" className="text-slate-400" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#analyticsGoldGrad)" dot={false} activeDot={{ r: 5, fill: "#10B981" }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col min-w-0">
          <div className="flex gap-2 mb-5">
            <button onClick={() => setActiveChart("revenue")} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${activeChart === 'revenue' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50'}`}>Revenue</button>
            <button onClick={() => setActiveChart("orders")} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${activeChart === 'orders' ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700 hover:border-blue-500/50'}`}>Orders</button>
          </div>

          <div className={`transition-opacity duration-300 w-full ${activeChart === "revenue" ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"}`}>
            {loading ? <Skeleton h={220} r={10} /> : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800/60" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={20} stroke="currentColor" className="text-slate-400" />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={55} stroke="currentColor" className="text-slate-400" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-[220px] flex items-center justify-center text-slate-500 text-[13px]">No data available</div>}
          </div>

          <div className={`transition-opacity duration-300 w-full ${activeChart === "orders" ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"}`}>
            {loading ? <Skeleton h={220} r={10} /> : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800/60" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={20} stroke="currentColor" className="text-slate-400" />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={55} stroke="currentColor" className="text-slate-400" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-[220px] flex items-center justify-center text-slate-500 text-[13px]">No data available</div>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="font-bold text-[15px] mb-4 text-slate-800 dark:text-slate-100">Category Breakdown</div>
          {loading ? <Skeleton h={220} r={10} /> : (
            <>
              <div className="h-[160px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PIE_DATA || []} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                      {(PIE_DATA || []).map((d, i) => <Cell key={i} fill={d?.color || "#10B981"} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2.5 mt-4">
                {(PIE_DATA || []).map(d => d && (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                      <span className="text-[12px] font-medium text-slate-600 dark:text-slate-400">{d.name}</span>
                    </div>
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{d.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="font-bold text-[15px] mb-5 text-slate-800 dark:text-slate-100">
          Sales Trend ({dateRange === "weekly" ? "Last 7 Days" : dateRange === "monthly" ? "Last 30 Days" : "Last 12 Months"})
        </div>
        {loading ? <Skeleton h={200} r={10} /> : (
          chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800/60" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={20} stroke="currentColor" className="text-slate-400" />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={55} stroke="currentColor" className="text-slate-400" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#10B981", strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-[200px] flex items-center justify-center text-slate-500 text-[13px]">No data available</div>
        )}
      </div>
    </div>
  );
}
