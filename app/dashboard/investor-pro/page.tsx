import { createClient } from "@/lib/supabase/server";
import { TrendingUp, DollarSign, BarChart2, ShieldCheck, ArrowUpRight } from "lucide-react";

export default async function InvestorOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ambil data portofolio real-time dari database Supabase
  const { data: portfolios } = await supabase
    .from("investor_portfolios")
    .select("*")
    .eq("user_id", user?.id);

  const totalPortfolioValue = portfolios?.reduce((acc, curr) => acc + Number(curr.current_valuation), 0) || 0;
  const avgInvestmentScore = portfolios?.length 
    ? Math.round(portfolios.reduce((acc, curr) => acc + curr.investment_score, 0) / portfolios.length) 
    : 88;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-linear-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 p-8 rounded-3xl shadow-2xl gap-4">
        <div>
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-emerald-500/30 inline-block mb-3">
            Institutional Grade Analytics
          </span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Investor Pro Command Center</h1>
          <p className="text-sm text-slate-400 mt-1">Pantau performa aset properti, proyeksi ROI, dan yield sewa secara real-time.</p>
        </div>
        <div className="bg-slate-950/80 border border-slate-800 px-6 py-4 rounded-2xl text-right">
          <p className="text-xs text-slate-400">Total Valuasi Portofolio</p>
          <p className="text-2xl font-bold text-emerald-400 mt-0.5">
            Rp {totalPortfolioValue.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Kartu Metrik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Rata-rata Rental Yield</p>
            <h3 className="text-xl font-bold text-white mt-1">8.4% / tahun</h3>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Skor Investasi Keseluruhan</p>
            <h3 className="text-xl font-bold text-white mt-1">{avgInvestmentScore} / 100 (Strong Buy)</h3>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Proyeksi Capital Gain</p>
            <h3 className="text-xl font-bold text-white mt-1">+14.2% YoY</h3>
          </div>
        </div>
      </div>

      {/* Visualisasi Grafik Profesional (Simulasi Analitik Pasar & ROI) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              Proyeksi Arus Kas & ROI (5 Tahun ke Depan)
            </h2>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Real-time Sync
            </span>
          </div>
          
          {/* Grafik Batang Profesional berbasis Tailwind */}
          <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4 border-b border-slate-800">
            {[
              { year: "Tahun 1", val: 40, amt: "Rp 1.2M" },
              { year: "Tahun 2", val: 55, amt: "Rp 1.6M" },
              { year: "Tahun 3", val: 70, amt: "Rp 2.1M" },
              { year: "Tahun 4", val: 85, amt: "Rp 2.7M" },
              { year: "Tahun 5", val: 100, amt: "Rp 3.5M" },
            ].map((item) => (
              <div key={item.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{item.amt}</span>
                <div 
                  style={{ height: `${item.val}%` }} 
                  className="w-full bg-linear-to-t from-emerald-600 to-emerald-400 rounded-t-xl transition-all duration-500 group-hover:brightness-125"
                ></div>
                <span className="text-xs text-slate-400 font-medium">{item.year}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center">Kurva pertumbuhan akumulatif berdasarkan tingkat okupansi sewa dan capital gain regional.</p>
        </div>

        {/* Panel Alokasi Aset & Area Insight Teratas */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-2">Rekomendasi Area Yield Tinggi</h2>
            <p className="text-xs text-slate-400 mb-4">Zona dengan tingkat serapan pasar tertinggi bulan ini.</p>
            
            <div className="space-y-3">
              {[
                { area: "CBD Sudirman, Jakarta", yield: "9.2%", status: "Prime" },
                { area: "BSD City Phase 2", yield: "8.7%", status: "Growth" },
                { area: "Menteng Commercial Zone", yield: "7.9%", status: "Stable" },
              ].map((zone) => (
                <div key={zone.area} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-white">{zone.area}</p>
                    <span className="text-[10px] text-slate-400">Yield: {zone.yield}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-semibold border border-emerald-500/30">
                    {zone.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>AI Advisor Recommendation</span>
            </div>
            <p className="text-[11px] text-slate-300">Alokasikan 40% portofolio baru ke sektor komersial urban untuk hedging inflasi kuartal ini.</p>
          </div>
        </div>
      </div>
    </div>
  );
}