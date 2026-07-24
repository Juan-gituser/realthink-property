"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PremiumGuard from "@/components/PremiumGuard";
import { 
  Calculator, Wallet, AlertTriangle, 
  Percent, Info, ShieldCheck 
} from "lucide-react";

// Fungsi Helper untuk format Rupiah (pemisah titik)
const formatRupiah = (value: number | string) => {
  if (!value && value !== 0) return "";
  const numberString = value.toString().replace(/[^,\d]/g, "");
  const split = numberString.split(",");
  let sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    let separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
};

// Fungsi Helper untuk mengambil angka murni dari string berformat titik
const parseRupiah = (value: string) => {
  return Number(value.replace(/\./g, "")) || 0;
};

export default function PropertyFinancialPlannerPage() {
  const router = useRouter();

  // State Input Pendapatan & Kewajiban
  const [salary, setSalary] = useState<number>(15000000);
  const [partnerSalary, setPartnerSalary] = useState<number>(10000000);
  const [annualBonus, setAnnualBonus] = useState<number>(30000000);
  const [savings, setSavings] = useState<number>(150000000);
  const [downPayment, setDownPayment] = useState<number>(100000500);
  const [currentInstallment, setCurrentInstallment] = useState<number>(2000000);
  
  // State Input Skema KPR
  const [tenor, setTenor] = useState<number>(15);
  const [kprScheme, setKprScheme] = useState<"fixed" | "floating">("floating");
  const [interestRate, setInterestRate] = useState<string>("6.5"); // Bunga Fixed/Awal
  const [fixedTenor, setFixedTenor] = useState<number>(3); // Masa Fixed (Tahun)
  const [floatingInterestRate, setFloatingInterestRate] = useState<string>("12.5"); // Estimasi Bunga Floating

  // --- KALKULASI FINANSIAL DASAR ---
  const totalMonthlyIncome = salary + partnerSalary + (annualBonus / 12);
  const maxSafeInstallmentRatio = 0.35; // 35% dari total pendapatan
  const maxSafeInstallmentAmount = totalMonthlyIncome * maxSafeInstallmentRatio;
  
  // Kapasitas sisa untuk cicilan KPR (Cicilan Maksimal Masa Fixed)
  const availableInstallmentForMortgage = Math.max(0, maxSafeInstallmentAmount - currentInstallment);
  
  const isFloating = kprScheme === "floating";
  const fixedRateNum = parseFloat(interestRate) || 0;
  const floatingRateNum = parseFloat(floatingInterestRate) || 0;
  
  const fixedMonthlyRate = (fixedRateNum / 100) / 12;
  const floatingMonthlyRate = (floatingRateNum / 100) / 12;
  
  const totalMonths = tenor * 12;
  const fixedMonths = isFloating ? (fixedTenor * 12) : totalMonths;

  // --- PLAFON KPR MAKSIMAL ---
  const maxLoanAmount = availableInstallmentForMortgage > 0 && fixedMonthlyRate > 0
    ? (availableInstallmentForMortgage * (1 - Math.pow(1 + fixedMonthlyRate, -totalMonths))) / fixedMonthlyRate 
    : 0;

  const idealPropertyPrice = maxLoanAmount + downPayment;

  // --- KALKULASI MASA FLOATING ---
  let remainingBalance = 0;
  let floatingInstallment = 0;

  if (isFloating && fixedMonths < totalMonths && fixedMonthlyRate > 0) {
    const r = fixedMonthlyRate;
    const n = fixedMonths;
    const p = maxLoanAmount;
    const pmt = availableInstallmentForMortgage;
    
    remainingBalance = (p * Math.pow(1 + r, n)) - (pmt * (Math.pow(1 + r, n) - 1) / r);

    if (remainingBalance > 0 && floatingMonthlyRate > 0) {
      const remainingMonths = totalMonths - fixedMonths;
      floatingInstallment = (remainingBalance * floatingMonthlyRate) / (1 - Math.pow(1 + floatingMonthlyRate, -remainingMonths));
    }
  }

  // --- BIAYA TAMBAHAN AWAL ---
  const estimatedTax = idealPropertyPrice * 0.05; // BPHTB ~5%
  const estimatedNotary = idealPropertyPrice * 0.01; // Notaris ~1%
  const totalInitialCost = downPayment + estimatedTax + estimatedNotary;

  // --- STATUS KESEHATAN FINANSIAL ---
  const totalMonthlyInstallmentFixed = availableInstallmentForMortgage + currentInstallment;
  const totalInstallmentRatioFixed = (totalMonthlyInstallmentFixed / totalMonthlyIncome) * 100;
  const isOverSafeLimitFixed = totalInstallmentRatioFixed > 35;

  const totalMonthlyInstallmentFloating = floatingInstallment + currentInstallment;
  const totalInstallmentRatioFloating = (totalMonthlyInstallmentFloating / totalMonthlyIncome) * 100;
  const isOverSafeLimitFloating = isFloating && totalInstallmentRatioFloating > 35;

  return (
    <PremiumGuard>
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Title */}
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <Calculator className="w-4 h-4" /> Financial Health Check Properti
            </div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Property Financial Planner (AI Match)
            </h1>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Hitung kemampuan finansial Anda secara akurat termasuk simulasi kenaikan bunga KPR <i>(stress test)</i> agar keuangan tetap aman di masa depan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* KOLOM KIRI: INPUT FORM */}
            <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              
              {/* Bagian 1: Data Finansial */}
              <h3 className="text-lg font-heading font-bold text-gray-900 border-b pb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-600" /> Profil Finansial Anda
              </h3>
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Gaji Anda per Bulan (Rp)</label>
                    <input type="text" value={formatRupiah(salary)} onChange={(e) => setSalary(parseRupiah(e.target.value))} className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Gaji Pasangan per Bulan (Rp)</label>
                    <input type="text" value={formatRupiah(partnerSalary)} onChange={(e) => setPartnerSalary(parseRupiah(e.target.value))} className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Bonus Tahunan (Total / Rp)</label>
                    <input type="text" value={formatRupiah(annualBonus)} onChange={(e) => setAnnualBonus(parseRupiah(e.target.value))} className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Total Tabungan Tersedia (Rp)</label>
                    <input type="text" value={formatRupiah(savings)} onChange={(e) => setSavings(parseRupiah(e.target.value))} className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Rencana DP Disiapkan (Rp)</label>
                    <input type="text" value={formatRupiah(downPayment)} onChange={(e) => setDownPayment(parseRupiah(e.target.value))} className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Cicilan Lainnya / Bulan (Rp)</label>
                    <input type="text" value={formatRupiah(currentInstallment)} onChange={(e) => setCurrentInstallment(parseRupiah(e.target.value))} className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500" />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Skema KPR */}
              <h3 className="text-lg font-heading font-bold text-gray-900 border-b pb-4 pt-4 flex items-center gap-2">
                <Percent className="w-5 h-5 text-amber-600" /> Skema & Bunga KPR
              </h3>
              <div className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Total Tenor KPR</label>
                    <select value={tenor} onChange={(e) => setTenor(Number(e.target.value))} className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer">
                      <option value={10}>10 Tahun</option>
                      <option value={15}>15 Tahun</option>
                      <option value={20}>20 Tahun</option>
                      <option value={25}>25 Tahun</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Jenis Skema KPR</label>
                    <select value={kprScheme} onChange={(e) => setKprScheme(e.target.value as "fixed" | "floating")} className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer">
                      <option value="fixed">Full Fixed (Misal: Syariah)</option>
                      <option value="floating">Fixed Berjenjang / Floating (Konvensional)</option>
                    </select>
                  </div>
                </div>

                {isFloating ? (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Bunga Promo / Fixed Awal (%)</label>
                        <input type="text" placeholder="Misal: 6.5" value={interestRate} onChange={(e) => setInterestRate(e.target.value.replace(/[^0-9.]/g, ""))} className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Masa Bunga Fixed (Tahun)</label>
                        <input type="number" value={fixedTenor} onChange={(e) => setFixedTenor(Number(e.target.value))} max={tenor} className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500" />
                      </div>
                    </div>
                    <div>
                      <label className="flex font-semibold text-gray-700 mb-1 items-center gap-1.5">
                        Estimasi Bunga Floating (%) 
                        <span title="Rata-rata bunga KPR floating di Indonesia berkisar 11% - 14%" className="cursor-help">
                          <Info className="w-3.5 h-3.5 text-gray-400" />
                        </span>
                      </label>
                      <input type="text" placeholder="Misal: 12.5" value={floatingInterestRate} onChange={(e) => setFloatingInterestRate(e.target.value.replace(/[^0-9.]/g, ""))} className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Suku Bunga Tetap (% / Tahun)</label>
                    <input type="text" placeholder="Misal: 8.5" value={interestRate} onChange={(e) => setInterestRate(e.target.value.replace(/[^0-9.]/g, ""))} className="w-full p-3 border rounded-xl font-semibold text-gray-900 bg-white outline-none focus:ring-1 focus:ring-amber-500" />
                  </div>
                )}
              </div>
            </div>

            {/* KOLOM KANAN: HASIL KALKULASI & REKOMENDASI */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Peringatan Jika Cicilan Floating Berbahaya */}
              {isOverSafeLimitFloating && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-red-900 text-sm">Peringatan: Gagal Stress Test Bunga Floating!</h4>
                    <p className="text-xs text-red-700 leading-relaxed">
                      Meskipun cicilan di awal aman, namun saat memasuki masa bunga mengambang (Tahun ke-{fixedTenor + 1}), cicilan Anda akan melonjak menjadi <strong>{totalInstallmentRatioFloating.toFixed(1)}%</strong> dari gaji (Batas sehat 35%).
                    </p>
                  </div>
                </div>
              )}

              {/* Card Hasil Utama */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <h3 className="text-lg font-heading font-bold text-gray-900 border-b pb-4 flex items-center justify-between">
                  <span>Hasil Analisis Properti</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${(isOverSafeLimitFixed || isOverSafeLimitFloating) ? "text-amber-700 bg-amber-50" : "text-emerald-700 bg-emerald-50"}`}>
                    {(isOverSafeLimitFixed || isOverSafeLimitFloating) ? "Perlu Penyesuaian" : "Kapasitas Finansial Sehat"}
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-1 sm:col-span-2">
                    <span className="text-gray-600 font-medium text-sm">Target Harga Properti Maksimal</span>
                    <div className="text-2xl font-bold text-amber-700">
                      Rp {Math.round(idealPropertyPrice).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                    <span className="text-gray-500 font-medium">{isFloating ? `Cicilan Promo (1-${fixedTenor} Thn)` : "Cicilan per Bulan (Flat)"}</span>
                    <div className="text-base font-bold text-gray-900">
                      Rp {Math.round(availableInstallmentForMortgage).toLocaleString("id-ID")}
                    </div>
                  </div>

                  {isFloating && (
                    <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 space-y-1">
                      <span className="text-gray-500 font-medium">Estimasi Cicilan Floating (Thn ke-{fixedTenor + 1})</span>
                      <div className="text-base font-bold text-rose-700">
                        Rp {Math.round(floatingInstallment).toLocaleString("id-ID")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rincian Biaya Awal */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Estimasi Kebutuhan Dana Awal:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-600">DP yang Disiapkan</span>
                      <span className="font-semibold text-gray-900">Rp {downPayment.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-600">Pajak Pembeli (BPHTB ~5%)</span>
                      <span className="font-semibold text-gray-900">Rp {Math.round(estimatedTax).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-600">Biaya Notaris & Bank (~1%)</span>
                      <span className="font-semibold text-gray-900">Rp {Math.round(estimatedNotary).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-gray-900 bg-gray-50 px-3 rounded-lg">
                      <span>Total Kebutuhan Dana Awal</span>
                      <span className="text-amber-700">Rp {Math.round(totalInitialCost).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                {/* Rekomendasi Cerdas */}
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-2 text-xs">
                  <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700" /> Rekomendasi Pakar Realthink
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {isOverSafeLimitFloating 
                      ? "Meskipun cicilan awal terlihat sanggup dibayar, Anda memiliki risiko besar saat memasuki bunga floating. Sebaiknya tambah porsi DP atau turunkan target harga rumah."
                      : "Simulasi Stress-Test menunjukkan kondisi keuangan Anda AMAN bahkan jika suku bunga bank naik ke tingkat floating. Anda sangat siap untuk mengajukan KPR!"
                    }
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </PremiumGuard>
  );
}