import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const planId = url.searchParams.get("plan");
  const billingCycle = url.searchParams.get("cycle") || "monthly";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/pricing", request.url));
  }

  // 1. Ambil detail harga paket dari database
  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("id", planId)
    .single();

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const amount = billingCycle === "annually" ? plan.price_annually : plan.price_monthly;
  const orderId = `SUBS-${user.id.slice(0, 6)}-${Date.now()}`;

  // 2. Simpan transaksi awal dengan status 'pending'
  await supabase.from("payment_transactions").insert({
    user_id: user.id,
    plan_id: planId,
    gateway: "midtrans", // Atau 'xendit'
    order_id: orderId,
    amount: amount,
    status: "pending",
  });

  /* 
    =================================================================
    INTEGRASI MIDTRANS / XENDIT (CONTOH MIDTRANS SNAP):
    -----------------------------------------------------------------
    import midtransClient from 'midtrans-client';
    
    let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    });

    let parameter = {
        transaction_details: { order_id: orderId, gross_amount: amount },
        customer_details: { email: user.email }
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.redirect(transaction.redirect_url);
    =================================================================
  */

  // Untuk keperluan struktur, arahkan sementara ke halaman simulasi pembayaran sukses
  return NextResponse.redirect(new URL(`/dashboard/member?success=pending&order=${orderId}`, request.url));
}