"tsx"
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
    <div className="bg-[#1C2541]/70 border border-slate-800 rounded-3xl p-4 flex flex-col h-175[700px] shrink-0 w-80 backdrop-blur-xl shadow-xl">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">{stage}</h3>
          <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
            {leads.length}
          </span>
        </div>
      </div>

      {/* Droppable List Area */}
      <div ref={setNodeRef} className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>

        {leads.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs italic py-12">
            Belum ada lead
          </div>
        )}
      </div>
    </div>
  );
}