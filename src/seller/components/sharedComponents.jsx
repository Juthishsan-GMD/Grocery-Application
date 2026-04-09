import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PageHeader = ({ title, subtitle }) => (
  <div className="mb-1">
    <h1 className="text-[22px] font-bold m-0 text-slate-800 dark:text-slate-100">{title}</h1>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 mb-0">{subtitle}</p>
  </div>
);

export const SectionHeader = ({ title, action }) => (
  <div className="flex items-center justify-between">
    <span className="font-semibold text-[15px] text-slate-800 dark:text-slate-100">{title}</span>
    {action && (
      <button className="text-[12px] text-emerald-500 bg-transparent border-none cursor-pointer flex items-center gap-0.5 hover:text-emerald-600 transition-colors">
        {action} <ChevronRight size={14} />
      </button>
    )}
  </div>
);

export const Skeleton = ({ w = "100%", h = 20, r = 8 }) => (
  <div 
    style={{ width: w, minWidth: w, height: h, minHeight: h, borderRadius: r }} 
    className="bg-slate-200 dark:bg-slate-700/50 animate-pulse shrink-0" 
  />
);

export const BackButton = ({ label = "← Back to Products", to = "/seller/products" }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="inline-flex items-center gap-1.5 mb-2 text-[13px] border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm"
    >
      {label}
    </button>
  );
};

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg shadow-lg">
        <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
        <p className="text-[13px] font-bold text-emerald-500">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const EmptyState = ({ icon: Icon, title, sub }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
    <Icon size={40} className="text-slate-300 dark:text-slate-600 mb-4" />
    <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</div>
    <div className="text-[13px] text-slate-500 dark:text-slate-400">{sub}</div>
  </div>
);
