"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Users } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";
import { LeadStage, Lead } from "@/types/lead";
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

  // React Hook Form + Zod setup dengan penyesuaian tipe agar bebas error
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema) as any,
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
      <div className="flex flex-col items-center justify-center min-h-100[400px] text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-xs">Memuat Lead Center & Pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1C2541]/70 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
        <div>
          <span className="bg-amber-500/20 text-amber-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-2">
            CRM Pipeline
          </span>
          <h1 className="text-2xl font-extrabold text-white font-heading">Lead Center Kanban</h1>
          <p className="text-xs text-slate-300 mt-0.5">Kelola konversi klien properti secara interaktif menggunakan metode drag-and-drop.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> Tambah Lead Baru
        </button>
      </div>

      {/* Kanban Board Container */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar">
          {STAGES.map((stage) => (
            <LeadColumn
              key={stage}
              stage={stage}
              leads={leads.filter((l) => l.status === stage)}
            />
          ))}
        </div>
      </DndContext>

      {/* Modal Tambah Lead */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C2541] border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Tambah Lead Baru</h3>
                  <p className="text-xs text-slate-400">Masukkan detail kontak dan preferensi properti klien.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 p-2 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nama Klien</label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
                {errors.name && <span className="text-[10px] text-rose-400 mt-1 block">{errors.name.message as string}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nomor WhatsApp</label>
                  <input
                    {...register("whatsapp")}
                    type="text"
                    placeholder="08123456789"
                    className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  {errors.whatsapp && <span className="text-[10px] text-rose-400 mt-1 block">{errors.whatsapp.message as string}</span>}
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Budget (Rp)</label>
                  <input
                    {...register("budget")}
                    type="number"
                    placeholder="1500000000"
                    className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  {errors.budget && <span className="text-[10px] text-rose-400 mt-1 block">{errors.budget.message as string}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Area Peminatan</label>
                  <input
                    {...register("area")}
                    type="text"
                    placeholder="Jakarta Selatan"
                    className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  {errors.area && <span className="text-[10px] text-rose-400 mt-1 block">{errors.area.message as string}</span>}
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Marketing PIC</label>
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
                  placeholder="Preferensi khusus klien..."
                  className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-2"
                >
                  {isCreating && <Loader2 className="w-4 h-4 animate-spin" />} Simpan Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}