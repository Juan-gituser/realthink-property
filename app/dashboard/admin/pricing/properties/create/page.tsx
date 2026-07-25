import { createClient } from "@/lib/supabase/server";
import { Building2, Save } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function CreatePropertyPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const title = formData.get("title");
    const price = formData.get("price");
    const location = formData.get("location");
    const status = formData.get("status");

    await supabase.from("properties").insert({
      title,
      price: Number(price),
      location,
      status,
    });

    redirect("/dashboard/admin");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#1C2541] border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tambah Property Baru</h1>
            <p className="text-xs text-slate-300">Masukkan informasi listing properti baru ke database Supabase.</p>
          </div>
        </div>
        <Link href="/dashboard/admin" className="text-xs text-slate-400 hover:text-white transition-colors">
          ← Kembali
        </Link>
      </div>

      <form action={handleCreate} className="bg-[#1C2541]/60 border border-slate-800 p-8 rounded-3xl space-y-5">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Judul Properti</label>
          <input 
            type="text" 
            name="title" 
            required 
            placeholder="Contoh: Cluster Mewah Grand Kenari" 
            className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Harga (Rp)</label>
            <input 
              type="number" 
              name="price" 
              required 
              placeholder="1500000000" 
              className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" 
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Status Listing</label>
            <select 
              name="status" 
              className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Lokasi</label>
          <input 
            type="text" 
            name="location" 
            required 
            placeholder="Jakarta Selatan, DKI Jakarta" 
            className="w-full bg-[#0B132B] border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> Simpan Properti ke Supabase
        </button>
      </form>
    </div>
  );
}