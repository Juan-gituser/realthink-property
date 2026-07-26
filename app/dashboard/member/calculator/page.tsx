import { createClient } from "@/lib/supabase/server";
import { Calculator } from "lucide-react";

export default async function CalculatorHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: history } = await supabase
    .from("kpr_simulations")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4 rounded-3xl border border-slate-800 bg-[#1C2541] p-6">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-400">
          <Calculator className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Riwayat Simulasi Kalkulator KPR</h1>
          <p className="text-xs text-slate-300">
            Arsip perhitungan cicilan dan pinjaman yang pernah Anda lakukan.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {history?.length === 0 && (
          <p className="py-12 text-center text-xs text-slate-400 italic">
            Belum ada riwayat kalkulasi tersimpan.
          </p>
        )}
        {history?.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-800 bg-[#1C2541]/60 p-5 md:flex-row md:items-center"
          >
            <div>
              <p className="text-xs text-slate-300">
                Harga Properti:{" "}
                <strong className="text-white">
                  Rp {item.property_price.toLocaleString("id-ID")}
                </strong>
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Tenor: {item.tenor_years} Tahun | Bunga: {item.interest_rate}%
              </p>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-slate-400">Estimasi Cicilan / Bulan</span>
              <span className="text-sm font-extrabold text-emerald-400">
                Rp {Math.round(item.monthly_installment).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
