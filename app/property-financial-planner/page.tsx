"use client";

import { useState } from "react";
import PremiumGuard from "@/components/PremiumGuard";
import CalculatorDisclaimer from "@/components/CalculatorDisclaimer";
import { Calculator, Wallet, AlertTriangle, Percent, Info, ShieldCheck } from "lucide-react";

// Fungsi Helper untuk format Rupiah (pemisah titik)
const formatRupiah = (value: number | string) => {
  if (!value && value !== 0) return "";
  const numberString = value.toString().replace(/[^,\d]/g, "");
  const split = numberString.split(",");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
};

// Fungsi Helper untuk mengambil angka murni dari string berformat titik
const parseRupiah = (value: string) => {
  return Number(value.replace(/\./g, "")) || 0;
};

export default function PropertyFinancialPlannerPage() {
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
  const totalMonthlyIncome = salary + partnerSalary + annualBonus / 12;
  const maxSafeInstallmentRatio = 0.35; // 35% dari total pendapatan
  const maxSafeInstallmentAmount = totalMonthlyIncome * maxSafeInstallmentRatio;

  // Kapasitas sisa untuk cicilan KPR (Cicilan Maksimal Masa Fixed)
  const availableInstallmentForMortgage = Math.max(
    0,
    maxSafeInstallmentAmount - currentInstallment
  );

  const isFloating = kprScheme === "floating";
  const fixedRateNum = parseFloat(interestRate) || 0;
  const floatingRateNum = parseFloat(floatingInterestRate) || 0;

  const fixedMonthlyRate = fixedRateNum / 100 / 12;
  const floatingMonthlyRate = floatingRateNum / 100 / 12;

  const totalMonths = tenor * 12;
  const fixedMonths = isFloating ? fixedTenor * 12 : totalMonths;

  // --- PLAFON KPR MAKSIMAL ---
  const maxLoanAmount =
    availableInstallmentForMortgage > 0 && fixedMonthlyRate > 0
      ? (availableInstallmentForMortgage * (1 - Math.pow(1 + fixedMonthlyRate, -totalMonths))) /
        fixedMonthlyRate
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

    remainingBalance = p * Math.pow(1 + r, n) - (pmt * (Math.pow(1 + r, n) - 1)) / r;

    if (remainingBalance > 0 && floatingMonthlyRate > 0) {
      const remainingMonths = totalMonths - fixedMonths;
      floatingInstallment =
        (remainingBalance * floatingMonthlyRate) /
        (1 - Math.pow(1 + floatingMonthlyRate, -remainingMonths));
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
  const totalInstallmentRatioFloating =
    (totalMonthlyInstallmentFloating / totalMonthlyIncome) * 100;
  const isOverSafeLimitFloating = isFloating && totalInstallmentRatioFloating > 35;

  return (
    <PremiumGuard>
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Header Title */}
          <div className="mb-10 space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-800 shadow-xs">
              <Calculator className="h-4 w-4" /> Financial Health Check Properti
            </div>
            <h1 className="font-heading text-3xl font-bold text-gray-900">
              Property Financial Planner (AI Match)
            </h1>
            <p className="mx-auto max-w-xl text-sm text-gray-500">
              Hitung kemampuan finansial Anda secara akurat termasuk simulasi kenaikan bunga KPR{" "}
              <i>(stress test)</i> agar keuangan tetap aman di masa depan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* KOLOM KIRI: INPUT FORM */}
            <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:col-span-6">
              {/* Bagian 1: Data Finansial */}
              <h3 className="font-heading flex items-center gap-2 border-b pb-4 text-lg font-bold text-gray-900">
                <Wallet className="h-5 w-5 text-amber-600" /> Profil Finansial Anda
              </h3>
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-semibold text-gray-700">
                      Gaji Anda per Bulan (Rp)
                    </label>
                    <input
                      type="text"
                      value={formatRupiah(salary)}
                      onChange={(e) => setSalary(parseRupiah(e.target.value))}
                      className="w-full rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-gray-700">
                      Gaji Pasangan per Bulan (Rp)
                    </label>
                    <input
                      type="text"
                      value={formatRupiah(partnerSalary)}
                      onChange={(e) => setPartnerSalary(parseRupiah(e.target.value))}
                      className="w-full rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-semibold text-gray-700">
                      Bonus Tahunan (Total / Rp)
                    </label>
                    <input
                      type="text"
                      value={formatRupiah(annualBonus)}
                      onChange={(e) => setAnnualBonus(parseRupiah(e.target.value))}
                      className="w-full rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-gray-700">
                      Total Tabungan Tersedia (Rp)
                    </label>
                    <input
                      type="text"
                      value={formatRupiah(savings)}
                      onChange={(e) => setSavings(parseRupiah(e.target.value))}
                      className="w-full rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-semibold text-gray-700">
                      Rencana DP Disiapkan (Rp)
                    </label>
                    <input
                      type="text"
                      value={formatRupiah(downPayment)}
                      onChange={(e) => setDownPayment(parseRupiah(e.target.value))}
                      className="w-full rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-gray-700">
                      Cicilan Lainnya / Bulan (Rp)
                    </label>
                    <input
                      type="text"
                      value={formatRupiah(currentInstallment)}
                      onChange={(e) => setCurrentInstallment(parseRupiah(e.target.value))}
                      className="w-full rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Skema KPR */}
              <h3 className="font-heading flex items-center gap-2 border-b pt-4 pb-4 text-lg font-bold text-gray-900">
                <Percent className="h-5 w-5 text-amber-600" /> Skema & Bunga KPR
              </h3>
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-semibold text-gray-700">
                      Total Tenor KPR
                    </label>
                    <select
                      value={tenor}
                      onChange={(e) => setTenor(Number(e.target.value))}
                      className="w-full cursor-pointer rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value={10}>10 Tahun</option>
                      <option value={15}>15 Tahun</option>
                      <option value={20}>20 Tahun</option>
                      <option value={25}>25 Tahun</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-gray-700">
                      Jenis Skema KPR
                    </label>
                    <select
                      value={kprScheme}
                      onChange={(e) => setKprScheme(e.target.value as "fixed" | "floating")}
                      className="w-full cursor-pointer rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="fixed">Full Fixed (Misal: Syariah)</option>
                      <option value="floating">Fixed Berjenjang / Floating (Konvensional)</option>
                    </select>
                  </div>
                </div>

                {isFloating ? (
                  <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                          Bunga Promo / Fixed Awal (%)
                        </label>
                        <input
                          type="text"
                          placeholder="Misal: 6.5"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value.replace(/[^0-9.]/g, ""))}
                          className="w-full rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                          Masa Bunga Fixed (Tahun)
                        </label>
                        <input
                          type="number"
                          value={fixedTenor}
                          onChange={(e) => setFixedTenor(Number(e.target.value))}
                          max={tenor}
                          className="w-full rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 flex items-center gap-1.5 font-semibold text-gray-700">
                        Estimasi Bunga Floating (%)
                        <span
                          title="Rata-rata bunga KPR floating di Indonesia berkisar 11% - 14%"
                          className="cursor-help"
                        >
                          <Info className="h-3.5 w-3.5 text-gray-400" />
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Misal: 12.5"
                        value={floatingInterestRate}
                        onChange={(e) =>
                          setFloatingInterestRate(e.target.value.replace(/[^0-9.]/g, ""))
                        }
                        className="w-full rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="mb-1 block font-semibold text-gray-700">
                      Suku Bunga Tetap (% / Tahun)
                    </label>
                    <input
                      type="text"
                      placeholder="Misal: 8.5"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value.replace(/[^0-9.]/g, ""))}
                      className="w-full rounded-xl border bg-white p-3 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* KOLOM KANAN: HASIL KALKULASI & REKOMENDASI */}
            <div className="space-y-6 lg:col-span-6">
              {/* Peringatan Jika Cicilan Floating Berbahaya */}
              {isOverSafeLimitFloating && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
                  <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-red-900">
                      Peringatan: Gagal Stress Test Bunga Floating!
                    </h4>
                    <p className="text-xs leading-relaxed text-red-700">
                      Meskipun cicilan di awal aman, namun saat memasuki masa bunga mengambang
                      (Tahun ke-{fixedTenor + 1}), cicilan Anda akan melonjak menjadi{" "}
                      <strong>{totalInstallmentRatioFloating.toFixed(1)}%</strong> dari gaji (Batas
                      sehat 35%).
                    </p>
                  </div>
                </div>
              )}

              {/* Card Hasil Utama */}
              <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <h3 className="font-heading flex items-center justify-between border-b pb-4 text-lg font-bold text-gray-900">
                  <span>Hasil Analisis Properti</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${isOverSafeLimitFixed || isOverSafeLimitFloating ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
                  >
                    {isOverSafeLimitFixed || isOverSafeLimitFloating
                      ? "Perlu Penyesuaian"
                      : "Kapasitas Finansial Sehat"}
                  </span>
                </h3>

                <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                  <div className="space-y-1 rounded-xl border border-amber-100 bg-amber-50/50 p-4 sm:col-span-2">
                    <span className="text-sm font-medium text-gray-600">
                      Target Harga Properti Maksimal
                    </span>
                    <div className="text-2xl font-bold text-amber-700">
                      Rp {Math.round(idealPropertyPrice).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="space-y-1 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <span className="font-medium text-gray-500">
                      {isFloating
                        ? `Cicilan Promo (1-${fixedTenor} Thn)`
                        : "Cicilan per Bulan (Flat)"}
                    </span>
                    <div className="text-base font-bold text-gray-900">
                      Rp {Math.round(availableInstallmentForMortgage).toLocaleString("id-ID")}
                    </div>
                  </div>

                  {isFloating && (
                    <div className="space-y-1 rounded-xl border border-rose-100 bg-rose-50/50 p-4">
                      <span className="font-medium text-gray-500">
                        Estimasi Cicilan Floating (Thn ke-{fixedTenor + 1})
                      </span>
                      <div className="text-base font-bold text-rose-700">
                        Rp {Math.round(floatingInstallment).toLocaleString("id-ID")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rincian Biaya Awal */}
                <div className="space-y-3 border-t pt-4">
                  <h4 className="text-xs font-bold tracking-wider text-gray-900 uppercase">
                    Estimasi Kebutuhan Dana Awal:
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-gray-100 py-1">
                      <span className="text-gray-600">DP yang Disiapkan</span>
                      <span className="font-semibold text-gray-900">
                        Rp {downPayment.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 py-1">
                      <span className="text-gray-600">Pajak Pembeli (BPHTB ~5%)</span>
                      <span className="font-semibold text-gray-900">
                        Rp {Math.round(estimatedTax).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 py-1">
                      <span className="text-gray-600">Biaya Notaris & Bank (~1%)</span>
                      <span className="font-semibold text-gray-900">
                        Rp {Math.round(estimatedNotary).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 font-bold text-gray-900">
                      <span>Total Kebutuhan Dana Awal</span>
                      <span className="text-amber-700">
                        Rp {Math.round(totalInitialCost).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rekomendasi Cerdas */}
                <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs">
                  <CalculatorDisclaimer />
                  <h4 className="flex items-center gap-1.5 font-bold text-amber-900">
                    <ShieldCheck className="h-4 w-4 text-amber-700" /> Rekomendasi Pakar Realthink
                  </h4>
                  <p className="leading-relaxed text-gray-700">
                    {isOverSafeLimitFloating
                      ? "Meskipun cicilan awal terlihat sanggup dibayar, Anda memiliki risiko besar saat memasuki bunga floating. Sebaiknya tambah porsi DP atau turunkan target harga rumah."
                      : "Simulasi Stress-Test menunjukkan kondisi keuangan Anda AMAN bahkan jika suku bunga bank naik ke tingkat floating. Anda sangat siap untuk mengajukan KPR!"}
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