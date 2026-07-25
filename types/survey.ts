export type SurveyStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Survey {
  id: string;
  property_title: string;
  client_name: string;
  client_whatsapp: string;
  survey_date: string; // Format ISO string datetime
  status: SurveyStatus;
  marketing_pic: string;
  notes?: string;
  created_at: string;
}