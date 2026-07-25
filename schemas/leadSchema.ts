import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  whatsapp: z.string().min(10, "Nomor WhatsApp tidak valid"),
  budget: z.coerce.number().min(1000000, "Budget minimal Rp 1 Juta"),
  area: z.string().min(2, "Area wajib diisi"),
  status: z.enum([
    "Lead Baru",
    "Dihubungi",
    "Konsultasi",
    "Survey",
    "Negosiasi",
    "Deal",
    "Lost",
  ]),
  notes: z.string().optional(),
  marketing_pic: z.string().min(2, "Marketing PIC wajib diisi"),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;