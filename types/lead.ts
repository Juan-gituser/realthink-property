export type LeadStage =
  "Lead Baru" | "Dihubungi" | "Konsultasi" | "Survey" | "Negosiasi" | "Deal" | "Lost";

export interface LeadActivity {
  id: string;
  date: string;
  description: string;
}

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  budget: number;
  area: string;
  status: LeadStage;
  notes?: string;
  marketing_pic: string;
  activities: LeadActivity[];
  created_at: string;
}
