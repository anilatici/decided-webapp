import type { Metadata } from 'next';
import { AuthCard } from '@/components/shared/AuthCard';
import { AuthForm } from '@/components/shared/AuthForm';

export const metadata: Metadata = {
  title: 'Reset Your Password And Get Back Into Decided',
  description: 'Request a Decided password reset email to recover access, return to saved decisions quickly, and continue your workflow without losing context.',
  alternates: {
    canonical: '/forgot-password',
  },
  openGraph: {
    title: 'Reset Your Password And Get Back Into Decided | Decided',
    description: 'Request a Decided password reset email to recover access, return to saved decisions quickly, and continue your workflow without losing context.',
    url: '/forgot-password',
  },
  twitter: {
    card: 'summary',
    title: 'Reset Your Password And Get Back Into Decided | Decided',
    description: 'Request a Decided password reset email to recover access, return to saved decisions quickly, and continue your workflow without losing context.',
  },
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Reset"
      title="Get back in."
      description="Send a password reset email to regain access."
    >
      <AuthForm mode="forgot-password" />
    </AuthCard>
  );
}
