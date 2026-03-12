import { NextRequest, NextResponse } from 'next/server';
import { getDecisionStorageErrorMessage, isMissingDecisionsTableError } from '@/lib/supabase/errors';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const { error } = await supabase.from('decisions').insert({
    ...payload,
    user_id: user.id,
    feedback: 'none',
    feedback_context: null,
  });

  if (error) {
    return NextResponse.json(
      {
        code: isMissingDecisionsTableError(error) ? 'DECISIONS_TABLE_MISSING' : 'SAVE_DECISION_FAILED',
        error: getDecisionStorageErrorMessage(error),
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
