"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Send, CheckCircle2, Upload, MapPin, DollarSign, Home, User, Phone } from "lucide-react";

export default function TitipPropertiPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    tipe: "Rumah",
    kategori: "Dijual",
    harga: "",
    lokasi: "",
    kamarTidur: "",
    kamarMandi: "",
    luasTanah: "",
    luasBangunan: "",
    deskripsi: "",
    namaPemilik: "",
    telepon: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi pengiriman data
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 pt-20">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        {/* Header & Back Button */}
        <div>
          <Link href="/" className="text-xs font-semibold text-amber-600 flex items-center gap-1 mb-2 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Titip Jual / Sewa Properti
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Pasarkan properti Anda dengan mudah bersama Realthink Property dan menjangkau ribuan calon pembeli potensial.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-gray-900">Properti Berhasil Dititipkan!</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Terima kasih, <span className="font-semibold">{formData.namaPemilik}</span>. Tim marketing kami akan segera meninjau informasi properti Anda dan menghubungi nomor <span className="font-semibold">{formData.telepon}</span>.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    judul: "",
                    tipe: "Rumah",
                    kategori: "Dijual",
                    harga: "",
                    lokasi: "",
                    kamarTidur: "",
                    kamarMandi: "",
                    luasTanah: "",
                    luasBangunan: "",
                    deskripsi: "",
                    namaPemilik: "",
                    telepon: "",
                  });
                }}
                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-md"
              >
                Titip Properti Lainnya
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-900 text-lg">
                  Formulir Titip Properti
                </h3>
                <p className="text-xs text-gray-500">
                  Lengkapi data properti Anda dengan benar dan jelas
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Judul Properti */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Judul Properti <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="judul"
                  required
                  value={formData.judul}
                  onChange={handleChange}
                  placeholder="Contoh: Dijual Rumah Mewah Minimalist di Jakarta Selatan"
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
                />
              </div>

              {/* Kategori & Tipe Properti */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kategori Transaksi <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border rounded-xl text-sm bg-white outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900"
                  >
                    <option value="Dijual">Dijual</option>
                    <option value="Disewa">Disewa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tipe Properti <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tipe"
                    value={formData.tipe}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border rounded-xl text-sm bg-white outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900"
                  >
                    <option value="Rumah">Rumah</option>
                    <option value="Apartemen">Apartemen</option>
                    <option value="Ruko">Ruko / Toko</option>
                    <option value="Tanah">Tanah</option>
                    <option value="Gedung">Gedung / Komersial</option>
                  </select>
                </div>
              </div>

              {/* Harga & Lokasi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Harga Penawaran (Rp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-semibold text-gray-400">Rp</span>
                    <input
                      type="text"
                      name="harga"
                      required
                      value={formData.harga}
                      onChange={handleChange}
                      placeholder="1.500.000.000"
                      className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Lokasi / Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lokasi"
                    required
                    value={formData.lokasi}
                    onChange={handleChange}
                    placeholder="Contoh: Menteng, Jakarta Pusat"
                    className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Spesifikasi Detail */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Kamar Tidur</label>
                  <input
                    type="number"
                    name="kamarTidur"
                    value={formData.kamarTidur}
                    onChange={handleChange}
                    placeholder="3"
                    className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Kamar Mandi</label>
                  <input
                    type="number"
                    name="kamarMandi"
                    value={formData.kamarMandi}
                    onChange={handleChange}
                    placeholder="2"
                    className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Luas Tanah (m²)</label>
                  <input
                    type="number"
                    name="luasTanah"
                    value={formData.luasTanah}
                    onChange={handleChange}
                    placeholder="120"
                    className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Luas Bangunan (m²)</label>
                  <input
                    type="number"
                    name="luasBangunan"
                    value={formData.luasBangunan}
                    onChange={handleChange}
                    placeholder="100"
                    className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Deskripsi & Fasilitas Properti
                </label>
                <textarea
                  name="deskripsi"
                  rows={4}
                  value={formData.deskripsi}
                  onChange={handleChange}
                  placeholder="Jelaskan keunggulan properti, fasilitas sekitar, kondisi bangunan, dll."
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
                ></textarea>
              </div>

              {/* Informasi Kontak Pemilik */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nama Pemilik / Agen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaPemilik"
                    required
                    value={formData.namaPemilik}
                    onChange={handleChange}
                    placeholder="Nama Lengkap"
                    className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nomor WhatsApp / Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telepon"
                    required
                    value={formData.telepon}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/25 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Kirim & Pasarkan Properti
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}