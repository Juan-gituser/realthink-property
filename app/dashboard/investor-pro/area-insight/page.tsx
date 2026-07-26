import { RoleGuard } from "@/components/auth/RoleGuard";
import { MapPin, TrendingUp, Building2, ShieldCheck } from "lucide-react";

export default function AreaInsightPage() {
  const areas = [
    {
      name: "SCBD & Kuningan, Jakarta Selatan",
      avgPrice: "Rp 45 Jt / m²",
      growth: "+12.4% / thn",
      demand: "Sangat Tinggi",
      score: 9.4,
    },
    {
      name: "PIK 2, Jakarta Utara",
      avgPrice: "Rp 28 Jt / m²",
      growth: "+15.8% / thn",
      demand: "Tinggi",
      score: 9.1,
    },
    {
      name: "BSD City, Tangerang",
      avgPrice: "Rp 21 Jt / m²",
      growth: "+9.5% / thn",
      demand: "Tinggi",
      score: 8.7,
    },
  ];

  return (
    <RoleGuard minRole="investor_pro">
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
            Investor Pro Analytics
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Area Insight & Regional Potential
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Analisis mendalam mengenai pertumbuhan harga rata-rata, tingkat permintaan, dan
            likuiditas per wilayah.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {areas.map((area, idx) => (
            <div
              key={idx}
              className="space-y-4 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 shadow-xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                  Score: {area.score}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{area.name}</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Harga Rata-rata: <span className="font-semibold text-white">{area.avgPrice}</span>
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                <span className="text-slate-400">
                  Growth: <strong className="text-emerald-400">{area.growth}</strong>
                </span>
                <span className="text-slate-400">
                  Demand: <strong className="text-indigo-300">{area.demand}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
}
