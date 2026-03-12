import { Badge } from '@/components/ui/Badge';

export function StreakBadge({ streak }: { streak: number }) {
  return <Badge tone="accent">🔥 {streak} day streak</Badge>;
}
