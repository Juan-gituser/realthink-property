import { createClient } from "@/lib/supabase/server";
import { Calendar, Clock, CheckCircle } from "lucide-react";

export default async function SurveyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: surveys } = await supabase
    .from("property_surveys")
    .select("*")
    .eq("user_id", user?.id)
    .order("survey_date", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4 rounded-3xl border border-slate-800 bg-[#1C2541] p-6">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
          <Calendar className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Riwayat Jadwal Survey Properti</h1>
          <p className="text-xs text-slate-300">
            Daftar agenda kunjungan langsung ke lokasi properti pilihan Anda.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {surveys?.length === 0 && (
          <p className="py-12 text-center text-xs text-slate-400 italic">
            Belum ada jadwal survey yang terdaftar.
          </p>
        )}
        {surveys?.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-800 bg-[#1C2541]/60 p-5 md:flex-row md:items-center"
          >
            <div>
              <h3 className="text-sm font-bold text-white">{item.property_title}</h3>
              <p className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                <Clock className="h-3.5 w-3.5 text-amber-400" />{" "}
                {new Date(item.survey_date).toLocaleString("id-ID")}
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-400">
              <CheckCircle className="h-3.5 w-3.5" /> {item.status || "Terjadwal"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
