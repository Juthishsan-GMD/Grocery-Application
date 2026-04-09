import React, { useState } from 'react';
import { Eye, Truck, Check, RefreshCw, X } from 'lucide-react';
import { PageHeader, Skeleton } from '../components/sharedComponents';
import { fmt, fmtShort, statusColor, avatarBg } from '../components/shared';

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-[16px] text-slate-800 dark:text-slate-100 m-0">{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 border-none bg-transparent cursor-pointer transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  </div>
);

export default function OrdersPage({ orders, fetchOrders, loading }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const localOrders = Array.isArray(orders) ? orders : [];
  const filtered = localOrders.filter(o => statusFilter === "All" || o.status === statusFilter);
  
  const updateStatus = async (id, status) => {
    try {
      const resp = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (resp.ok) {
        fetchOrders();
        if (selected && selected.id === id) {
          setSelected(prev => ({ ...prev, status }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statuses = ["All", "Processing", "Shipped", "Delivered", "Returned"];

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader title="Orders" subtitle={`${localOrders.length} total orders`} />

      <div className="flex gap-3 flex-wrap">
        {statuses.map(s => {
          const count = s === "All" ? localOrders.length : localOrders.filter(o => o.status === s).length;
          const isActive = statusFilter === s;
          return (
            <button 
              key={s} 
              onClick={() => setStatusFilter(s)} 
              className={`flex-1 min-w-[120px] py-3 px-5 flex items-center justify-center gap-2 rounded-xl border-2 transition-all cursor-pointer ${isActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-500/50'}`}
            >
              <span className={`text-[20px] font-bold ${isActive ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-100'}`}>{count}</span>
              <span className={`text-[12px] font-medium ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>{s}</span>
            </button>
          );
        })}
      </div>

      {loading ? <Skeleton w="100%" h={300} r={16} /> : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px] text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
              <tr>
                {["Order ID", "Customer", "Product", "Amount", "Status", "Tracking ID", "Date", "Actions"].map(h => (
                  <th key={h} className="p-3.5 text-[12px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                ))}
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filtered.map((o, i) => {
                const sc = statusColor(o.status);
                return (
                  <tr key={`order-row-${o.id || i}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-3.5 text-[13px] font-semibold text-emerald-500">{o.id}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${avatarBg(o.customer_name || "User")}`}>
                          {(o.customer_name || "U").split(" ").map(w => w[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium text-slate-800 dark:text-slate-200 truncate">{o.customer_name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{o.customer_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-[12px] text-slate-500 max-w-[160px]">
                      <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                        {Array.isArray(o.items) ? o.items.map(item => item.name).join(', ') : (typeof o.items === 'string' ? JSON.parse(o.items).map(i => i.name).join(', ') : 'Order Items')}
                      </span>
                    </td>
                    <td className="p-3.5 text-[13px] font-bold text-slate-800 dark:text-slate-200">{fmtShort(o.total_amount)}</td>
                    <td className="p-3.5">
                      <span className={`flex items-center gap-1.5 w-fit text-[12px] px-2.5 py-1 rounded-full font-medium ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{o.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-[12px] text-slate-500 font-mono tracking-tight">{o.tracking_id || "—"}</td>
                    <td className="p-3.5 text-[12px] text-slate-500 whitespace-nowrap">{o.created_at ? new Date(o.created_at).toLocaleDateString() : "Pending"}</td>
                    <td className="p-3.5">
                      <div className="flex gap-1.5">
                        <button onClick={() => setSelected(o)} className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors border-none cursor-pointer"><Eye size={14} /></button>
                        {o.status === "Processing" && <button onClick={() => updateStatus(o.id, "Shipped")} className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors border-none cursor-pointer"><Truck size={14} /></button>}
                        {o.status === "Shipped" && <button onClick={() => updateStatus(o.id, "Delivered")} className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors border-none cursor-pointer"><Check size={14} /></button>}
                        {o.status === "Returned" && <button onClick={() => updateStatus(o.id, "Processing")} className="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border-none cursor-pointer"><RefreshCw size={14} /></button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <Modal title={`Order ${selected.id}`} onClose={() => setSelected(null)}>
          <div className="flex flex-col gap-3">
            {[
              ["Customer", selected.customer_name], 
              ["Email", selected.customer_email], 
              ["Total Amount", fmt(selected.total_amount)], 
              ["Tracking ID", selected.tracking_id || "—"], 
              ["Date", new Date(selected.created_at).toLocaleDateString()]
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[13px] text-slate-500 font-medium">{k}</span>
                <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{v}</span>
              </div>
            ))}
            <div className="flex justify-between py-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[13px] text-slate-500 font-medium">Status</span>
              <span className={`text-[13px] font-bold ${statusColor(selected.status).text}`}>{selected.status}</span>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2">
              <span className="text-[13px] text-slate-800 dark:text-slate-200 font-bold">Update Status</span>
              <select 
                value={selected.status}
                onChange={(e) => {
                  updateStatus(selected.id, e.target.value);
                  setSelected({...selected, status: e.target.value});
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[13px] font-medium min-w-[140px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
