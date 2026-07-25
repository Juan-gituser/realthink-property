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
      {/* Banner Utama */}
      <div className="bg-primary border border-border p-6 rounded-3xl flex items-center gap-4 text-white shadow-sm">
        <div className="p-3 bg-secondary/15 text-secondary rounded-xl border border-secondary/30">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold font-heading text-white">Pengaturan Profil Pengguna</h1>
          <p className="text-xs text-slate-300 mt-0.5">Perbarui informasi data diri Anda pada platform.</p>
        </div>
      </div>

      {/* Form Profil dengan Border Card yang Tegas & Kontras */}
      <form action={updateProfile} className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-[11px] uppercase font-bold text-foreground/85 tracking-wider block">
            Email Akun
          </label>
          <input 
            type="email" 
            disabled 
            defaultValue={user?.email || ""} 
            className="w-full bg-background/50 border border-border px-4 py-3 rounded-xl text-xs text-muted-foreground cursor-not-allowed shadow-xs" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] uppercase font-bold text-foreground/85 tracking-wider block">
            Nama Lengkap
          </label>
          <input 
            type="text" 
            name="full_name" 
            defaultValue={profile?.full_name || ""} 
            required 
            className="w-full bg-background border border-border px-4 py-3 rounded-xl text-xs text-foreground focus:outline-none focus:border-secondary transition shadow-xs" 
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] uppercase font-bold text-foreground/85 tracking-wider block">
            Nomor Telepon / WhatsApp
          </label>
          <input 
            type="text" 
            name="phone" 
            defaultValue={profile?.phone || ""} 
            className="w-full bg-background border border-border px-4 py-3 rounded-xl text-xs text-foreground focus:outline-none focus:border-secondary transition shadow-xs" 
            placeholder="Contoh: 081234567890"
          />
        </div>

        <button 
          type="submit" 
          className="inline-flex items-center gap-2 px-5 py-3 bg-secondary text-primary font-bold text-xs rounded-xl hover:opacity-90 transition shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" /> 
          <span>Simpan Perubahan</span>
        </button>
      </form>
    </div>
  );
}