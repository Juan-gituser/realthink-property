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
        getAll() {
          return cookieStore.getAll();
        },
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

// GET: Lead Detail + Attached Properties + Activities + Surveys + Commissions
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase();

  try {
    const { data: lead, error: leadErr } = await supabase
      .from("leads")
      .select(`
        *,
        lead_properties (
          id,
          interest_status,
          notes,
          property_id,
          properties (
            id,
            title,
            price
          )
        )
      `)
      .eq("id", id)
      .single();

    if (leadErr || !lead) {
      return NextResponse.json(
        { success: false, error: "Lead tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fetch activities
    const { data: activities } = await supabase
      .from("activities")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false });

    // Fetch surveys summary
    const { data: surveys } = await supabase
      .from("surveys")
      .select("*")
      .eq("lead_id", id)
      .order("survey_date", { ascending: false });

    // Fetch commissions summary
    const { data: commissions } = await supabase
      .from("commissions")
      .select("*")
      .eq("lead_id", id);

    return NextResponse.json({
      success: true,
      data: {
        ...lead,
        activities: activities || [],
        surveys: surveys || [],
        commissions: commissions || [],
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching lead detail";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH: Update Lead Status / PIC / Follow up & Log Activity
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase();

  try {
    const body = await req.json();
    const { status, assigned_to, notes, next_follow_up_at, last_contact_at, budget_min, budget_max } = body;

    // Fetch existing state to check for activity logs
    const { data: currentLead } = await supabase
      .from("leads")
      .select("status, assigned_to")
      .eq("id", id)
      .single();

    const updates: Record<string, unknown> = {};
    if (status !== undefined) updates.status = status;
    if (assigned_to !== undefined) updates.assigned_to = assigned_to;
    if (notes !== undefined) updates.notes = notes;
    if (next_follow_up_at !== undefined) updates.next_follow_up_at = next_follow_up_at;
    if (last_contact_at !== undefined) updates.last_contact_at = last_contact_at;
    if (budget_min !== undefined) updates.budget_min = budget_min;
    if (budget_max !== undefined) updates.budget_max = budget_max;

    const { data: updatedLead, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Log Activity if status changed
    if (status && currentLead && currentLead.status !== status) {
      await supabase.from("activities").insert({
        lead_id: id,
        activity_type: "STATUS_CHANGE",
        description: `Status diubah dari ${currentLead.status} menjadi ${status}.`,
      });
    }

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}