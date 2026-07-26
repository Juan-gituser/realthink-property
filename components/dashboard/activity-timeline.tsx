import { Activity, Building2, Users, Calendar, FileText } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "property_added" | "property_updated" | "lead_new" | "survey_new" | "article_published";
  title: string;
  description: string;
  timestamp: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

export function ActivityTimeline({ activities, isLoading = false }: ActivityTimelineProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6">
        <div className="h-5 w-36 rounded bg-slate-800" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-slate-800/50" />
          ))}
        </div>
      </div>
    );
  }

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "property_added":
      case "property_updated":
        return <Building2 className="h-4 w-4 text-amber-400" />;
      case "lead_new":
        return <Users className="h-4 w-4 text-blue-400" />;
      case "survey_new":
        return <Calendar className="h-4 w-4 text-emerald-400" />;
      case "article_published":
        return <FileText className="h-4 w-4 text-purple-400" />;
      default:
        return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 shadow-xl backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-400">
            <Activity className="h-4 w-4" />
          </div>
          <h3 className="font-heading text-base font-bold text-white">Activity Timeline</h3>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
          Live Log
        </span>
      </div>

      <div className="max-h-87.5[350px] space-y-4 overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <p className="py-8 text-center text-xs text-slate-400 italic">
            Belum ada aktivitas terekam.
          </p>
        ) : (
          activities.map((item, index) => (
            <div
              key={item.id || index}
              className="flex items-start gap-3.5 border-b border-slate-800/60 pb-4 last:border-0 last:pb-0"
            >
              <div className="mt-0.5 shrink-0 rounded-2xl border border-slate-800 bg-slate-900/80 p-2.5">
                {getIcon(item.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="truncate text-xs font-bold text-white">{item.title}</h4>
                  <span className="ml-2 shrink-0 text-[10px] text-slate-400">{item.timestamp}</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-slate-300">{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
