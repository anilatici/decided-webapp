import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai/client';
import { generateQuestionsSystem, SAFETY_BLOCK } from '@/lib/prompts';
import { getBlockedMessageFromModelOutput, getSafetyMessage } from '@/lib/safety/filter';
import { parseJsonContent } from '@/lib/utils/json';

type ParsedQuestion = {
  id?: string;
  text?: string;
  type?: 'options' | 'scale' | 'boolean';
  options?: string[];
  scaleMin?: string;
  scaleMax?: string;
};

function normalizeQuestions(payload: { questions?: ParsedQuestion[] }) {
  const questions = Array.isArray(payload.questions) ? payload.questions : [];

  return questions
    .map((question, index) => {
      if (!question || typeof question.text !== 'string' || !question.text.trim()) {
        return null;
      }

      const type = question.type === 'scale' || question.type === 'boolean' ? question.type : 'options';
      const options = Array.isArray(question.options)
        ? question.options.filter((option): option is string => typeof option === 'string' && option.trim().length > 0)
        : undefined;

      return {
        id: question.id?.trim() || `q${index + 1}`,
        text: question.text.trim(),
        type,
        options: type === 'options' ? options ?? [] : undefined,
        scaleMin: typeof question.scaleMin === 'string' ? question.scaleMin : undefined,
        scaleMax: typeof question.scaleMax === 'string' ? question.scaleMax : undefined,
      };
    })
    .filter((question): question is NonNullable<typeof question> => Boolean(question));
}

export async function POST(request: NextRequest) {
  const { decision, category } = await request.json();
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
    max_tokens: 600,
    temperature: 0.7,
    messages: [
      { role: 'system', content: `${SAFETY_BLOCK}\n\n${generateQuestionsSystem(decision, category)}` },
      { role: 'user', content: `Generate clarifying questions for: "${decision}"` },
    ],
  });

  const raw = completion.choices[0].message.content ?? '';

  try {
    const parsed = parseJsonContent<{ questions?: ParsedQuestion[] }>(raw);
    return NextResponse.json({ questions: normalizeQuestions(parsed) });
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
        code: 'QUESTION_PARSE_FAILED',
        error: 'I could not turn that into clarifying questions. Try rephrasing it as a simple everyday decision.',
      },
      { status: 500 },
    );
  }
}
