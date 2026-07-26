"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, PropertyFormInput, PropertyFormValues } from "@/lib/validations/admin";
import { uploadMultipleImages } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ImagePlus, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PropertyForm() {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const router = useRouter();
  const supabase = createClient();

  // Integrasi tipe Input dan Output pada Generik useForm
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormInput, undefined, PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      slug: "",
      price: 0,
      categoryId: "",
      status: "dijual",
      listingStatus: "published",
      province: "",
      city: "",
      district: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      landArea: 0,
      buildingArea: 0,
      bedrooms: 0,
      bathrooms: 0,
      garages: 0,
      electricity: 1300,
      water: "PDAM",
      certificate: "SHM",
      description: "",
      youtubeVideoUrl: "",
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
    },
  });

  // Otomatis buat slug dari judul
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const slugVal = val
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setValue("slug", slugVal);
  };

  // Preview Gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      setSelectedFiles(filesArr);
      const previews = filesArr.map((f) => URL.createObjectURL(f));
      setPreviewUrls(previews);
    }
  };

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setUploading(true);
      let imageUrls: string[] = [];

      // Upload Gambar ke Supabase Storage
      if (selectedFiles.length > 0) {
        imageUrls = await uploadMultipleImages(selectedFiles, "properties");
      }

      // Insert ke database Supabase
      const { error } = await supabase.from("properties").insert({
        title: data.title,
        slug: data.slug,
        price: data.price,
        category_id: data.categoryId,
        status: data.status,
        listing_status: data.listingStatus,
        province: data.province,
        city: data.city,
        district: data.district,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        land_area: data.landArea,
        building_area: data.buildingArea,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        garages: data.garages,
        electricity: data.electricity,
        water: data.water,
        certificate: data.certificate,
        description: data.description,
        youtube_video_url: data.youtubeVideoUrl,
        thumbnail_url: imageUrls[0] || "",
        images: imageUrls,
        is_featured: data.isFeatured,
        meta_title: data.metaTitle,
        meta_description: data.metaDescription,
      });

      if (error) throw error;

      alert("Properti berhasil disimpan!");
      router.push("/admin/properties");
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert("Gagal menyimpan properti: " + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border max-w-5xl space-y-8 rounded-xl border bg-white p-8 shadow-sm"
    >
      <div className="border-border border-b pb-4">
        <h2 className="text-primary text-2xl font-bold">Tambah Properti Baru</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Lengkapi informasi properti secara detail untuk publikasi.
        </p>
      </div>

      {/* Informasi Utama */}
      <div className="space-y-4">
        <h3 className="text-primary border-secondary border-l-4 pl-3 text-lg font-semibold">
          1. Informasi Utama
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Judul Properti</label>
            <input
              type="text"
              {...register("title")}
              onChange={handleTitleChange}
              placeholder="Contoh: Rumah Minimalis Modern BSD"
              className="focus:ring-secondary mt-1 w-full rounded-lg border p-2.5 text-sm outline-none focus:ring-1"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Slug URL</label>
            <input
              type="text"
              {...register("slug")}
              className="mt-1 w-full rounded-lg border bg-gray-50 p-2.5 text-sm outline-none"
              readOnly
            />
            {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Harga (Rp)</label>
            <input
              type="number"
              {...register("price")}
              placeholder="1500000000"
              className="mt-1 w-full rounded-lg border p-2.5 text-sm outline-none"
            />
            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Status Listing</label>
            <select
              {...register("status")}
              className="mt-1 w-full rounded-lg border bg-white p-2.5 text-sm outline-none"
            >
              <option value="dijual">Dijual</option>
              <option value="disewa">Disewa</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">
              Status Publikasi
            </label>
            <select
              {...register("listingStatus")}
              className="mt-1 w-full rounded-lg border bg-white p-2.5 text-sm outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="sold">Terjual (Sold)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spesifikasi Properti */}
      <div className="border-border space-y-4 border-t pt-4">
        <h3 className="text-primary border-secondary border-l-4 pl-3 text-lg font-semibold">
          2. Spesifikasi Bangunan
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Luas Tanah (m²)</label>
            <input
              type="number"
              {...register("landArea")}
              className="mt-1 w-full rounded-lg border p-2.5 text-sm"
            />
            {errors.landArea && (
              <p className="mt-1 text-xs text-red-500">{errors.landArea.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">
              Luas Bangunan (m²)
            </label>
            <input
              type="number"
              {...register("buildingArea")}
              className="mt-1 w-full rounded-lg border p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Kamar Tidur</label>
            <input
              type="number"
              {...register("bedrooms")}
              className="mt-1 w-full rounded-lg border p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Kamar Mandi</label>
            <input
              type="number"
              {...register("bathrooms")}
              className="mt-1 w-full rounded-lg border p-2.5 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Upload Gambar Banyak */}
      <div className="border-border space-y-4 border-t pt-4">
        <h3 className="text-primary border-secondary border-l-4 pl-3 text-lg font-semibold">
          3. Galeri Foto
        </h3>

        <div className="border-border relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition hover:bg-gray-50">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <ImagePlus className="text-muted-foreground mx-auto mb-2 h-10 w-10" />
          <p className="text-sm font-medium text-gray-700">Klik atau seret foto properti ke sini</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Bisa pilih beberapa gambar sekaligus (JPG, PNG, WEBP)
          </p>
        </div>

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-6">
            {previewUrls.map((url, idx) => (
              <div
                key={idx}
                className="border-border group relative h-24 overflow-hidden rounded-lg border"
              >
                <Image src={url} alt="preview" fill className="object-cover" />
                {idx === 0 && (
                  <span className="bg-secondary text-primary absolute bottom-1 left-1 z-10 rounded px-1.5 py-0.5 text-[10px] font-bold">
                    Thumbnail
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkbox Featured */}
      <div className="border-border flex items-center gap-3 border-t pt-4">
        <input
          type="checkbox"
          id="featured"
          {...register("isFeatured")}
          className="accent-primary h-5 w-5 cursor-pointer rounded"
        />
        <label htmlFor="featured" className="cursor-pointer text-sm font-semibold text-gray-800">
          Jadikan Properti Unggulan (Featured)
        </label>
      </div>

      {/* Submit Button */}
      <div className="border-border flex justify-end border-t pt-6">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-8 py-3 font-semibold text-white shadow-md transition disabled:opacity-50"
        >
          {isSubmitting || uploading ? (
            <>
              <Loader2 className="text-secondary h-5 w-5 animate-spin" /> Menyimpan...
            </>
          ) : (
            <>
              <CheckCircle2 className="text-secondary h-5 w-5" /> Simpan Properti
            </>
          )}
        </button>
      </div>
    </form>
  );
}