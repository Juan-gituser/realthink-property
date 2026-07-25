import { Activity, Compass, Target, Calculator, FileCheck, Bell, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  { title: "Smart Decision Hub", desc: "Matriks keputusan beli vs sewa berbasis AI.", href: "/dashboard/smart-buyer/decision-hub", icon: Compass },
  { title: "Property Health Score", desc: "Audit legalitas, struktur, & reputasi developer.", href: "/dashboard/smart-buyer/health-score", icon: Activity },
  { title: "Negotiation Estimator", desc: "Rekomendasi harga wajar dan limit penawaran.", href: "/dashboard/smart-buyer/negotiation", icon: Target },
  { title: "Hidden Cost Analyzer", desc: "Kalkulasi total pajak, BPHTB, & notaris akurat.", href: "/dashboard/smart-buyer/hidden-cost", icon: Calculator },
  { title: "Property Passport", desc: "Unduh laporan lengkap properti berformat PDF.", href: "/dashboard/smart-buyer/passport", icon: FileCheck },
  { title: "Price Alert", desc: "Notifikasi otomatis saat harga target turun.", href: "/dashboard/smart-buyer/price-alert", icon: Bell },
];

export default function SmartBuyerOverview() {
  return (
    <div className="space-y-8">
      {/* Banner Selamat Datang */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-amber-600/20 via-slate-900 to-slate-900 border border-amber-500/30 p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-3">
            Elite Membership Active
          </span>
          <h1 className="text-3xl font-extrabold font-heading text-white tracking-tight">Smart Buyer Command Center</h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Anda memiliki akses penuh ke seluruh alat analisis properti mendalam, proteksi pembelian bebas risiko, dan estimasi biaya tersembunyi.
          </p>
        </div>
      </div>

      {/* Grid Menu Fitur Premium */}
      <div>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Eksklusif Fitur Smart Buyer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                  Buka Fitur &rarr;
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}