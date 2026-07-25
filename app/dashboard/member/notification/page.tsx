import { createClient } from "@/lib/supabase/server";
import { Bell } from "lucide-react";

export default async function NotificationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#1C2541] border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20"><Bell className="w-6 h-6" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Pusat Notifikasi</h1>
          <p className="text-xs text-slate-300">Semua pemberitahuan dan pembaruan sistem penting untuk Anda.</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications?.length === 0 && (
          <p className="text-xs text-slate-400 italic text-center py-12">Tidak ada notifikasi saat ini.</p>
        )}
        {notifications?.map((item) => (
          <div key={item.id} className="p-5 bg-[#1C2541]/60 border border-slate-800 rounded-2xl flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{item.message}</p>
            </div>
            <span className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString("id-ID")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}