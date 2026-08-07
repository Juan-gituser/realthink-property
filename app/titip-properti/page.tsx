"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Send,
  CheckCircle2,
  Upload,
  MapPin,
  DollarSign,
  Home,
  User,
  Phone,
} from "lucide-react";

export default function TitipPropertiPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError("");

    try {
      const payload = {
        type: "TITIP_PROPERTY",
        name: formData.namaPemilik,
        whatsapp: formData.telepon,
        email: "",
        message: formData.deskripsi,
        title: formData.judul,
        property_type: formData.tipe,
        transaction_type: formData.kategori,
        price: formData.harga,
        location: formData.lokasi,
        bedrooms: formData.kamarTidur,
        bathrooms: formData.kamarMandi,
        land_area: formData.luasTanah,
        building_area: formData.luasBangunan,
        description: formData.deskripsi,
        owner_name: formData.namaPemilik,
        source: "Titip Properti",
      };

      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal mengirim formulir.");
      }

      setSubmitted(true);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Gagal mengirim formulir.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 pt-20">
      <div className="container mx-auto max-w-3xl space-y-6 px-4">
        {/* Header & Back Button */}
        <div>
          <Link
            href="/"
            className="mb-2 flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Beranda
          </Link>
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Titip Jual / Sewa Properti
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Pasarkan properti Anda dengan mudah bersama Realthink Property dan menjangkau ribuan
            calon pembeli potensial.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-gray-900">
              Properti Berhasil Dititipkan!
            </h3>
            <p className="mx-auto max-w-md text-sm text-gray-600">
              Terima kasih, <span className="font-semibold">{formData.namaPemilik}</span>. Data
              properti Anda telah masuk ke sistem dan akan ditangani tim admin melalui dashboard CRM.
              Kami akan segera meninjau informasi properti Anda dan menghubungi nomor{" "}
              <span className="font-semibold">{formData.telepon}</span>.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setServerError("");
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
                className="bg-primary hover:bg-primary/90 rounded-xl px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all"
              >
                Titip Properti Lainnya
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="rounded-xl bg-amber-100 p-2.5 text-amber-600">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-900">
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
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Judul Properti <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="judul"
                  required
                  value={formData.judul}
                  onChange={handleChange}
                  placeholder="Contoh: Dijual Rumah Mewah Minimalist di Jakarta Selatan"
                  className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Kategori & Tipe Properti */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Kategori Transaksi <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Dijual">Dijual</option>
                    <option value="Disewa">Disewa</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Tipe Properti <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tipe"
                    value={formData.tipe}
                    onChange={handleChange}
                    className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Harga Penawaran (Rp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute top-2.5 left-3 text-sm font-semibold text-gray-400">
                      Rp
                    </span>
                    <input
                      type="text"
                      name="harga"
                      required
                      value={formData.harga}
                      onChange={handleChange}
                      placeholder="1.500.000.000"
                      className="w-full rounded-xl border bg-white py-2.5 pr-3 pl-10 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Lokasi / Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lokasi"
                    required
                    value={formData.lokasi}
                    onChange={handleChange}
                    placeholder="Contoh: Menteng, Jakarta Pusat"
                    className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Spesifikasi Detail */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Kamar Tidur
                  </label>
                  <input
                    type="number"
                    name="kamarTidur"
                    value={formData.kamarTidur}
                    onChange={handleChange}
                    placeholder="3"
                    className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Kamar Mandi
                  </label>
                  <input
                    type="number"
                    name="kamarMandi"
                    value={formData.kamarMandi}
                    onChange={handleChange}
                    placeholder="2"
                    className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Luas Tanah (m²)
                  </label>
                  <input
                    type="number"
                    name="luasTanah"
                    value={formData.luasTanah}
                    onChange={handleChange}
                    placeholder="120"
                    className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Luas Bangunan (m²)
                  </label>
                  <input
                    type="number"
                    name="luasBangunan"
                    value={formData.luasBangunan}
                    onChange={handleChange}
                    placeholder="100"
                    className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Deskripsi & Fasilitas Properti
                </label>
                <textarea
                  name="deskripsi"
                  rows={4}
                  value={formData.deskripsi}
                  onChange={handleChange}
                  placeholder="Jelaskan keunggulan properti, fasilitas sekitar, kondisi bangunan, dll."
                  className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                ></textarea>
              </div>

              {/* Informasi Kontak Pemilik */}
              <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-2 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Nama Pemilik / Agen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaPemilik"
                    required
                    value={formData.namaPemilik}
                    onChange={handleChange}
                    placeholder="Nama Lengkap"
                    className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Nomor WhatsApp / Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telepon"
                    required
                    value={formData.telepon}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {serverError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            {/* Tombol Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 shadow-primary/25 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-white shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Mengirim data..." : "Kirim & Pasarkan Properti"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
