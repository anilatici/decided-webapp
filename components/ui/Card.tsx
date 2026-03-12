import { cn } from '@/lib/utils/cn';

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-card border border-border bg-surface p-5 shadow-glow', className)}>
      {children}
    </div>
  );
}
