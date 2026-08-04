import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function PATCH(
  req: Request,
  context: { params: Promise<Record<string, string | string[] | undefined>> }
) {
  const { params } = context;
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const body = await req.json();
    const { status, date, time, notes, pic } = body;

    const { data, error } = await supabase
      .from("follow_ups")
      .update({
        ...(status && { status }),
        ...(date && { date }),
        ...(time && { time }),
        ...(notes !== undefined && { notes }),
        ...(pic !== undefined && { pic }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Log ke Activity jika status berubah ke COMPLETED
    if (status === "COMPLETED") {
      await supabase.from("activities").insert({
        lead_id: data.lead_id,
        type: "NOTE",
        description: `Follow Up selesai diselesaikan. Catatan: ${data.notes || "-"}`,
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Gagal memperbarui follow up" },
      { status: 500 }
    );
  }
}