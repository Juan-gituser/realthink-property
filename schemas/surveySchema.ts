import { z } from "zod";

export const updateSurveySchema = z.object({
  status: z.enum(["Pending", "Confirmed", "Completed", "Cancelled"]),
  survey_date: z.string().min(1, "Tanggal dan waktu survey wajib diisi"),
  marketing_pic: z.string().min(2, "Marketing PIC wajib diisi"),
  notes: z.string().optional(),
});

export type UpdateSurveyValues = z.infer<typeof updateSurveySchema>;