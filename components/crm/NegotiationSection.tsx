"use client";

import { useState, useEffect, useCallback } from "react";
import { Handshake, Plus, Edit2, CheckCircle2, XCircle, Clock, type LucideIcon } from "lucide-react";
import { NegotiationItem, NegotiationStatus } from "@/types/crm";

interface NegotiationSectionProps {
  leadId?: string;
  propertyId?: string;
  onActivityAdded?: () => void; // Trigger refresh activity timeline jika ada
}

const formatRupiah = (val?: number | null) => {
  if (val === undefined || val === null || isNaN(val)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
};

const STATUS_BADGES: Record<NegotiationStatus, { label: string; bg: string; icon: LucideIcon }> = {
  ONGOING: { label: "Negosiasi Berjalan", bg: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  ACCEPTED: { label: "Disetujui (Accepted)", bg: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2 },
  REJECTED: { label: "Ditolak (Rejected)", bg: "bg-rose-100 text-rose-800 border-rose-200", icon: XCircle },
};

export default function NegotiationSection({ leadId, propertyId, onActivityAdded }: NegotiationSectionProps) {
  const [items, setItems] = useState<NegotiationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NegotiationItem | null>(null);

  // Form State
  const [listingPrice, setListingPrice] = useState("2450000000");
  const [buyerOffer, setBuyerOffer] = useState("2200000000");
  const [counterOffer, setCounterOffer] = useState("2350000000");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<NegotiationStatus>("ONGOING");

  const fetchNegotiations = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (leadId) query.append("lead_id", leadId);
      if (propertyId) query.append("property_id", propertyId);

      const res = await fetch(`/api/admin/crm/negotiations?${query.toString()}`);
      const json = await res.json();
      if (json.success) setItems(json.data || []);
    } catch (err) {
      console.error("Failed to load negotiations", err);
    } finally {
      setLoading(false);
    }
  }, [leadId, propertyId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchNegotiations();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchNegotiations]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setListingPrice("2450000000");
    setBuyerOffer("2200000000");
    setCounterOffer("2350000000");
    setNotes("");
    setStatus("ONGOING");
    setShowModal(true);
  };

  const handleOpenEdit = (item: NegotiationItem) => {
    setEditingItem(item);
    setListingPrice(item.listing_price.toString());
    setBuyerOffer(item.buyer_offer.toString());
    setCounterOffer(item.counter_offer?.toString() || "");
    setNotes(item.notes || "");
    setStatus(item.status);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Edit Mode
        const res = await fetch(`/api/admin/crm/negotiations/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            buyer_offer: Number(buyerOffer),
            counter_offer: counterOffer ? Number(counterOffer) : null,
            notes,
            status,
          }),
        });
        if ((await res.json()).success) {
          setShowModal(false);
          fetchNegotiations();
          if (onActivityAdded) onActivityAdded();
        }
      } else {
        // Create Mode
        const res = await fetch("/api/admin/crm/negotiations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lead_id: leadId || "lead-default",
            property_id: propertyId || "prop-default",
            listing_price: Number(listingPrice),
            buyer_offer: Number(buyerOffer),
            counter_offer: counterOffer ? Number(counterOffer) : null,
            notes,
          }),
        });
        if ((await res.json()).success) {
          setShowModal(false);
          fetchNegotiations();
          if (onActivityAdded) onActivityAdded();
        }
      }
    } catch (err) {
      alert("Gagal menyimpan data negosiasi");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2 uppercase tracking-wider">
          <Handshake className="h-4 w-4 text-amber-600" />
          Catatan Negosiasi Harga
        </h3>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Negosiasi Baru
        </button>
      </div>

      {/* List Negosiasi */}
      {loading ? (
        <p className="text-xs text-gray-400 italic">Memuat data negosiasi...</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-gray-400 italic">Belum ada riwayat negosiasi untuk dicatat.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const badge = STATUS_BADGES[item.status] || STATUS_BADGES.ONGOING;
            const Icon = badge.icon;

            return (
              <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                    <Icon className="h-3 w-3" />
                    {badge.label}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 text-gray-400 hover:text-gray-700 transition"
                    title="Edit Negosiasi"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Grid Harga */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-gray-100 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Listing Price</span>
                    <span className="font-semibold text-gray-800">{formatRupiah(item.listing_price)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Buyer Offer</span>
                    <span className="font-bold text-blue-600">{formatRupiah(item.buyer_offer)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Counter Offer</span>
                    <span className="font-bold text-amber-600">{formatRupiah(item.counter_offer)}</span>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-[11px] text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
                    <span className="font-semibold">Catatan:</span> {item.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form Create / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h4 className="font-bold text-gray-900 text-sm">
              {editingItem ? "Update Negosiasi" : "Buat Catatan Negosiasi"}
            </h4>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Listing Price (Rp)</label>
                <input
                  type="number"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  disabled={!!editingItem} // Listing price diset dari properti awal
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Buyer Offer (Rp)</label>
                <input
                  type="number"
                  value={buyerOffer}
                  onChange={(e) => setBuyerOffer(e.target.value)}
                  placeholder="Penawaran dari pembeli..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Counter Offer / Balasan Penjual (Rp)</label>
                <input
                  type="number"
                  value={counterOffer}
                  onChange={(e) => setCounterOffer(e.target.value)}
                  placeholder="Harga counter dari penjual/pemilik..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {editingItem && (
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Status Negosiasi</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as NegotiationStatus)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 bg-white focus:border-amber-500 focus:outline-none font-medium"
                  >
                    <option value="ONGOING">ONGOING (Dalam Proses)</option>
                    <option value="ACCEPTED">ACCEPTED (Disetujui)</option>
                    <option value="REJECTED">REJECTED (Ditolak)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Catatan Negosiasi</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Syarat pembayaran, KPR, kesepakatan bonus perabot, dll..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-amber-500 py-2.5 font-bold text-white hover:bg-amber-600 transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}