'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProBadge } from '@/components/shared/ProBadge';
import { UpgradeNudge } from '@/components/paywall/UpgradeNudge';
import { PaywallModal } from '@/components/paywall/PaywallModal';
import { createClient } from '@/lib/supabase/client';
import type { Decision, UserProfile } from '@/types';

export function ProfileClient({
  profile,
  decisions,
  storageError,
}: {
  profile: UserProfile;
  decisions: Decision[];
  storageError?: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [showPaywall, setShowPaywall] = useState(false);
  const topCategory = decisions.reduce<Record<string, number>>((acc, decision) => {
    acc[decision.category] = (acc[decision.category] ?? 0) + 1;
    return acc;
  }, {});
  const fastest = decisions.length ? Math.min(...decisions.map((item) => item.seconds_to_decide)) : 0;
  const topCategoryLabel =
    Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None yet';

  async function handleSignOut() {
    if (!window.confirm('Sign out?')) return;
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  async function handleManageSubscription() {
    const response = await fetch('/api/portal', { method: 'POST' });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    toast.error(data.error ?? 'Unable to open billing portal');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent font-display text-3xl text-black">
          {profile.email.slice(0, 2).toUpperCase()}
        </div>
        <div className="space-y-2">
          <div className="text-lg">{profile.email}</div>
          {profile.is_premium ? <ProBadge /> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="font-display text-5xl uppercase">{decisions.length}</div>
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-text-secondary">Total Decisions</div>
        </Card>
        <Card>
          <div className="font-display text-5xl uppercase">{fastest}s</div>
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-text-secondary">Fastest</div>
        </Card>
        <Card>
          <div className="font-display text-5xl uppercase">{topCategoryLabel}</div>
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-text-secondary">Top Category</div>
        </Card>
        <Card>
          <div className="font-display text-5xl uppercase">{profile.is_premium ? 'Pro' : 'Free'}</div>
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-text-secondary">Plan</div>
        </Card>
      </div>

      {storageError ? (
        <Card className="border-danger/30 bg-danger/10">
          <p className="text-sm text-text-primary">{storageError}</p>
        </Card>
      ) : null}

      <section className="space-y-4">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-text-secondary">Learned About You</div>
        <Card>
          {profile.preference_profile ? (
            <p className="text-sm text-text-secondary">{profile.preference_profile}</p>
          ) : (
            <div className="space-y-3">
              <div className="h-2 rounded-full bg-elevated">
                <div className="h-full rounded-full bg-accent" style={{ width: '40%' }} />
              </div>
              <p className="text-sm text-text-secondary">Give feedback on 5 decisions and Decided will learn your style.</p>
            </div>
          )}
        </Card>
      </section>

      <section className="space-y-4">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-text-secondary">Subscription</div>
        {profile.is_premium ? (
          <Card className="space-y-4">
            <div className="text-sm text-text-secondary">
              Premium active{profile.premium_expires_at ? ` until ${new Date(profile.premium_expires_at).toLocaleDateString()}` : ''}
            </div>
            <Button onClick={() => void handleManageSubscription()} type="button">
              Manage subscription
            </Button>
          </Card>
        ) : (
          <UpgradeNudge onUpgrade={() => setShowPaywall(true)} />
        )}
      </section>

      <Button variant="danger" onClick={() => void handleSignOut()} type="button">
        Sign out
      </Button>
      <PaywallModal open={showPaywall} trigger="manual_upgrade" onClose={() => setShowPaywall(false)} />
    </div>
  );
}
