'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

type AppNavigationContextValue = {
  pathname: string;
  pendingHref: string | null;
  setPendingHref: (href: string | null) => void;
};

const AppNavigationContext = createContext<AppNavigationContextValue | null>(null);

export function AppNavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setPendingHref((current) => (current && pathname.startsWith(current) ? null : current));
  }, [pathname]);

  const value = useMemo(
    () => ({
      pathname,
      pendingHref,
      setPendingHref,
    }),
    [pathname, pendingHref],
  );

  return <AppNavigationContext.Provider value={value}>{children}</AppNavigationContext.Provider>;
}

export function useAppNavigation() {
  const context = useContext(AppNavigationContext);

  if (!context) {
    throw new Error('useAppNavigation must be used within AppNavigationProvider');
  }

  return context;
}
