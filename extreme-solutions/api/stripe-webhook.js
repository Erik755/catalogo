import crypto from "node:crypto";

async function readRawBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function verifyStripeSignature(rawBody, signatureHeader, secret, toleranceSeconds = 300) {
  if (!signatureHeader || !secret) return false;

  let timestamp = null;
  const signatures = [];

  for (const item of signatureHeader.split(",")) {
    const [key, value] = item.trim().split("=", 2);
    if (key === "t") timestamp = value;
    if (key === "v1") signatures.push(value);
  }

  if (!timestamp || signatures.length === 0) return false;

  const payload = timestamp + "." + rawBody.toString("utf8");
  const expectedHex = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const expected = Buffer.from(expectedHex, "hex");

  const validSignature = signatures.some((signature) => {
    try {
      const actual = Buffer.from(signature, "hex");
      return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
    } catch {
      return false;
    }
  });

  if (!validSignature) return false;

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  return Number.isFinite(age) && age <= toleranceSeconds;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).end();
  }

  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signingSecret) return response.status(500).json({ error: "Webhook secret missing" });

  const rawBody = await readRawBody(request);
  const stripeSignature = request.headers["stripe-signature"];

  if (!verifyStripeSignature(rawBody, stripeSignature, signingSecret)) {
    return response.status(400).json({ error: "Invalid Stripe signature" });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return response.status(400).json({ error: "Invalid JSON" });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data?.object;
      console.info("Stripe payment confirmed", {
        eventId: event.id,
        sessionId: session?.id,
        paymentStatus: session?.payment_status,
        amountTotal: session?.amount_total,
        currency: session?.currency,
        customerEmail: session?.customer_details?.email || null
      });
      // Add persistent fulfillment here when Extreme Solutions has a database/CRM.
      break;
    }
    case "checkout.session.async_payment_failed":
      console.warn("Stripe asynchronous payment failed", { eventId: event.id });
      break;
    default:
      break;
  }

  return response.status(200).json({ received: true });
}

export const config = {
  api: {
    bodyParser: false
  }
};
