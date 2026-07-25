import { createClient } from "@/lib/supabase/server";
import { User, Save } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  async function updateProfile(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return;

    const fullName = formData.get("full_name");
    const phone = formData.get("phone");

    await supabaseServer.from("profiles").update({
      full_name: fullName,
      phone: phone,
      updated_at: new Date().toISOString()
    }).eq("id", user.id);

    revalidatePath("/dashboard/member/profile");
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#1C2541] border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20"><User className="w-6 h-6" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Pengaturan Profil Pengguna</h1>
          <p className="text-xs text-slate-300">Perbarui informasi data diri Anda pada platform.</p>
        </div>
      </div>

      <form action={updateProfile} className="bg-[#1C2541]/60 border border-slate-800 p-6 rounded-3xl space-y-4">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email Akun</label>
          <input type="email" disabled defaultValue={user?.email || ""} className="w-full bg-[#0B132B]/50 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-slate-500 cursor-not-allowed" />
        </div>
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nama Lengkap</label>
          <input type="text" name="full_name" defaultValue={profile?.full_name || ""} className="w-full bg-[#0B132B] border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" />
        </div>
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nomor Telepon / WhatsApp</label>
          <input type="text" name="phone" defaultValue={profile?.phone || ""} className="w-full bg-[#0B132B] border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5">
          <Save className="w-4 h-4" /> Simpan Perubahan
        </button>
      </form>
    </div>
  );
}