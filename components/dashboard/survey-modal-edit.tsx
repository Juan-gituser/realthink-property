"tsx"
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Calendar, User, FileText, CheckCircle } from "lucide-react";
import { Survey, SurveyStatus } from "@/types/survey";
import { updateSurveySchema, UpdateSurveyValues } from "@/schemas/surveySchema";

interface SurveyModalEditProps {
  survey: Survey | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, values: UpdateSurveyValues) => void;
  isUpdating: boolean;
}

export function SurveyModalEdit({ survey, isOpen, onClose, onSave, isUpdating }: SurveyModalEditProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateSurveyValues>({
    resolver: zodResolver(updateSurveySchema) as any,
  });

  useEffect(() => {
    if (survey) {
      reset({
        status: survey.status,
        survey_date: survey.survey_date ? new Date(survey.survey_date).toISOString().slice(0, 16) : "",
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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C2541] border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Kelola Jadwal Survey</h3>
              <p className="text-xs text-slate-400">Properti: {survey.property_title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 p-2 rounded-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Status Survey</label>
            <select
              {...register("status")}
              className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {errors.status && <span className="text-[10px] text-rose-400 mt-1 block">{errors.status.message as string}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reschedule Tanggal & Waktu</label>
              <input
                {...register("survey_date")}
                type="datetime-local"
                className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
              {errors.survey_date && <span className="text-[10px] text-rose-400 mt-1 block">{errors.survey_date.message as string}</span>}
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assign Marketing PIC</label>
              <input
                {...register("marketing_pic")}
                type="text"
                placeholder="Nama Agent"
                className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
              {errors.marketing_pic && <span className="text-[10px] text-rose-400 mt-1 block">{errors.marketing_pic.message as string}</span>}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Catatan Tambahan</label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="Catatan khusus survey..."
              className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-2"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />} Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}