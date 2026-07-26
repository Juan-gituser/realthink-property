import { createClient } from "@/lib/supabase/server";
import { Shield, KeyRound } from "lucide-react";

export default async function SecurityPage() {
  const supabase = await createClient();

  async function updatePassword(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const newPassword = formData.get("new_password") as string;
    await supabaseServer.auth.updateUser({ password: newPassword });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Banner Utama */}
      <div className="bg-primary border-border flex items-center gap-4 rounded-3xl border p-6 text-white shadow-sm">
        <div className="bg-secondary/15 text-secondary border-secondary/30 rounded-xl border p-3">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-white sm:text-xl">
            Keamanan & Password
          </h1>
          <p className="mt-0.5 text-xs text-slate-300">
            Ubah kata sandi akun Anda secara berkala demi keamanan.
          </p>
        </div>
      </div>

      {/* Form Keamanan */}
      <form
        action={updatePassword}
        className="bg-card border-border space-y-6 rounded-3xl border p-6 shadow-xs sm:p-8"
      >
        <div className="space-y-2">
          <label className="text-foreground/80 block text-[11px] font-bold tracking-wider uppercase">
            Password Baru
          </label>
          <input
            type="password"
            name="new_password"
            required
            className="bg-background border-border text-foreground focus:border-secondary w-full rounded-xl border px-4 py-3 text-xs shadow-sm transition focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="bg-secondary text-primary inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold shadow-sm transition hover:opacity-90"
        >
          <KeyRound className="h-4 w-4" />
          <span>Perbarui Password</span>
        </button>
      </form>
    </div>
  );
}
