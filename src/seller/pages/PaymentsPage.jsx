import React from 'react';
import { IndianRupee, Clock, Check, Download } from 'lucide-react';
import { PageHeader, Skeleton } from '../components/sharedComponents';
import { fmt, fmtShort } from '../components/shared';

const generatePayments = () => [
  { id: "PAY-001", date: "Mar 25, 2025", amount: 252500, orders: 3, status: "Completed", method: "Bank Transfer" },
  { id: "PAY-002", date: "Mar 18, 2025", amount: 138200, orders: 2, status: "Completed", method: "Bank Transfer" },
  { id: "PAY-003", date: "Mar 11, 2025", amount: 97800, orders: 4, status: "Completed", method: "UPI" },
  { id: "PAY-004", date: "Mar 04, 2025", amount: 315600, orders: 5, status: "Completed", method: "Bank Transfer" },
  { id: "PAY-005", date: "Apr 01, 2025", amount: 68700, orders: 2, status: "Pending", method: "Bank Transfer" },
];

export default function PaymentsPage({ loading }) {
  const payments = generatePayments();
  const total = payments.filter(p => p.status === "Completed").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader title="Payments & Earnings" subtitle="Track your completed payouts and pending balance" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Total Earned", value: fmtShort(total), icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Pending Payout", value: fmtShort(pending), icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Completed", value: payments.filter(p => p.status === "Completed").length.toString(), icon: Check, color: "text-green-500", bg: "bg-green-500/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:-translate-y-0.5 transition-transform">
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
          <div className="p-6"><Skeleton h={200} r={10} /></div>
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
                    <td className="px-5 py-4 text-[13px] font-medium text-slate-600 dark:text-slate-300">{p.date}</td>
                    <td className="px-5 py-4 text-[14px] font-bold text-slate-800 dark:text-slate-100">{fmt(p.amount)}</td>
                    <td className="px-5 py-4 text-[13px] text-slate-500 font-medium">{p.orders} orders</td>
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
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
