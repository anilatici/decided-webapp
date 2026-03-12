import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai/client';
import { generateAutopilotSystem, SAFETY_BLOCK } from '@/lib/prompts';
import { parseJsonContent } from '@/lib/utils/json';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1000,
    temperature: 0.6,
    messages: [
      { role: 'system', content: `${SAFETY_BLOCK}\n\n${generateAutopilotSystem(payload)}` },
      { role: 'user', content: 'Generate today’s plan.' },
    ],
  });

  const raw = completion.choices[0].message.content ?? '';

  try {
    return NextResponse.json(parseJsonContent(raw));
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to parse autopilot plan',
        details: error instanceof Error ? error.message : 'Unknown parse error',
      },
      { status: 500 },
    );
  }
}
