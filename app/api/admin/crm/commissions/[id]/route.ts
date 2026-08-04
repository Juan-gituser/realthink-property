import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const gross = Number(body.gross_commission) || 0;
    const cost = Number(body.additional_cost) || 0;
    const net = gross - cost;

    const updated = {
      ...body,
      id,
      gross_commission: gross,
      additional_cost: cost,
      net_commission: net,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal memperbarui komisi" }, { status: 500 });
  }
}