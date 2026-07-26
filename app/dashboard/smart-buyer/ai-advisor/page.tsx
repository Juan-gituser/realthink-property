import { RoleGuard } from "@/components/auth/RoleGuard";
import { Bot, Send, Sparkles } from "lucide-react";

export default function SmartBuyerAIAdvisorPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-blue-500/20 bg-linear-to-r from-blue-950/50 via-slate-900 to-slate-900 p-8 shadow-2xl md:flex-row md:items-center">
          <div>
            <span className="mb-3 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
              Smart Buyer Feature
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Smart Buyer AI Assistant
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Konsultasikan pilihan properti, simulasi KPR, dan tips negosiasi aman secara instan.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
            <Bot className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-xs font-bold text-white">Status: Online</p>
              <p className="text-[10px] text-blue-400">Buyer Assistant Ready</p>
            </div>
          </div>
        </div>

        <div className="min-h-100[400px] flex flex-col justify-between rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 shadow-2xl backdrop-blur-xl">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/20 p-2 text-blue-400">
                <Bot className="h-5 w-5" />
              </div>
              <div className="max-w-xl space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300">
                <p>
                  Halo! Saya siap membantu Anda menganalisis kelayakan unit properti incaran,
                  menghitung cicilan KPR riil, dan memeriksa reputasi developer. Ada yang ingin
                  ditanyakan?
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 border-t border-slate-800 pt-4">
            <input
              type="text"
              placeholder="Tanyakan hal seputar pembelian properti..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-white placeholder-slate-500 transition-all focus:border-blue-500/50 focus:outline-none"
            />
            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-500">
              <span>Kirim</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
