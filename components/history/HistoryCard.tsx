'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Decision } from '@/types';

export function HistoryCard({ decision, locked = false }: { decision: Decision; locked?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={locked ? 'brightness-75 blur-[1px]' : ''}>
      <button className="w-full text-left" onClick={() => setExpanded((value) => !value)} type="button">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-medium text-text-primary">{decision.decision_label}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-text-secondary">
              <span>{formatDistanceToNow(new Date(decision.created_at), { addSuffix: true })}</span>
              <Badge tone="accent">⚡ {decision.seconds_to_decide}s</Badge>
              <Badge>{decision.category}</Badge>
            </div>
          </div>
          {decision.feedback !== 'none' ? <div>{decision.feedback === 'liked' ? '👍' : '👎'}</div> : null}
        </div>
        {expanded && !locked ? (
          <div className="mt-4 space-y-3">
            <div className="font-display text-4xl uppercase leading-none">{decision.headline}</div>
            <p className="text-sm text-text-secondary">{decision.reasoning}</p>
            <div className="text-sm font-medium text-accent">→ {decision.next_step}</div>
          </div>
        ) : null}
      </button>
    </Card>
  );
}
