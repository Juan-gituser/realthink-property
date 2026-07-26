"tsx";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Lead, LeadStage } from "@/types/lead";
import { LeadCard } from "./lead-card";

interface LeadColumnProps {
  stage: LeadStage;
  leads: Lead[];
}

export function LeadColumn({ stage, leads }: LeadColumnProps) {
  const { setNodeRef } = useDroppable({ id: stage });

  return (
    <div className="h-175[700px] flex w-80 shrink-0 flex-col rounded-3xl border border-slate-800 bg-[#1C2541]/70 p-4 shadow-xl backdrop-blur-xl">
      {/* Column Header */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-extrabold tracking-wider text-white uppercase">{stage}</h3>
          <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
            {leads.length}
          </span>
        </div>
      </div>

      {/* Droppable List Area */}
      <div ref={setNodeRef} className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>

        {leads.length === 0 && (
          <div className="flex h-full items-center justify-center py-12 text-xs text-slate-500 italic">
            Belum ada lead
          </div>
        )}
      </div>
    </div>
  );
}
