import { createClient } from "@/lib/supabase/server";
import { FileText, Save } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function NotesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notes } = await supabase
    .from("property_notes")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  async function addNote(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();
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
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4 rounded-3xl border border-slate-800 bg-[#1C2541] p-6">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Catatan Properti Pribadi</h1>
          <p className="text-xs text-slate-300">
            Tulis catatan eksklusif mengenai hasil survey atau perbandingan unit properti.
          </p>
        </div>
      </div>

      <form
        action={addNote}
        className="space-y-4 rounded-3xl border border-slate-800 bg-[#1C2541]/60 p-6"
      >
        <h3 className="text-sm font-bold text-white">Tambah Catatan Baru</h3>
        <div>
          <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
            Judul / Nama Properti
          </label>
          <input
            type="text"
            name="title"
            required
            className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            placeholder="Contoh: Cluster Kenari Residence"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
            Isi Catatan
          </label>
          <textarea
            name="content"
            rows={3}
            required
            className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            placeholder="Catat kelebihan, kekurangan, atau harga tawar..."
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
        >
          <Save className="h-4 w-4" /> Simpan Catatan
        </button>
      </form>

      <div className="space-y-3">
        {notes?.map((item) => (
          <div
            key={item.id}
            className="space-y-1 rounded-2xl border border-slate-800 bg-[#1C2541]/60 p-5"
          >
            <h3 className="text-sm font-bold text-white">{item.property_title}</h3>
            <p className="text-xs text-slate-300">{item.note_content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
