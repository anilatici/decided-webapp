import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { SuccessStatusClient } from '@/components/paywall/SuccessStatusClient';
import { getStripeClient } from '@/lib/stripe/client';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams?: { session_id?: string };
}) {
  let email: string | null = null;

  if (searchParams?.session_id) {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(searchParams.session_id);
    email = session.customer_details?.email ?? session.customer_email ?? null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-lg space-y-4 text-center">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Success</div>
        <h1 className="font-display text-6xl uppercase leading-none">You’re Pro.</h1>
        <p className="text-sm text-text-secondary">
          Stripe checkout completed{email ? ` for ${email}` : ''}. Your billing status should be available in the app
          as soon as the webhook is processed.
        </p>
        <SuccessStatusClient />
        <Link className="text-sm text-text-secondary underline" href="/decide" prefetch={false}>
          Skip waiting and open Decide
        </Link>
      </Card>
    </main>
  );
}
