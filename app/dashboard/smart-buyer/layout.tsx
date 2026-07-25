import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Compass, Activity, Target, Calculator, 
  FileCheck, Bell, Columns3, Sparkles, PhoneCall, ShieldCheck, LogOut 
} from "lucide-react";

const smartBuyerMenus = [
  { name: "Overview", href: "/dashboard/smart-buyer", icon: LayoutDashboard },
  { name: "Smart Decision Hub", href: "/dashboard/smart-buyer/decision-hub", icon: Compass },
  { name: "Property Health Score", href: "/dashboard/smart-buyer/health-score", icon: Activity },
  { name: "Negotiation Estimator", href: "/dashboard/smart-buyer/negotiation", icon: Target },
  { name: "Hidden Cost Analyzer", href: "/dashboard/smart-buyer/hidden-cost", icon: Calculator },
  { name: "Property Passport", href: "/dashboard/smart-buyer/passport", icon: FileCheck },
  { name: "Price Alert", href: "/dashboard/smart-buyer/price-alert", icon: Bell },
  { name: "Smart Compare Pro", href: "/dashboard/smart-buyer/compare-pro", icon: Columns3 },
  { name: "AI Property Advisor", href: "/dashboard/smart-buyer/ai-advisor", icon: Sparkles },
  { name: "Priority Consultation", href: "/dashboard/smart-buyer/priority-consultation", icon: PhoneCall },
];

export default async function SmartBuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Ambil role dari tabel profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
  .eq("id", user.id)
    .single();

  const role = profile?.role || "member";

  // Validasi: Hanya Smart Buyer, Investor Pro, atau Super Admin yang bisa akses
  const allowedRoles = ["smart_buyer", "investor_pro", "super_admin"];
  if (!allowedRoles.includes(role)) {
    redirect("/upgrade?plan=smart_buyer");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Premium */}
      <aside className="w-full md:w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md">
                Smart Buyer
              </span>
            </div>
            <h2 className="text-base font-bold font-heading text-white mt-0.5">Realthink Elite</h2>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {smartBuyerMenus.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700/50"
              >
                <Icon className="w-4 h-4 text-amber-400" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs text-slate-400 truncate max-w-35[140px]">{profile?.full_name || user.email}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <form action="/auth/signout" method="POST">
            <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors">
              <LogOut className="w-4 h-4" />
              Keluar Akun
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Utama Dashboard */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}