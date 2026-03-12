'use client';

import { Button } from '@/components/ui/Button';

export function UpgradeNudge({
  title = 'Unlock the full Decided flow.',
  body = 'Upgrade to Pro for unlimited decisions, feedback learning, and complete history.',
  onUpgrade,
}: {
  title?: string;
  body?: string;
  onUpgrade?: () => void;
}) {
  return (
    <div className="rounded-card border border-accent/30 bg-accent/5 p-4">
      <div className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Pro</div>
      <div className="mt-2 text-lg font-medium text-text-primary">{title}</div>
      <p className="mt-2 text-sm text-text-secondary">{body}</p>
      <Button className="mt-4" onClick={onUpgrade} type="button">
        ⚡ Upgrade to Pro
      </Button>
    </div>
  );
}
