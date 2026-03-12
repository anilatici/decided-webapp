import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/lib/utils/session';

export async function GET() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    is_premium: profile.is_premium,
    premium_expires_at: profile.premium_expires_at,
    stripe_customer_id: profile.stripe_customer_id,
  });
}
