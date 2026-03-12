import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AppNavigationProvider } from '@/components/layout/AppNavigationContext';
import { AppContentTransition } from '@/components/layout/AppContentTransition';
import { AppRoutePrefetch } from '@/components/layout/AppRoutePrefetch';
import { getCurrentUser } from '@/lib/utils/session';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <AppNavigationProvider>
      <div className="min-h-screen lg:flex">
        <AppRoutePrefetch />
        <Sidebar email={user.email ?? ''} />
        <div className="min-w-0 flex-1 pb-24 lg:pb-0">
          <TopBar />
          <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 lg:px-10 lg:py-10">
            <AppContentTransition>{children}</AppContentTransition>
          </main>
        </div>
        <MobileNav />
      </div>
    </AppNavigationProvider>
  );
}
