import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getStripeClient } from '@/lib/stripe/client';

function getSubscriptionCustomerId(subscription: Stripe.Subscription) {
  return typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id ?? null;
}

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const periodEnds = subscription.items.data
    .map((item) => (item as Stripe.SubscriptionItem & { current_period_end?: number }).current_period_end)
    .filter((value): value is number => typeof value === 'number');

  if (periodEnds.length === 0) {
    return null;
  }

  return Math.max(...periodEnds);
}

async function syncPremiumStatusForSubscription({
  stripe,
  supabase,
  subscriptionId,
  fallbackUserId,
}: {
  stripe: Stripe;
  supabase: any;
  subscriptionId: string;
  fallbackUserId?: string | null;
}) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata.supabase_user_id || fallbackUserId;
  const isActive = subscription.status === 'active' || subscription.status === 'trialing';
  const stripeCustomerId = getSubscriptionCustomerId(subscription);
  const periodEnd = getSubscriptionPeriodEnd(subscription);

  if (!userId) {
    return;
  }

  const update = {
    is_premium: isActive,
    stripe_customer_id: stripeCustomerId,
    premium_expires_at:
      isActive && periodEnd ? new Date(periodEnd * 1000).toISOString() : new Date().toISOString(),
  };

  const { error } = await supabase
    .from('profiles')
    .update(update)
    .eq('id', userId);

  if (error) {
    console.error('Failed to sync Stripe subscription to profile', {
      userId,
      subscriptionId,
      error,
      update,
    });
  }
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId =
        session.metadata?.supabase_user_id ??
        (typeof session.client_reference_id === 'string' ? session.client_reference_id : null);

      if (userId && typeof session.customer === 'string') {
        const { error } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: session.customer,
          })
          .eq('id', userId);

        if (error) {
          console.error('Failed to persist Stripe customer from checkout session', {
            userId,
            customer: session.customer,
            error,
          });
        }
      }

      if (typeof session.subscription === 'string') {
        await syncPremiumStatusForSubscription({
          stripe,
          supabase,
          subscriptionId: session.subscription,
          fallbackUserId: userId,
        });
      }

      console.log('Processed checkout.session.completed', {
        userId,
        customer: session.customer,
        subscription: session.subscription,
      });

      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.supabase_user_id || null;

      await syncPremiumStatusForSubscription({
        stripe,
        supabase,
        subscriptionId: subscription.id,
        fallbackUserId: userId,
      });

      console.log(`Processed ${event.type}`, {
        userId,
        customer: getSubscriptionCustomerId(subscription),
        subscriptionId: subscription.id,
      });

      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;

      if (typeof invoice.subscription === 'string') {
        await syncPremiumStatusForSubscription({
          stripe,
          supabase,
          subscriptionId: invoice.subscription,
        });
      }

      console.log('Processed invoice.paid', {
        customer: invoice.customer,
        subscription: invoice.subscription,
      });

      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn('Stripe invoice payment failed', {
        customer: invoice.customer,
        subscription: invoice.subscription,
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
