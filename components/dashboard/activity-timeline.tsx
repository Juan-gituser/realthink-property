// components/dashboard/activity-timeline.tsx
"use client";

import { ActivityItem } from "@/hooks/useExecutiveDashboard";
import { Building, UserPlus, Calendar, FileText, RefreshCw } from "lucide-react";

interface ActivityTimelineProps {
  activities: ActivityItem[];
  isLoading: boolean;
}

export function ActivityTimeline({ activities, isLoading }: ActivityTimelineProps) {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "property_add":
      case "property_updated":
        return <Building className="h-4 w-4 text-amber-600" />;
      case "lead_new":
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case "survey_new":
        return <Calendar className="h-4 w-4 text-emerald-600" />;
      case "article_publish":
        return <FileText className="h-4 w-4 text-purple-600" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-gray-900">Activity Timeline</h2>
          <p className="text-xs text-gray-500">Aktivitas operasional sistem secara real-time.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4 py-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-10 rounded-2xl bg-gray-100 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/3 rounded bg-gray-100" />
                <div className="h-3 w-3/4 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="py-12 text-center text-xs text-gray-400">
          Belum ada aktivitas tercatat.
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
          {activities.map((item) => (
            <div key={item.id} className="relative flex items-start gap-4 pl-2">
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                  <span className="text-[10px] text-gray-400">
                    {new Date(item.timestamp).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}