'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const APP_ROUTES = ['/decide', '/autopilot', '/history', '/profile'];

export function AppRoutePrefetch() {
  const router = useRouter();

  useEffect(() => {
    APP_ROUTES.forEach((route) => {
      router.prefetch(route);
    });
  }, [router]);

  return null;
}
