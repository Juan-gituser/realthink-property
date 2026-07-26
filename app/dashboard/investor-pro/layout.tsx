import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  Calculator,
  LineChart,
  BarChart3,
  Globe,
  Percent,
  ArrowUpRight,
  FileSpreadsheet,
  Sparkles,
  ShieldCheck,
  LogOut,
  Layers,
} from "lucide-react";

const investorMenus = [
  { name: "Executive Overview", href: "/dashboard/investor-pro", icon: TrendingUp },
  { name: "Investment Score", href: "/dashboard/investor-pro/investment-score", icon: ShieldCheck },
  { name: "ROI Calculator", href: "/dashboard/investor-pro/roi-calculator", icon: Calculator },
  { name: "ROI Forecast", href: "/dashboard/investor-pro/roi-forecast", icon: LineChart },
  { name: "Market Trend", href: "/dashboard/investor-pro/market-trend", icon: BarChart3 },
  { name: "Market Comparison", href: "/dashboard/investor-pro/market-comparison", icon: Layers },
  { name: "Area Insight Pro", href: "/dashboard/investor-pro/area-insight", icon: Globe },
  { name: "Rental Yield", href: "/dashboard/investor-pro/rental-yield", icon: Percent },
  {
    name: "Capital Gain Projection",
    href: "/dashboard/investor-pro/capital-gain",
    icon: ArrowUpRight,
  },
  {
    name: "Investment Report PDF",
    href: "/dashboard/investor-pro/investment-report",
    icon: FileSpreadsheet,
  },
  { name: "AI Advisor Unlimited", href: "/dashboard/investor-pro/ai-advisor", icon: Sparkles },
  {
    name: "Export Excel Data",
    href: "/dashboard/investor-pro/export-excel",
    icon: FileSpreadsheet,
  },
];

export default async function InvestorProLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "member";

  // Validasi Hak Akses Investor Pro
  if (!["investor_pro", "super_admin"].includes(role)) {
    redirect("/upgrade?plan=investor_pro");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 md:flex-row">
      {/* Sidebar Eksklusif Investor Pro */}
      <aside className="flex w-full flex-col border-r border-slate-800 bg-slate-900/90 backdrop-blur-xl md:w-72">
        <div className="flex items-center gap-3 border-b border-slate-800/80 p-6">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
              Investor Pro
            </span>
            <h2 className="font-heading mt-0.5 text-base font-bold text-white">
              Realthink Capital
            </h2>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {investorMenus.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-xs font-medium text-slate-400 transition-all hover:border-slate-700/40 hover:bg-slate-800/60 hover:text-white"
              >
                <Icon className="h-4 w-4 text-emerald-400" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 bg-slate-900/50 p-4">
          <div className="mb-3 flex items-center justify-between px-2">
            <span className="max-w-35[140px] truncate text-xs text-slate-400">
              {profile?.full_name || user.email}
            </span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
          </div>
          <form action="/auth/signout" method="POST">
            <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/10">
              <LogOut className="h-4 w-4" />
              Keluar Sesi
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 overflow-y-auto bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
