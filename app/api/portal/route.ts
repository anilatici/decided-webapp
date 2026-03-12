import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripeClient } from '@/lib/stripe/client';
import { getAppUrl } from '@/lib/stripe/config';
import { getCurrentProfile } from '@/lib/utils/session';

export async function POST() {
  const supabase = createClient();
  const stripe = getStripeClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await getCurrentProfile();
  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'No Stripe customer found' }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${getAppUrl()}/profile`,
  });

  return NextResponse.json({ url: session.url });
}
