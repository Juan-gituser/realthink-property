import { RoleGuard } from "@/components/auth/RoleGuard";
import { MapPin, TrendingUp, Building2, ShieldCheck } from "lucide-react";

export default function AreaInsightPage() {
  const areas = [
    { name: "SCBD & Kuningan, Jakarta Selatan", avgPrice: "Rp 45 Jt / m²", growth: "+12.4% / thn", demand: "Sangat Tinggi", score: 9.4 },
    { name: "PIK 2, Jakarta Utara", avgPrice: "Rp 28 Jt / m²", growth: "+15.8% / thn", demand: "Tinggi", score: 9.1 },
    { name: "BSD City, Tangerang", avgPrice: "Rp 21 Jt / m²", growth: "+9.5% / thn", demand: "Tinggi", score: 8.7 },
  ];

  return (
    <RoleGuard minRole="investor_pro">
      <div className="space-y-6 max-w-6xl mx-auto p-6">
        <div>
          <span className="bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 inline-block mb-3">Investor Pro Analytics</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Area Insight & Regional Potential</h1>
          <p className="text-xs text-slate-400 mt-1">Analisis mendalam mengenai pertumbuhan harga rata-rata, tingkat permintaan, dan likuiditas per wilayah.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {areas.map((area, idx) => (
            <div key={idx} className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                  Score: {area.score}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{area.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Harga Rata-rata: <span className="text-white font-semibold">{area.avgPrice}</span></p>
              </div>
              <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                <span className="text-slate-400">Growth: <strong className="text-emerald-400">{area.growth}</strong></span>
                <span className="text-slate-400">Demand: <strong className="text-indigo-300">{area.demand}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
}