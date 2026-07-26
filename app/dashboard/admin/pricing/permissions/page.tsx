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
    <div className="mx-auto min-h-screen max-w-5xl space-y-8 bg-slate-950 p-6 text-slate-100">
      <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">RBAC & Route Security Manager</h1>
          <p className="text-xs text-slate-400">
            Atur hak akses rute dan proteksi level peran secara dinamis langsung dari database.
          </p>
        </div>
      </div>

      <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="flex items-center gap-2 text-base font-bold text-white">
          <Lock className="h-4 w-4 text-amber-400" />
          Pemetaan Akses Rute Berbasis Database
        </h2>

        <div className="space-y-4">
          {routeRules?.map((rule) => (
            <form
              key={rule.id}
              action={updateRoutePermission}
              className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 md:flex-row"
            >
              <input type="hidden" name="path_prefix" value={rule.path_prefix} />
              <div>
                <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono text-xs text-amber-400">
                  {rule.path_prefix}
                </span>
                <p className="mt-2 text-xs text-slate-400">
                  Menentukan batas minimal role untuk mengakses direktori ini.
                </p>
              </div>

              <div className="flex w-full items-center gap-3 md:w-auto">
                <select
                  name="required_role"
                  defaultValue={rule.required_role}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  {roles?.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} ({role.id})
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
                >
                  <Save className="h-3.5 w-3.5" />
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
