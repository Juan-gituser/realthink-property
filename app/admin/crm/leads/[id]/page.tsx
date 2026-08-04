"use client";

import { useState, useEffect, useCallback, use } from "react";
import {
  User,
  Phone,
  Mail,
  Building,
  Calendar,
  Clock,
  MessageSquare,
  Plus,
  CheckCircle,
  FileText,
  Activity as ActivityIcon,
  Send,
  AlertTriangle,
} from "lucide-react";
import { FollowUpItem, ActivityItem, ActivityType } from "@/types/crm";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const ACTIVITY_LABELS: Record<ActivityType, { label: string; bg: string; text: string }> = {
  LEAD_CREATED: { label: "Lead Dibuat", bg: "bg-blue-50", text: "text-blue-700" },
  WHATSAPP: { label: "WhatsApp Chat", bg: "bg-emerald-50", text: "text-emerald-700" },
  CALL: { label: "Panggilan Telepon", bg: "bg-teal-50", text: "text-teal-700" },
  EMAIL: { label: "Email Terkirim", bg: "bg-purple-50", text: "text-purple-700" },
  NOTE: { label: "Catatan", bg: "bg-gray-100", text: "text-gray-700" },
  SURVEY_SCHEDULED: { label: "Survey Dijadwalkan", bg: "bg-amber-50", text: "text-amber-700" },
  SURVEY_COMPLETED: { label: "Survey Selesai", bg: "bg-emerald-50", text: "text-emerald-700" },
  NEGOTIATION: { label: "Negosiasi", bg: "bg-orange-50", text: "text-orange-700" },
  BOOKING: { label: "Booking Unit", bg: "bg-indigo-50", text: "text-indigo-700" },
  CLOSING: { label: "Closing / Akad", bg: "bg-emerald-100", text: "text-emerald-900" },
  STATUS_CHANGED: { label: "Status Berubah", bg: "bg-blue-100", text: "text-blue-800" },
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: leadId } = use(params);

  // Lead Data State
  const [lead, setLead] = useState<{
    id?: string;
    name?: string;
    whatsapp?: string;
    email?: string;
    property_title?: string;
  } | null>(null);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Follow Up Form
  const [fuDate, setFuDate] = useState("");
  const [fuTime, setFuTime] = useState("10:00");
  const [fuNotes, setFuNotes] = useState("");
  const [fuPic, setFuPic] = useState("");

  // New Manual Activity
  const [actType, setActType] = useState<ActivityType>("NOTE");
  const [actDesc, setActDesc] = useState("");

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Lead
      const resLead = await fetch(`/api/admin/crm/leads/${leadId}`);
      const jsonLead = await resLead.json();
      if (jsonLead.success) setLead(jsonLead.data);

      // 2. Fetch Follow Ups
      const resFu = await fetch(`/api/admin/crm/follow-ups?lead_id=${leadId}`);
      const jsonFu = await resFu.json();
      if (jsonFu.success) setFollowUps(jsonFu.data || []);

      // 3. Fetch Activities
      const resAct = await fetch(`/api/admin/crm/activities?lead_id=${leadId}`);
      const jsonAct = await resAct.json();
      if (jsonAct.success) setActivities(jsonAct.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchData]);

  // Create Follow Up
  const handleCreateFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fuDate || !fuTime) return;

    try {
      const res = await fetch("/api/admin/crm/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId,
          date: fuDate,
          time: fuTime,
          notes: fuNotes,
          pic: fuPic,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setFuNotes("");
        fetchData();
      }
    } catch (err) {
      alert("Gagal membuat follow up");
    }
  };

  // Add Manual Activity
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actDesc) return;

    try {
      const res = await fetch("/api/admin/crm/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId,
          type: actType,
          description: actDesc,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setActDesc("");
        fetchData();
      }
    } catch (err) {
      alert("Gagal menambah activity");
    }
  };

  if (loading) return <div className="p-12 text-center text-xs text-gray-400">Memuat detail lead...</div>;
  if (!lead) return <div className="p-12 text-center text-xs text-rose-500">Lead tidak ditemukan.</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header Profile */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Lead Profile</span>
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Properti: <span className="font-semibold text-gray-800">{lead.property_title || "-"}</span>
          </p>
        </div>

        {/* WhatsApp Link Button */}
        {lead.whatsapp && (
          <a
            href={getWhatsAppUrl(lead.whatsapp ?? "", lead.name ?? "", lead.property_title)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer"
          >
            <MessageSquare className="h-4 w-4" /> Hubungi via WhatsApp
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Detail Lead & Follow Up Management */}
        <div className="lg:col-span-7 space-y-6">
          {/* Detail Lead */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Informasi Kontak</h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
              <div>
                <span className="text-gray-400 block text-[10px]">WhatsApp</span>
                <span className="font-semibold">{lead.whatsapp || "-"}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Email</span>
                <span className="font-semibold">{lead.email || "-"}</span>
              </div>
            </div>
          </div>

          {/* Form Create Follow Up */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 space-y-4">
            <h3 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-amber-600" /> Buat Jadwal Follow Up
            </h3>

            <form onSubmit={handleCreateFollowUp} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={fuDate}
                    onChange={(e) => setFuDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Jam</label>
                  <input
                    type="time"
                    value={fuTime}
                    onChange={(e) => setFuTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">PIC (Petugas)</label>
                <input
                  type="text"
                  placeholder="Nama sales / agen..."
                  value={fuPic}
                  onChange={(e) => setFuPic(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-2 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Catatan Follow Up</label>
                <textarea
                  rows={2}
                  placeholder="Instruksi follow up (misal: tanyakan keputusan KPR)..."
                  value={fuNotes}
                  onChange={(e) => setFuNotes(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-2 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-2.5 font-bold text-white hover:bg-amber-600 transition shadow-xs cursor-pointer"
              >
                Simpan Jadwal Follow Up
              </button>
            </form>
          </div>

          {/* Daftar Follow Up Terjadwal */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
            <h3 className="font-bold text-gray-900 text-xs">Daftar Follow Up Lead Ini</h3>

            {followUps.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Belum ada follow up dijadwalkan.</p>
            ) : (
              <div className="space-y-2">
                {followUps.map((fu) => (
                  <div key={fu.id} className="rounded-xl border border-gray-100 p-3 bg-gray-50/50 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-gray-800">
                        {fu.date} pkl {fu.time}
                      </div>
                      <p className="text-gray-500 mt-0.5">{fu.notes || "Tanpa catatan"}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${fu.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {fu.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Activity Timeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <ActivityIcon className="h-4 w-4 text-amber-600" /> Timeline Activity
            </h3>

            {/* Form Tambah Activity Manual */}
            <form onSubmit={handleAddActivity} className="space-y-2 border-b pb-4">
              <select
                value={actType}
                onChange={(e) => setActType(e.target.value as ActivityType)}
                className="w-full rounded-xl border border-gray-200 p-2 text-xs focus:border-amber-500 focus:outline-none bg-white"
              >
                {Object.keys(ACTIVITY_LABELS).map((type) => (
                  <option key={type} value={type}>
                    {ACTIVITY_LABELS[type as ActivityType].label}
                  </option>
                ))}
              </select>

              <textarea
                rows={2}
                placeholder="Tambah riwayat/catatan interaksi..."
                value={actDesc}
                onChange={(e) => setActDesc(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2 text-xs focus:border-amber-500 focus:outline-none"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-gray-900 py-2 text-xs font-bold text-white hover:bg-gray-800 transition cursor-pointer"
              >
                + Tambah Aktivitas
              </button>
            </form>

            {/* List Activity Timeline */}
            <div className="relative pl-4 border-l-2 border-gray-100 space-y-4">
              {activities.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Belum ada riwayat aktivitas.</p>
              ) : (
                activities.map((act) => {
                  const badge = ACTIVITY_LABELS[act.type] || ACTIVITY_LABELS.NOTE;
                  return (
                    <div key={act.id} className="relative space-y-1">
                      {/* Circle Dot */}
                      <div className="absolute -left-5.25[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-500 ring-2 ring-amber-100" />

                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(act.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-gray-700 font-medium">{act.description}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}