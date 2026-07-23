"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  propertySchema, 
  PropertyFormInput, 
  PropertyFormValues 
} from "@/lib/validations/admin";
import { uploadMultipleImages } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ImagePlus, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormInput, any, PropertyFormValues>({
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
    } catch (err: any) {
      alert("Gagal menyimpan properti: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl bg-white p-8 rounded-xl border border-border shadow-sm">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-primary">Tambah Properti Baru</h2>
        <p className="text-sm text-muted-foreground mt-1">Lengkapi informasi properti secara detail untuk publikasi.</p>
      </div>

      {/* Informasi Utama */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary border-l-4 border-secondary pl-3">1. Informasi Utama</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Judul Properti</label>
            <input
              type="text"
              {...register("title")}
              onChange={handleTitleChange}
              placeholder="Contoh: Rumah Minimalis Modern BSD"
              className="w-full mt-1 p-2.5 border rounded-lg text-sm focus:ring-1 focus:ring-secondary outline-none"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Slug URL</label>
            <input
              type="text"
              {...register("slug")}
              className="w-full mt-1 p-2.5 border rounded-lg text-sm bg-gray-50 outline-none"
              readOnly
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Harga (Rp)</label>
            <input
              type="number"
              {...register("price")}
              placeholder="1500000000"
              className="w-full mt-1 p-2.5 border rounded-lg text-sm outline-none"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Status Listing</label>
            <select {...register("status")} className="w-full mt-1 p-2.5 border rounded-lg text-sm bg-white outline-none">
              <option value="dijual">Dijual</option>
              <option value="disewa">Disewa</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Status Publikasi</label>
            <select {...register("listingStatus")} className="w-full mt-1 p-2.5 border rounded-lg text-sm bg-white outline-none">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="sold">Terjual (Sold)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spesifikasi Properti */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-primary border-l-4 border-secondary pl-3">2. Spesifikasi Bangunan</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Luas Tanah (m²)</label>
            <input type="number" {...register("landArea")} className="w-full mt-1 p-2.5 border rounded-lg text-sm" />
            {errors.landArea && <p className="text-red-500 text-xs mt-1">{errors.landArea.message}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Luas Bangunan (m²)</label>
            <input type="number" {...register("buildingArea")} className="w-full mt-1 p-2.5 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Kamar Tidur</label>
            <input type="number" {...register("bedrooms")} className="w-full mt-1 p-2.5 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase">Kamar Mandi</label>
            <input type="number" {...register("bathrooms")} className="w-full mt-1 p-2.5 border rounded-lg text-sm" />
          </div>
        </div>
      </div>

      {/* Upload Gambar Banyak */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-primary border-l-4 border-secondary pl-3">3. Galeri Foto</h3>
        
        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <ImagePlus className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Klik atau seret foto properti ke sini</p>
          <p className="text-xs text-muted-foreground mt-1">Bisa pilih beberapa gambar sekaligus (JPG, PNG, WEBP)</p>
        </div>

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="relative h-24 rounded-lg overflow-hidden border border-border group">
                <img src={url} alt="preview" className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-secondary text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Thumbnail
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkbox Featured */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <input
          type="checkbox"
          id="featured"
          {...register("isFeatured")}
          className="w-5 h-5 accent-primary rounded cursor-pointer"
        />
        <label htmlFor="featured" className="text-sm font-semibold text-gray-800 cursor-pointer">
          Jadikan Properti Unggulan (Featured)
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-border flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {(isSubmitting || uploading) ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-secondary" /> Menyimpan...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 text-secondary" /> Simpan Properti
            </>
          )}
        </button>
      </div>
    </form>
  );
}