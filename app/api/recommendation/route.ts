import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai/client';
import { generateRecommendationSystem, SAFETY_BLOCK } from '@/lib/prompts';
import { getBlockedMessageFromModelOutput, getSafetyMessage } from '@/lib/safety/filter';
import { parseJsonContent } from '@/lib/utils/json';

export async function POST(request: NextRequest) {
  const { decision, category, answers, preferenceProfile } = await request.json();
  const safetyMessage = getSafetyMessage(decision ?? '');

  if (safetyMessage) {
    return NextResponse.json(
      {
        code: 'SENSITIVE_REQUEST',
        error: safetyMessage,
      },
      { status: 422 },
    );
  }

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
    const blockedMessage = getBlockedMessageFromModelOutput(raw);

    if (blockedMessage) {
      return NextResponse.json(
        {
          code: 'SENSITIVE_REQUEST',
          error: blockedMessage,
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      {
        code: 'RECOMMENDATION_PARSE_FAILED',
        error: 'I could not produce a recommendation for that. Try rewriting it as a simple everyday choice.',
      },
      { status: 500 },
    );
  }
}
