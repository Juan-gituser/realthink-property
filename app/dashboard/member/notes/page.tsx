import { createClient } from "@/lib/supabase/server";
import { FileText, Save } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function NotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: notes } = await supabase
    .from("property_notes")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  async function addNote(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return;

    const title = formData.get("title");
    const content = formData.get("content");

    await supabaseServer.from("property_notes").insert({
      user_id: user.id,
      property_title: title,
      note_content: content,
    });

    revalidatePath("/dashboard/member/notes");
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#1C2541] border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20"><FileText className="w-6 h-6" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Catatan Properti Pribadi</h1>
          <p className="text-xs text-slate-300">Tulis catatan eksklusif mengenai hasil survey atau perbandingan unit properti.</p>
        </div>
      </div>

      <form action={addNote} className="bg-[#1C2541]/60 border border-slate-800 p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-white">Tambah Catatan Baru</h3>
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Judul / Nama Properti</label>
          <input type="text" name="title" required className="w-full bg-[#0B132B] border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" placeholder="Contoh: Cluster Kenari Residence" />
        </div>
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Isi Catatan</label>
          <textarea name="content" rows={3} required className="w-full bg-[#0B132B] border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" placeholder="Catat kelebihan, kekurangan, atau harga tawar..." />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5">
          <Save className="w-4 h-4" /> Simpan Catatan
        </button>
      </form>

      <div className="space-y-3">
        {notes?.map((item) => (
          <div key={item.id} className="p-5 bg-[#1C2541]/60 border border-slate-800 rounded-2xl space-y-1">
            <h3 className="text-sm font-bold text-white">{item.property_title}</h3>
            <p className="text-xs text-slate-300">{item.note_content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}