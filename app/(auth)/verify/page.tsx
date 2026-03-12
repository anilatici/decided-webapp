import Link from 'next/link';
import { AuthCard } from '@/components/shared/AuthCard';

export default function VerifyPage() {
  return (
    <AuthCard
      eyebrow="Check your inbox"
      title="Verify your email."
      description="Open the verification email, confirm the link, then return here."
    >
      <div className="space-y-4 text-sm text-text-secondary">
        <p>After verification, the middleware will route you to `/decide` on your next visit.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/login" className="inline-flex rounded-pill bg-accent px-5 py-3 font-medium text-black">
            Back to login →
          </Link>
          <Link href="/forgot-password" className="inline-flex rounded-pill border border-border px-5 py-3 font-medium text-text-primary">
            Reset password
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
