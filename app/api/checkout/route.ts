import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripeClient } from '@/lib/stripe/client';
import { getAppUrl, getStripePriceId, type BillingPlan } from '@/lib/stripe/config';
import { getCurrentProfile } from '@/lib/utils/session';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const stripe = getStripeClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { plan } = (await request.json()) as { plan?: BillingPlan };

  if (plan !== 'weekly' && plan !== 'monthly' && plan !== 'yearly') {
    return NextResponse.json({ error: 'Invalid billing plan' }, { status: 400 });
  }

  const profile = await getCurrentProfile();
  const priceId = getStripePriceId(plan);
  const appUrl = getAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    ...(profile?.stripe_customer_id
      ? { customer: profile.stripe_customer_id }
      : { customer_email: user.email }),
    client_reference_id: user.id,
    metadata: {
      supabase_user_id: user.id,
      plan,
    },
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/decide`,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
      trial_period_days: plan === 'yearly' ? 7 : undefined,
    },
  });

  return NextResponse.json({ url: session.url });
}
