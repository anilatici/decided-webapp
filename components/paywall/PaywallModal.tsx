'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const triggerHeadlines = {
  decision_limit: "You've made 5 decisions today.",
  autopilot_limit: "Your day isn't done yet.",
  feedback_gate: 'Decided learns from feedback.',
  history_gate: 'Your full history is waiting.',
  manual_upgrade: 'Unlock everything.',
};

export function PaywallModal({
  open,
  trigger = 'manual_upgrade',
  onClose,
}: {
  open: boolean;
  trigger?: keyof typeof triggerHeadlines;
  onClose: () => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full rounded-t-[24px] border border-border bg-surface p-6"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto max-w-xl space-y-6">
              <div className="space-y-3">
                <div className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Upgrade</div>
                <h2 className="font-display text-5xl uppercase leading-none">{triggerHeadlines[trigger]}</h2>
                <p className="text-sm text-text-secondary">
                  Unlimited decisions, full Autopilot, learned preferences, and complete history.
                </p>
              </div>
              <div className="grid gap-3 text-sm text-text-secondary">
                <div>✓ Unlimited decisions every day</div>
                <div>✓ Full Autopilot Day</div>
                <div>✓ Likes and dislikes teach the AI your style</div>
                <div>✓ Complete decision history and stats</div>
              </div>
              <div className="space-y-3">
                <button
                  className={`w-full rounded-card border p-4 text-left ${
                    selectedPlan === 'weekly' ? 'border-accent bg-accent/5' : 'border-border bg-elevated'
                  }`}
                  onClick={() => setSelectedPlan('weekly')}
                  type="button"
                >
                  <div className="font-medium text-text-primary">$2.99 AUD / week</div>
                </button>
                <button
                  className={`w-full rounded-card border p-4 text-left ${
                    selectedPlan === 'yearly' ? 'border-accent bg-accent/5' : 'border-border bg-elevated'
                  }`}
                  onClick={() => setSelectedPlan('yearly')}
                  type="button"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-medium text-text-primary">$99.99 AUD / year</div>
                    <Badge tone="accent">Best Value</Badge>
                  </div>
                  <div className="text-sm text-text-secondary">7-day free trial. About $8.33 AUD/month.</div>
                </button>
                <button
                  className={`w-full rounded-card border p-4 text-left ${
                    selectedPlan === 'monthly' ? 'border-accent bg-accent/5' : 'border-border bg-elevated'
                  }`}
                  onClick={() => setSelectedPlan('monthly')}
                  type="button"
                >
                  <div className="font-medium text-text-primary">$10.99 AUD / month</div>
                </button>
              </div>
              <Button fullWidth onClick={handleCheckout} disabled={loading}>
                {loading
                  ? 'Loading...'
                  : selectedPlan === 'yearly'
                    ? 'Start Free Trial →'
                    : selectedPlan === 'monthly'
                      ? 'Start Pro Monthly →'
                      : 'Start Pro Weekly →'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
