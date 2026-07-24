import { createClient } from "@/lib/supabase/server";
import { Heart, Calendar, Calculator, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function MemberOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ambil statistik ringkas dari database
  const { count: favoriteCount } = await supabase
    .from('property_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id);

  const { count: surveyCount } = await supabase
    .from('property_surveys')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-900">Dashboard Member</h1>
        <p className="text-sm text-slate-500">Kelola properti favorit, riwayat simulasi, dan jadwal survei Anda di sini.</p>
      </div>

      {/* Banner Status Membership */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-500/30">
              🟢 Member Gratis (Aktif)
            </span>
          </div>
          <h2 className="text-xl font-bold">Akses AI Match Unlimited & Favorite Tanpa Batas</h2>
          <p className="text-xs text-slate-300 mt-1">Tingkatkan ke Smart Buyer untuk membuka Property Health Score & Hidden Cost Analyzer.</p>
        </div>
        <Link 
          href="/upgrade" 
          className="bg-white text-slate-900 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm"
        >
          Upgrade Paket 🚀
        </Link>
      </div>

      {/* Kartu Statistik Cepat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Properti Favorit</p>
            <h3 className="text-xl font-bold text-slate-900">{favoriteCount || 0} Unit</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Jadwal Survey</p>
            <h3 className="text-xl font-bold text-slate-900">{surveyCount || 0} Agenda</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">AI Match Status</p>
            <h3 className="text-xl font-bold text-emerald-600">Unlimited</h3>
          </div>
        </div>
      </div>
    </div>
  );
}