import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai/client';
import { generateAutopilotSystem, SAFETY_BLOCK } from '@/lib/prompts';
import { getBlockedMessageFromModelOutput } from '@/lib/safety/filter';
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
        code: 'AUTOPILOT_PARSE_FAILED',
        error: 'I could not build a plan from that. Try shortening it and focus on normal day-planning details.',
      },
      { status: 500 },
    );
  }
}
