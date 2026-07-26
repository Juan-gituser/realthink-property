"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsData } from "@/services/analyticsService";
import { AnalyticsFilterPeriod } from "@/types/analytics";

export function useAnalytics(period: AnalyticsFilterPeriod) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics", period],
    queryFn: () => fetchAnalyticsData(period),
    staleTime: 1000 * 60 * 5, // Cache valid selama 5 menit
  });

  return {
    chartData: data?.chartData || [],
    summary: data?.summary || {
      totalViews: 0,
      totalLeads: 0,
      totalSurveys: 0,
      totalDeals: 0,
      totalRevenue: 0,
      growthRate: 0,
    },
    isLoading,
    error,
  };
}
