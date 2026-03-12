import { StreakBadge } from '@/components/shared/StreakBadge';

export function TopBar({ streak }: { streak: number }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-4 backdrop-blur lg:hidden">
      <div className="font-display text-4xl uppercase text-accent">decided.</div>
      <StreakBadge streak={streak} />
    </div>
  );
}
