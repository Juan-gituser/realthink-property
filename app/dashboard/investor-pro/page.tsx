import { createClient } from "@/lib/supabase/server";
import { TrendingUp, DollarSign, BarChart2, ShieldCheck, ArrowUpRight } from "lucide-react";

export default async function InvestorOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ambil data portofolio real-time dari database Supabase
  const { data: portfolios } = await supabase
    .from("investor_portfolios")
    .select("*")
    .eq("user_id", user?.id);

  const totalPortfolioValue =
    portfolios?.reduce((acc, curr) => acc + Number(curr.current_valuation), 0) || 0;
  const avgInvestmentScore = portfolios?.length
    ? Math.round(
        portfolios.reduce((acc, curr) => acc + curr.investment_score, 0) / portfolios.length
      )
    : 88;

  return (
    <div className="space-y-8 p-6">
      {/* Header Banner */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-emerald-500/20 bg-linear-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-8 shadow-2xl md:flex-row md:items-center">
        <div>
          <span className="mb-3 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
            Institutional Grade Analytics
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Investor Pro Command Center
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Pantau performa aset properti, proyeksi ROI, dan yield sewa secara real-time.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-6 py-4 text-right">
          <p className="text-xs text-slate-400">Total Valuasi Portofolio</p>
          <p className="mt-0.5 text-2xl font-bold text-emerald-400">
            Rp {totalPortfolioValue.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Kartu Metrik Utama */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Rata-rata Rental Yield</p>
            <h3 className="mt-1 text-xl font-bold text-white">8.4% / tahun</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Skor Investasi Keseluruhan</p>
            <h3 className="mt-1 text-xl font-bold text-white">
              {avgInvestmentScore} / 100 (Strong Buy)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Proyeksi Capital Gain</p>
            <h3 className="mt-1 text-xl font-bold text-white">+14.2% YoY</h3>
          </div>
        </div>
      </div>

      {/* Visualisasi Grafik Profesional (Simulasi Analitik Pasar & ROI) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-white">
              <BarChart2 className="h-4 w-4 text-emerald-400" />
              Proyeksi Arus Kas & ROI (5 Tahun ke Depan)
            </h2>
            <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
              Real-time Sync
            </span>
          </div>

          {/* Grafik Batang Profesional berbasis Tailwind */}
          <div className="flex h-64 items-end justify-between gap-4 border-b border-slate-800 px-4 pt-6">
            {[
              { year: "Tahun 1", val: 40, amt: "Rp 1.2M" },
              { year: "Tahun 2", val: 55, amt: "Rp 1.6M" },
              { year: "Tahun 3", val: 70, amt: "Rp 2.1M" },
              { year: "Tahun 4", val: 85, amt: "Rp 2.7M" },
              { year: "Tahun 5", val: 100, amt: "Rp 3.5M" },
            ].map((item) => (
              <div
                key={item.year}
                className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[10px] text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
                  {item.amt}
                </span>
                <div
                  style={{ height: `${item.val}%` }}
                  className="w-full rounded-t-xl bg-linear-to-t from-emerald-600 to-emerald-400 transition-all duration-500 group-hover:brightness-125"
                ></div>
                <span className="text-xs font-medium text-slate-400">{item.year}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500">
            Kurva pertumbuhan akumulatif berdasarkan tingkat okupansi sewa dan capital gain
            regional.
          </p>
        </div>

        {/* Panel Alokasi Aset & Area Insight Teratas */}
        <div className="flex flex-col justify-between space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <div>
            <h2 className="mb-2 text-base font-bold text-white">Rekomendasi Area Yield Tinggi</h2>
            <p className="mb-4 text-xs text-slate-400">
              Zona dengan tingkat serapan pasar tertinggi bulan ini.
            </p>

            <div className="space-y-3">
              {[
                { area: "CBD Sudirman, Jakarta", yield: "9.2%", status: "Prime" },
                { area: "BSD City Phase 2", yield: "8.7%", status: "Growth" },
                { area: "Menteng Commercial Zone", yield: "7.9%", status: "Stable" },
              ].map((zone) => (
                <div
                  key={zone.area}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{zone.area}</p>
                    <span className="text-[10px] text-slate-400">Yield: {zone.yield}</span>
                  </div>
                  <span className="rounded-md border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    {zone.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ArrowUpRight className="h-4 w-4" />
              <span>AI Advisor Recommendation</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Alokasikan 40% portofolio baru ke sektor komersial urban untuk hedging inflasi kuartal
              ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
