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
      <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl space-y-4 animate-pulse">
        <div className="w-36 h-5 bg-slate-800 rounded" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-800/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "property_added":
      case "property_updated":
        return <Building2 className="w-4 h-4 text-amber-400" />;
      case "lead_new":
        return <Users className="w-4 h-4 text-blue-400" />;
      case "survey_new":
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case "article_published":
        return <FileText className="w-4 h-4 text-purple-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">Activity Timeline</h3>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          Live Log
        </span>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-87.5[350px] pr-1">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8 italic">Belum ada aktivitas terekam.</p>
        ) : (
          activities.map((item, index) => (
            <div key={item.id || index} className="flex items-start gap-3.5 pb-4 border-b border-slate-800/60 last:border-0 last:pb-0">
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">{item.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 truncate">{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}