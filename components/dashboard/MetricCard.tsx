// components/dashboard/MetricCard.tsx
import { ReactNode } from "react";
import { Sparkline } from "./Sparkline";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: ReactNode;
  sparklineData: number[];
  isLoading: boolean;
  formatType?: "number" | "currency" | "percentage";
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  sparklineData,
  isLoading,
  formatType = "number",
}: MetricCardProps) {
  const isPositive = change >= 0;

  const formattedValue = () => {
    if (isLoading) return "";
    if (formatType === "currency") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(Number(value));
    }
    if (formatType === "percentage") {
      return `${value}%`;
    }
    return new Intl.NumberFormat("id-ID").format(Number(value));
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 shadow-xl backdrop-blur-xl transition-all hover:border-slate-700">
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="flex justify-between">
            <div className="h-10 w-10 rounded-2xl bg-slate-800" />
            <div className="h-5 w-16 rounded-full bg-slate-800" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-slate-800" />
            <div className="h-8 w-32 rounded bg-slate-800" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
              {icon}
            </div>
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? `+${change}%` : `${change}%`}
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {title}
              </p>
              <h3 className="mt-1 font-heading text-xl font-extrabold text-white sm:text-2xl">
                {formattedValue()}
              </h3>
            </div>
            <div className="hidden sm:block">
              <Sparkline data={sparklineData} color={isPositive ? "#10b981" : "#f43f5e"} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}