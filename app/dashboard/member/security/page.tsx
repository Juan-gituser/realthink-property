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
      <div className="bg-[#1C2541] border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
        <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20"><Shield className="w-6 h-6" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Keamanan & Password</h1>
          <p className="text-xs text-slate-300">Ubah kata sandi akun Anda secara berkala demi keamanan.</p>
        </div>
      </div>

      <form action={updatePassword} className="bg-[#1C2541]/60 border border-slate-800 p-6 rounded-3xl space-y-4">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Password Baru</label>
          <input type="password" name="new_password" required className="w-full bg-[#0B132B] border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" placeholder="••••••••" />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5">
          <KeyRound className="w-4 h-4" /> Perbarui Password
        </button>
      </form>
    </div>
  );
}