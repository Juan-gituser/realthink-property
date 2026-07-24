"use client";

import { useState } from "react";
import { Landmark, ArrowLeft } from "lucide-react";
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

export default function BiayaNotarisPage() {
  const [harga, setHarga] = useState(1000000000);
  const [displayHarga, setDisplayHarga] = useState(formatRupiahInput(1000000000));
  const [transaksiType, setTransaksiType] = useState("jual-beli"); // jual-beli atau kpr

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDisplayHarga(formatRupiahInput(val));
    setHarga(parseRupiahInput(val));
  };

  // Estimasi honorarium PPAT/Notaris max 1% (berdasarkan standar umum UU Jabatan PPAT)
  const honorPpat = harga * 0.01;
  const biayaSertifikat = 2500000; // Biaya pengecekan & validasi sertifikat di BPN
  const biayaAktaKpr = transaksiType === "kpr" ? harga * 0.005 : 0; // Biaya Akta Jaminan / APHT jika KPR

  const totalBiayaNotaris = honorPpat + biayaSertifikat + biayaAktaKpr;

  const formatCurrency = (val: number) => {
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
            Kalkulator Biaya Notaris & PPAT
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Hitung perkiraan biaya legalitas termasuk Akta Jual Beli (AJB), Balik Nama (BBN), dan Akta Kredit.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-gray-900 text-lg">Rincian Properti & Layanan</h3>
              <p className="text-xs text-gray-500">Estimasi honorarium pejabat pembuat akta tanah</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Harga Properti (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-semibold text-gray-400">Rp</span>
                <input
                  type="text"
                  value={displayHarga}
                  onChange={handleHargaChange}
                  className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Skema Transaksi
              </label>
              <select
                value={transaksiType}
                onChange={(e) => setTransaksiType(e.target.value)}
                className="w-full px-3 py-2.5 border rounded-xl text-sm bg-white outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900"
              >
                <option value="jual-beli">Cash / Tunai (AJB & Balik Nama Sertifikat)</option>
                <option value="kpr">KPR Bank (Termasuk APHT & SKMHT Bank)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs text-slate-300">
              <span>Honorarium PPAT/Notaris (±1%):</span>
              <span className="font-semibold text-white">{formatCurrency(honorPpat)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs text-slate-300">
              <span>Biaya Cek Sertifikat & Validasi BPN:</span>
              <span className="font-semibold text-white">{formatCurrency(biayaSertifikat)}</span>
            </div>
            {transaksiType === "kpr" && (
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs text-slate-300">
                <span>Biaya Akta Jaminan / APHT Bank:</span>
                <span className="font-semibold text-white">{formatCurrency(biayaAktaKpr)}</span>
              </div>
            )}
            <div className="pt-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Total Estimasi Biaya Notaris</span>
                <h2 className="text-2xl md:text-3xl font-heading font-bold mt-1">{formatCurrency(totalBiayaNotaris)}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}