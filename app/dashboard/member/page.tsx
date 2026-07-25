import { createClient } from "@/lib/supabase/server";
import { Heart, Calendar, Calculator, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function MemberOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { count: favCount } = await supabase.from("user_favorites").select("*", { count: "exact", head: true }).eq("user_id", user?.id);
  const { count: surveyCount } = await supabase.from("property_surveys").select("*", { count: "exact", head: true }).eq("user_id", user?.id);
  const { count: calcCount } = await supabase.from("kpr_simulations").select("*", { count: "exact", head: true }).eq("user_id", user?.id);
  const { count: notifCount } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", user?.id).eq("is_read", false);

  return (
    <div className="space-y-8">
      <div className="bg-[#1C2541] border border-amber-500/20 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-amber-500/20 text-amber-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-3">
            Overview Akun Member
          </span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Dashboard Utama</h1>
          <p className="text-xs text-slate-300 mt-1">Pantau properti favorit, jadwal survey, dan riwayat aktivitas Anda dalam satu tempat.</p>
        </div>
        <Link href="/pricing" className="px-5 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-2">
          Eksplor Paket Elite <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#1C2541]/60 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20"><Heart className="w-6 h-6" /></div>
          <div><p className="text-xs text-slate-400 font-medium">Favorit</p><h3 className="text-xl font-bold text-white mt-1">{favCount || 0} Unit</h3></div>
        </div>
        <div className="bg-[#1C2541]/60 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20"><Calendar className="w-6 h-6" /></div>
          <div><p className="text-xs text-slate-400 font-medium">Jadwal Survey</p><h3 className="text-xl font-bold text-white mt-1">{surveyCount || 0} Agenda</h3></div>
        </div>
        <div className="bg-[#1C2541]/60 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20"><Calculator className="w-6 h-6" /></div>
          <div><p className="text-xs text-slate-400 font-medium">Simulasi KPR</p><h3 className="text-xl font-bold text-white mt-1">{calcCount || 0} Kalkulasi</h3></div>
        </div>
        <div className="bg-[#1C2541]/60 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20"><MessageSquare className="w-6 h-6" /></div>
          <div><p className="text-xs text-slate-400 font-medium">Notifikasi Baru</p><h3 className="text-xl font-bold text-white mt-1">{notifCount || 0} Pesan</h3></div>
        </div>
      </div>
    </div>
  );
}