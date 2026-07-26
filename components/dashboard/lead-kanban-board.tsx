"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Users } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";
import { LeadStage } from "@/types/lead";
import { leadFormSchema, LeadFormValues } from "@/schemas/leadSchema";
import { LeadColumn } from "./lead-column";

const STAGES: LeadStage[] = [
  "Lead Baru",
  "Dihubungi",
  "Konsultasi",
  "Survey",
  "Negosiasi",
  "Deal",
  "Lost",
];

export function LeadKanbanBoard() {
  const { leads, isLoading, updateStage, createLead, isCreating } = useLeads();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Menggunakan unknown dan Resolver untuk mengatasi mismatch tipe input/output Zod coersion pada budget tanpa melanggar aturan linter
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema) as unknown as Resolver<LeadFormValues>,
    defaultValues: {
      name: "",
      whatsapp: "",
      budget: 0,
      area: "",
      status: "Lead Baru",
      marketing_pic: "",
      notes: "",
    },
  });

  const onSubmit = (values: LeadFormValues) => {
    createLead(values, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      },
    });
  };

  // Handler Event Drag and Drop Kanban
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const targetStage = over.id as LeadStage;

    if (STAGES.includes(targetStage)) {
      const currentLead = leads.find((l) => l.id === leadId);
      if (currentLead && currentLead.status !== targetStage) {
        updateStage({ id: leadId, status: targetStage });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-100[400px] flex-col items-center justify-center space-y-3 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <p className="text-xs">Memuat Lead Center & Pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Action */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-6 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center">
        <div>
          <span className="mb-2 inline-block rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-400 uppercase">
            CRM Pipeline
          </span>
          <h1 className="font-heading text-2xl font-extrabold text-white">Lead Center Kanban</h1>
          <p className="mt-0.5 text-xs text-slate-300">
            Kelola konversi klien properti secara interaktif menggunakan metode drag-and-drop.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-colors hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" /> Tambah Lead Baru
        </button>
      </div>

      {/* Kanban Board Container */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="custom-scrollbar flex gap-5 overflow-x-auto pb-6">
          {STAGES.map((stage) => (
            <LeadColumn key={stage} stage={stage} leads={leads.filter((l) => l.status === stage)} />
          ))}
        </div>
      </DndContext>

      {/* Modal Tambah Lead */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg space-y-6 rounded-3xl border border-slate-800 bg-[#1C2541] p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Tambah Lead Baru</h3>
                  <p className="text-xs text-slate-400">
                    Masukkan detail kontak dan preferensi properti klien.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl bg-slate-800 p-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                  Nama Klien
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
                {errors.name && (
                  <span className="mt-1 block text-[10px] text-rose-400">
                    {errors.name?.message as string}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                    Nomor WhatsApp
                  </label>
                  <input
                    {...register("whatsapp")}
                    type="text"
                    placeholder="08123456789"
                    className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  {errors.whatsapp && (
                    <span className="mt-1 block text-[10px] text-rose-400">
                      {errors.whatsapp?.message as string}
                    </span>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                    Budget (Rp)
                  </label>
                  <input
                    {...register("budget", { valueAsNumber: true })}
                    type="number"
                    placeholder="1500000000"
                    className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  {errors.budget && (
                    <span className="mt-1 block text-[10px] text-rose-400">
                      {errors.budget?.message as string}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                    Area Peminatan
                  </label>
                  <input
                    {...register("area")}
                    type="text"
                    placeholder="Jakarta Selatan"
                    className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  {errors.area && (
                    <span className="mt-1 block text-[10px] text-rose-400">
                      {errors.area?.message as string}
                    </span>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                    Marketing PIC
                  </label>
                  <input
                    {...register("marketing_pic")}
                    type="text"
                    placeholder="Nama Agent"
                    className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  {errors.marketing_pic && (
                    <span className="mt-1 block text-[10px] text-rose-400">
                      {errors.marketing_pic?.message as string}
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
                  placeholder="Preferensi khusus klien..."
                  className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-slate-800 px-5 py-3 text-xs font-bold text-slate-300 transition-colors hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
                >
                  {isCreating && <Loader2 className="h-4 w-4 animate-spin" />} Simpan Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}