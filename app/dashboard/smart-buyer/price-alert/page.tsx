import { RoleGuard } from "@/components/auth/RoleGuard";
import { Bell, TrendingDown } from "lucide-react";

export default function SmartBuyerPriceAlertPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div>
          <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-blue-500/30 inline-block mb-3">Notification Center</span>
          <h1 className="text-3xl font-extrabold font-heading text-white">Property Price Alerts</h1>
          <p className="text-xs text-slate-400 mt-1">Atur pemberitahuan instan ketika harga properti incaran Anda mengalami penurunan atau promo menarik.</p>
        </div>

        <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Cluster Puri Botanical - Tipe 36</h4>
                <p className="text-[11px] text-slate-400">Target Alert: Turun di bawah Rp 1.1 Miliar</p>
              </div>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-bold">Active</span>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}