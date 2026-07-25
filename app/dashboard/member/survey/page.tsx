import { createClient } from "@/lib/supabase/server";
import { Calendar, Clock, CheckCircle } from "lucide-react";

export default async function SurveyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: surveys } = await supabase
    .from("property_surveys")
    .select("*")
    .eq("user_id", user?.id)
    .order("survey_date", { ascending: true });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#1C2541] border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20"><Calendar className="w-6 h-6" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Riwayat Jadwal Survey Properti</h1>
          <p className="text-xs text-slate-300">Daftar agenda kunjungan langsung ke lokasi properti pilihan Anda.</p>
        </div>
      </div>

      <div className="space-y-4">
        {surveys?.length === 0 && (
          <p className="text-xs text-slate-400 italic text-center py-12">Belum ada jadwal survey yang terdaftar.</p>
        )}
        {surveys?.map((item) => (
          <div key={item.id} className="bg-[#1C2541]/60 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">{item.property_title}</h3>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-amber-400" /> {new Date(item.survey_date).toLocaleString("id-ID")}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> {item.status || "Terjadwal"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}