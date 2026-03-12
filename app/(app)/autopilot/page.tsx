import { AutopilotClient } from '@/components/autopilot/AutopilotClient';
import { getCurrentProfile } from '@/lib/utils/session';

export default async function AutopilotPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  return <AutopilotClient profile={profile} />;
}
