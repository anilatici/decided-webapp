import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai/client';
import { generateQuestionsSystem, SAFETY_BLOCK } from '@/lib/prompts';
import { parseJsonContent } from '@/lib/utils/json';

export async function POST(request: NextRequest) {
  const { decision, category } = await request.json();
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 600,
    temperature: 0.7,
    messages: [
      { role: 'system', content: `${SAFETY_BLOCK}\n\n${generateQuestionsSystem(decision, category)}` },
      { role: 'user', content: `Generate clarifying questions for: "${decision}"` },
    ],
  });

  const raw = completion.choices[0].message.content ?? '';

  try {
    return NextResponse.json(parseJsonContent(raw));
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to parse questions',
        details: error instanceof Error ? error.message : 'Unknown parse error',
      },
      { status: 500 },
    );
  }
}
