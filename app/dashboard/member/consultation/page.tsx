import { createClient } from "@/lib/supabase/server";
import { MessageSquare } from "lucide-react";

export default async function ConsultationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: consultations } = await supabase
    .from("consultations")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#1C2541] border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20"><MessageSquare className="w-6 h-6" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Riwayat Konsultasi Pakar</h1>
          <p className="text-xs text-slate-300">Catatan percakapan dan sesi konsultasi bersama ahli properti Realthink.</p>
        </div>
      </div>

      <div className="space-y-3">
        {consultations?.length === 0 && (
          <p className="text-xs text-slate-400 italic text-center py-12">Belum ada riwayat sesi konsultasi.</p>
        )}
        {consultations?.map((item) => (
          <div key={item.id} className="p-5 bg-[#1C2541]/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Topik: <strong className="text-white">{item.topic}</strong></span>
              <span>{new Date(item.created_at).toLocaleDateString("id-ID")}</span>
            </div>
            <p className="text-xs text-slate-300">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}