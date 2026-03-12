function StatCardSkeleton() {
  return <div className="h-28 animate-pulse rounded-card border border-border bg-surface/70" />;
}

function ContentSkeleton() {
  return <div className="h-40 animate-pulse rounded-card border border-border bg-surface/70" />;
}

export function AppLoadingShell() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="space-y-4">
        <ContentSkeleton />
        <ContentSkeleton />
      </div>
    </div>
  );
}
