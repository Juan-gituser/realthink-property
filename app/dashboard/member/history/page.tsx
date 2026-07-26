import { createClient } from "@/lib/supabase/server";
import { Clock, MapPin } from "lucide-react";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: views } = await supabase
    .from("recently_viewed")
    .select("*")
    .eq("user_id", user?.id)
    .order("viewed_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4 rounded-3xl border border-slate-800 bg-[#1C2541] p-6">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            Properti Terakhir Dilihat (Recently Viewed)
          </h1>
          <p className="text-xs text-slate-300">
            Daftar unit properti yang pernah Anda kunjungi halamannya.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {views?.length === 0 && (
          <p className="col-span-3 py-12 text-center text-xs text-slate-400 italic">
            Belum ada riwayat properti yang dilihat.
          </p>
        )}
        {views?.map((item) => (
          <div
            key={item.id}
            className="space-y-3 rounded-3xl border border-slate-800 bg-[#1C2541]/60 p-5"
          >
            <h3 className="text-sm font-bold text-white">{item.property_title}</h3>
            <p className="flex items-center gap-1 text-xs text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-amber-400" /> {item.location}
            </p>
            <p className="text-xs font-bold text-amber-400">
              Rp {Number(item.price).toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
