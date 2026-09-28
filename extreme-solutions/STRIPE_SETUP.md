# Extreme Solutions — Stripe Payments

This folder is a recovered copy of the current Vercel deployment, prepared for hosted Stripe Checkout.

## Current Stripe test setup

- Stripe account: Entorno de prueba de Extreme solutions
- Currency: MXN
- Checkout amount: entered by the customer and validated server-side
- Allowed amount: MXN 10.00 to MXN 500,000.00
- Test Payment Link (isolated Stripe test): https://buy.stripe.com/test_00wcMY3ob9v5asX7ksasg00
- Stripe mode: TEST

A test Product and custom Price also exist in Stripe:
- Product: `prod_VLNTp3A6PA7OzS`
- Price: `price_1UKgiz2QeuoQnxxjYnUpiiVh`

The web integration does not depend on that Price. It creates an ad-hoc one-time price using the amount entered on the site.

## Required Vercel environment variables

Never commit their values.

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SITE_URL=https://extreme-solutions-eosin.vercel.app
```

A publishable key is not needed for this hosted Checkout flow because payment details are entered on Stripe's hosted page.

## Webhook

After this folder is deployed as the Extreme Solutions Vercel project, create a TEST webhook endpoint:

```
https://extreme-solutions-eosin.vercel.app/api/stripe-webhook
```

Subscribe only to:
- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`

Then store that endpoint's `whsec_...` value in Vercel as `STRIPE_WEBHOOK_SECRET`.

## Security

- The secret API key remains server-side.
- The amount is validated again by the server; the browser value is never trusted blindly.
- Card data goes directly to Stripe Checkout.
- The webhook verifies the raw request body using Stripe's HMAC-SHA256 signature and a 5-minute timestamp tolerance.
- The success redirect is not treated as proof of payment; fulfillment should rely on a verified webhook.

## Production cutover

Keep this in test mode until Checkout and webhook delivery are verified end-to-end. For production:
1. Set a live `STRIPE_SECRET_KEY` in Vercel.
2. Create a live webhook endpoint and use its separate live `whsec_...`.
3. Run a low-value real transaction and verify the webhook before announcing payments publicly.
