// app/decision-center/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, ArrowRight, ShieldCheck, Sparkles, Calculator } from "lucide-react";

const initialChecklist = {
  emergencyFund: true,
  dpReady: true,
  slikClean: true,
};

export default function DecisionCenterPage() {
  const router = useRouter();

  // State untuk checklist kesiapan membeli
  const [checklist, setChecklist] = useState(() => {
    if (typeof window === "undefined") return initialChecklist;

    try {
      const saved = window.localStorage.getItem("decision_checklist");
      if (!saved) return initialChecklist;

      const parsed = JSON.parse(saved) as Partial<typeof initialChecklist>;
      return {
        ...initialChecklist,
        ...parsed,
      };
    } catch (error) {
      console.error(error);
      return initialChecklist;
    }
  });

  // Handler untuk mengubah status checkbox
  const handleToggle = (key: keyof typeof checklist) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    localStorage.setItem("decision_checklist", JSON.stringify(updated));
  };

  // Hitung jumlah checklist yang sudah selesai
  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalChecklist = Object.keys(checklist).length;
  const isReady = completedCount === totalChecklist;

  // Handler tombol simulasi lanjutan
  const handleStartSimulation = () => {
    // Navigasi ke halaman kalkulator/simulasi KPR
    router.push("/simulation"); // Sesuaikan dengan route halaman simulasi Anda
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold tracking-wider text-blue-600 uppercase border border-blue-200 shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          Decision Center
        </div>
        <p className="text-sm text-gray-500">
          Panduan langkah demi langkah dan checklist kesiapan finansial sebelum Anda memutuskan membeli rumah.
        </p>
      </div>

      {/* Grid Konten */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Box Kiri: Checklist Kesiapan Membeli */}
        <div className="flex flex-col justify-between rounded-3xl border border-gray-800 bg-slate-900 p-6 text-white shadow-lg space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400 border border-blue-500/20">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <h2 className="text-base font-bold">Checklist Kesiapan Membeli</h2>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-blue-400 border border-slate-700">
                {completedCount} dari {totalChecklist} Selesai
              </span>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <label 
                onClick={() => handleToggle("emergencyFund")}
                className={`flex items-start gap-3.5 rounded-2xl border p-4 cursor-pointer transition-all ${
                  checklist.emergencyFund 
                    ? "border-blue-500/40 bg-slate-800/80 text-white shadow-sm" 
                    : "border-gray-800 bg-slate-900/50 text-gray-400 hover:border-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checklist.emergencyFund}
                  onChange={() => handleToggle("emergencyFund")}
                  className="mt-0.5 h-4 w-4 rounded border-gray-700 bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold leading-snug">Dana Darurat Terkumpul (Minimal 6x pengeluaran)</p>
                  <p className="text-[11px] text-gray-400">Menjaga keamanan finansial jika terjadi hal tak terduga.</p>
                </div>
              </label>

              {/* Item 2 */}
              <label 
                onClick={() => handleToggle("dpReady")}
                className={`flex items-start gap-3.5 rounded-2xl border p-4 cursor-pointer transition-all ${
                  checklist.dpReady 
                    ? "border-blue-500/40 bg-slate-800/80 text-white shadow-sm" 
                    : "border-gray-800 bg-slate-900/50 text-gray-400 hover:border-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checklist.dpReady}
                  onChange={() => handleToggle("dpReady")}
                  className="mt-0.5 h-4 w-4 rounded border-gray-700 bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold leading-snug">DP & Biaya Lainnya (BPHTB, Notaris) Siap</p>
                  <p className="text-[11px] text-gray-400">Menyiapkan uang muka serta biaya legalitas awal.</p>
                </div>
              </label>

              {/* Item 3 */}
              <label 
                onClick={() => handleToggle("slikClean")}
                className={`flex items-start gap-3.5 rounded-2xl border p-4 cursor-pointer transition-all ${
                  checklist.slikClean 
                    ? "border-blue-500/40 bg-slate-800/80 text-white shadow-sm" 
                    : "border-gray-800 bg-slate-900/50 text-gray-400 hover:border-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checklist.slikClean}
                  onChange={() => handleToggle("slikClean")}
                  className="mt-0.5 h-4 w-4 rounded border-gray-700 bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold leading-snug">Skor BI Checking / SLIK OJK Bersih</p>
                  <p className="text-[11px] text-gray-400">Memastikan riwayat kredit lancar tanpa tunggakan macet.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Box Kanan: Rekomendasi Keputusan AI */}
        <div className="flex flex-col justify-between rounded-3xl border border-gray-800 bg-slate-900 p-6 text-white shadow-lg space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
              <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold">Rekomendasi Keputusan AI</h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 space-y-3">
              <p className="text-xs leading-relaxed text-gray-300">
                {isReady ? (
                  <>
                    Berdasarkan profil finansial Anda saat ini dan checklist yang lengkap, Anda berada di jalur yang tepat untuk mengambil KPR dengan plafon hingga <span className="font-bold text-emerald-400">Rp 1.5 Miliar</span> dengan cicilan aman 30% dari penghasilan bulanan.
                  </>
                ) : (
                  <>
                    Anda telah menyelesaikan <span className="font-bold text-blue-400">{completedCount} dari {totalChecklist}</span> checklist kesiapan. Selesaikan sisa checklist di samping untuk memastikan pengajuan KPR Anda memiliki peluang disetujui yang lebih tinggi oleh bank.
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleStartSimulation}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-500 active:scale-[0.99] cursor-pointer"
          >
            <Calculator className="h-4 w-4" />
            Mulai Simulasi KPR Lanjutan
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}