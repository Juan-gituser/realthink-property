"use client";

import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Star,
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

interface SelectedImage {
  id: string;
  file: File;
  previewUrl: string;
}

// Interface untuk Kategori Properti dari Supabase
interface CategoryOption {
  id: string | number;
  name: string; // sesuaikan jika nama kolom di Supabase adalah 'title' atau 'category_name'
}

export default function CreatePropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [displayPrice, setDisplayPrice] = useState("");
  const [status, setStatus] = useState<"dijual" | "disewa">("dijual");
  
  // 🟢 Dynamic Category States
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [category, setCategory] = useState("");

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
  const [lat, setLat] = useState<number>(-6.2);
  const [lng, setLng] = useState<number>(106.816666);

  // State Terpadu untuk Foto
  const [images, setImages] = useState<SelectedImage[]>([]);

  // State Drag & Drop Native
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // 🟢 Fetch Data Kategori dari Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetchingCategories(true);
        const { data, error } = await supabase
          .from("categories") // Ubah nama tabel menjadi 'categories'
          .select("id, name")
          .order("name", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setCategories(data);
          setCategory(data[0].name); // Default pilih item pertama
        }
      } catch (err) {
        console.error("Gagal memuat kategori properti:", err);
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Pembersihan memory leak preview URL
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  // Helper untuk auto-format titik ribuan pada Harga
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
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

  // Handler Pilih File Foto
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    const validImages: SelectedImage[] = [];
    const MAX_SIZE_MB = 5;

    filesArray.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`File "${file.name}" bukan berupa gambar.`);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`Ukuran foto "${file.name}" melebihi batas ${MAX_SIZE_MB}MB.`);
        return;
      }

      validImages.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    });

    setImages((prev) => [...prev, ...validImages]);
    e.target.value = "";
  };

  // Handler Hapus Foto
  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const itemToRemove = prev.find((img) => img.id === id);
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  // Helper Geser Posisi Foto
  const moveImage = (currentIndex: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const [movedItem] = updated.splice(currentIndex, 1);
    updated.splice(targetIndex, 0, movedItem);
    setImages(updated);
  };

  // Helper Set Foto Utama
  const setAsMainImage = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setImages(updated);
  };

  // HANDLER DRAG & DROP
  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...images];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    setImages(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (images.length === 0) {
        throw new Error("Silakan pilih minimal satu foto utama properti terlebih dahulu.");
      }

      const rawPriceNumeric = Number(displayPrice.replace(/\D/g, "")) || 0;
      if (rawPriceNumeric <= 0) {
        throw new Error("Silakan masukkan harga properti yang valid.");
      }

      const locationRingkas =
        [district, city || province].filter(Boolean).join(", ") || address;

      // 1. Upload foto ke Supabase Storage
      const uploadPromises = images.map(async (item) => {
        const file = item.file;
        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const uniqueId = typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        const fileName = `${uniqueId}.${fileExt}`;
        const filePath = `listings/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("properties")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("properties")
          .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // 2. Buat slug unik
      const slug = `${generateSlug(title)}-${Date.now().toString().slice(-5)}`;

      // 3. Insert ke DB Supabase
      const { error: dbError } = await supabase.from("properties").insert([
        {
          title,
          slug,
          price: rawPriceNumeric,
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
      const actualErrorMsg =
        (err instanceof Error && err.message) ||
        (typeof err === "object" && err !== null && "message" in err && typeof (err as { message?: unknown }).message === "string"
          ? (err as { message?: string }).message
          : "Terjadi kesalahan saat menyimpan properti.");

      console.error(`Detail Error Lengkap: ${actualErrorMsg}`);
      setErrorMsg(actualErrorMsg || "Terjadi kesalahan saat menyimpan properti.");
    } finally {
      setLoading(false);
    }
  };

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
              Tambah Properti Baru
            </h1>
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
                disabled={loading}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Rumah Minimalis Modern Hook Cilandak"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
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
                  disabled={loading}
                  value={displayPrice}
                  onChange={handlePriceChange}
                  placeholder="1.250.000.000"
                  className="w-full rounded-xl border border-gray-200 pl-9 pr-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Status Properti
              </label>
              <select
                disabled={loading}
                value={status}
                onChange={(e) => setStatus(e.target.value as "dijual" | "disewa")}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
              >
                <option value="dijual">Dijual</option>
                <option value="disewa">Disewa</option>
              </select>
            </div>

            {/* 🟢 DYNAMIC CATEGORY DROPDOWN */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Kategori Properti
              </label>
              <select
                disabled={loading || fetchingCategories}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
              >
                {fetchingCategories ? (
                  <option value="">Memuat kategori...</option>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="">Tidak ada kategori tersedia</option>
                )}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Legalitas / Sertifikat
              </label>
              <select
                disabled={loading}
                value={legality}
                onChange={(e) => setLegality(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
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
                  min="0"
                  disabled={loading}
                  value={bedrooms}
                  onChange={(e) =>
                    setBedrooms(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="3"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-gray-600">
                  Kamar Mandi
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={loading}
                  value={bathrooms}
                  onChange={(e) =>
                    setBathrooms(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="2"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-gray-600">
                  Luas Tanah (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={loading}
                  value={landArea}
                  onChange={(e) =>
                    setLandArea(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="120"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-gray-600">
                  Luas Bangunan (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={loading}
                  value={buildingArea}
                  onChange={(e) =>
                    setBuildingArea(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="90"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
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
                disabled={loading}
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="DKI Jakarta"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Kota / Kabupaten
              </label>
              <input
                type="text"
                disabled={loading}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Jakarta Selatan"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Kecamatan
              </label>
              <input
                type="text"
                disabled={loading}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Cilandak"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Alamat Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Jl. Cilandak Barat No. 12, RT 04 / RW 02"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>
          </div>

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
              rows={5}
              disabled={loading}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan fasilitas, kondisi bangunan, keunggulan lokasi, dll..."
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-none disabled:bg-gray-50"
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
                Pilih beberapa foto sekaligus. Geser urutan foto atau gunakan tombol di bawahnya — foto posisi pertama otomatis menjadi <strong>Cover Utama</strong>.
              </p>
            </div>
          </div>

          <div>
            <label className="flex flex-col items-center justify-center cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 text-center transition hover:bg-gray-100/50">
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                  <ImagePlus className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-gray-700">
                  Klik untuk pilih foto atau seret file ke sini
                </p>
                <p className="text-[10px] text-gray-400">
                  PNG, JPG, JPEG (Maksimal 5MB per file)
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={loading}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {images.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-gray-700">
                  Foto Terpilih ({images.length}):
                </p>
                <span className="text-[11px] text-amber-600 font-medium">
                  💡 Gunakan drag & drop atau tombol panah untuk atur urutan
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((item, index) => {
                  const isDragging = draggedIndex === index;
                  const isDragOver = dragOverIndex === index;

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={() => handleDrop(index)}
                      onDragEnd={handleDragEnd}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-gray-100 transition-all cursor-grab active:cursor-grabbing select-none ${
                        isDragging
                          ? "opacity-30 scale-95 border-amber-500"
                          : isDragOver
                          ? "border-2 border-amber-500 scale-102 shadow-lg"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-200">
                        <img
                          src={item.previewUrl}
                          alt={`Foto ${index + 1}`}
                          className="h-full w-full object-cover pointer-events-none"
                        />

                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                            Utama
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(item.id);
                          }}
                          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/90 text-white shadow-md backdrop-blur-xs transition hover:bg-rose-600 hover:scale-110 active:scale-95 cursor-pointer"
                          title="Hapus Foto"
                        >
                          <X className="h-4 w-4 stroke-[2.5]" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 bg-white p-1.5">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveImage(index, "left")}
                            className="flex h-6 w-6 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Geser Kiri"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === images.length - 1}
                            onClick={() => moveImage(index, "right")}
                            className="flex h-6 w-6 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Geser Kanan"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => setAsMainImage(index)}
                            className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700 transition hover:bg-amber-100"
                            title="Set sebagai foto utama"
                          >
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            <span>Utama</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SEKSI 5: OPTION & SUBMIT */}
        <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <input
            type="checkbox"
            id="featured"
            disabled={loading}
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
                Simpan Properti
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}