# Extreme Solutions — Stripe Payments

Recovered from the current Vercel deployment and prepared for Stripe Checkout.

## Stripe test resources

- Product: `prod_VLNTp3A6PA7OzS`
- Price: `price_1UKgiz2QeuoQnxxjYnUpiiVh`
- Currency: MXN
- Price model: customer-entered amount, minimum MXN 10.00
- Payment Link for isolated testing: https://buy.stripe.com/test_00wcMY3ob9v5asX7ksasg00
- Stripe account mode: TEST

## Required Vercel environment variables

Set these in the Vercel project. Never commit their values.

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_1UKgiz2QeuoQnxxjYnUpiiVh
STRIPE_WEBHOOK_SECRET=whsec_...
SITE_URL=https://extreme-solutions-eosin.vercel.app
```

The hosted Checkout flow does not need a publishable key because card details are collected on Stripe's hosted page.

## Webhook

After this code is deployed, create a Stripe test webhook endpoint:

```
https://extreme-solutions-eosin.vercel.app/api/stripe-webhook
```

Listen only for:
- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`

Copy the endpoint's `whsec_...` value into `STRIPE_WEBHOOK_SECRET` in Vercel.

## Production

Do not switch to live mode until the test flow is verified end-to-end. Create live products/prices or map the live Price ID, replace the Vercel secret with `sk_live_...`, create a live webhook endpoint, and use its separate live signing secret.
