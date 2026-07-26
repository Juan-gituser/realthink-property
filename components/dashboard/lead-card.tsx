"tsx";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lead } from "@/types/lead";
import { Phone, MapPin, User, Clock } from "lucide-react";

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const formattedBudget = `Rp ${(lead.budget / 1000000).toLocaleString("id-ID")} Jt`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group cursor-grab space-y-3 rounded-2xl border border-slate-800 bg-[#0B132B] p-4 shadow-md transition-all hover:border-amber-500/40 active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-bold text-white transition-colors group-hover:text-amber-400">
          {lead.name}
        </h4>
        <span className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
          {formattedBudget}
        </span>
      </div>

      <div className="space-y-1.5 text-[11px] text-slate-300">
        <div className="flex items-center gap-2 text-slate-400">
          <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span className="truncate">{lead.whatsapp}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-400" />
          <span className="truncate">{lead.area}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <User className="h-3.5 w-3.5 shrink-0 text-purple-400" />
          <span className="truncate">PIC: {lead.marketing_pic}</span>
        </div>
      </div>

      {lead.notes && (
        <p className="line-clamp-2 rounded-xl border border-slate-800/80 bg-slate-900/80 p-2 text-[10px] text-slate-400 italic">
          &ldquo;{lead.notes}&rdquo;
        </p>
      )}

      <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {lead.activities?.length || 0} Aktivitas
        </span>
        <span>{new Date(lead.created_at).toLocaleDateString("id-ID")}</span>
      </div>
    </div>
  );
}
