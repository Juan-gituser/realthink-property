import { createClient } from "@/lib/supabase/server";
import { MessageSquare } from "lucide-react";

export default async function ConsultationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: consultations } = await supabase
    .from("consultations")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4 rounded-3xl border border-slate-800 bg-[#1C2541] p-6">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
          <MessageSquare className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Riwayat Konsultasi Pakar</h1>
          <p className="text-xs text-slate-300">
            Catatan percakapan dan sesi konsultasi bersama ahli properti Realthink.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {consultations?.length === 0 && (
          <p className="py-12 text-center text-xs text-slate-400 italic">
            Belum ada riwayat sesi konsultasi.
          </p>
        )}
        {consultations?.map((item) => (
          <div
            key={item.id}
            className="space-y-2 rounded-2xl border border-slate-800 bg-[#1C2541]/60 p-5"
          >
            <div className="flex justify-between text-xs text-slate-400">
              <span>
                Topik: <strong className="text-white">{item.topic}</strong>
              </span>
              <span>{new Date(item.created_at).toLocaleDateString("id-ID")}</span>
            </div>
            <p className="text-xs text-slate-300">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
