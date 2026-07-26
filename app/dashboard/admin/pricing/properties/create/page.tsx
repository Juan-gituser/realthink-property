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
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-[#1C2541] p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tambah Property Baru</h1>
            <p className="text-xs text-slate-300">
              Masukkan informasi listing properti baru ke database Supabase.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/admin"
          className="text-xs text-slate-400 transition-colors hover:text-white"
        >
          ← Kembali
        </Link>
      </div>

      <form
        action={handleCreate}
        className="space-y-5 rounded-3xl border border-slate-800 bg-[#1C2541]/60 p-8"
      >
        <div>
          <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase">
            Judul Properti
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="Contoh: Cluster Mewah Grand Kenari"
            className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase">
              Harga (Rp)
            </label>
            <input
              type="number"
              name="price"
              required
              placeholder="1500000000"
              className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase">
              Status Listing
            </label>
            <select
              name="status"
              className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase">
            Lokasi
          </label>
          <input
            type="text"
            name="location"
            required
            placeholder="Jakarta Selatan, DKI Jakarta"
            className="w-full rounded-xl border border-slate-800 bg-[#0B132B] px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-400"
        >
          <Save className="h-4 w-4" /> Simpan Properti ke Supabase
        </button>
      </form>
    </div>
  );
}
