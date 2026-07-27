// app/admin/properties/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Building, ImagePlus, X, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreatePropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<"dijual" | "disewa">("dijual");
  const [category, setCategory] = useState("Rumah");
  const [legality, setLegality] = useState("SHM"); // State untuk Legalitas
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [bathrooms, setBathrooms] = useState<number | "">("");
  const [landArea, setLandArea] = useState<number | "">("");
  const [buildingArea, setBuildingArea] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // State untuk Multiple Files & Previews
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Helper untuk slug URL dari judul
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Handler saat memilih file foto
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    setImageFiles((prev) => [...prev, ...filesArray]);

    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Handler untuk menghapus foto dari list pilihan
  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler Submit Form ke Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (imageFiles.length === 0) {
        throw new Error("Silakan pilih minimal satu foto utama properti terlebih dahulu.");
      }

      const uploadedUrls: string[] = [];

      // 1. Upload semua foto ke Supabase Storage secara berurutan
      for (const file of imageFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `listings/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("properties")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("properties")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      // 2. Buat slug unik
      const slug = `${generateSlug(title)}-${Date.now().toString().slice(-4)}`;

      // 3. Simpan data properti ke database tabel 'properties'
      const { error: dbError } = await supabase.from("properties").insert([
        {
          title,
          slug,
          price,
          status,
          category,
          legality, // Menyimpan data legalitas
          location,
          city,
          district,
          bedrooms: Number(bedrooms) || 0,
          bathrooms: Number(bathrooms) || 0,
          land_area: Number(landArea) || 0,
          building_area: Number(buildingArea) || 0,
          description,
          image_url: uploadedUrls[0],
          images: uploadedUrls,
          is_featured: isFeatured,
        },
      ]);

      if (dbError) throw dbError;

      alert("Properti berhasil ditambahkan!");
      router.push("/admin/properties");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan properti.";
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/properties"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <span className="mb-1 inline-block rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-600 uppercase border border-amber-200">
              Manajemen Properti
            </span>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Tambah Properti Baru</h1>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 shadow-sm">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Form Tambah Properti */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Utama Unit */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Informasi Utama Unit</h2>
              <p className="text-xs text-gray-500">Masukkan detail lengkap properti yang akan dijual/disewa.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Judul Properti <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Rumah Minimalis Modern Hook Cilandak"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Harga (Teks Tampilan) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Contoh: Rp 1.250.000.000"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Status Properti</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "dijual" | "disewa")}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 bg-white focus:border-amber-500 focus:outline-none"
              >
                <option value="dijual">Dijual</option>
                <option value="disewa">Disewa</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 bg-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Rumah">Rumah</option>
                <option value="Apartemen">Apartemen</option>
                <option value="Ruko">Ruko</option>
                <option value="Villa">Villa</option>
                <option value="Tanah">Tanah</option>
              </select>
            </div>

            {/* Input Legalitas */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Legalitas / Sertifikat</label>
              <select
                value={legality}
                onChange={(e) => setLegality(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 bg-white focus:border-amber-500 focus:outline-none"
              >
                <option value="SHM">SHM - Sertifikat Hak Milik</option>
                <option value="HGB">HGB - Hak Guna Bangunan</option>
                <option value="SHSRS">SHSRS - Sertifikat Hak Satuan Rumah Susun</option>
                <option value="AJB">AJB - Akta Jual Beli</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Lokasi Ringkas <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Cilandak, Jakarta Selatan"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Kota / Kabupaten</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Jakarta Selatan"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Kecamatan</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Cilandak"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">Deskripsi Lengkap</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsikan fasilitas, jumlah kamar, luas tanah, dll..."
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Spesifikasi Bangunan */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Spesifikasi Fisik</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Kamar Tidur</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : "")}
                placeholder="3"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Kamar Mandi</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value ? Number(e.target.value) : "")}
                placeholder="2"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Luas Tanah (m²)</label>
              <input
                type="number"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value ? Number(e.target.value) : "")}
                placeholder="120"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Luas Bangunan (m²)</label>
              <input
                type="number"
                value={buildingArea}
                onChange={(e) => setBuildingArea(e.target.value ? Number(e.target.value) : "")}
                placeholder="90"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section Upload Multiple Foto */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Galeri Foto Properti</h2>
              <p className="text-xs text-gray-500">Anda dapat memilih dan mengunggah beberapa foto sekaligus (Foto pertama akan menjadi foto utama).</p>
            </div>
          </div>

          <div>
            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 text-center cursor-pointer transition hover:bg-gray-100/50">
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                  <ImagePlus className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-gray-700">Klik untuk pilih foto atau seret file ke sini</p>
                <p className="text-[10px] text-gray-400">PNG, JPG, JPEG (Bisa pilih lebih dari satu)</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-700">Foto Terpilih ({imagePreviews.length}):</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs">
                    <img src={src} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        Utama
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition hover:bg-rose-700 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Checkbox Featured */}
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <input
            type="checkbox"
            id="featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
          />
          <label htmlFor="featured" className="cursor-pointer text-xs font-semibold text-gray-700">
            Jadikan Properti Pilihan (Featured / Unggulan di Beranda)
          </label>
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                Mengunggah & Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 text-amber-400" />
                Simpan Properti
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}