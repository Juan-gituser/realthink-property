export type AnalyticsFilterPeriod = "day" | "week" | "month" | "year";

export interface AnalyticsDataPoint {
  label: string;      // Label sumbu X (misal: Tanggal, Minggu, atau Bulan)
  propertyViews: number;
  leads: number;
  surveys: number;
  deals: number;
  revenue: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalLeads: number;
  totalSurveys: number;
  totalDeals: number;
  totalRevenue: number;
  growthRate: number; // Persentase pertumbuhan dari periode sebelumnya
}