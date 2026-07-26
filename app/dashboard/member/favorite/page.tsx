import { createClient } from "@/lib/supabase/server";
import { Heart, MapPin, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function FavoritePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: favorites } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  async function removeFavorite(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const id = formData.get("id");
    await supabaseServer.from("user_favorites").delete().eq("id", id);
    revalidatePath("/dashboard/member/favorite");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-4 rounded-3xl border border-slate-800 bg-[#1C2541] p-6">
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-400">
          <Heart className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Daftar Properti Favorit</h1>
          <p className="text-xs text-slate-300">
            Simpan dan akses daftar properti impian Anda tanpa batasan kuota.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {favorites?.length === 0 && (
          <p className="text-py-12 col-span-3 text-center text-xs text-slate-400 italic">
            Belum ada properti yang disimpan ke daftar favorit.
          </p>
        )}
        {favorites?.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between space-y-4 rounded-3xl border border-slate-800 bg-[#1C2541]/60 p-5"
          >
            <div>
              <div className="relative mb-4 h-40 overflow-hidden rounded-2xl bg-slate-800">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.property_title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                    No Image Preview
                  </div>
                )}
              </div>
              <h3 className="text-sm font-bold text-white">{item.property_title}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-amber-400" /> {item.location}
              </p>
              <p className="mt-3 text-sm font-extrabold text-amber-400">
                Rp {Number(item.price).toLocaleString("id-ID")}
              </p>
            </div>
            <form action={removeFavorite}>
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2 text-xs font-bold text-rose-400 transition-colors hover:bg-rose-500/20"
              >
                <Trash2 className="h-3.5 w-3.5" /> Hapus dari Favorit
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
