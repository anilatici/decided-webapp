import { subDays } from 'date-fns';
import { HistoryCard } from '@/components/history/HistoryCard';
import { Card } from '@/components/ui/Card';
import { getDecisionStorageErrorMessage } from '@/lib/supabase/errors';
import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/utils/session';
import type { Decision } from '@/types';

export default async function HistoryPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('decisions')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  const decisions = (data ?? []) as Decision[];
  const weekAgo = subDays(new Date(), 7);
  const avgTime = decisions.length
    ? Math.round(decisions.reduce((sum, item) => sum + item.seconds_to_decide, 0) / decisions.length)
    : 0;
  const thisWeek = decisions.filter((item) => new Date(item.created_at) > weekAgo).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="font-display text-5xl uppercase text-accent">{decisions.length}</div>
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-text-secondary">Total Decisions</div>
        </Card>
        <Card>
          <div className="font-display text-5xl uppercase text-accent">{avgTime}s</div>
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-text-secondary">Avg Time</div>
        </Card>
        <Card>
          <div className="font-display text-5xl uppercase text-accent">{thisWeek}</div>
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-text-secondary">This Week</div>
        </Card>
      </div>
      {error ? (
        <Card className="border-danger/30 bg-danger/10">
          <p className="text-sm text-text-primary">{getDecisionStorageErrorMessage(error)}</p>
        </Card>
      ) : null}
      <div className="space-y-4">
        {decisions.map((decision) => (
          <HistoryCard
            key={decision.id}
            decision={decision}
            locked={!profile.is_premium && new Date(decision.created_at) < weekAgo}
          />
        ))}
      </div>
    </div>
  );
}
