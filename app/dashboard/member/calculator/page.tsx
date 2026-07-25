import { createClient } from "@/lib/supabase/server";
import { Calculator } from "lucide-react";

export default async function CalculatorHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: history } = await supabase
    .from("kpr_simulations")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#1C2541] border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20"><Calculator className="w-6 h-6" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Riwayat Simulasi Kalkulator KPR</h1>
          <p className="text-xs text-slate-300">Arsip perhitungan cicilan dan pinjaman yang pernah Anda lakukan.</p>
        </div>
      </div>

      <div className="space-y-3">
        {history?.length === 0 && (
          <p className="text-xs text-slate-400 italic text-center py-12">Belum ada riwayat kalkulasi tersimpan.</p>
        )}
        {history?.map((item) => (
          <div key={item.id} className="p-5 bg-[#1C2541]/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs text-slate-300">Harga Properti: <strong className="text-white">Rp {item.property_price.toLocaleString("id-ID")}</strong></p>
              <p className="text-[11px] text-slate-400 mt-1">Tenor: {item.tenor_years} Tahun | Bunga: {item.interest_rate}%</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Estimasi Cicilan / Bulan</span>
              <span className="text-sm font-extrabold text-emerald-400">Rp {Math.round(item.monthly_installment).toLocaleString("id-ID")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}