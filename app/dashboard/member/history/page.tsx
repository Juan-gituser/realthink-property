import { createClient } from "@/lib/supabase/server";
import { Clock, MapPin } from "lucide-react";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: views } = await supabase
    .from("recently_viewed")
    .select("*")
    .eq("user_id", user?.id)
    .order("viewed_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[#1C2541] border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20"><Clock className="w-6 h-6" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Properti Terakhir Dilihat (Recently Viewed)</h1>
          <p className="text-xs text-slate-300">Daftar unit properti yang pernah Anda kunjungi halamannya.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {views?.length === 0 && (
          <p className="text-xs text-slate-400 italic col-span-3 text-center py-12">Belum ada riwayat properti yang dilihat.</p>
        )}
        {views?.map((item) => (
          <div key={item.id} className="bg-[#1C2541]/60 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white">{item.property_title}</h3>
            <p className="text-xs text-slate-300 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {item.location}</p>
            <p className="text-xs font-bold text-amber-400">Rp {Number(item.price).toLocaleString("id-ID")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}