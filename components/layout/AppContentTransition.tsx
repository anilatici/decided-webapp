'use client';

import { AppLoadingShell } from '@/components/layout/AppLoadingShell';
import { useAppNavigation } from '@/components/layout/AppNavigationContext';

export function AppContentTransition({ children }: { children: React.ReactNode }) {
  const { pathname, pendingHref } = useAppNavigation();
  const showLoading = Boolean(pendingHref && !pathname.startsWith(pendingHref));

  return showLoading ? <AppLoadingShell /> : <>{children}</>;
}
