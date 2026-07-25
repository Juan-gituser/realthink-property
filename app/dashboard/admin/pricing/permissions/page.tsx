import { createClient } from "@/lib/supabase/server";
import { Shield, Lock, Save } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminPermissionsPage() {
  const supabase = await createClient();

  // Ambil data rute dan role yang diizinkan dari database
  const { data: routeRules } = await supabase.from("route_permissions").select("*");
  const { data: roles } = await supabase.from("roles").select("*");

  async function updateRoutePermission(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const pathPrefix = formData.get("path_prefix") as string;
    const requiredRole = formData.get("required_role") as string;

    await supabaseServer
      .from("route_permissions")
      .update({ required_role: requiredRole })
      .eq("path_prefix", pathPrefix);

    revalidatePath("/dashboard/admin/permissions");
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">RBAC & Route Security Manager</h1>
          <p className="text-xs text-slate-400">Atur hak akses rute dan proteksi level peran secara dinamis langsung dari database.</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          Pemetaan Akses Rute Berbasis Database
        </h2>

        <div className="space-y-4">
          {routeRules?.map((rule) => (
            <form key={rule.id} action={updateRoutePermission} className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <input type="hidden" name="path_prefix" value={rule.path_prefix} />
              <div>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {rule.path_prefix}
                </span>
                <p className="text-xs text-slate-400 mt-2">Menentukan batas minimal role untuk mengakses direktori ini.</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select 
                  name="required_role" 
                  defaultValue={rule.required_role}
                  className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {roles?.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} ({role.id})
                    </option>
                  ))}
                </select>

                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0">
                  <Save className="w-3.5 h-3.5" />
                  Update
                </button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}