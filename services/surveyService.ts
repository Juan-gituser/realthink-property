import { createClient } from "@/lib/supabase/client";
import { Survey } from "@/types/survey";
import { UpdateSurveyValues } from "@/schemas/surveySchema";

/**
 * Mengambil seluruh jadwal survey dari Supabase diurutkan berdasarkan waktu terdekat
 */
export async function fetchSurveys(): Promise<Survey[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .order("survey_date", { ascending: true });

  if (error) {
    throw new Error(`Gagal memuat jadwal survey: ${error.message}`);
  }

  return data || [];
}

/**
 * Memperbarui data survey (Reschedule, Assign PIC, Status, Catatan)
 */
export async function updateSurvey(id: string, values: UpdateSurveyValues): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("surveys")
    .update({
      status: values.status,
      survey_date: values.survey_date,
      marketing_pic: values.marketing_pic,
      notes: values.notes,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Gagal memperbarui survey: ${error.message}`);
  }
}
