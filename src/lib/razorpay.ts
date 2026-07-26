// Razorpay helper utility

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayOrderOptions {
  amount: number; // In paise (INR * 100)
  orderId?: string;
  name: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (response: { razorpay_payment_id: string; razorpay_order_id?: string; razorpay_signature?: string }) => void;
  onFailure?: (error: any) => void;
}

export async function openRazorpayCheckout(options: RazorpayOrderOptions) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Razorpay SDK failed to load. Please check your internet connection.");
    return;
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder";

  const razorpayOptions = {
    key: keyId,
    amount: options.amount * 100,
    currency: "INR",
    name: options.name || "SAVERA Luxury Jewellery",
    description: options.description || "Order Payment",
    image: "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=200&auto=format&fit=crop",
    handler: function (response: any) {
      options.onSuccess(response);
    },
    prefill: {
      name: options.customerName,
      email: options.customerEmail,
      contact: options.customerPhone,
    },
    theme: {
      color: "#C5A059", // Champagne Gold
    },
  };

  const paymentObject = new (window as any).Razorpay(razorpayOptions);
  paymentObject.on("payment.failed", function (response: any) {
    if (options.onFailure) {
      options.onFailure(response.error);
    } else {
      alert("Payment failed: " + response.error.description);
    }
  });

  paymentObject.open();
}
