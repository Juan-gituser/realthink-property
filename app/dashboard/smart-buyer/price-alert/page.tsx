import { RoleGuard } from "@/components/auth/RoleGuard";
import { Bell, TrendingDown } from "lucide-react";

export default function SmartBuyerPriceAlertPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div>
          <span className="mb-3 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
            Notification Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">Property Price Alerts</h1>
          <p className="mt-1 text-xs text-slate-400">
            Atur pemberitahuan instan ketika harga properti incaran Anda mengalami penurunan atau
            promo menarik.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5 text-blue-400">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Cluster Puri Botanical - Tipe 36</h4>
                <p className="text-[11px] text-slate-400">
                  Target Alert: Turun di bawah Rp 1.1 Miliar
                </p>
              </div>
            </div>
            <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
              Active
            </span>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
