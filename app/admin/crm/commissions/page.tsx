"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Coins,
  Plus,
  Search,
  Building,
  User,
  Calculator,
} from "lucide-react";
import { Commission, CommissionStatus } from "@/types/crm";

const STATUS_BADGES: Record<CommissionStatus, { label: string; bg: string; text: string }> = {
  PENDING: { label: "PENDING", bg: "bg-amber-50 border-amber-200", text: "text-amber-800" },
  VERIFIED: { label: "VERIFIED", bg: "bg-blue-50 border-blue-200", text: "text-blue-800" },
  APPROVED: { label: "APPROVED", bg: "bg-purple-50 border-purple-200", text: "text-purple-800" },
  PAID: { label: "PAID", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800" },
  CANCELLED: { label: "CANCELLED", bg: "bg-rose-50 border-rose-200", text: "text-rose-800" },
};

// Dummy opsi Properti & Lead untuk pilihan relasi
const MOCK_PROPERTIES = [
  { id: "PROP-101", listing_id: "LST-882", title: "Rumah Mewah Cluster Emerald", price: 2450000000 },
  { id: "PROP-102", listing_id: "LST-901", title: "Apartemen Sudirman Tower A", price: 1200000000 },
  { id: "PROP-103", listing_id: "LST-734", title: "Ruko Strategis Gading Serpong", price: 3500000000 },
];

const MOCK_LEADS = [
  { id: "LEAD-001", name: "Ahmad Dahlan", property_id: "PROP-101", property_title: "Rumah Mewah Cluster Emerald" },
  { id: "LEAD-002", name: "Siti Aminah", property_id: "PROP-102", property_title: "Apartemen Sudirman Tower A" },
  { id: "LEAD-003", name: "Bambang Wijaya", property_id: "PROP-103", property_title: "Ruko Strategis Gading Serpong" },
];

const formatRupiah = (val?: number | null) => {
  if (val === undefined || val === null || isNaN(val)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
};

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedCom, setSelectedCom] = useState<Commission | null>(null);

  // Form Fields
  const [selectedPropId, setSelectedPropId] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [agentName, setAgentName] = useState("Budi Santoso");
  const [txPrice, setTxPrice] = useState<number>(2400000000);
  const [netSellerPrice, setNetSellerPrice] = useState<number>(2320000000);
  const [grossCommission, setGrossCommission] = useState<number>(80000000);
  const [additionalCost, setAdditionalCost] = useState<number>(5000000);
  const [formStatus, setFormStatus] = useState<CommissionStatus>("PENDING");
  const [paymentDate, setPaymentDate] = useState("");
  const [notes, setNotes] = useState("");

  // Auto Calculations
  const calculatedNetCommission = useMemo(() => {
    const gross = Number(grossCommission) || 0;
    const cost = Number(additionalCost) || 0;
    return gross - cost;
  }, [grossCommission, additionalCost]);

  // Derived selected property info
  const currentProp = useMemo(() => {
    return MOCK_PROPERTIES.find((p) => p.id === selectedPropId);
  }, [selectedPropId]);

  // Derived selected lead info
  const currentLead = useMemo(() => {
    return MOCK_LEADS.find((l) => l.id === selectedLeadId);
  }, [selectedLeadId]);

  const fetchCommissions = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (statusFilter !== "ALL") q.append("status", statusFilter);
      if (search) q.append("search", search);

      const res = await fetch(`/api/admin/crm/commissions?${q.toString()}`);
      const json = await res.json();
      if (json.success) setCommissions(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCommissions();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchCommissions]);

  // Handler auto select property saat lead dipilih
  const handleLeadChange = (leadId: string) => {
    setSelectedLeadId(leadId);
    const found = MOCK_LEADS.find((l) => l.id === leadId);
    if (found && found.property_id) {
      setSelectedPropId(found.property_id);
      const prop = MOCK_PROPERTIES.find((p) => p.id === found.property_id);
      if (prop) {
        setTxPrice(prop.price);
        setNetSellerPrice(prop.price * 0.97); // perkiraan default
        setGrossCommission(prop.price * 0.03); // default 3%
      }
    }
  };

  // Handler select property
  const handlePropertyChange = (propId: string) => {
    setSelectedPropId(propId);
    const prop = MOCK_PROPERTIES.find((p) => p.id === propId);
    if (prop) {
      setTxPrice(prop.price);
      setNetSellerPrice(prop.price * 0.97);
      setGrossCommission(prop.price * 0.03);
    }
  };

  const handleOpenCreate = () => {
    setSelectedCom(null);
    setSelectedPropId(MOCK_PROPERTIES[0].id);
    setSelectedLeadId(MOCK_LEADS[0].id);
    setAgentName("Budi Santoso");
    setTxPrice(MOCK_PROPERTIES[0].price);
    setNetSellerPrice(MOCK_PROPERTIES[0].price * 0.97);
    setGrossCommission(MOCK_PROPERTIES[0].price * 0.03);
    setAdditionalCost(5000000);
    setFormStatus("PENDING");
    setPaymentDate("");
    setNotes("");
    setShowModal(true);
  };

  const handleOpenEdit = (item: Commission) => {
    setSelectedCom(item);
    setSelectedPropId(item.property_id);
    setSelectedLeadId(item.lead_id);
    setAgentName(item.agent_name || "Agent Utama");
    setTxPrice(item.transaction_price);
    setNetSellerPrice(item.net_seller_price);
    setGrossCommission(item.gross_commission);
    setAdditionalCost(item.additional_cost);
    setFormStatus(item.status);
    setPaymentDate(item.payment_date || "");
    setNotes(item.notes || "");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        property_id: selectedPropId,
        listing_id: currentProp?.listing_id || "-",
        lead_id: selectedLeadId,
        agent_name: agentName,
        transaction_price: txPrice,
        net_seller_price: netSellerPrice,
        gross_commission: grossCommission,
        additional_cost: additionalCost,
        status: formStatus,
        payment_date: paymentDate || null,
        notes,
        property_title: currentProp?.title || "Properti",
        property_price: currentProp?.price || txPrice,
        lead_name: currentLead?.name || "Lead",
      };

      if (selectedCom) {
        // Update
        const res = await fetch(`/api/admin/crm/commissions/${selectedCom.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if ((await res.json()).success) {
          setShowModal(false);
          fetchCommissions();
        }
      } else {
        // Create
        const res = await fetch("/api/admin/crm/commissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if ((await res.json()).success) {
          setShowModal(false);
          fetchCommissions();
        }
      }
    } catch {
      alert("Gagal menyimpan data komisi");
    }
  };

  // Metrics Summary
  const totals = useMemo(() => {
    const totalNet = commissions.reduce((acc, curr) => acc + (curr.net_commission || 0), 0);
    const paidNet = commissions
      .filter((c) => c.status === "PAID")
      .reduce((acc, curr) => acc + (curr.net_commission || 0), 0);
    const pendingNet = commissions
      .filter((c) => c.status === "PENDING" || c.status === "VERIFIED")
      .reduce((acc, curr) => acc + (curr.net_commission || 0), 0);
    return { totalNet, paidNet, pendingNet };
  }, [commissions]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">CRM Module</span>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Coins className="h-6 w-6 text-amber-500" /> Commission Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pencatatan dan verifikasi pembagian komisi transaksi agen, lead, dan properti.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Catat Komisi Baru
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Net Commission</span>
          <div className="text-xl font-extrabold text-gray-900">{formatRupiah(totals.totalNet)}</div>
          <p className="text-[10px] text-gray-500">Akumulasi komisi bersih terdaftar</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-1">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Sudah Cair (PAID)</span>
          <div className="text-xl font-extrabold text-emerald-900">{formatRupiah(totals.paidNet)}</div>
          <p className="text-[10px] text-emerald-600">Komisi telah ditransfer ke agen</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 space-y-1">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending / Verifikasi</span>
          <div className="text-xl font-extrabold text-amber-900">{formatRupiah(totals.pendingNet)}</div>
          <p className="text-[10px] text-amber-600">Proses persetujuan pencairan</p>
        </div>
      </div>

      {/* Filter & Table Container */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari ID, Lead, Properti, Agent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["ALL", "PENDING", "VERIFIED", "APPROVED", "PAID", "CANCELLED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table Data */}
        {loading ? (
          <p className="text-xs text-gray-400 italic py-8 text-center">Memuat daftar komisi...</p>
        ) : commissions.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-8 text-center">Tidak ada data komisi ditemukan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                  <th className="p-3">ID Komisi</th>
                  <th className="p-3">Properti & Lead</th>
                  <th className="p-3">Agent</th>
                  <th className="p-3">Nilai Transaksi</th>
                  <th className="p-3">Gross / Potongan</th>
                  <th className="p-3">Net Commission</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {commissions.map((item) => {
                  const badge = STATUS_BADGES[item.status] || STATUS_BADGES.PENDING;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition">
                      <td className="p-3 font-bold text-gray-900">{item.commission_id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-800">{item.property_title || item.property_id}</div>
                        <div className="text-[10px] text-gray-500">Lead: {item.lead_name || item.lead_id}</div>
                      </td>
                      <td className="p-3 font-medium text-gray-700">{item.agent_name || "-"}</td>
                      <td className="p-3 font-medium text-gray-800">{formatRupiah(item.transaction_price)}</td>
                      <td className="p-3 text-gray-600">
                        <div>Gross: {formatRupiah(item.gross_commission)}</div>
                        <div className="text-[10px] text-rose-500">Cost: -{formatRupiah(item.additional_cost)}</div>
                      </td>
                      <td className="p-3 font-extrabold text-amber-600">{formatRupiah(item.net_commission)}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                        >
                          Edit / Detail
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

      {/* Modal Form Tambah / Edit Komisi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  {selectedCom ? `Edit Komisi (${selectedCom.commission_id})` : "Pencatatan Komisi Transaksi"}
                </h3>
                <p className="text-[11px] text-gray-500">Pilih relasi properti, lead, dan kalkulasi komisi bersih.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Relasi Lead & Properti */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <label className="font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-amber-600" /> Pilih Lead
                  </label>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => handleLeadChange(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 bg-white focus:border-amber-500 focus:outline-none"
                    required
                  >
                    {MOCK_LEADS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.id})
                      </option>
                    ))}
                  </select>
                  {currentLead && (
                    <div className="mt-1.5 text-[10px] text-gray-500">
                      Property Terkait: <span className="font-semibold text-gray-700">{currentLead.property_title}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Building className="h-3.5 w-3.5 text-amber-600" /> Pilih Properti
                  </label>
                  <select
                    value={selectedPropId}
                    onChange={(e) => handlePropertyChange(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 bg-white focus:border-amber-500 focus:outline-none"
                    required
                  >
                    {MOCK_PROPERTIES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} - {formatRupiah(p.price)}
                      </option>
                    ))}
                  </select>
                  {currentProp && (
                    <div className="mt-1.5 text-[10px] text-gray-500 flex justify-between">
                      <span>Listing ID: <b>{currentProp.listing_id}</b></span>
                      <span>Harga: <b>{formatRupiah(currentProp.price)}</b></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Agent & Nilai Transaksi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Nama Agent</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Harga Transaksi (Rp)</label>
                  <input
                    type="number"
                    value={txPrice}
                    onChange={(e) => setTxPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Net Seller Price (Rp)</label>
                  <input
                    type="number"
                    value={netSellerPrice}
                    onChange={(e) => setNetSellerPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Kalkulasi Komisi */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 space-y-3">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                  <Calculator className="h-4 w-4 text-amber-600" /> Kalkulasi Komisi
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Gross Commission (Rp)</label>
                    <input
                      type="number"
                      value={grossCommission}
                      onChange={(e) => setGrossCommission(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 bg-white p-2.5 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Biaya Tambahan / Potongan (Rp)</label>
                    <input
                      type="number"
                      value={additionalCost}
                      onChange={(e) => setAdditionalCost(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 bg-white p-2.5 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Display Hasil Kalkulasi Net Commission */}
                <div className="flex items-center justify-between border-t border-amber-200/60 pt-3 mt-1">
                  <span className="font-bold text-gray-700">Net Commission (Komisi Bersih):</span>
                  <span className="text-base font-extrabold text-amber-700">
                    {formatRupiah(calculatedNetCommission)}
                  </span>
                </div>
                <p className="text-[10px] text-amber-800/80 italic">
                  * Formula: Gross Commission ({formatRupiah(grossCommission)}) - Additional Cost ({formatRupiah(additionalCost)})
                </p>
              </div>

              {/* Status, Tanggal Pembayaran, Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Status Komisi</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as CommissionStatus)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 bg-white focus:border-amber-500 focus:outline-none font-bold"
                  >
                    <option value="PENDING">PENDING (Menunggu)</option>
                    <option value="VERIFIED">VERIFIED (Diverifikasi)</option>
                    <option value="APPROVED">APPROVED (Disetujui)</option>
                    <option value="PAID">PAID (Sudah Cair)</option>
                    <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Tanggal Pembayaran / Pencairan</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keterangan rincian biaya marketing, referensi transfer, dll..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-amber-500 py-2.5 font-bold text-white hover:bg-amber-600 transition cursor-pointer"
                >
                  Simpan Komisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}