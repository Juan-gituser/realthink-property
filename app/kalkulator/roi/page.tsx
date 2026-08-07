"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Calculator, ShieldCheck } from "lucide-react";
import CalculatorDisclaimer from "@/components/CalculatorDisclaimer";

export default function KalkulatorROIPage() {
  const [hargaBeli, setHargaBeli] = useState<string>("1.500.000.000");
  const [biayaLain, setBiayaLain] = useState<string>("50.000.000");
  const [pendapatanSewa, setPendapatanSewa] = useState<string>("120.000.000");
  const [biayaOperasional, setBiayaOperasional] = useState<string>("10.000.000");

  const formatInput = (val: string) => {
    const numbers = val.replace(/\D/g, "");
    if (!numbers) return "";
    return new Intl.NumberFormat("id-ID").format(parseInt(numbers, 10));
  };

  const parseNum = (val: string) => parseFloat(val.replace(/\D/g, "")) || 0;

  const numHargaBeli = parseNum(hargaBeli);
  const numBiayaLain = parseNum(biayaLain);
  const numPendapatanSewa = parseNum(pendapatanSewa);
  const numBiayaOperasional = parseNum(biayaOperasional);

  const totalModal = numHargaBeli + numBiayaLain;
  const pendapatanBersihTahunan = numPendapatanSewa - numBiayaOperasional;
  const roiTahunan = totalModal > 0 ? (pendapatanBersihTahunan / totalModal) * 100 : 0;
  const paybackPeriod = pendapatanBersihTahunan > 0 ? totalModal / pendapatanBersihTahunan : 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-20 pb-16">
      <div className="container mx-auto max-w-4xl space-y-6 px-4">
        <div>
          <Link
            href="/"
            className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Beranda
          </Link>
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Kalkulator ROI Investasi Properti
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Hitung tingkat pengembalian investasi (Return on Investment) dari properti sewaan atau
            aset komersial Anda secara akurat.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-7 md:p-8">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="rounded-xl bg-amber-100 p-2.5 text-amber-600">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-gray-900">
                  Parameter Properti
                </h3>
                <p className="text-xs text-gray-500">Masukkan estimasi nilai keuangan properti</p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Harga Pembelian Properti (Rp)
              </label>
              <input
                type="text"
                value={hargaBeli}
                onChange={(e) => setHargaBeli(formatInput(e.target.value))}
                placeholder="1.500.000.000"
                className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Biaya Tambahan Awal (Renovasi, Notaris, Pajak) (Rp)
              </label>
              <input
                type="text"
                value={biayaLain}
                onChange={(e) => setBiayaLain(formatInput(e.target.value))}
                placeholder="50.000.000"
                className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Potensi Pendapatan Sewa per Tahun (Rp)
              </label>
              <input
                type="text"
                value={pendapatanSewa}
                onChange={(e) => setPendapatanSewa(formatInput(e.target.value))}
                placeholder="120.000.000"
                className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Biaya Operasional Tahunan (Maintenance, PBB, Asuransi) (Rp)
              </label>
              <input
                type="text"
                value={biayaOperasional}
                onChange={(e) => setBiayaOperasional(formatInput(e.target.value))}
                placeholder="10.000.000"
                className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-6 md:col-span-5">
            <div className="bg-primary relative space-y-6 overflow-hidden rounded-2xl p-6 text-white shadow-lg md:p-8">
              <div className="bg-secondary/10 pointer-events-none absolute top-0 right-0 h-32 w-32 translate-x-4 -translate-y-4 rounded-full blur-2xl" />

              <div className="text-secondary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                <TrendingUp className="h-4 w-4" /> Hasil Analisis ROI
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-300">Estimasi ROI Tahunan</p>
                  <h2 className="font-heading text-secondary mt-1 text-4xl font-extrabold">
                    {roiTahunan.toFixed(2)}%
                  </h2>
                </div>

                <div className="space-y-3 border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Modal Investasi:</span>
                    <span className="font-semibold">{formatRupiah(totalModal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Pendapatan Bersih/Tahun:</span>
                    <span className="font-semibold text-green-400">
                      {formatRupiah(pendapatanBersihTahunan)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Waktu Balik Modal:</span>
                    <span className="font-semibold">
                      {paybackPeriod > 0 ? `${paybackPeriod.toFixed(1)} Tahun` : "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/titip-properti"
                  className="bg-secondary text-primary hover:bg-secondary/90 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-center text-sm font-bold shadow-md transition-all"
                >
                  Konsultasikan Properti Anda
                </Link>
              </div>
            </div>

            <CalculatorDisclaimer />

            <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
              <ShieldCheck className="h-5 w-5 shrink-0 text-amber-600" />
              <p>
                <strong className="font-semibold">Tips Investasi:</strong> ROI yang baik untuk
                properti sewaan di area berkembang biasanya berkisar antara{" "}
                <strong>7% hingga 12%</strong> per tahun di luar kenaikan harga aset (capital gain).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
