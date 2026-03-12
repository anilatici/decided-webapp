import type { Metadata } from 'next';
import { AuthCard } from '@/components/shared/AuthCard';
import { AuthForm } from '@/components/shared/AuthForm';

export const metadata: Metadata = {
  title: 'Create Your Account And Start Deciding Faster',
  description: 'Create your Decided account to start guided decision-making, save outcomes, sync your workflow across devices, and build momentum on difficult calls.',
  alternates: {
    canonical: '/register',
  },
  openGraph: {
    title: 'Create Your Account And Start Deciding Faster | Decided',
    description: 'Create your Decided account to start guided decision-making, save outcomes, sync your workflow across devices, and build momentum on difficult calls.',
    url: '/register',
  },
  twitter: {
    card: 'summary',
    title: 'Create Your Account And Start Deciding Faster | Decided',
    description: 'Create your Decided account to start guided decision-making, save outcomes, sync your workflow across devices, and build momentum on difficult calls.',
  },
};

export default function RegisterPage() {
  return (
    <AuthCard
      eyebrow="New account"
      title="Start with one decision."
      description="Create your account and land directly in the product flow."
    >
      <AuthForm mode="register" />
    </AuthCard>
  );
}
