import { NextResponse } from "next/server";
import { Commission } from "@/types/crm";

// Dummy storage in-memory (integrasikan dengan database Prisma/Supabase/SQL Anda)
const commissionsDb: Commission[] = [
  {
    id: "com-1",
    commission_id: "COM-2026-001",
    property_id: "PROP-101",
    listing_id: "LST-882",
    lead_id: "LEAD-001",
    agent_id: "AGT-01",
    agent_name: "Budi Santoso",
    transaction_price: 2400000000,
    net_seller_price: 2320000000,
    gross_commission: 80000000,
    additional_cost: 5000000,
    net_commission: 75000000,
    status: "APPROVED",
    payment_date: "2026-08-15",
    notes: "Komisi bersih dipotong biaya marketing khusus",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    property_title: "Rumah Mewah Cluster Emerald",
    property_price: 2450000000,
    lead_name: "Ahmad Dahlan",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  let filtered = [...commissionsDb];

  if (status && status !== "ALL") {
    filtered = filtered.filter((c) => c.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.commission_id.toLowerCase().includes(q) ||
        (c.lead_name && c.lead_name.toLowerCase().includes(q)) ||
        (c.property_title && c.property_title.toLowerCase().includes(q)) ||
        (c.agent_name && c.agent_name.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      property_id,
      listing_id,
      lead_id,
      agent_id,
      agent_name,
      transaction_price,
      net_seller_price,
      gross_commission,
      additional_cost,
      status,
      payment_date,
      notes,
      property_title,
      property_price,
      lead_name,
    } = body;

    if (!property_id || !lead_id || !transaction_price) {
      return NextResponse.json(
        { success: false, message: "Property, Lead, dan Harga Transaksi wajib diisi." },
        { status: 400 }
      );
    }

    const gross = Number(gross_commission) || 0;
    const cost = Number(additional_cost) || 0;
    const net = gross - cost;

    const autoCode = `COM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newCommission: Commission = {
      id: `com-${Date.now()}`,
      commission_id: autoCode,
      property_id,
      listing_id: listing_id || "-",
      lead_id,
      agent_id: agent_id || "-",
      agent_name: agent_name || "Agent Utama",
      transaction_price: Number(transaction_price),
      net_seller_price: Number(net_seller_price) || 0,
      gross_commission: gross,
      additional_cost: cost,
      net_commission: net,
      status: status || "PENDING",
      payment_date: payment_date || null,
      notes: notes || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      property_title: property_title || "Properti",
      property_price: Number(property_price) || Number(transaction_price),
      lead_name: lead_name || "Lead",
    };

    commissionsDb.unshift(newCommission);

    return NextResponse.json({ success: true, data: newCommission });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal membuat data komisi" }, { status: 500 });
  }
}