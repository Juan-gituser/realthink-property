import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase();

  try {
    const { activity_type, description, property_id } = await req.json();

    if (!activity_type || !description) {
      return NextResponse.json(
        { success: false, error: "Activity type dan deskripsi wajib diisi" },
        { status: 400 }
      );
    }

    const { data: newActivity, error } = await supabase
      .from("activities")
      .insert({
        lead_id: id,
        activity_type,
        description,
        property_id: property_id || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Auto-update last_contact_at on lead if activity is contact-related
    if (["CALL", "WHATSAPP", "EMAIL", "MEETING"].includes(activity_type)) {
      await supabase
        .from("leads")
        .update({ last_contact_at: new Date().toISOString() })
        .eq("id", id);
    }

    return NextResponse.json({ success: true, data: newActivity });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record activity";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}