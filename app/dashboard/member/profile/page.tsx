import { createClient } from "@/lib/supabase/server";
import { User, Save } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single();

  async function updateProfile(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();
    if (!user) return;

    const fullName = formData.get("full_name");
    const phone = formData.get("phone");

    await supabaseServer
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    revalidatePath("/dashboard/member/profile");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Banner Utama */}
      <div className="bg-primary border-border flex items-center gap-4 rounded-3xl border p-6 text-white shadow-sm">
        <div className="bg-secondary/15 text-secondary border-secondary/30 rounded-xl border p-3">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-white sm:text-xl">
            Pengaturan Profil Pengguna
          </h1>
          <p className="mt-0.5 text-xs text-slate-300">
            Perbarui informasi data diri Anda pada platform.
          </p>
        </div>
      </div>

      {/* Form Profil dengan Border Card yang Tegas & Kontras */}
      <form
        action={updateProfile}
        className="bg-card border-border space-y-6 rounded-3xl border p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-2">
          <label className="text-foreground/85 block text-[11px] font-bold tracking-wider uppercase">
            Email Akun
          </label>
          <input
            type="email"
            disabled
            defaultValue={user?.email || ""}
            className="bg-background/50 border-border text-muted-foreground w-full cursor-not-allowed rounded-xl border px-4 py-3 text-xs shadow-xs"
          />
        </div>

        <div className="space-y-2">
          <label className="text-foreground/85 block text-[11px] font-bold tracking-wider uppercase">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="full_name"
            defaultValue={profile?.full_name || ""}
            required
            className="bg-background border-border text-foreground focus:border-secondary w-full rounded-xl border px-4 py-3 text-xs shadow-xs transition focus:outline-none"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div className="space-y-2">
          <label className="text-foreground/85 block text-[11px] font-bold tracking-wider uppercase">
            Nomor Telepon / WhatsApp
          </label>
          <input
            type="text"
            name="phone"
            defaultValue={profile?.phone || ""}
            className="bg-background border-border text-foreground focus:border-secondary w-full rounded-xl border px-4 py-3 text-xs shadow-xs transition focus:outline-none"
            placeholder="Contoh: 081234567890"
          />
        </div>

        <button
          type="submit"
          className="bg-secondary text-primary inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold shadow-sm transition hover:opacity-90"
        >
          <Save className="h-4 w-4" />
          <span>Simpan Perubahan</span>
        </button>
      </form>
    </div>
  );
}
