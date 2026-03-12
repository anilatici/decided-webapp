import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai/client';
import { generateRecommendationSystem, SAFETY_BLOCK } from '@/lib/prompts';
import { parseJsonContent } from '@/lib/utils/json';

export async function POST(request: NextRequest) {
  const { decision, category, answers, preferenceProfile } = await request.json();
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 800,
    temperature: 0.7,
    messages: [
      {
        role: 'system',
        content: `${SAFETY_BLOCK}\n\n${generateRecommendationSystem(
          decision,
          category,
          answers,
          preferenceProfile ?? '',
        )}`,
      },
      { role: 'user', content: 'Generate a recommendation.' },
    ],
  });

  const raw = completion.choices[0].message.content ?? '';

  try {
    return NextResponse.json(parseJsonContent(raw));
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to parse recommendation',
        details: error instanceof Error ? error.message : 'Unknown parse error',
      },
      { status: 500 },
    );
  }
}
