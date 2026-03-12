'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

type PremiumStatus = {
  is_premium: boolean;
  premium_expires_at: string | null;
  stripe_customer_id: string | null;
};

export function SuccessStatusClient() {
  const router = useRouter();
  const [status, setStatus] = useState<PremiumStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function pollStatus() {
      for (let attempt = 0; attempt < 10; attempt += 1) {
        try {
          const response = await fetch('/api/profile/status', { cache: 'no-store' });
          const data = (await response.json()) as PremiumStatus & { error?: string };

          if (!response.ok) {
            throw new Error(data.error ?? 'Unable to load billing status');
          }

          if (cancelled) {
            return;
          }

          setStatus(data);

          if (data.is_premium) {
            router.replace('/decide');
            router.refresh();
            return;
          }
        } catch (fetchError) {
          if (cancelled) {
            return;
          }

          setError(fetchError instanceof Error ? fetchError.message : 'Unable to load billing status');
          return;
        }

        await new Promise((resolve) => window.setTimeout(resolve, 1500));
      }
    }

    void pollStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="text-sm text-danger">{error}</p>;
  }

  if (!status?.is_premium) {
    return <p className="text-sm text-text-secondary">Waiting for billing and account updates to finish syncing your plan...</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">
        Premium is active
        {status.premium_expires_at ? ` until ${new Date(status.premium_expires_at).toLocaleDateString()}` : ''}.
        Redirecting you now...
      </p>
      <Link href="/decide" prefetch={false}>
        <Button type="button">Continue to Decide</Button>
      </Link>
    </div>
  );
}
