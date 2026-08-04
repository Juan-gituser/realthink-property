import { NextResponse } from "next/server";
import { NegotiationItem } from "@/types/crm";

// Dummy database in-memory (atau sesuaikan dengan database/Prisma/Supabase Anda)
const negotiationsDb: NegotiationItem[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get("lead_id");
  const propertyId = searchParams.get("property_id");

  let result = negotiationsDb;

  if (leadId) {
    result = result.filter((item) => item.lead_id === leadId);
  }
  if (propertyId) {
    result = result.filter((item) => item.property_id === propertyId);
  }

  return NextResponse.json({ success: true, data: result });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lead_id, property_id, listing_price, buyer_offer, counter_offer, notes } = body;

    if (!lead_id || !property_id || !listing_price || !buyer_offer) {
      return NextResponse.json(
        { success: false, message: "Lead, Property, Listing Price, dan Buyer Offer wajib diisi" },
        { status: 400 }
      );
    }

    const newNegotiation: NegotiationItem = {
      id: `neg-${Date.now()}`,
      lead_id,
      property_id,
      listing_price: Number(listing_price),
      buyer_offer: Number(buyer_offer),
      counter_offer: counter_offer ? Number(counter_offer) : null,
      notes: notes || "",
      status: "ONGOING",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    negotiationsDb.unshift(newNegotiation);

    // Otomatis buat Activity log
    await fetch(`${new URL(request.url).origin}/api/admin/crm/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_id,
        property_id,
        type: "NEGOTIATION",
        description: `Memulai negosiasi. Penawaran buyer: Rp ${Number(buyer_offer).toLocaleString("id-ID")}`,
      }),
    }).catch(() => {}); // fallback ignore jika mock

    return NextResponse.json({ success: true, data: newNegotiation });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal membuat negosiasi" }, { status: 500 });
  }
}