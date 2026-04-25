import React, { useState, useEffect, useCallback } from 'react';
import { IndianRupee, Clock, Check, Download, Loader2 } from 'lucide-react';
import { PageHeader } from '../components/sharedComponents';
import { fmt, fmtShort } from '../components/shared';
import { useAuth } from '../../contexts/AuthContext';

export default function PaymentsPage() {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completedCount: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const sellerId = currentUser.id || currentUser.seller_id;
      const res = await fetch(`http://localhost:5000/api/payments/seller/${sellerId}`);
      const data = await res.json();
      if (res.ok) {
        setPayments(data.payments || []);
        setStats(data.stats || {
          total: 0,
          pending: 0,
          completedCount: 0
        });
      }
    } catch (err) {
      console.error("Failed to fetch seller payments:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, currentUser?.seller_id]);

  useEffect(() => {
    if (currentUser?.id || currentUser?.seller_id) {
      fetchPayments();
    }
  }, [currentUser, fetchPayments]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader title="Payments & Earnings" subtitle="Track your completed payouts and pending balance" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Total Earned", value: fmtShort(stats.total || 0), icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Pending Payout", value: fmtShort(stats.pending || 0), icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Completed", value: (stats.completedCount || 0).toString(), icon: Check, color: "text-green-500", bg: "bg-green-500/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:-translate-y-0.5 transition-transform text-left">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
              <Icon size={26} className={color} />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</div>
              <div className="text-[26px] font-bold text-slate-800 dark:text-slate-100 leading-none">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <span className="font-bold text-[15px] text-slate-800 dark:text-slate-100">Payment History</span>
          <button className="flex items-center gap-1.5 px-4 py-2 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-[13px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer bg-transparent shadow-sm">
            <Download size={15} /> Export
          </button>
        </div>
        
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
            <p className="text-slate-500 font-medium">Fetching transactions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead className="bg-[#f8fafc] dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  {["Payment ID", "Date", "Amount", "Orders", "Method", "Status"].map(h => (
                    <th key={h} className="px-5 py-4 text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 text-[13px] font-bold text-emerald-500 cursor-pointer">{p.id}</td>
                    <td className="px-5 py-4 text-[13px] font-medium text-slate-600 dark:text-slate-300">
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-[14px] font-bold text-slate-800 dark:text-slate-100">{fmt(p.amount)}</td>
                    <td className="px-5 py-4 text-[13px] text-slate-500 font-medium">{p.orders} products</td>
                    <td className="px-5 py-4 text-[13px] text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 before:content-[''] before:block before:w-1.5 before:h-1.5 before:rounded-full before:bg-slate-400">{p.method}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center text-[12px] px-3 py-1 rounded-full font-bold ${
                        p.status === "Completed" 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-500">
                      No transaction history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

