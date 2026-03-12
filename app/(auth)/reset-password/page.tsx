import type { Metadata } from 'next';
import { AuthCard } from '@/components/shared/AuthCard';
import { ResetPasswordForm } from '@/components/shared/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Choose A New Password For Your Decided Account',
  description: 'Update your Decided password after following the secure reset link sent to your email.',
  alternates: {
    canonical: '/reset-password',
  },
  openGraph: {
    title: 'Choose A New Password For Your Decided Account | Decided',
    description: 'Update your Decided password after following the secure reset link sent to your email.',
    url: '/reset-password',
  },
  twitter: {
    card: 'summary',
    title: 'Choose A New Password For Your Decided Account | Decided',
    description: 'Update your Decided password after following the secure reset link sent to your email.',
  },
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      eyebrow="Secure reset"
      title="Set a new password."
      description="Choose a new password for your Decided account."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
