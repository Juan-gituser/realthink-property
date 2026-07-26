"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPropertyPerformances } from "@/services/propertyPerformanceService";
import { PropertyPerformanceItem } from "@/types/property-performance";

export function usePropertyPerformance() {
  return useQuery<PropertyPerformanceItem[], Error>({
    queryKey: ["propertyPerformance"],
    queryFn: fetchPropertyPerformances,
    staleTime: 1000 * 60 * 5, // Cache valid selama 5 menit
  });
}
