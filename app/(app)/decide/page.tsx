import { DecideClient } from '@/components/decide/DecideClient';
import { getCurrentProfile } from '@/lib/utils/session';

export default async function DecidePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  return <DecideClient profile={profile} preferenceProfile={profile.preference_profile ?? ''} />;
}
