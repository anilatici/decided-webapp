import type { Metadata } from 'next';
import { AuthCard } from '@/components/shared/AuthCard';
import { AuthForm } from '@/components/shared/AuthForm';

export const metadata: Metadata = {
  title: 'Log In To Continue Your Saved Decisions',
  description: 'Log in to Decided to resume active decision flows, review saved outcomes, sync progress across devices, and keep momentum without restarting.',
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: 'Log In To Continue Your Saved Decisions | Decided',
    description: 'Log in to Decided to resume active decision flows, review saved outcomes, sync progress across devices, and keep momentum without restarting.',
    url: '/login',
  },
  twitter: {
    card: 'summary',
    title: 'Log In To Continue Your Saved Decisions | Decided',
    description: 'Log in to Decided to resume active decision flows, review saved outcomes, sync progress across devices, and keep momentum without restarting.',
  },
};

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Make the next call."
      description="Log in with the same account you use on mobile."
    >
      <AuthForm mode="login" />
    </AuthCard>
  );
}
