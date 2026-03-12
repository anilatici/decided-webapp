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

export function MobileNav() {
  const { pathname, pendingHref, setPendingHref } = useAppNavigation();
  const selectedHref = pendingHref ?? pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface/95 px-2 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-4 gap-1">
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
                'flex flex-col items-center gap-1 rounded-card px-2 py-2 text-[11px]',
                active ? 'text-accent' : 'text-text-dim',
              )}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
