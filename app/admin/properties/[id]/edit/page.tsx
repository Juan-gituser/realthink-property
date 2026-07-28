"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Building,
  ImagePlus,
  X,
  Save,
  ArrowLeft,
  Loader2,
  MapPin,
  FileText,
  Ruler,
} from "lucide-react";

// 🟢 Dynamic Import LocationPickerMap (No SSR)
const LocationPickerMap = dynamic(
  () => import("@/components/LocationPickerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 w-full items-center justify-center rounded-2xl bg-gray-100 text-xs font-medium text-gray-400 animate-pulse">
        Memuat Peta...
      </div>
    ),
  }
);

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Support Async Params pada Next.js 15+
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const id = resolvedParams.id;

  const router = useRouter();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [displayPrice, setDisplayPrice] = useState(""); // Nilai harga terformat (titik)
  const [status, setStatus] = useState<"dijual" | "disewa">("dijual");
  const [category, setCategory] = useState("Rumah");
  const [legality, setLegality] = useState("SHM");

  // Alamat State
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  // Spesifikasi State
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [bathrooms, setBathrooms] = useState<number | "">("");
  const [landArea, setLandArea] = useState<number | "">("");
  const [buildingArea, setBuildingArea] = useState<number | "">("");

  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // State Koordinat Peta
  const [lat, setLat] = useState<number>(-6.2); // Default Jakarta
  const [lng, setLng] = useState<number>(106.816666);

  // State untuk Foto Eksisting (yang sudah di-upload sebelumnya)
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // State untuk Foto Baru (Multiple Files & Previews)
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // 🟢 1. Fetch Data Properti Awal berdasarkan ID
  useEffect(() => {
    async function fetchProperty() {
      try {
        setFetching(true);
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          setTitle(data.title || "");
          setDisplayPrice(
            data.price ? new Intl.NumberFormat("id-ID").format(Number(data.price)) : ""
          );
          setStatus(data.status || "dijual");
          setCategory(data.category || "Rumah");
          setLegality(data.legality || "SHM");

          setAddress(data.address || "");
          setProvince(data.province || "");
          setCity(data.city || "");
          setDistrict(data.district || "");

          setBedrooms(data.bedrooms ?? "");
          setBathrooms(data.bathrooms ?? "");
          setLandArea(data.land_area ?? data.land_size ?? "");
          setBuildingArea(data.building_area ?? data.building_size ?? "");

          setDescription(data.description || "");
          setIsFeatured(data.is_featured || false);

          if (data.lat) setLat(Number(data.lat));
          if (data.lng) setLng(Number(data.lng));

          // Set foto eksisting
          const imgs = Array.isArray(data.images) && data.images.length > 0
            ? data.images
            : data.image_url
            ? [data.image_url]
            : [];
          setExistingImages(imgs);
        }
      } catch (err: any) {
        setErrorMsg(err?.message || "Gagal memuat data properti.");
      } finally {
        setFetching(false);
      }
    }

    if (id) fetchProperty();
  }, [id]);

  // 🟢 Helper untuk auto-format titik ribuan pada Harga
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Ambil hanya angka
    if (!rawValue) {
      setDisplayPrice("");
      return;
    }
    const formatted = new Intl.NumberFormat("id-ID").format(Number(rawValue));
    setDisplayPrice(formatted);
  };

  // Helper untuk slug URL
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleLocationChange = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  // Handler untuk Tambah File Foto Baru
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    setNewImageFiles((prev) => [...prev, ...filesArray]);

    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Handler Hapus Foto Eksisting
  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler Hapus Foto Baru
  const handleRemoveNewImage = (index: number) => {
    if (newImagePreviews[index]) {
      URL.revokeObjectURL(newImagePreviews[index]);
    }
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 🟢 2. Submit Handler Update Properti
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const totalImages = existingImages.length + newImageFiles.length;
      if (totalImages === 0) {
        throw new Error("Silakan pilih minimal satu foto utama properti.");
      }

      // Clean harga dari titik untuk disimpan di Database
      const rawPrice = displayPrice.replace(/\D/g, "");

      // Auto Generate Lokasi Ringkas (Kecamatan, Kota/Provinsi)
      const locationRingkas = [district, city || province]
        .filter(Boolean)
        .join(", ") || address;

      const newlyUploadedUrls: string[] = [];

      // Upload Foto-Foto Baru ke Supabase Storage (jika ada)
      for (const file of newImageFiles) {
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

        newlyUploadedUrls.push(publicUrlData.publicUrl);
      }

      // Gabungkan Foto Eksisting + Foto Baru
      const finalImages = [...existingImages, ...newlyUploadedUrls];
      const mainImageUrl = finalImages[0] || "";

      // Regenerate slug jika judul diperbarui
      const slug = `${generateSlug(title)}-${Date.now().toString().slice(-4)}`;

      // Update Data ke Database Supabase
      const { error: dbError } = await supabase
        .from("properties")
        .update({
          title,
          slug,
          price: rawPrice,
          status,
          category,
          legality,
          location: locationRingkas,
          address,
          province,
          city,
          district,
          lat,
          lng,
          bedrooms: Number(bedrooms) || 0,
          bathrooms: Number(bathrooms) || 0,
          land_area: Number(landArea) || 0,
          building_area: Number(buildingArea) || 0,
          description,
          image_url: mainImageUrl,
          images: finalImages,
          is_featured: isFeatured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (dbError) throw dbError;

      alert("Properti berhasil diperbarui!");
      router.push("/admin/properties");
      router.refresh();
    } catch (err: any) {
      const actualErrorMsg =
        err?.message ||
        err?.error_description ||
        err?.details ||
        err?.hint ||
        (typeof err === "object" && err !== null
          ? JSON.stringify(err, Object.getOwnPropertyNames(err))
          : String(err));

      console.error(`Detail Error Lengkap: ${actualErrorMsg}`);
      setErrorMsg(actualErrorMsg || "Terjadi kesalahan saat memperbarui properti.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-96 w-full items-center justify-center text-xs text-gray-500 font-medium">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-amber-500" />
        Memuat data properti...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
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
            <span className="mb-1 inline-block rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-600">
              Manajemen Properti
            </span>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Edit Properti
            </h1>
            <p className="text-xs text-gray-400">ID Properti: {id}</p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 shadow-sm">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Form Edit Properti */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SEKSI 1: INFORMASI UTAMA & SPESIFIKASI */}
        <div className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Informasi Utama & Spesifikasi
              </h2>
              <p className="text-xs text-gray-500">
                Atribut dasar properti, harga, dan spesifikasi fisik bangunan.
              </p>
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
                Harga (Rp) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-400">
                  Rp
                </span>
                <input
                  type="text"
                  required
                  value={displayPrice}
                  onChange={handlePriceChange}
                  placeholder="1.250.000.000"
                  className="w-full rounded-xl border border-gray-200 pl-9 pr-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Status Properti
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "dijual" | "disewa")}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              >
                <option value="dijual">Dijual</option>
                <option value="disewa">Disewa</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Kategori Properti
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              >
                <option value="Rumah">Rumah</option>
                <option value="Apartemen">Apartemen</option>
                <option value="Ruko">Ruko</option>
                <option value="Villa">Villa</option>
                <option value="Tanah">Tanah</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Legalitas / Sertifikat
              </label>
              <select
                value={legality}
                onChange={(e) => setLegality(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              >
                <option value="SHM">SHM - Sertifikat Hak Milik</option>
                <option value="HGB">HGB - Hak Guna Bangunan</option>
                <option value="SHSRS">SHSRS - Sertifikat Hak Satuan Rumah Susun</option>
                <option value="AJB">AJB - Akta Jual Beli</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Sub-Seksi Spesifikasi Fisik */}
          <div className="pt-2 border-t border-gray-100">
            <label className="mb-3 text-gray-800 flex items-center gap-1.5 text-xs font-bold">
              <Ruler className="h-4 w-4 text-amber-500" /> Spesifikasi Fisik
            </label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-gray-600">
                  Kamar Tidur
                </label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) =>
                    setBedrooms(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="3"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-gray-600">
                  Kamar Mandi
                </label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) =>
                    setBathrooms(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="2"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-gray-600">
                  Luas Tanah (m²)
                </label>
                <input
                  type="number"
                  value={landArea}
                  onChange={(e) =>
                    setLandArea(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="120"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-gray-600">
                  Luas Bangunan (m²)
                </label>
                <input
                  type="number"
                  value={buildingArea}
                  onChange={(e) =>
                    setBuildingArea(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="90"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEKSI 2: ALAMAT & LOKASI PETA */}
        <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Alamat & Titik Lokasi Peta
              </h2>
              <p className="text-xs text-gray-500">
                Isi wilayah administratif dan cari lokasi presisi pada peta interaktif.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Provinsi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="DKI Jakarta"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Kota / Kabupaten
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Jakarta Selatan"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Kecamatan
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Cilandak"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Alamat Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Jl. Cilandak Barat No. 12, RT 04 / RW 02"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Map Picker Component */}
          <div className="pt-2">
            <LocationPickerMap
              address={address}
              onAddressChange={(newAddress) => setAddress(newAddress)}
              lat={lat}
              lng={lng}
              onLocationChange={handleLocationChange}
            />
          </div>
        </div>

        {/* SEKSI 3: DESKRIPSI LENGKAP */}
        <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Deskripsi Lengkap
              </h2>
              <p className="text-xs text-gray-500">
                Jelaskan keunggulan unit, akses transportasi, dan fasilitas terdekat.
              </p>
            </div>
          </div>

          <div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan fasilitas, kondisi bangunan, keunggulan lokasi, dll..."
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* SEKSI 4: GALERI FOTO */}
        <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Galeri Foto Properti
              </h2>
              <p className="text-xs text-gray-500">
                Kelola foto yang tersimpan atau tambahkan foto baru. Foto pertama otomatis menjadi foto sampul utama.
              </p>
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <label className="flex flex-col items-center justify-center cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 text-center transition hover:bg-gray-100/50">
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                  <ImagePlus className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-gray-700">
                  Klik untuk tambah foto baru atau seret file ke sini
                </p>
                <p className="text-[10px] text-gray-400">
                  PNG, JPG, JPEG (Bisa pilih lebih dari satu)
                </p>
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

          {/* Previews Foto (Eksisting & Baru) */}
          {(existingImages.length > 0 || newImagePreviews.length > 0) && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-700">
                Semua Foto ({existingImages.length + newImagePreviews.length}):
              </p>
              
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {/* 1. Render Foto Eksisting yang Sudah Ada */}
                {existingImages.map((src, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs"
                  >
                    <img
                      src={src}
                      alt={`Foto Eksisting ${index}`}
                      className="h-full w-full object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        Utama
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition hover:bg-rose-700 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* 2. Render Preview Foto Baru */}
                {newImagePreviews.map((src, index) => {
                  const globalIndex = existingImages.length + index;
                  return (
                    <div
                      key={`new-${index}`}
                      className="relative group aspect-square rounded-xl overflow-hidden border-2 border-amber-400 bg-gray-100 shadow-xs"
                    >
                      <img
                        src={src}
                        alt={`Preview Baru ${index}`}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2 left-2 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        Baru
                      </span>
                      {globalIndex === 0 && (
                        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          Utama
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition hover:bg-rose-700 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SEKSI 5: OPTION & SUBMIT */}
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <input
            type="checkbox"
            id="featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
          />
          <label
            htmlFor="featured"
            className="cursor-pointer text-xs font-semibold text-gray-700"
          >
            Jadikan Properti Pilihan (Featured / Unggulan di Beranda)
          </label>
        </div>

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
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}