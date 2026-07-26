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
      <div className="animate-pulse space-y-4 rounded-3xl border border-slate-800 bg-[#1C2541]/60 p-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-slate-800" />
          <div className="h-5 w-16 rounded-full bg-slate-800" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-slate-800" />
          <div className="h-7 w-32 rounded bg-slate-800" />
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
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 shadow-xl backdrop-blur-xl hover:border-amber-500/40"
    >
      <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-500/5 blur-2xl transition-all duration-500 group-hover:bg-amber-500/15" />

      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
            isIncrease
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-rose-500/20 bg-rose-500/10 text-rose-400"
          }`}
        >
          {change}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">{title}</p>
          <h3 className="font-heading mt-1 text-2xl font-extrabold tracking-tight text-white">
            {value}
          </h3>
        </div>

        <div className="h-10 w-20">
          <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
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
