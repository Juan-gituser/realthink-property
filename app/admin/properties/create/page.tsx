"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; //  BENAR (untuk App Router)
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Upload, Loader2, Building, CheckCircle2 } from "lucide-react";

export default function CreatePropertyPage() {
  const router = useRouter();

  // State Form
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<"dijual" | "disewa">("dijual");
  const [category, setCategory] = useState("Rumah");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [bathrooms, setBathrooms] = useState<number | "">("");
  const [landArea, setLandArea] = useState<number | "">("");
  const [buildingArea, setBuildingArea] = useState<number | "">("");
  const [isFeatured, setIsFeatured] = useState(false);

  // State File & Upload Status
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper untuk slug URL dari judul
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Handler Pilih File Gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handler Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (!imageFile) {
        throw new Error("Silakan pilih gambar utama properti terlebih dahulu.");
      }

      // 1. Upload Gambar ke Supabase Storage Bucket 'properties'
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `listings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("properties")
        .upload(filePath, imageFile);

      if (uploadError) {
        throw new Error(`Gagal upload gambar: ${uploadError.message}`);
      }

      // 2. Dapatkan Public URL Gambar
      const { data: publicUrlData } = supabase.storage
        .from("properties")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // 3. Simpan Data Properti ke Tabel 'properties' di Supabase Database
      const slug = `${generateSlug(title)}-${Date.now().toString().slice(-4)}`;

      const { error: insertError } = await supabase.from("properties").insert([
        {
          title,
          slug,
          price,
          status,
          category,
          location,
          city,
          district,
          bedrooms: Number(bedrooms) || 0,
          bathrooms: Number(bathrooms) || 0,
          land_area: Number(landArea) || 0,
          building_area: Number(buildingArea) || 0,
          image_url: imageUrl,
          is_featured: isFeatured,
        },
      ]);

      if (insertError) {
        throw new Error(`Gagal menyimpan data: ${insertError.message}`);
      }

      alert("Properti berhasil ditambahkan!");
      router.push("/admin/properties"); // Redireksi ke halaman daftar properti
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Tombol Kembali & Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/properties"
          className="p-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Tambah Properti Baru
          </h1>
          <p className="text-sm text-gray-500">
            Isi detail spesifikasi dan unggah gambar properti ke database.
          </p>
        </div>
      </div>

      {/* Alert Error Jika Ada */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-xl">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Form Utama */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        
        {/* Upload Foto */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Foto Utama Properti <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-48 h-36 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2 text-gray-400">
                  <Upload className="w-8 h-8 mx-auto mb-1" />
                  <span className="text-xs">Pilih Gambar</span>
                </div>
              )}
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
              />
              <p className="text-xs text-gray-400">
                Format PNG, JPG, WEBP maks 5MB.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Informasi Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Judul Properti <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Rumah Minimalis Modern Hook Cilandak"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Harga (Teks Tampilan) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Rp 1.250.000.000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Status Properti</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "dijual" | "disewa")}
              className="w-full p-2.5 border rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="dijual">Dijual</option>
              <option value="disewa">Disewa</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="Rumah">Rumah</option>
              <option value="Apartemen">Apartemen</option>
              <option value="Ruko">Ruko</option>
              <option value="Villa">Villa</option>
              <option value="Tanah">Tanah</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Lokasi Ringkas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Cilandak, Jakarta Selatan"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Kota / Kabupaten</label>
            <input
              type="text"
              placeholder="Jakarta Selatan"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Kecamatan</label>
            <input
              type="text"
              placeholder="Cilandak"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Spesifikasi Bangunan */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Kamar Tidur</label>
            <input
              type="number"
              placeholder="3"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : "")}
              className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Kamar Mandi</label>
            <input
              type="number"
              placeholder="2"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value ? Number(e.target.value) : "")}
              className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Luas Tanah (m²)</label>
            <input
              type="number"
              placeholder="120"
              value={landArea}
              onChange={(e) => setLandArea(e.target.value ? Number(e.target.value) : "")}
              className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Luas Bangunan (m²)</label>
            <input
              type="number"
              placeholder="90"
              value={buildingArea}
              onChange={(e) => setBuildingArea(e.target.value ? Number(e.target.value) : "")}
              className="w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
        </div>

        {/* Checkbox Featured */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-secondary"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">
            Jadikan Properti Pilihan (Featured)
          </label>
        </div>

        {/* Button Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengunggah & Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Simpan Properti
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}