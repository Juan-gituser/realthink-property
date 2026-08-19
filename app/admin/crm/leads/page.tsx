"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  Building2,
  Clock,
  ChevronRight,
  MessageSquare,
  AlertCircle,
  X,
  Send,
} from "lucide-react";
import { LeadStatus, LeadSource, ActivityType, FollowUpItem } from "@/types/crm";

interface AttachedProperty {
  id: string;
  interest_status: string;
  property_id: string;
  properties?: {
    id: string;
    title: string;
    price: number;
  };
}

interface LeadItem {
  id: string;
  lead_id: string;
  name: string;
  whatsapp: string;
  email?: string;
  source: LeadSource;
  source_label?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_area?: string;
  property_type?: string;
  status: LeadStatus;
  assigned_to?: string;
  notes?: string;
  last_contact_at?: string;
  next_follow_up_at?: string;
  created_at: string;
  lead_properties?: AttachedProperty[];
}

const STATUS_BADGES: Record<
  LeadStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  NEW: { label: "BARU", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  CONTACTED: { label: "DIHUBUNGI", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  QUALIFIED: { label: "TERKUALIFIKASI", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  SURVEY: { label: "SURVEY", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  NEGOTIATION: { label: "NEGOSIASI", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  BOOKING: { label: "BOOKING", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  CLOSED: { label: "CLOSED", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  LOST: { label: "BATAL/LOST", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

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

const SOURCES: LeadSource[] = [
  "Website",
  "Instagram",
  "TikTok",
  "Facebook",
  "WhatsApp",
  "Google",
  "Referral",
  "Agent",
  "Freelancer",
  "Other",
  "Titip Properti",
];

export default function AdminCRMLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  // Drawer & Modal States
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch Leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (sourceFilter) params.set("source", sourceFilter);

      const res = await fetch(`/api/admin/crm/leads?${params.toString()}`);

      if (!res.ok) {
        throw new Error(
          `Endpoint API mengembalikan status HTTP ${res.status}. Pastikan route /api/admin/crm/leads sudah ada.`
        );
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server mengembalikan halaman HTML/Error, bukan data JSON.");
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Gagal memuat data leads");

      setLeads(data.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchLeads();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchLeads]);

  // Handle Quick Status Change
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
    } catch {
      alert("Gagal memperbarui status lead");
    }
  };

  const formatRupiah = (val?: number) => {
    if (!val) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <Users className="h-3.5 w-3.5" /> Management Leads CRM
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Center & Pipeline</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Kelola prospek pembeli, jalur negosiasi, dan aktivitas tim sales.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-600"
        >
          <Plus className="h-4 w-4" /> Tambah Lead Baru
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:grid-cols-12">
        <div className="relative sm:col-span-6 md:col-span-5">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, WA, Lead ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-xs focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-3 md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:border-amber-500 focus:outline-none bg-white"
          >
            <option value="">Semua Status Pipeline</option>
            {Object.keys(STATUS_BADGES).map((st) => (
              <option key={st} value={st}>
                {STATUS_BADGES[st as LeadStatus].label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3 md:col-span-3">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:border-amber-500 focus:outline-none bg-white"
          >
            <option value="">Semua Source</option>
            {SOURCES.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Data Table */}
<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
  {loading ? (
    <div className="p-12 text-center text-xs text-gray-400">Memuat pipeline leads...</div>
  ) : error ? (
    <div className="flex items-center justify-center gap-2 p-8 text-xs text-rose-500">
      <AlertCircle className="h-4 w-4" /> {error}
    </div>
  ) : leads.length === 0 ? (
    <div className="p-12 text-center text-xs text-gray-500">
      Belum ada lead yang sesuai filter.
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-gray-200 bg-gray-50 font-semibold uppercase text-gray-500">
          <tr>
            <th className="px-5 py-4">Lead ID & Nama</th>
            <th className="px-4 py-4">Kontak</th>
            <th className="px-4 py-4">Source</th>
            <th className="px-4 py-4">Properti Minat</th>
            <th className="px-4 py-4">Budget Range</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4">Next Follow-Up</th>
            <th className="px-5 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => {
            const badge = STATUS_BADGES[lead.status] || STATUS_BADGES.NEW;

            return (
              <tr key={lead.id || lead.lead_id} className="hover:bg-gray-50/60 transition">
                <td className="px-5 py-4">
                  <div className="font-mono text-[10px] text-amber-600 font-bold">
                    {lead.lead_id || `ID-${lead.id.slice(0, 6)}`}
                  </div>
                  <div className="font-bold text-gray-900 text-sm">{lead.name || "Tanpa Nama"}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 font-medium text-gray-700">
                    <Phone className="h-3 w-3 text-emerald-600" /> {lead.whatsapp || "-"}
                  </div>
                  {lead.email && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mt-0.5">
                      <Mail className="h-3 w-3" /> {lead.email}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex w-fit rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                    {lead.source || "Website"}
                  </span>
                </td>

                {/* PROPERTI MINAT (LIGHT THEME & RAPI) */}
                <td className="px-4 py-4 align-middle">
                  {(() => {
                    const properties = (lead.lead_properties || [])
                      .map((lp: any) => lp.properties)
                      .filter(Boolean);

                    if (properties.length === 0) {
                      return <span className="text-gray-400 italic text-xs">Belum diset</span>;
                    }

                    const firstProp = properties[0];
                    const extraCount = properties.length - 1;

                    return (
                      <div className="group relative inline-block">
                        {/* Badge Utama */}
                        <div className="flex items-center gap-1.5 rounded-xl border border-amber-200/80 bg-amber-50/60 px-2.5 py-1 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-100/80 cursor-pointer whitespace-nowrap">
                          <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
                          <span className="truncate max-w-[140px] font-medium text-gray-800" title={firstProp.title}>
                            {firstProp.title}
                          </span>
                          {extraCount > 0 && (
                            <span className="flex-shrink-0 rounded-full bg-amber-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                              +{extraCount}
                            </span>
                          )}
                        </div>

                        {/* Hover Card (Light Theme) */}
                        <div className="absolute left-0 top-full mt-1.5 hidden group-hover:block z-50 min-w-[250px] max-w-[300px] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl transition-all">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                            <span className="text-xs font-bold text-gray-800">Properti Minat</span>
                            <span className="rounded-full bg-amber-50 border border-amber-200/60 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                              {properties.length} Properti
                            </span>
                          </div>

                          <ul className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                            {properties.map((p: any, idx: number) => (
                              <li key={p.id || idx} className="rounded-lg bg-gray-50/80 p-2 border border-gray-100 text-xs">
                                <p className="font-semibold text-gray-800 truncate">{idx + 1}. {p.title || "Tanpa Judul"}</p>
                                {p.price && (
                                  <p className="mt-0.5 text-[11px] font-mono font-bold text-amber-600">
                                    {typeof formatRupiah === "function" ? formatRupiah(p.price) : `Rp ${Number(p.price).toLocaleString("id-ID")}`}
                                  </p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </td>

                <td className="px-4 py-4 font-mono text-[11px] text-gray-600">
                  {lead.budget_min || lead.budget_max ? (
                    <span>
                      {formatRupiah(lead.budget_min)} - {formatRupiah(lead.budget_max)}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Unspecified</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <select
                    value={lead.status || "NEW"}
                    onChange={(e) =>
                      handleStatusChange(lead.id, e.target.value as LeadStatus)
                    }
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold focus:outline-none cursor-pointer ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {Object.keys(STATUS_BADGES).map((st) => (
                      <option key={st} value={st}>
                        {STATUS_BADGES[st as LeadStatus].label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 text-gray-500 text-[11px]">
                  {lead.next_follow_up_at ? (
                    <span className="flex items-center gap-1 font-medium text-amber-700">
                      <Calendar className="h-3 w-3" />{" "}
                      {new Date(lead.next_follow_up_at).toLocaleDateString("id-ID")}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => setSelectedLeadId(lead.id)}
                    className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition cursor-pointer"
                  >
                    Detail <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>

      {/* Drawer Detail Lead */}
      {selectedLeadId && (
        <LeadDetailDrawer
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onUpdated={fetchLeads}
        />
      )}

      {/* Modal Create Lead */}
      {isCreateOpen && (
        <CreateLeadModal
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => {
            setIsCreateOpen(false);
            fetchLeads();
          }}
        />
      )}
    </div>
  );
}

/* ====================================================================
   SUB-COMPONENT 1: LEAD DETAIL DRAWER (LENGKAP DENGAN AKSI MANUAL)
==================================================================== */
function LeadDetailDrawer({
  leadId,
  onClose,
  onUpdated,
}: {
  leadId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [detail, setDetail] = useState<{
    lead_id?: string;
    name?: string;
    whatsapp?: string;
    email?: string;
    source?: string;
    preferred_area?: string;
    budget_min?: number;
    budget_max?: number;
    next_follow_up_at?: string;
    lead_properties?: Array<{
      id: string;
      property_id: string;
      interest_status: string;
      properties?: {
        title?: string;
        name?: string;
        price?: number;
      };
    }>;
    activities?: Array<{
      id: string;
      type: ActivityType;
      created_at: string;
      description: string;
    }>;
  } | null>(null);

  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Edit Manual Informasi Klien
  const [isEditing, setIsEditing] = useState(false);
  const [budgetMin, setBudgetMin] = useState<number | string>("");
  const [budgetMax, setBudgetMax] = useState<number | string>("");
  const [nextFollowUp, setNextFollowUp] = useState("");

  // State untuk Edit Properti Minat dari Katalog
  const [propertiesCatalog, setPropertiesCatalog] = useState<
    Array<{ id: string; title?: string; name?: string; price?: number }>
  >([]);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [selectedPropToAdd, setSelectedPropToAdd] = useState("");
  const [isEditingProps, setIsEditingProps] = useState(false);
  const [savingProps, setSavingProps] = useState(false);

  // New Follow Up Form State
  const [fuDate, setFuDate] = useState("");
  const [fuTime, setFuTime] = useState("10:00");
  const [fuNotes, setFuNotes] = useState("");
  const [fuPic, setFuPic] = useState("");

  // New Activity Form State
  const [activityType, setActivityType] = useState<ActivityType>("NOTE");
  const [activityDesc, setActivityDesc] = useState("");
  const [submittingAct, setSubmittingAct] = useState(false);

  // Fetch Katalog Properti
  const fetchPropertiesCatalog = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/properties");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setPropertiesCatalog(json.data || []);
      }
    } catch (e) {
      console.error("Gagal memuat katalog properti", e);
    }
  }, []);

  useEffect(() => {
    fetchPropertiesCatalog();
  }, [fetchPropertiesCatalog]);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Lead Detail
      const res = await fetch(`/api/admin/crm/leads/${leadId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setDetail(data.data);
          // Sinkronisasi state form edit dengan data terbaru
          setBudgetMin(data.data.budget_min ?? "");
          setBudgetMax(data.data.budget_max ?? "");
          setNextFollowUp(
            data.data.next_follow_up_at
              ? data.data.next_follow_up_at.split("T")[0]
              : ""
          );

          // Sinkronisasi properti terpilih
          if (Array.isArray(data.data.lead_properties)) {
            setSelectedPropertyIds(
              data.data.lead_properties.map((lp: any) => lp.property_id)
            );
          }
        }
      }

      // 2. Fetch Follow Ups
      const resFu = await fetch(`/api/admin/crm/follow-ups?lead_id=${leadId}`);
      if (resFu.ok) {
        const dataFu = await resFu.json();
        if (dataFu.success && Array.isArray(dataFu.data)) {
          // Normalisasi data agar fu.date & fu.time selalu ada
          const normalizedFollowUps = dataFu.data.map((item: any) => {
            const rawDate =
              item.date ||
              item.follow_up_date ||
              item.scheduled_at ||
              item.created_at ||
              item.date_time;

            let formattedDate = item.date || "";
            let formattedTime = item.time || "";

            if (rawDate && (!item.date || !item.time)) {
              const dateObj = new Date(rawDate);
              if (!isNaN(dateObj.getTime())) {
                formattedDate =
                  item.date ||
                  dateObj.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                formattedTime =
                  item.time ||
                  dateObj
                    .toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                    .replace(".", ":");
              }
            }

            return {
              ...item,
              date: formattedDate || "-",
              time: formattedTime || "",
            };
          });

          setFollowUps(normalizedFollowUps);
        } else {
          setFollowUps([]);
        }
      }
    } catch (e) {
      console.error("Gagal memuat detail lead", e);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchDetail();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchDetail]);

  // Fungsi untuk menyimpan perubahan manual info klien oleh admin
  const handleSaveManualEdit = async () => {
    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget_min: budgetMin ? Number(budgetMin) : null,
          budget_max: budgetMax ? Number(budgetMax) : null,
          next_follow_up_at: nextFollowUp
            ? new Date(nextFollowUp).toISOString()
            : null,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setIsEditing(false);
        fetchDetail();
        onUpdated();
      } else {
        alert("Gagal memperbarui data: " + result.error);
      }
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  };

  // Fungsi untuk menyimpan perubahan Properti Minat
  const handleSaveProperties = async () => {
    setSavingProps(true);
    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_ids: selectedPropertyIds,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setIsEditingProps(false);
        fetchDetail();
        onUpdated();
      } else {
        alert("Gagal memperbarui properti minat: " + (result.error || ""));
      }
    } catch (err) {
      console.error("Error updating properties:", err);
    } finally {
      setSavingProps(false);
    }
  };

  // Handler: Buat Follow Up Baru
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
        setFuDate("");
        fetchDetail();
        onUpdated();
      }
    } catch {
      alert("Gagal membuat jadwal follow up");
    }
  };

  // Handler: Tambah Aktivitas Manual
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityDesc) return;
    setSubmittingAct(true);
    try {
      const res = await fetch(`/api/admin/crm/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId,
          type: activityType,
          description: activityDesc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActivityDesc("");
        fetchDetail();
        onUpdated();
      }
    } finally {
      setSubmittingAct(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header Drawer */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
          <div>
            <span className="font-mono text-xs font-bold text-amber-600">
              {detail?.lead_id}
            </span>
            <h2 className="text-lg font-bold text-gray-900">
              {detail?.name || "Detail Lead"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">
            Memuat detail lead...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Actions */}
            <div className="flex gap-2">
              <a
                href={`https://wa.me/${detail?.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                <Phone className="h-4 w-4" /> Chat WhatsApp
              </a>
            </div>

            {/* General Info Card (INFORMASI KLIEN dengan Mode Edit) */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-xs">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-700">INFORMASI KLIEN</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-amber-600 font-medium hover:underline cursor-pointer"
                >
                  {isEditing ? "Batal" : "Edit Manual"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400 text-xs block">WhatsApp:</span>
                  <p className="font-medium text-gray-800">{detail?.whatsapp}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Email:</span>
                  <p className="font-medium text-gray-800">
                    {detail?.email || "-"}
                  </p>
                </div>

                {/* Budget Range */}
                <div className="col-span-2">
                  <span className="text-gray-400 text-xs block">Budget Range:</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        placeholder="Min Budget"
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value)}
                        className="w-full text-xs p-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-amber-500"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max Budget"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value)}
                        className="w-full text-xs p-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  ) : (
                    <p className="font-medium text-gray-800">
                      {detail?.budget_min || detail?.budget_max
                        ? `Rp ${Number(detail?.budget_min || 0).toLocaleString()} - Rp ${Number(detail?.budget_max || 0).toLocaleString()}`
                        : "Unspecified"}
                    </p>
                  )}
                </div>

                {/* Next Follow-Up */}
                <div className="col-span-2">
                  <span className="text-gray-400 text-xs block">Next Follow-Up:</span>
                  {isEditing ? (
                    <input
                      type="date"
                      value={nextFollowUp}
                      onChange={(e) => setNextFollowUp(e.target.value)}
                      className="w-full text-xs p-1.5 border border-gray-200 rounded-md mt-1 focus:outline-none focus:border-amber-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">
                      {detail?.next_follow_up_at
                        ? new Date(detail.next_follow_up_at).toLocaleDateString("id-ID", {
                            dateStyle: "medium",
                          })
                        : "-"}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSaveManualEdit}
                  className="w-full mt-2 bg-amber-500 text-white text-xs py-2 rounded-lg font-medium hover:bg-amber-600 transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              )}
            </div>

            {/* Attached Properties (PROPERTI MINAT dengan Pemilihan dari Katalog) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-amber-500" /> Properti Minat (
                  {detail?.lead_properties?.length || 0})
                </h3>
                <button
                  onClick={() => setIsEditingProps(!isEditingProps)}
                  className="text-xs text-amber-600 font-medium hover:underline cursor-pointer"
                >
                  {isEditingProps ? "Batal" : "Edit Properti"}
                </button>
              </div>

              {isEditingProps ? (
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 space-y-3">
                  {/* Select Katalog */}
                  <div className="flex gap-2">
                    <select
                      value={selectedPropToAdd}
                      onChange={(e) => setSelectedPropToAdd(e.target.value)}
                      className="flex-1 text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500 bg-white"
                    >
                      <option value="">-- Pilih Properti dari Katalog --</option>
                      {propertiesCatalog.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          disabled={selectedPropertyIds.includes(p.id)}
                        >
                          {p.title || p.name} - Rp{" "}
                          {p.price ? Number(p.price).toLocaleString("id-ID") : 0}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          selectedPropToAdd &&
                          !selectedPropertyIds.includes(selectedPropToAdd)
                        ) {
                          setSelectedPropertyIds([
                            ...selectedPropertyIds,
                            selectedPropToAdd,
                          ]);
                          setSelectedPropToAdd("");
                        }
                      }}
                      className="bg-amber-500 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-amber-600 transition cursor-pointer"
                    >
                      Tambah
                    </button>
                  </div>

                  {/* List Properti Terpilih (Mode Edit) */}
                  <div className="space-y-1.5">
                    {selectedPropertyIds.map((id) => {
                      const prop =
                        propertiesCatalog.find((p) => p.id === id) ||
                        detail?.lead_properties?.find(
                          (lp) => lp.property_id === id
                        )?.properties;
                      const title =
                        prop?.title || prop?.name || `Properti ID: ${id}`;
                      const price = prop?.price;

                      return (
                        <div
                          key={id}
                          className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-lg text-xs"
                        >
                          <div>
                            <p className="font-bold text-gray-800">{title}</p>
                            {price ? (
                              <p className="text-[11px] text-amber-700 font-mono">
                                Rp {Number(price).toLocaleString("id-ID")}
                              </p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPropertyIds(
                                selectedPropertyIds.filter((pid) => pid !== id)
                              )
                            }
                            className="text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                    {selectedPropertyIds.length === 0 && (
                      <p className="text-xs text-gray-400 italic text-center py-2">
                        Belum ada properti minat terpilih.
                      </p>
                    )}
                  </div>

                  {/* Tombol Simpan Properti */}
                  <button
                    type="button"
                    onClick={handleSaveProperties}
                    disabled={savingProps}
                    className="w-full bg-emerald-600 text-white text-xs py-2 rounded-lg font-bold hover:bg-emerald-700 transition cursor-pointer disabled:opacity-50"
                  >
                    {savingProps ? "Menyimpan..." : "Simpan Properti Minat"}
                  </button>
                </div>
              ) : (
                /* Read-only View */
                <div className="space-y-2">
                  {detail?.lead_properties?.map((lp) => (
                    <div
                      key={lp.id}
                      className="rounded-xl border border-gray-200 p-3 bg-white flex justify-between items-center"
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          {lp.properties?.title || "Properti ID: " + lp.property_id}
                        </p>
                        <p className="text-[11px] font-mono text-amber-700">
                          Rp {lp.properties?.price?.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        {lp.interest_status || "MINAT"}
                      </span>
                    </div>
                  ))}
                  {(!detail?.lead_properties || detail.lead_properties.length === 0) && (
                    <div className="text-center p-3 border border-dashed border-gray-200 rounded-xl text-xs text-gray-400">
                      Belum ada properti minat yang diset
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form Jadwal Follow-Up Baru */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 space-y-3">
              <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-amber-600" /> Buat Jadwal Follow-Up
              </h3>
              <form onSubmit={handleCreateFollowUp} className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={fuDate}
                      onChange={(e) => setFuDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white p-2 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Jam</label>
                    <input
                      type="time"
                      value={fuTime}
                      onChange={(e) => setFuTime(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white p-2 focus:outline-none"
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
                    className="w-full rounded-xl border border-gray-200 bg-white p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Catatan Follow-Up</label>
                  <input
                    type="text"
                    placeholder="Misal: Konfirmasi hasil survey lokasi..."
                    value={fuNotes}
                    onChange={(e) => setFuNotes(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-500 py-2 font-bold text-white hover:bg-amber-600 transition cursor-pointer"
                >
                  Simpan Jadwal Follow-Up
                </button>
              </form>

              {/* List Follow-Up Terjadwal */}
              {followUps.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-amber-200 pt-3">
                  <span className="font-bold text-[11px] text-amber-900 block">Daftar Follow-Up:</span>
                  {followUps.map((fu: any) => {
                    const displayDate = fu.date || (fu.schedule_date ? fu.schedule_date.split("T")[0] : "-");
                    const displayTime = fu.time || (fu.schedule_date ? new Date(fu.schedule_date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "");

                    return (
                      <div key={fu.id} className="bg-white rounded-xl p-2.5 border border-amber-100 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-gray-800">
                            {displayDate} {displayTime ? `pukul ${displayTime}` : ""}
                          </div>
                          <p className="text-gray-500 text-[11px]">{fu.notes || "Tanpa catatan"}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${fu.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {fu.status || "PENDING"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====================================================================
   SUB-COMPONENT 2: CREATE LEAD MODAL
==================================================================== */
function CreateLeadModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState<LeadSource>("Website");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [preferredArea, setPreferredArea] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp,
          email,
          source,
          budget_min: budgetMin,
          budget_max: budgetMax,
          preferred_area: preferredArea,
          notes,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      onSuccess();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menambah lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-bold text-gray-900">Tambah Lead Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700">Nama Lengkap *</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border p-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700">WhatsApp *</label>
              <input
                required
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="mt-1 w-full rounded-xl border p-2 focus:border-amber-500 focus:outline-none"
                placeholder="08123456789"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border p-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="mt-1 w-full rounded-xl border p-2 focus:border-amber-500 focus:outline-none bg-white"
              >
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700">Budget Min (Rp)</label>
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                className="mt-1 w-full rounded-xl border p-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700">Budget Max (Rp)</label>
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                className="mt-1 w-full rounded-xl border p-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700">Preferred Area / Catatan</label>
            <textarea
              value={preferredArea}
              onChange={(e) => setPreferredArea(e.target.value)}
              className="mt-1 w-full rounded-xl border p-2 focus:border-amber-500 focus:outline-none"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-amber-500 px-5 py-2 font-bold text-white hover:bg-amber-600 cursor-pointer"
            >
              {loading ? "Menyimpan..." : "Simpan Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}