"tsx"
import { Survey } from "@/types/survey";
import { Calendar as CalendarIcon, Clock, Building, User, Edit2 } from "lucide-react";

interface SurveyCalendarViewProps {
  surveys: Survey[];
  onSelectSurvey: (survey: Survey) => void;
}

export function SurveyCalendarView({ surveys, onSelectSurvey }: SurveyCalendarViewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surveys.map((survey) => {
          const dateObj = new Date(survey.survey_date);
          return (
            <div
              key={survey.id}
              className="bg-[#1C2541]/70 border border-slate-800 hover:border-amber-500/40 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {survey.status}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    {dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-400 shrink-0" />
                    {survey.property_title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">Klien: <strong className="text-white">{survey.client_name}</strong> ({survey.client_whatsapp})</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>PIC: {survey.marketing_pic || "Belum ada"}</span>
                </div>

                <button
                  onClick={() => onSelectSurvey(survey)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Reschedule / PIC
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {surveys.length === 0 && (
        <div className="bg-[#1C2541]/70 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs">
          Belum ada jadwal survey pada kalender.
        </div>
      )}
    </div>
  );
}