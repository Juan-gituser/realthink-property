import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Home, Heart, Calendar, Calculator, MessageSquare, 
  Clock, FileText, User, Shield, Bell, LogOut, Zap, ArrowUpRight 
} from "lucide-react";

const memberMenus = [
  { name: "Overview", href: "/dashboard/member", icon: Home },
  { name: "Daftar Favorit", href: "/dashboard/member/favorite", icon: Heart },
  { name: "Jadwal Survey", href: "/dashboard/member/survey", icon: Calendar },
  { name: "Simulasi Kalkulator", href: "/dashboard/member/calculator", icon: Calculator },
  { name: "Riwayat Konsultasi", href: "/dashboard/member/consultation", icon: MessageSquare },
  { name: "Recently Viewed", href: "/dashboard/member/history", icon: Clock },
  { name: "Catatan Pribadi", href: "/dashboard/member/notes", icon: FileText },
  { name: "Pengaturan Profil", href: "/dashboard/member/profile", icon: User },
  { name: "Keamanan Password", href: "/dashboard/member/security", icon: Shield },
  { name: "Pusat Notifikasi", href: "/dashboard/member/notification", icon: Bell },
];

export default async function MemberDashboardLayout({
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

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#0B132B]/95 backdrop-blur-xl border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md">
                Member Area
              </span>
              <h2 className="text-base font-bold font-heading text-white mt-0.5">Realthink Property</h2>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
          {memberMenus.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1C2541] transition-all border border-transparent hover:border-slate-700/40"
              >
                <Icon className="w-4 h-4 text-amber-400" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade Banner */}
        <div className="p-4 m-4 bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>Realthink Elite</span>
          </div>
          <p className="text-[11px] text-slate-300 mb-3">Nikmati fitur analisis investasi penuh dengan Investor Pro.</p>
          <Link 
            href="/pricing" 
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 transition-colors"
          >
            Upgrade Paket <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#0B132B]">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs text-slate-300 truncate max-w-35[140px] font-medium">{profile?.full_name || user.email}</span>
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
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#0B132B]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}