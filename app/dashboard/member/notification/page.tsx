import { createClient } from "@/lib/supabase/server";
import { Bell } from "lucide-react";

export default async function NotificationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4 rounded-3xl border border-slate-800 bg-[#1C2541] p-6">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
          <Bell className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Pusat Notifikasi</h1>
          <p className="text-xs text-slate-300">
            Semua pemberitahuan dan pembaruan sistem penting untuk Anda.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications?.length === 0 && (
          <p className="py-12 text-center text-xs text-slate-400 italic">
            Tidak ada notifikasi saat ini.
          </p>
        )}
        {notifications?.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between rounded-2xl border border-slate-800 bg-[#1C2541]/60 p-5"
          >
            <div>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="mt-1 text-xs text-slate-300">{item.message}</p>
            </div>
            <span className="text-[10px] text-slate-500">
              {new Date(item.created_at).toLocaleDateString("id-ID")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
