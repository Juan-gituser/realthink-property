import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isIncrease: boolean;
  icon: LucideIcon;
  isLoading?: boolean;
  sparklineData?: number[];
}

export function StatCard({
  title,
  value,
  change,
  isIncrease,
  icon: Icon,
  isLoading = false,
  sparklineData = [30, 40, 35, 50, 49, 60, 70, 91],
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="bg-[#1C2541]/60 border border-slate-800 p-6 rounded-3xl animate-pulse space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-10 h-10 bg-slate-800 rounded-xl" />
          <div className="w-16 h-5 bg-slate-800 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="w-24 h-3 bg-slate-800 rounded" />
          <div className="w-32 h-7 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  const points = sparklineData
    .map((val, index) => {
      const x = (index / (sparklineData.length - 1)) * 100;
      const y = 35 - ((val - min) / range) * 30;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-[#1C2541]/70 border border-slate-800 hover:border-amber-500/40 p-6 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col justify-between relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all duration-500 pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
          <Icon className="w-5 h-5" />
        </div>
        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
            isIncrease
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {change}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-heading tracking-tight">{value}</h3>
        </div>

        <div className="w-20 h-10">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={isIncrease ? "#10b981" : "#f43f5e"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}