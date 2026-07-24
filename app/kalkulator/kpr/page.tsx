"use client";

import { useState } from "react";
import { Calculator, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Fungsi helper untuk format harga properti (dengan titik ribuan)
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

export default function KprCalculatorPage({ defaultHarga = 500000000 }: { defaultHarga?: number }) {
  const [harga, setHarga] = useState(defaultHarga);
  const [displayHarga, setDisplayHarga] = useState(formatRupiahInput(defaultHarga));
  
  // Menggunakan string untuk DP dan Bunga agar bebas mengetik koma/titik tanpa nyangkut angka 0
  const [dpPersen, setDpPersen] = useState("20");
  const [bunga, setBunga] = useState("8.5"); 
  const [tenor, setTenor] = useState(15); // tahun

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatRupiahInput(inputValue);
    const numericValue = parseRupiahInput(formatted);

    setDisplayHarga(formatted);
    setHarga(numericValue);
  };

  // Konversi aman string ke angka untuk rumus (mendukung koma maupun titik)
  const numericDp = parseFloat(dpPersen.replace(",", ".")) || 0;
  const numericBunga = parseFloat(bunga.replace(",", ".")) || 0;

  const dpNominal = (harga * numericDp) / 100;
  const pokokPinjaman = harga - dpNominal;
  const bungaPerBulan = numericBunga / 100 / 12;
  const jumlahBulan = tenor * 12;

  // Rumus Angsuran KPR Annuity
  const cicilanPerBulan =
    pokokPinjaman > 0 && bungaPerBulan > 0
      ? (pokokPinjaman * bungaPerBulan * Math.pow(1 + bungaPerBulan, jumlahBulan)) /
        (Math.pow(1 + bungaPerBulan, jumlahBulan) - 1)
      : 0;

  const formatRupiahCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <div>
          <Link href="/" className="text-xs font-semibold text-amber-600 flex items-center gap-1 mb-2 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Kalkulator Simulasi KPR
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Hitung estimasi cicilan bulanan KPR properti pilihan Anda dengan mudah dan akurat.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-gray-900 text-lg">
                Simulasi Kredit Pemilikan Rumah
              </h3>
              <p className="text-xs text-gray-500">
                Hitung estimasi cicilan bulanan KPR properti pilihan Anda
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Harga Properti */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Harga Properti (Rp)
              </label>
              <input
                type="text"
                value={displayHarga}
                onChange={handleHargaChange}
                placeholder="500.000.000"
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
              />
            </div>

            {/* Input Uang Muka / DP */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Uang Muka / DP ({numericDp}%)
              </label>
              <input
                type="text"
                value={dpPersen}
                onChange={(e) => setDpPersen(e.target.value)}
                placeholder="20"
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 bg-white font-semibold text-gray-900"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Nominal DP: {formatRupiahCurrency(dpNominal)}
              </span>
            </div>

            {/* Input Suku Bunga */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Suku Bunga (% per tahun)
              </label>
              <input
                type="text"
                value={bunga}
                onChange={(e) => setBunga(e.target.value)}
                placeholder="8.5"
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 bg-white font-semibold text-gray-900"
              />
            </div>

            {/* Jangka Waktu / Tenor */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Jangka Waktu / Tenor (Tahun)
              </label>
              <select
                value={tenor}
                onChange={(e) => setTenor(Number(e.target.value))}
                className="w-full px-3 py-2.5 border rounded-xl text-sm bg-white outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900"
              >
                {[5, 10, 15, 20, 25, 30].map((t) => (
                  <option key={t} value={t}>
                    {t} Tahun ({t * 12} Bulan)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hasil Kalkulasi */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                Estimasi Cicilan per Bulan
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold mt-1">
                {formatRupiahCurrency(cicilanPerBulan)}
              </h2>
            </div>
            <div className="text-left md:text-right text-xs text-slate-300 space-y-1">
              <p>
                Plafond Pinjaman:{" "}
                <span className="font-semibold text-white">
                  {formatRupiahCurrency(pokokPinjaman)}
                </span>
              </p>
              <p>
                Rekomendasi Min. Gaji (3x):{" "}
                <span className="font-semibold text-white">
                  {formatRupiahCurrency(cicilanPerBulan * 3)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}