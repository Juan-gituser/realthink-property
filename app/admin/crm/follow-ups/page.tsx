"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  MessageSquare,
  User,
  Building,
  Phone,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  whatsapp?: string;
  property_title?: string;
}

interface FollowUp {
  id: string;
  lead_id: string;
  date: string;
  time: string;
  notes: string;
  pic: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  created_at?: string;
  leads?: Lead;
}

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // State Modal Tambah
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    lead_id: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    notes: "",
    pic: "",
  });

  // Fetch data follow-ups dari API
  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/crm/follow-ups?status=${statusFilter}`);
      const json = await res.json();
      if (json.success) {
        setFollowUps(json.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data follow up:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch daftar Leads untuk dropdown pendaftaran
  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/crm/leads");
      const json = await res.json();
      if (json.success) {
        setLeads(json.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data leads:", err);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchFollowUps();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [statusFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchLeads();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  // Handle pembuatan Follow Up baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lead_id || !formData.date || !formData.time) {
      alert("Lead, tanggal, dan jam wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/crm/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setFormData({
          lead_id: "",
          date: new Date().toISOString().split("T")[0],
          time: "10:00",
          notes: "",
          pic: "",
        });
        fetchFollowUps();
      } else {
        alert(json.error || "Gagal menambah follow up");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle ubah status (misal PENDING -> COMPLETED)
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/crm/follow-ups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const json = await res.json();
      if (json.success) {
        fetchFollowUps();
      } else {
        alert(json.error || "Gagal memperbarui status");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter hasil pencarian
  const filteredFollowUps = followUps.filter((item) => {
    const leadName = item.leads?.name?.toLowerCase() || "";
    const notes = item.notes?.toLowerCase() || "";
    const pic = item.pic?.toLowerCase() || "";
    const query = search.toLowerCase();

    return leadName.includes(query) || notes.includes(query) || pic.includes(query);
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
            CRM Module
          </span>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="h-6 w-6 text-amber-500" /> Follow-Up Schedule
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola jadwal tindak lanjut dan riwayat interaksi dengan prospek / lead.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Tambah Follow-Up
        </button>
      </div>

      {/* Container Utama */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-5">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama lead, catatan, atau PIC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {["ALL", "PENDING", "COMPLETED", "CANCELLED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition capitalize whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {st === "ALL" ? "Semua" : st.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-xs gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            Memuat data follow-up...
          </div>
        ) : filteredFollowUps.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            <Calendar className="h-10 w-10 mx-auto text-gray-300 mb-2" />
            <p className="font-semibold text-gray-600">Tidak ada jadwal follow-up</p>
            <p className="text-[11px] mt-1 text-gray-400">
              Coba sesuaikan pencarian atau tambahkan jadwal baru.
            </p>
          </div>
        ) : (
          /* Table / List Follow Up */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 font-semibold">
                  <th className="p-3 rounded-l-xl">Lead / Prospek</th>
                  <th className="p-3">Jadwal</th>
                  <th className="p-3">Catatan & PIC</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right rounded-r-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFollowUps.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    {/* Lead Info */}
                    <td className="p-3">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        {item.leads?.name || "Lead Tidak Ditemukan"}
                      </div>
                      {item.leads?.property_title && (
                        <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Building className="h-3 w-3 text-amber-500" />
                          {item.leads.property_title}
                        </div>
                      )}
                    </td>

                    {/* Schedule */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        {item.date}
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3 text-gray-400" />
                        Pkl {item.time}
                      </div>
                    </td>

                    {/* Notes & PIC */}
                    <td className="p-3 max-w-xs">
                      <p className="text-gray-700 line-clamp-2">{item.notes || "-"}</p>
                      <span className="inline-block text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md mt-1 font-medium">
                        PIC: {item.pic || "Tanpa PIC"}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3 whitespace-nowrap">
                      {item.status === "COMPLETED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="h-3 w-3" /> Selesai
                        </span>
                      )}
                      {item.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                      {item.status === "CANCELLED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="h-3 w-3" /> Batal
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right whitespace-nowrap space-x-2">
                      {/* WhatsApp Direct Link */}
                      {item.leads?.whatsapp && (
                        <a
                          href={`https://wa.me/${item.leads.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-green-500 text-white font-semibold text-[11px] hover:bg-green-600 transition"
                        >
                          <Phone className="h-3 w-3" /> WA
                        </a>
                      )}

                      {/* Complete Button */}
                      {item.status === "PENDING" && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, "COMPLETED")}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition cursor-pointer"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Selesai
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah Follow Up */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" /> Tambah Schedule Follow-Up
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Jadwalkan interaksi selanjutnya dengan lead / calon pembeli.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Select Lead */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Pilih Lead / Prospek <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.lead_id}
                  onChange={(e) => setFormData({ ...formData, lead_id: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Pilih Lead --</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} {lead.property_title ? `(${lead.property_title})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Jam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* PIC */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  PIC / Penanggung Jawab
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sales Admin / Agent Ahmad"
                  value={formData.pic}
                  onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Catatan / Agenda Interaksi
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Telepon ulang untuk mengonfirmasi ketersediaan survei lokasi unit tipe 36..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}