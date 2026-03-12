'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Mode = 'login' | 'register' | 'forgot-password';

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error('Login succeeded but no session was returned.');
        }

        window.location.assign('/decide');
        return;
      }

      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/verify`,
          },
        });
        if (error) throw error;
        router.push('/verify');
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      toast.success('Reset email sent');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block space-y-2 text-sm text-text-secondary">
        <span>Email</span>
        <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
      </label>
      {mode !== 'forgot-password' ? (
        <label className="block space-y-2 text-sm text-text-secondary">
          <span>Password</span>
          <Input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            minLength={mode === 'register' ? 8 : undefined}
            required
          />
        </label>
      ) : null}
      {mode === 'register' ? (
        <div className="rounded-card border border-border bg-elevated p-3 text-sm text-text-secondary">
          Use 8+ characters with a mix of letters, numbers, or symbols.
        </div>
      ) : null}
      <Button fullWidth disabled={loading} type="submit">
        {loading
          ? 'Working...'
          : mode === 'login'
            ? 'Log In →'
            : mode === 'register'
              ? 'Create account →'
              : 'Send reset link →'}
      </Button>
      {mode === 'login' ? (
        <div className="flex justify-between text-sm text-text-secondary">
          <Link href="/forgot-password">Forgot password</Link>
          <Link href="/register">Create account</Link>
        </div>
      ) : null}
      {mode === 'register' ? (
        <div className="flex justify-between gap-4 text-sm text-text-secondary">
          Already have an account? <Link href="/login">Log in to your Decided account</Link>
          <Link href="/forgot-password">Need a reset link?</Link>
        </div>
      ) : null}
      {mode === 'forgot-password' ? (
        <div className="flex justify-between text-sm text-text-secondary">
          <Link href="/login">Back to login</Link>
          <Link href="/register">Create account</Link>
        </div>
      ) : null}
    </form>
  );
}
