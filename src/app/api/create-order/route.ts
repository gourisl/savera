import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials are missing in server environment." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount, receipt } = body;

    // Amount should be in paise (e.g. 5000 = ₹50.00). Minimum amount is 100 paise (₹1)
    const amountInPaise = typeof amount === "number" ? Math.round(amount) : parseInt(amount, 10);

    if (!amountInPaise || isNaN(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { error: "Invalid order amount. Minimum amount is 100 paise (₹1)." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: receipt || `rcpt_${Date.now().toString().slice(-8)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create Razorpay order." },
      { status: 500 }
    );
  }
}
