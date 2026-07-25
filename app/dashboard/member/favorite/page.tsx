import { createClient } from "@/lib/supabase/server";
import { Heart, MapPin, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function FavoritePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-[#1C2541] border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
        <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20"><Heart className="w-6 h-6" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Daftar Properti Favorit</h1>
          <p className="text-xs text-slate-300">Simpan dan akses daftar properti impian Anda tanpa batasan kuota.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {favorites?.length === 0 && (
          <p className="text-xs text-slate-400 italic col-span-3 text-py-12 text-center">Belum ada properti yang disimpan ke daftar favorit.</p>
        )}
        {favorites?.map((item) => (
          <div key={item.id} className="bg-[#1C2541]/60 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="h-40 bg-slate-800 rounded-2xl mb-4 overflow-hidden relative">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.property_title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">No Image Preview</div>
                )}
              </div>
              <h3 className="text-sm font-bold text-white">{item.property_title}</h3>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {item.location}</p>
              <p className="text-sm font-extrabold text-amber-400 mt-3">Rp {Number(item.price).toLocaleString("id-ID")}</p>
            </div>
            <form action={removeFavorite}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-rose-500/20">
                <Trash2 className="w-3.5 h-3.5" /> Hapus dari Favorit
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}