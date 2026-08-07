import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  propertyInquirySchema,
  consultationSchema,
  titipPropertySchema,
  sanitizeWhatsApp,
} from "@/lib/validations/public-lead";

// Supabase client khusus server side tanpa mengekspos service key ke client
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const type = body.type || "INQUIRY"; // "INQUIRY" | "CONSULTATION"
    const supabase = getAdminClient();

    let name = "";
    let rawWhatsapp = "";
    let email = "";
    let message = "";
    let propertyId = null;
    let propertyTitle = "";
    let listingId = "";
    let notesFormatted = "";
    let source = "Website";

    if (type === "INQUIRY") {
      const parsed = propertyInquirySchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.issues[0].message },
          { status: 400 }
        );
      }
      name = parsed.data.name;
      rawWhatsapp = parsed.data.whatsapp;
      email = parsed.data.email || "";
      message = parsed.data.message || "";
      propertyId = parsed.data.property_id;
      propertyTitle = parsed.data.property_title || "";
      listingId = parsed.data.listing_id || "";
      notesFormatted = `Tanya Properti: ${propertyTitle} (Listing: ${listingId}). Pesan: ${message}`;
    } else if (type === "TITIP_PROPERTY") {
      const parsed = titipPropertySchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.issues[0].message },
          { status: 400 }
        );
      }
      name = parsed.data.name;
      rawWhatsapp = parsed.data.whatsapp;
      email = parsed.data.email || "";
      message = parsed.data.message || "";
      propertyTitle = parsed.data.title || "";
      source = parsed.data.source || "Titip Properti";
      const details = [
        `Judul: ${parsed.data.title || "-"}`,
        `Kategori: ${parsed.data.transaction_type || "-"}`,
        `Tipe: ${parsed.data.property_type || "-"}`,
        `Harga: ${parsed.data.price || "-"}`,
        `Lokasi: ${parsed.data.location || "-"}`,
        `Kamar Tidur: ${parsed.data.bedrooms || "-"}`,
        `Kamar Mandi: ${parsed.data.bathrooms || "-"}`,
        `Luas Tanah: ${parsed.data.land_area || "-"}`,
        `Luas Bangunan: ${parsed.data.building_area || "-"}`,
        `Deskripsi: ${parsed.data.description || "-"}`,
        `Pemilik/Agen: ${parsed.data.owner_name || "-"}`,
      ];
      notesFormatted = `Titip Properti\n${details.join("\n")}\nPesan: ${message}`;
    } else {
      const parsed = consultationSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.issues[0].message },
          { status: 400 }
        );
      }
      name = parsed.data.name;
      rawWhatsapp = parsed.data.whatsapp;
      email = parsed.data.email || "";
      message = parsed.data.message || "";
      notesFormatted = `Konsultasi: ${parsed.data.intent}. Budget: ${parsed.data.budget || "-"}. Area: ${parsed.data.area || "-"}. Pesan: ${message}`;
    }

    const cleanWa = sanitizeWhatsApp(rawWhatsapp);

    // 1. Cek apakah Lead sudah ada berdasarkan WhatsApp
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("whatsapp", cleanWa)
      .maybeSingle();

    let leadId = existingLead?.id;

    if (!leadId) {
      // Create Lead Baru
      const { data: newLead, error: createLeadErr } = await supabase
        .from("leads")
        .insert({
          name,
          whatsapp: cleanWa,
          email: email || null,
          source,
          status: "NEW",
          property_title: propertyTitle || null,
          notes: notesFormatted,
        })
        .select("id")
        .single();

      if (createLeadErr) throw createLeadErr;
      leadId = newLead.id;
    } else {
      // Update info lead existing jika diperlukan
      await supabase
        .from("leads")
        .update({
          property_title: propertyTitle || undefined,
          notes: notesFormatted,
        })
        .eq("id", leadId);
    }

    // 2. Hubungkan Lead dengan Activity Log
    await supabase.from("activities").insert({
      lead_id: leadId,
      property_id: propertyId,
      type: "NOTE",
      description: `[Public Website Input] ${notesFormatted}`,
    });

    return NextResponse.json({
      success: true,
      message:
        "Permintaan Anda berhasil dikirim. Tim Realthink Property akan segera menghubungi Anda.",
    });
  } catch (err: unknown) {
    console.error("[PUBLIC_LEAD_SUBMIT_ERROR]", err);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memproses permintaan Anda. Silakan coba beberapa saat lagi.",
      },
      { status: 500 }
    );
  }
}