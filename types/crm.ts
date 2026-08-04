// types/crm.ts

// ==========================================
// ENUMS & TYPES
// ==========================================

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "SURVEY"
  | "NEGOTIATION"
  | "BOOKING"
  | "CLOSED"
  | "LOST";

export type LeadSource =
  | "Website"
  | "Instagram"
  | "TikTok"
  | "Facebook"
  | "WhatsApp"
  | "Google"
  | "Referral"
  | "Agent"
  | "Freelancer"
  | "Other";

export type SurveyStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "RESCHEDULED"
  | "CANCELLED"
  | "NO_SHOW";

export type CommissionStatus =
  | "PENDING"
  | "VERIFIED"
  | "APPROVED"
  | "PAID"
  | "CANCELLED";

export type FollowUpStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export type NegotiationStatus = "ONGOING" | "ACCEPTED" | "REJECTED";

export type ActivityType =
  | "LEAD_CREATED"
  | "WHATSAPP"
  | "CALL"
  | "EMAIL"
  | "NOTE"
  | "SURVEY_SCHEDULED"
  | "SURVEY_COMPLETED"
  | "NEGOTIATION"
  | "BOOKING"
  | "CLOSING"
  | "STATUS_CHANGED";

// ==========================================
// INTERFACES
// ==========================================

export interface Lead {
  id: string;
  lead_id: string;
  name: string;
  whatsapp?: string;
  email?: string;
  source: LeadSource;
  budget_min?: number;
  budget_max?: number;
  preferred_area?: string;
  property_type?: string;
  status: LeadStatus;
  assigned_to?: string;
  notes?: string;
  last_contact_at?: string;
  next_follow_up_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadProperty {
  id: string;
  lead_id: string;
  property_id: string;
  interest_status: "HIGH" | "MEDIUM" | "LOW" | "INTERESTED" | "OFFERED" | "REJECTED";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Survey {
  id: string;
  survey_id: string;
  lead_id: string;
  property_id?: string;
  survey_date: string;
  survey_time: string;
  assigned_to?: string;
  status: SurveyStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FollowUpItem {
  id: string;
  lead_id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes: string;
  pic: string;
  status: FollowUpStatus;
  created_at: string;
  lead_name?: string;
  lead_whatsapp?: string;
  property_title?: string;
}

export interface ActivityItem {
  id: string;
  lead_id: string;
  property_id?: string;
  type: ActivityType;
  description: string;
  created_by?: string;
  created_at: string;
}

export interface NegotiationItem {
  id: string;
  lead_id: string;
  property_id: string;
  listing_price: number;
  buyer_offer: number;
  counter_offer?: number | null;
  notes?: string | null;
  status: NegotiationStatus;
  created_at: string;
  updated_at: string;
  // Optional join fields untuk UI
  lead_name?: string;
  property_title?: string;
}

export interface Commission {
  id: string;
  commission_id: string; // Contoh: COM-2026-001
  property_id: string;
  listing_id?: string;
  lead_id: string;
  agent_id?: string;
  agent_name?: string;
  transaction_price: number;
  net_seller_price: number;
  gross_commission: number;
  additional_cost: number;
  net_commission: number; // Formula: gross_commission - additional_cost
  status: CommissionStatus;
  payment_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;

  // Joined display properties
  property_title?: string;
  property_price?: number;
  lead_name?: string;
}