import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  TrendingUp, Calculator, LineChart, BarChart3, Globe, 
  Percent, ArrowUpRight, FileSpreadsheet, Sparkles, ShieldCheck, LogOut, Layers
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
  { name: "Capital Gain Projection", href: "/dashboard/investor-pro/capital-gain", icon: ArrowUpRight },
  { name: "Investment Report PDF", href: "/dashboard/investor-pro/investment-report", icon: FileSpreadsheet },
  { name: "AI Advisor Unlimited", href: "/dashboard/investor-pro/ai-advisor", icon: Sparkles },
  { name: "Export Excel Data", href: "/dashboard/investor-pro/export-excel", icon: FileSpreadsheet },
];

export default async function InvestorProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Eksklusif Investor Pro */}
      <aside className="w-full md:w-72 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md">
              Investor Pro
            </span>
            <h2 className="text-base font-bold font-heading text-white mt-0.5">Realthink Capital</h2>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {investorMenus.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700/40"
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs text-slate-400 truncate max-w-35[140px]">{profile?.full_name || user.email}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <form action="/auth/signout" method="POST">
            <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors">
              <LogOut className="w-4 h-4" />
              Keluar Sesi
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}