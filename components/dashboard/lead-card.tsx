"tsx"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lead } from "@/types/lead";
import { Phone, MapPin, User, Clock } from "lucide-react";

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lead.id });

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
      className="bg-[#0B132B] border border-slate-800 hover:border-amber-500/40 p-4 rounded-2xl shadow-md cursor-grab active:cursor-grabbing space-y-3 group transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
          {lead.name}
        </h4>
        <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
          {formattedBudget}
        </span>
      </div>

      <div className="space-y-1.5 text-[11px] text-slate-300">
        <div className="flex items-center gap-2 text-slate-400">
          <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{lead.whatsapp}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="truncate">{lead.area}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="truncate">PIC: {lead.marketing_pic}</span>
        </div>
      </div>

      {lead.notes && (
        <p className="text-[10px] bg-slate-900/80 p-2 rounded-xl text-slate-400 italic border border-slate-800/80 line-clamp-2">
          &ldquo;{lead.notes}&rdquo;
        </p>
      )}

      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {lead.activities?.length || 0} Aktivitas
        </span>
        <span>{new Date(lead.created_at).toLocaleDateString("id-ID")}</span>
      </div>
    </div>
  );
}