import { cn } from '@/lib/utils/cn';

export function Badge({
  children,
  tone = 'default',
  className,
}: {
  children: React.ReactNode;
  tone?: 'default' | 'accent' | 'danger' | 'success';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em]',
        tone === 'default' && 'bg-elevated text-text-secondary',
        tone === 'accent' && 'bg-accent text-black',
        tone === 'danger' && 'bg-danger/15 text-danger',
        tone === 'success' && 'bg-success/15 text-success',
        className,
      )}
    >
      {children}
    </span>
  );
}
