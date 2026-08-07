import { z } from "zod";

// Clean phone number (format 62/08 ke standar 62)
export const sanitizeWhatsApp = (phone: string) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  return cleaned;
};

// 1. Schema Tanya Properti
export const propertyInquirySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  whatsapp: z
    .string()
    .min(9, "Nomor WhatsApp minimal 9 digit")
    .max(15, "Nomor WhatsApp maksimal 15 digit"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  message: z.string().optional(),
  property_id: z.string().min(1, "Property ID wajib ada"),
  property_title: z.string().optional(),
  listing_id: z.string().optional(),
});

// 2. Schema Konsultasi Sekarang (FIXED)
export const consultationSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  whatsapp: z
    .string()
    .min(9, "Nomor WhatsApp minimal 9 digit")
    .max(15, "Nomor WhatsApp maksimal 15 digit"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  intent: z.enum(
    [
      "Membeli Properti",
      "Menjual Properti",
      "Menyewa",
      "Investasi",
      "Konsultasi KPR",
      "Lainnya",
    ],
    { error: "Pilih kebutuhan Anda" }
  ),
  budget: z.string().optional(),
  area: z.string().optional(),
  message: z.string().optional(),
});

// 3. Schema Titip Properti
export const titipPropertySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  whatsapp: z
    .string()
    .min(9, "Nomor WhatsApp minimal 9 digit")
    .max(15, "Nomor WhatsApp maksimal 15 digit"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  message: z.string().optional(),
  title: z.string().min(1, "Judul properti wajib diisi"),
  property_type: z.string().optional(),
  transaction_type: z.string().optional(),
  price: z.string().optional(),
  location: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  land_area: z.string().optional(),
  building_area: z.string().optional(),
  description: z.string().optional(),
  owner_name: z.string().optional(),
  source: z.string().optional(),
});

// 4. Schema Jadwalkan Survey
export const scheduleSurveySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  whatsapp: z
    .string()
    .min(9, "Nomor WhatsApp minimal 9 digit")
    .max(15, "Nomor WhatsApp maksimal 15 digit"),
  date: z.string().min(1, "Tanggal survey wajib diisi"),
  time: z.string().min(1, "Jam survey wajib diisi"),
  notes: z.string().optional(),
  property_id: z.string().min(1, "Property ID wajib ada"),
  property_title: z.string().optional(),
});

export type PropertyInquiryInput = z.infer<typeof propertyInquirySchema>;
export type ConsultationInput = z.infer<typeof consultationSchema>;
export type ScheduleSurveyInput = z.infer<typeof scheduleSurveySchema>;