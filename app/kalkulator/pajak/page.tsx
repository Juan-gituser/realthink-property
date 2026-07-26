"use client";

import { useState } from "react";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

const formatRupiahInput = (value: string | number) => {
  if (!value) return "";
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

const parseRupiahInput = (value: string) => {
  return Number(value.replace(/\./g, "")) || 0;
};

export default function PajakBphtbPage() {
  const [harga, setHarga] = useState(1000000000);
  const [displayHarga, setDisplayHarga] = useState(formatRupiahInput(1000000000));
  const [npoptkp, setNpoptkp] = useState(60000000); // Standar umum NPOPTKP Rp 60 Juta

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDisplayHarga(formatRupiahInput(val));
    setHarga(parseRupiahInput(val));
  };

  // Rumus BPHTB: 5% * (Harga Properti - NPOPTKP)
  const nilaiDasarKenaPajak = Math.max(0, harga - npoptkp);
  const totalBphtb = nilaiDasarKenaPajak * 0.05;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="container mx-auto max-w-3xl space-y-8 px-4">
        <div>
          <Link
            href="/"
            className="mb-2 flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Beranda
          </Link>
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Kalkulator Estimasi Pajak BPHTB
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Hitung perkiraan Bea Perolehan Hak atas Tanah dan Bangunan (Pajak Pembeli) secara
            transparan.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="rounded-xl bg-amber-100 p-2.5 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-gray-900">
                Parameter Transaksi Pajak
              </h3>
              <p className="text-xs text-gray-500">
                Masukkan nilai transaksi pembelian properti Anda
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Harga Transaksi / Nilai Perolehan Objek Pajak (Rp)
              </label>
              <div className="relative">
                <span className="absolute top-2.5 left-3 text-sm font-semibold text-gray-400">
                  Rp
                </span>
                <input
                  type="text"
                  value={displayHarga}
                  onChange={handleHargaChange}
                  className="w-full rounded-xl border bg-white py-2.5 pr-3 pl-10 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                NPOPTKP (Nilai Perolehan Objek Pajak Tidak Kena Pajak)
              </label>
              <select
                value={npoptkp}
                onChange={(e) => setNpoptkp(Number(e.target.value))}
                className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value={60000000}>Rp 60.000.000 (Standar Umum Nasional)</option>
                <option value={80000000}>Rp 80.000.000 (Beberapa Wilayah Khusus)</option>
                <option value={0}>Rp 0 (Tanpa Pengurang / Kasus Tertentu)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-slate-900 p-6 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-300">
              <span>Tarif Pajak BPHTB:</span>
              <span className="font-semibold text-white">5%</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-300">
              <span>Dasar Pengenaan Pajak (NPOAP - NPOPTKP):</span>
              <span className="font-semibold text-white">
                {formatCurrency(nilaiDasarKenaPajak)}
              </span>
            </div>
            <div className="flex flex-col items-start justify-between gap-2 pt-1 sm:flex-row sm:items-center">
              <div>
                <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                  Total Estimasi BPHTB
                </span>
                <h2 className="font-heading mt-1 text-2xl font-bold md:text-3xl">
                  {formatCurrency(totalBphtb)}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
