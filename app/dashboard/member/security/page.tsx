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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner Utama */}
      <div className="bg-primary border border-border p-6 rounded-3xl flex items-center gap-4 text-white shadow-sm">
        <div className="p-3 bg-secondary/15 text-secondary rounded-xl border border-secondary/30">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold font-heading text-white">Keamanan & Password</h1>
          <p className="text-xs text-slate-300 mt-0.5">Ubah kata sandi akun Anda secara berkala demi keamanan.</p>
        </div>
      </div>

      {/* Form Keamanan */}
      <form action={updatePassword} className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
        <div className="space-y-2">
          <label className="text-[11px] uppercase font-bold text-foreground/80 tracking-wider block">
            Password Baru
          </label>
          <input 
            type="password" 
            name="new_password" 
            required 
            className="w-full bg-background border border-border px-4 py-3 rounded-xl text-xs text-foreground focus:outline-none focus:border-secondary transition shadow-sm" 
            placeholder="••••••••" 
          />
        </div>

        <button 
          type="submit" 
          className="inline-flex items-center gap-2 px-5 py-3 bg-secondary text-primary font-bold text-xs rounded-xl hover:opacity-90 transition shadow-sm cursor-pointer"
        >
          <KeyRound className="w-4 h-4" /> 
          <span>Perbarui Password</span>
        </button>
      </form>
    </div>
  );
}