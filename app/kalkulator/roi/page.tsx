"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Calculator, ShieldCheck } from "lucide-react";

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
    <div className="bg-gray-50/50 min-h-screen pb-16 pt-20">
      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        <div>
          <Link href="/" className="text-xs font-semibold text-amber-600 flex items-center gap-1 mb-1.5 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Kalkulator ROI Investasi Properti
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Hitung tingkat pengembalian investasi (Return on Investment) dari properti sewaan atau aset komersial Anda secara akurat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-900 text-base">
                  Parameter Properti
                </h3>
                <p className="text-xs text-gray-500">Masukkan estimasi nilai keuangan properti</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Harga Pembelian Properti (Rp)
              </label>
              <input
                type="text"
                value={hargaBeli}
                onChange={(e) => setHargaBeli(formatInput(e.target.value))}
                placeholder="1.500.000.000"
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Biaya Tambahan Awal (Renovasi, Notaris, Pajak) (Rp)
              </label>
              <input
                type="text"
                value={biayaLain}
                onChange={(e) => setBiayaLain(formatInput(e.target.value))}
                placeholder="50.000.000"
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Potensi Pendapatan Sewa per Tahun (Rp)
              </label>
              <input
                type="text"
                value={pendapatanSewa}
                onChange={(e) => setPendapatanSewa(formatInput(e.target.value))}
                placeholder="120.000.000"
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Biaya Operasional Tahunan (Maintenance, PBB, Asuransi) (Rp)
              </label>
              <input
                type="text"
                value={biayaOperasional}
                onChange={(e) => setBiayaOperasional(formatInput(e.target.value))}
                placeholder="10.000.000"
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
              />
            </div>
          </div>

          <div className="md:col-span-5 space-y-6">
            <div className="bg-primary text-white p-6 md:p-8 rounded-2xl shadow-lg space-y-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" /> Hasil Analisis ROI
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-300">Estimasi ROI Tahunan</p>
                  <h2 className="text-4xl font-heading font-extrabold text-secondary mt-1">
                    {roiTahunan.toFixed(2)}%
                  </h2>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Modal Investasi:</span>
                    <span className="font-semibold">{formatRupiah(totalModal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Pendapatan Bersih/Tahun:</span>
                    <span className="font-semibold text-green-400">{formatRupiah(pendapatanBersihTahunan)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Waktu Balik Modal:</span>
                    <span className="font-semibold">{paybackPeriod > 0 ? `${paybackPeriod.toFixed(1)} Tahun` : "-"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/titip-properti"
                  className="w-full bg-secondary text-primary font-bold py-3 rounded-xl transition-all shadow-md hover:bg-secondary/90 flex items-center justify-center gap-2 text-sm text-center"
                >
                  Konsultasikan Properti Anda
                </Link>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-900 text-xs">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <p>
                <strong className="font-semibold">Tips Investasi:</strong> ROI yang baik untuk properti sewaan di area berkembang biasanya berkisar antara <strong>7% hingga 12%</strong> per tahun di luar kenaikan harga aset (capital gain).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}