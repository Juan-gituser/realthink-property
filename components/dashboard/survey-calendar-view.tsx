import { Survey } from "@/types/survey";
import { Clock, Building, User, Edit2 } from "lucide-react";

interface SurveyCalendarViewProps {
  surveys: Survey[];
  onSelectSurvey: (survey: Survey) => void;
}

export function SurveyCalendarView({ surveys, onSelectSurvey }: SurveyCalendarViewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {surveys.map((survey) => {
          const dateObj = new Date(survey.survey_date);
          return (
            <div
              key={survey.id}
              className="flex flex-col justify-between space-y-4 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-amber-500/40"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                    {survey.status}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                    {dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                    <Building className="h-4 w-4 shrink-0 text-amber-400" />
                    {survey.property_title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-300">
                    Klien: <strong className="text-white">{survey.client_name}</strong> (
                    {survey.client_whatsapp})
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <User className="h-3.5 w-3.5 text-purple-400" />
                  <span>PIC: {survey.marketing_pic || "Belum ada"}</span>
                </div>

                <button
                  onClick={() => onSelectSurvey(survey)}
                  className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 transition-all hover:bg-amber-500 hover:text-slate-950"
                >
                  <Edit2 className="h-3 w-3" /> Reschedule / PIC
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {surveys.length === 0 && (
        <div className="rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-12 text-center text-xs text-slate-500">
          Belum ada jadwal survey pada kalender.
        </div>
      )}
    </div>
  );
}