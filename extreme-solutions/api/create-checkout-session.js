import crypto from "node:crypto";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const siteUrl = (process.env.SITE_URL || "https://extreme-solutions-eosin.vercel.app").replace(/\/$/, "");

  if (!secretKey || !priceId) {
    return response.status(500).json({ error: "Stripe is not configured" });
  }

  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("line_items[0][price]", priceId);
  form.set("line_items[0][quantity]", "1");
  form.set("success_url", siteUrl + "/?payment=success&session_id={CHECKOUT_SESSION_ID}");
  form.set("cancel_url", siteUrl + "/?payment=cancelled");
  form.set("billing_address_collection", "auto");
  form.set("customer_creation", "always");

  try {
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + secretKey,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": crypto.randomUUID()
      },
      body: form.toString()
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error("Stripe Checkout error", {
        type: session?.error?.type,
        code: session?.error?.code,
        message: session?.error?.message
      });
      return response.status(502).json({ error: "Could not create Checkout Session" });
    }

    return response.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Checkout endpoint error", error);
    return response.status(500).json({ error: "Unexpected checkout error" });
  }
}
