import { RoleGuard } from "@/components/auth/RoleGuard";
import { Bot, Send, Sparkles } from "lucide-react";

export default function SmartBuyerAIAdvisorPage() {
  return (
    <RoleGuard minRole="smart_buyer">
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div className="bg-linear-to-r from-blue-950/50 via-slate-900 to-slate-900 border border-blue-500/20 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-blue-500/30 inline-block mb-3">
              Smart Buyer Feature
            </span>
            <h1 className="text-3xl font-extrabold font-heading text-white">Smart Buyer AI Assistant</h1>
            <p className="text-sm text-slate-400 mt-1">Konsultasikan pilihan properti, simulasi KPR, dan tips negosiasi aman secara instan.</p>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-xs text-white font-bold">Status: Online</p>
              <p className="text-[10px] text-blue-400">Buyer Assistant Ready</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1C2541]/70 border border-slate-800 rounded-3xl backdrop-blur-xl p-6 min-h-100[400px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-xs text-slate-300 max-w-xl space-y-2">
                <p>Halo! Saya siap membantu Anda menganalisis kelayakan unit properti incaran, menghitung cicilan KPR riil, dan memeriksa reputasi developer. Ada yang ingin ditanyakan?</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex gap-3">
            <input 
              type="text" 
              placeholder="Tanyakan hal seputar pembelian properti..." 
              className="flex-1 bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20">
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}