import { Card } from '@/components/ui/Card';

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg p-8">
        <div className="mb-8 space-y-3">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">{eyebrow}</div>
          <h1 className="font-display text-6xl uppercase leading-none">{title}</h1>
          <p className="max-w-md text-sm text-text-secondary">{description}</p>
        </div>
        {children}
      </Card>
    </main>
  );
}
