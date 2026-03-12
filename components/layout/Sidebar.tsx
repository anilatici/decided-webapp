'use client';

import Link from 'next/link';
import { useAppNavigation } from '@/components/layout/AppNavigationContext';
import { cn } from '@/lib/utils/cn';

const items = [
  { href: '/decide', label: 'Decide', icon: '⚡' },
  { href: '/autopilot', label: 'Autopilot', icon: '🤖' },
  { href: '/history', label: 'History', icon: '📜' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export function Sidebar({ email }: { email: string }) {
  const { pathname, pendingHref, setPendingHref } = useAppNavigation();
  const selectedHref = pendingHref ?? pathname;

  return (
    <aside className="hidden h-screen w-60 shrink-0 border-r border-border bg-surface/80 px-5 py-6 backdrop-blur lg:flex lg:flex-col">
      <div>
        <div className="font-display text-5xl uppercase tracking-wide text-accent">decided.</div>
        <div className="mt-6 h-px bg-border" />
      </div>
      <nav className="mt-6 space-y-2">
        {items.map((item) => {
          const active = selectedHref.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onPointerDown={() => setPendingHref(item.href)}
              onClick={() => setPendingHref(item.href)}
              className={cn(
                'flex items-center gap-3 rounded-card px-4 py-3 text-sm transition',
                active
                  ? 'bg-accent text-black'
                  : 'text-text-secondary hover:bg-elevated hover:text-text-primary',
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-4">
        <div className="text-sm text-text-secondary">{email}</div>
      </div>
    </aside>
  );
}
