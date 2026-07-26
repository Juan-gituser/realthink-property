"tsx";
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
      <div className="min-h-100[400px] flex flex-col items-center justify-center space-y-3 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <p className="text-xs">Memuat Jadwal Survey...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center">
        <div>
          <span className="mb-2 inline-block rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-400 uppercase">
            Survey Scheduler
          </span>
          <h1 className="font-heading text-2xl font-extrabold text-white">Survey Management</h1>
          <p className="mt-0.5 text-xs text-slate-300">
            Kelola jadwal peninjauan properti, ubah status, reschedule, dan penugasan marketing.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-[#0B132B] p-1.5">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              viewMode === "list"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutList className="h-4 w-4" /> List View
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              viewMode === "calendar"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CalendarDays className="h-4 w-4" /> Calendar View
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
