"tsx"
"use client";

import { useState } from "react";
import { LayoutList, CalendarDays, Loader2 } from "lucide-react";
import { useSurveys } from "@/hooks/useSurveys";
import { Survey } from "@/types/survey";
import { UpdateSurveyValues } from "@/schemas/surveySchema";
import { SurveyListView } from "./survey-list-view";
import { SurveyCalendarView } from "./survey-calendar-view";
import { SurveyModalEdit } from "./survey-modal-edit";

export function SurveyManagement() {
  const { surveys, isLoading, updateSurvey, isUpdating } = useSurveys();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const handleSaveSurvey = (id: string, values: UpdateSurveyValues) => {
    updateSurvey(
      { id, values },
      {
        onSuccess: () => {
          setSelectedSurvey(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100[400px] text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-xs">Memuat Jadwal Survey...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
        <div>
          <span className="bg-amber-500/20 text-amber-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-2">
            Survey Scheduler
          </span>
          <h1 className="text-2xl font-extrabold text-white font-heading">Survey Management</h1>
          <p className="text-xs text-slate-300 mt-0.5">Kelola jadwal peninjauan properti, ubah status, reschedule, dan penugasan marketing.</p>
        </div>

        <div className="flex items-center gap-2 bg-[#0B132B] p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === "list"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutList className="w-4 h-4" /> List View
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === "calendar"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CalendarDays className="w-4 h-4" /> Calendar View
          </button>
        </div>
      </div>

      {/* Main Content Switcher */}
      {viewMode === "list" ? (
        <SurveyListView surveys={surveys} onSelectSurvey={setSelectedSurvey} />
      ) : (
        <SurveyCalendarView surveys={surveys} onSelectSurvey={setSelectedSurvey} />
      )}

      {/* Modal Edit / Reschedule / Assign */}
      <SurveyModalEdit
        survey={selectedSurvey}
        isOpen={!!selectedSurvey}
        onClose={() => setSelectedSurvey(null)}
        onSave={handleSaveSurvey}
        isUpdating={isUpdating}
      />
    </div>
  );
}