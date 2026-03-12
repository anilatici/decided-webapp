export type BillingPlan = 'weekly' | 'monthly' | 'yearly';

const planToPriceEnv: Record<BillingPlan, string | undefined> = {
  weekly: process.env.STRIPE_PRICE_WEEKLY,
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  yearly: process.env.STRIPE_PRICE_YEARLY,
};

export function getStripePriceId(plan: BillingPlan) {
  const priceId = planToPriceEnv[plan];

  if (!priceId) {
    throw new Error(`Missing Stripe price configuration for ${plan}`);
  }

  return priceId;
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}
