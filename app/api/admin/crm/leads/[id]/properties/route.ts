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

// Attach a property to lead
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase();

  try {
    const { property_id, interest_status = "INTERESTED", notes } = await req.json();

    if (!property_id) {
      return NextResponse.json({ success: false, error: "Property ID required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("lead_properties")
      .upsert(
        { lead_id: id, property_id, interest_status, notes },
        { onConflict: "lead_id,property_id" }
      )
      .select()
      .single();

    if (error) throw error;

    // Log Activity
    await supabase.from("activities").insert({
      lead_id: id,
      property_id,
      activity_type: "NOTE",
      description: `Properti ditambahkan ke daftar minat lead.`,
    });

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Attach failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}