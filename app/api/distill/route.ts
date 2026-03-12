import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOpenAIClient } from '@/lib/openai/client';
import { generateDistillSystem, SAFETY_BLOCK } from '@/lib/prompts';
import { parseJsonContent } from '@/lib/utils/json';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const openai = getOpenAIClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { feedbackLines } = await request.json();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 200,
    temperature: 0.4,
    messages: [
      { role: 'system', content: `${SAFETY_BLOCK}\n\n${generateDistillSystem(feedbackLines)}` },
      { role: 'user', content: 'Distill these signals into a preference profile.' },
    ],
  });

  const raw = completion.choices[0].message.content ?? '';

  try {
    const parsed = parseJsonContent<{ profile: string }>(raw);
    await supabase.from('profiles').update({ preference_profile: parsed.profile }).eq('id', user.id);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Failed to distill profile' }, { status: 500 });
  }
}
