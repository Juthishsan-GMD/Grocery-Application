import { cn } from "../../lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

export function StatCard({ title, value, todayValue, change, changeType = "neutral", icon: Icon, iconColor }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{value}</h3>
        </div>
        <div className={cn("rounded-xl flex shrink-0 items-center justify-center h-10 w-10 shadow-sm", iconColor || "bg-slate-50 dark:bg-slate-800")}>
          <Icon className={cn("h-5 w-5 shrink-0", iconColor ? "text-white" : "text-slate-400 dark:text-slate-500")} />
        </div>
      </div>
      
      <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-50 dark:border-slate-800/50">
        {todayValue && (
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">+{todayValue}</span>
            <span className="text-slate-400 dark:text-slate-500 font-medium lowercase">today</span>
          </p>
        )}

        {change && (
          <div className="flex items-center gap-1.5">
            <p
              className={cn(
                "text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full",
                changeType === "positive" && "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
                changeType === "negative" && "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
                changeType === "neutral" && "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              )}
            >
              <span className="flex items-center gap-1">
                {changeType === "positive" ? <ArrowUp className="h-2.5 w-2.5" /> : changeType === "negative" ? <ArrowDown className="h-2.5 w-2.5" /> : null}
                {change}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
