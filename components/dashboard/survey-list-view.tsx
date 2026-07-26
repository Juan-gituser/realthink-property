"tsx";
import { Survey, SurveyStatus } from "@/types/survey";
import { Calendar, Phone, User, Building, Edit3 } from "lucide-react";

interface SurveyListViewProps {
  surveys: Survey[];
  onSelectSurvey: (survey: Survey) => void;
}

export function SurveyListView({ surveys, onSelectSurvey }: SurveyListViewProps) {
  // Pemetaan badge warna status
  const getStatusBadge = (status: SurveyStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Confirmed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#1C2541]/70 shadow-xl backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <th className="p-4">Properti & Klien</th>
              <th className="p-4">Jadwal Survey</th>
              <th className="p-4">Marketing PIC</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {surveys.map((survey) => (
              <tr key={survey.id} className="transition-colors hover:bg-slate-800/40">
                <td className="space-y-1 p-4">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Building className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>{survey.property_title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {survey.client_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-emerald-400" /> {survey.client_whatsapp}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-blue-400" />
                    <span>
                      {new Date(survey.survey_date).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1 font-semibold text-slate-200">
                    {survey.marketing_pic || "Belum Ditugaskan"}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${getStatusBadge(survey.status)}`}
                  >
                    {survey.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => onSelectSurvey(survey)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 p-2 text-xs font-bold text-slate-300 shadow-md transition-all hover:bg-amber-500 hover:text-slate-950"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Kelola
                  </button>
                </td>
              </tr>
            ))}

            {surveys.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-xs text-slate-500 italic">
                  Belum ada jadwal survey terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
