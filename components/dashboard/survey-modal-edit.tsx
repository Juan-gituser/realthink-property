"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Calendar } from "lucide-react";
import { Survey } from "@/types/survey";
import { updateSurveySchema, UpdateSurveyValues } from "@/schemas/surveySchema";

interface SurveyModalEditProps {
  survey: Survey | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, values: UpdateSurveyValues) => void;
  isUpdating: boolean;
}

export function SurveyModalEdit({
  survey,
  isOpen,
  onClose,
  onSave,
  isUpdating,
}: SurveyModalEditProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateSurveyValues>({
    resolver: zodResolver(updateSurveySchema),
  });

  useEffect(() => {
    if (survey) {
      reset({
        status: survey.status,
        survey_date: survey.survey_date
          ? new Date(survey.survey_date).toISOString().slice(0, 16)
          : "",
        marketing_pic: survey.marketing_pic || "",
        notes: survey.notes || "",
      });
    }
  }, [survey, reset]);

  if (!isOpen || !survey) return null;

  const onSubmit = (values: UpdateSurveyValues) => {
    onSave(survey.id, values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg space-y-6 rounded-3xl border border-slate-800 bg-[#1C2541] p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Kelola Jadwal Survey</h3>
              <p className="text-xs text-slate-400">Properti: {survey.property_title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 p-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
              Status Survey
            </label>
            <select
              {...register("status")}
              className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <span className="mt-1 block text-[10px] text-rose-400">
                {errors.status.message as string}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                Reschedule Tanggal & Waktu
              </label>
              <input
                {...register("survey_date")}
                type="datetime-local"
                className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
              {errors.survey_date && (
                <span className="mt-1 block text-[10px] text-rose-400">
                  {errors.survey_date.message as string}
                </span>
              )}
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                Assign Marketing PIC
              </label>
              <input
                {...register("marketing_pic")}
                type="text"
                placeholder="Nama Agent"
                className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
              {errors.marketing_pic && (
                <span className="mt-1 block text-[10px] text-rose-400">
                  {errors.marketing_pic.message as string}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
              Catatan Tambahan
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="Catatan khusus survey..."
              className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-5 py-3 text-xs font-bold text-slate-300 transition-colors hover:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
            >
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />} Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}