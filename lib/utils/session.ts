import { unstable_noStore as noStore } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { UserProfile } from '@/types';

type RawProfileRow = {
  id?: string;
  email?: string | null;
  display_name?: string | null;
  is_premium?: boolean | null;
  pro?: boolean | null;
  premium_expires_at?: string | null;
  stripe_customer_id?: string | null;
  preference_profile?: string | null;
  created_at?: string | null;
};

function normalizeProfile(row: RawProfileRow, fallback: { id: string; email: string }): UserProfile {
  return {
    id: row.id ?? fallback.id,
    email: row.email ?? fallback.email,
    display_name: row.display_name ?? null,
    is_premium: row.is_premium ?? row.pro ?? false,
    premium_expires_at: row.premium_expires_at ?? null,
    stripe_customer_id: row.stripe_customer_id ?? null,
    preference_profile: row.preference_profile ?? null,
    created_at: row.created_at ?? new Date().toISOString(),
  };
}

export async function getCurrentUser() {
  noStore();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  noStore();
  const user = await getCurrentUser();

  if (!user) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Failed to load profile for authenticated user', {
      userId: user.id,
      error,
    });
  }

  if (data) {
    return normalizeProfile(data as RawProfileRow, {
      id: user.id,
      email: user.email ?? '',
    });
  }

  return normalizeProfile({}, {
    id: user.id,
    email: user.email ?? '',
  });
}
