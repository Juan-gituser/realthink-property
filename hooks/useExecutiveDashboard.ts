// hooks/useExecutiveDashboard.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface ActivityItem {
  id: string;
  type: "property_added" | "property_updated" | "lead_new" | "survey_new" | "article_published" | "property_add" | "article_publish";
  title: string;
  description: string;
  timestamp: string;
}

export interface DashboardMetrics {
  totalProperties: number;
  propertiesChange: number;
  totalLeads: number;
  leadsChange: number;
  surveysToday: number;
  surveysChange: number;
  propertiesSold: number;
  soldChange: number;
  monthlyRevenue: number;
  revenueChange: number;
  conversionRate: number;
  conversionChange: number;
  sparklines: {
    properties: number[];
    leads: number[];
    surveys: number[];
    sold: number[];
    revenue: number[];
    conversion: number[];
  };
}

export function useExecutiveDashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["executive-dashboard"],
    queryFn: async (): Promise<{ metrics: DashboardMetrics; activities: ActivityItem[] }> => {
      // 1. Fetch Properties
      const { data: properties, error: propError } = await supabase
        .from("properties")
        .select("id, status, price, created_at, updated_at, title");
      if (propError) throw propError;

      // 2. Fetch Leads
      const { data: leads, error: leadError } = await supabase
        .from("leads")
        .select("id, status, created_at, name");
      if (leadError) throw leadError;

      // 3. Fetch Surveys
      const todayStr = new Date().toISOString().split("T")[0];
      const { data: surveys, error: surveyError } = await supabase
        .from("property_surveys")
        .select("id, survey_date, created_at, full_name, property_title");
      if (surveyError) throw surveyError;

      // 4. Fetch Articles
      const { data: articles, error: artError } = await supabase
        .from("articles")
        .select("id, title, created_at");
      if (artError) {
        console.warn("Articles table might not exist yet:", artError.message);
      }

      // Hitung Metrik Bisnis Utama
      const totalProperties = properties?.length || 0;
      const totalLeads = leads?.length || 0;
      
      const surveysToday = surveys?.filter(
        (s) => s.survey_date && s.survey_date.startsWith(todayStr)
      ).length || 0;

      const soldProperties = properties?.filter(
        (p) => p.status?.toLowerCase() === "sold" || p.status?.toLowerCase() === "terjual"
      ) || [];
      const propertiesSold = soldProperties.length;

      // Hitung Revenue Bulan Ini
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = soldProperties
        .filter((p) => {
          const d = new Date(p.created_at);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

      // Conversion Rate
      const dealLeads = leads?.filter((l) => l.status?.toLowerCase() === "deal").length || 0;
      const conversionRate = totalLeads > 0 ? Number(((dealLeads / totalLeads) * 100).toFixed(1)) : 0;

      const metrics: DashboardMetrics = {
        totalProperties,
        propertiesChange: 12.5,
        totalLeads,
        leadsChange: 8.1,
        surveysToday,
        surveysChange: 4.3,
        propertiesSold,
        soldChange: 15.0,
        monthlyRevenue,
        revenueChange: 22.4,
        conversionRate,
        conversionChange: -2.1,
        sparklines: {
          properties: [40, 45, 48, 52, 60, 65, totalProperties],
          leads: [10, 15, 25, 30, 45, 50, totalLeads],
          surveys: [2, 4, 3, 5, 6, 4, surveysToday > 0 ? surveysToday : 2],
          sold: [1, 2, 1, 3, 2, 4, propertiesSold],
          revenue: [100, 200, 150, 300, 450, 500, monthlyRevenue / 1000000],
          conversion: [15, 18, 16, 20, 22, 21, conversionRate],
        },
      };

      // Gabungkan & Urutkan Aktivitas Terbaru (Timeline)
      const rawActivities: ActivityItem[] = [
        ...(properties || []).map((p) => ({
          id: `prop-add-${p.id}`,
          type: "property_added" as const,
          title: "Properti Baru Ditambahkan",
          description: p.title || "Properti baru terdaftar dalam sistem",
          timestamp: p.created_at,
        })),
        ...(leads || []).map((l) => ({
          id: `lead-${l.id}`,
          type: "lead_new" as const,
          title: "Lead Klien Baru",
          description: `${l.name || "Klien"} masuk ke pipeline (${l.status})`,
          timestamp: l.created_at,
        })),
        ...(surveys || []).map((s) => ({
          id: `survey-${s.id}`,
          type: "survey_new" as const,
          title: "Jadwal Survei Baru",
          description: `${s.full_name} menjadwalkan survei ke ${s.property_title || "Properti"}`,
          timestamp: s.created_at || new Date().toISOString(),
        })),
        ...((articles as Array<{ id: string; title: string; created_at: string }>) || []).map((a) => ({
          id: `art-${a.id}`,
          type: "article_published" as const,
          title: "Artikel Dipublikasi",
          description: a.title,
          timestamp: a.created_at,
        })),
      ];

      rawActivities.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return {
        metrics,
        activities: rawActivities.slice(0, 10),
      };
    },
    refetchInterval: 30000,
  });

  return { data, isLoading, error, refetch };
}