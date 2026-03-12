'use client';

import { Button } from '@/components/ui/Button';
import type { ScheduledTask } from '@/types';

export function ActiveTask({
  task,
  onDone,
  onDelay,
}: {
  task: ScheduledTask;
  onDone: () => void;
  onDelay: () => void;
}) {
  return (
    <div className="rounded-card border-l-4 border-accent bg-surface p-6">
      <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Now</div>
      <div className="mt-3 font-display text-6xl uppercase leading-none">{task.title}</div>
      <p className="mt-4 text-text-secondary">{task.description}</p>
      <div className="mt-4 font-mono text-xs uppercase tracking-[0.24em] text-accent">Start With →</div>
      <div className="mt-2 text-base font-medium text-accent">{task.firstAction}</div>
      <div className="mt-6 flex gap-3">
        <Button onClick={onDone} type="button">
          ✓ Done
        </Button>
        <Button variant="secondary" onClick={onDelay} type="button">
          +15 min
        </Button>
      </div>
    </div>
  );
}
