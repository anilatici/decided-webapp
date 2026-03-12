'use client';

import { useEffect } from 'react';
import { useSubscriptionStore } from '@/lib/store/subscriptionStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useSubscriptionStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return children;
}
