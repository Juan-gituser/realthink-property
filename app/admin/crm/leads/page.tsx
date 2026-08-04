"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Plus,
  Filter,
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
  UserCheck,
  Tag,
  DollarSign,
  Layers,
} from "lucide-react";
import { LeadStatus, LeadSource, ActivityType } from "@/types/crm";

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

  // Fetch Leads dengan Penanganan HTTP Status & Content-Type Aman
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (sourceFilter) params.set("source", sourceFilter);

      // Panggil Endpoint API CRM Leads
      const res = await fetch(`/api/admin/crm/leads?${params.toString()}`);

      // 1. Validasi HTTP Status Code
      if (!res.ok) {
        throw new Error(
          `Endpoint API mengembalikan status HTTP ${res.status}. Pastikan route /api/admin/crm/leads sudah ada.`
        );
      }

      // 2. Validasi bahwa response memang JSON, bukan halaman HTML
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

      // Optimistic Update
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
    } catch (err) {
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
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:border-amber-500 focus:outline-none"
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
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:border-amber-500 focus:outline-none"
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
                  const propertyCount = lead.lead_properties?.length || 0;

                  return (
                    <tr key={lead.id} className="hover:bg-gray-50/60 transition">
                      <td className="px-5 py-4">
                        <div className="font-mono text-[10px] text-amber-600 font-bold">
                          {lead.lead_id}
                        </div>
                        <div className="font-bold text-gray-900 text-sm">{lead.name}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 font-medium text-gray-700">
                          <Phone className="h-3 w-3 text-emerald-600" /> {lead.whatsapp}
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mt-0.5">
                            <Mail className="h-3 w-3" /> {lead.email}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {propertyCount > 0 ? (
                          <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                            <Building2 className="h-3.5 w-3.5 text-amber-500" />
                            <span>{propertyCount} Properti</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Belum diset</span>
                        )}
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
                          value={lead.status}
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
                          className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
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
   SUB-COMPONENT 1: LEAD DETAIL DRAWER
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
    lead_properties?: Array<{
      id: string;
      property_id: string;
      interest_status: string;
      properties?: {
        title?: string;
        price?: number;
      };
    }>;
    activities?: Array<{
      id: string;
      activity_type: string;
      created_at: string;
      description: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // New activity form
  const [activityType, setActivityType] = useState<ActivityType>("NOTE");
  const [activityDesc, setActivityDesc] = useState("");
  const [submittingAct, setSubmittingAct] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setDetail(data.data);
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

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityDesc) return;
    setSubmittingAct(true);
    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity_type: activityType, description: activityDesc }),
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
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
          <div>
            <span className="font-mono text-xs font-bold text-amber-600">
              {detail?.lead_id}
            </span>
            <h2 className="text-lg font-bold text-gray-900">
              {detail?.name || "Detail Lead"}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Memuat detail lead...</div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Actions */}
            <div className="flex gap-2">
              <a
                href={`https://wa.me/${detail?.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <Phone className="h-4 w-4" /> Chat WhatsApp
              </a>
            </div>

            {/* General Info Card */}
            <div className="rounded-2xl border border-gray-200 p-4 space-y-3 bg-gray-50/50">
              <h3 className="text-xs font-bold text-gray-500 uppercase">Informasi Klien</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400">WhatsApp:</span>{" "}
                  <p className="font-semibold text-gray-900">{detail?.whatsapp}</p>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>{" "}
                  <p className="font-semibold text-gray-900">{detail?.email || "-"}</p>
                </div>
                <div>
                  <span className="text-gray-400">Source:</span>{" "}
                  <p className="font-semibold text-gray-900">{detail?.source}</p>
                </div>
                <div>
                  <span className="text-gray-400">Preferred Area:</span>{" "}
                  <p className="font-semibold text-gray-900">{detail?.preferred_area || "-"}</p>
                </div>
              </div>
            </div>

            {/* Attached Properties */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-amber-500" /> Properti Minat (
                {detail?.lead_properties?.length || 0})
              </h3>
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
                      {lp.interest_status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Activity Note */}
            <form
              onSubmit={handleAddActivity}
              className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/40 p-4"
            >
              <h3 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" /> Catat Aktivitas / Follow-Up
              </h3>
              <div className="flex gap-2">
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as ActivityType)}
                  className="rounded-xl border border-gray-200 bg-white px-2 py-1.5 text-xs focus:outline-none"
                >
                  <option value="CALL">Call</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="EMAIL">Email</option>
                  <option value="MEETING">Meeting</option>
                  <option value="NOTE">Note</option>
                </select>
                <input
                  type="text"
                  placeholder="Deskripsi aktivitas..."
                  value={activityDesc}
                  onChange={(e) => setActivityDesc(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submittingAct}
                  className="rounded-xl bg-amber-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-600"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>

            {/* Activity Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500" /> Timeline Aktivitas
              </h3>
              <div className="relative border-l-2 border-amber-200 ml-3 space-y-4 pl-4">
                {detail?.activities?.map((act) => (
                  <div key={act.id} className="relative">
                    <div className="absolute -left-5.75[23px] top-1.5 h-3 w-3 rounded-full bg-amber-500 border-2 border-white" />
                    <div className="text-[10px] font-bold text-amber-700 uppercase">
                      {act.activity_type} • {new Date(act.created_at).toLocaleString("id-ID")}
                    </div>
                    <p className="text-xs text-gray-800 font-medium">{act.description}</p>
                  </div>
                ))}
              </div>
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
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
                className="mt-1 w-full rounded-xl border p-2 focus:border-amber-500 focus:outline-none"
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
              className="rounded-xl px-4 py-2 font-bold text-gray-500 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-amber-500 px-5 py-2 font-bold text-white hover:bg-amber-600"
            >
              {loading ? "Menyimpan..." : "Simpan Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}