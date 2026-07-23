import { z } from "zod";

// ==========================================
// 1. SKEMA PROPERTI
// ==========================================
export const propertySchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  slug: z.string().min(3, "Slug tidak boleh kosong"),
  price: z.coerce.number({ message: "Harga harus berupa angka" }).min(100000, "Harga tidak valid"),
  categoryId: z.string().min(1, "Pilih kategori properti"),
  status: z.enum(["dijual", "disewa"]),
  listingStatus: z.enum(["published", "draft", "sold"]),

  // Lokasi
  province: z.string().min(1, "Provinsi wajib diisi"),
  city: z.string().min(1, "Kota/Kabupaten wajib diisi"),
  district: z.string().min(1, "Kecamatan wajib diisi"),
  address: z.string().min(10, "Alamat lengkap minimal 10 karakter"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),

  // Spesifikasi
  landArea: z.coerce.number().min(1, "Luas tanah wajib diisi"),
  buildingArea: z.coerce.number().min(0),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  garages: z.coerce.number().min(0),
  electricity: z.coerce.number().min(0),
  water: z.string().min(1, "Jenis air wajib diisi"),
  certificate: z.string().min(1, "Sertifikat wajib diisi"),

  // Media & Detail
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  youtubeVideoUrl: z.string().url("URL Youtube tidak valid").optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),

  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Tipe khusus untuk Properti (Input vs Output untuk menangani z.coerce)
export type PropertyFormInput = z.input<typeof propertySchema>;
export type PropertyFormValues = z.output<typeof propertySchema>;

// ==========================================
// 2. SKEMA ARTIKEL
// ==========================================
export const articleSchema = z.object({
  title: z.string().min(5, "Judul artikel minimal 5 karakter"),
  slug: z.string().min(3, "Slug wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  excerpt: z.string().min(10, "Ringkasan minimal 10 karakter"),
  content: z.string().min(50, "Konten artikel minimal 50 karakter"),
  status: z.enum(["published", "draft"]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Tipe khusus untuk Artikel
export type ArticleFormInput = z.input<typeof articleSchema>;
export type ArticleFormValues = z.infer<typeof articleSchema>;