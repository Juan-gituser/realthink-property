import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { buyer_offer, counter_offer, notes, status } = body;

    // Logika update (sesuaikan dengan database Anda)
    const formattedCounter = counter_offer ? Number(counter_offer) : null;
    const formattedBuyer = buyer_offer ? Number(buyer_offer) : undefined;

    // Simulasi update response
    const updatedNegotiation = {
      id,
      buyer_offer: formattedBuyer,
      counter_offer: formattedCounter,
      notes,
      status,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: updatedNegotiation });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal mengupdate negosiasi" }, { status: 500 });
  }
}