import { ProfileClient } from '@/components/profile/ProfileClient';
import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/utils/session';
import type { Decision } from '@/types';

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = createClient();
  const { data } = await supabase
    .from('decisions')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  return <ProfileClient profile={profile} decisions={(data ?? []) as Decision[]} />;
}
