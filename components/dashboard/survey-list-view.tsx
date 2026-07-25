"tsx"
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
    <div className="bg-[#1C2541]/70 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              <th className="p-4">Properti & Klien</th>
              <th className="p-4">Jadwal Survey</th>
              <th className="p-4">Marketing PIC</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {surveys.map((survey) => (
              <tr key={survey.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Building className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{survey.property_title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {survey.client_name}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-400" /> {survey.client_whatsapp}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{new Date(survey.survey_date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-semibold text-slate-200 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
                    {survey.marketing_pic || "Belum Ditugaskan"}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(survey.status)}`}>
                    {survey.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => onSelectSurvey(survey)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-all shadow-md inline-flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Kelola
                  </button>
                </td>
              </tr>
            ))}

            {surveys.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-500 text-xs italic">
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