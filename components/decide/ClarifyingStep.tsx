'use client';

import { Button } from '@/components/ui/Button';
import { QuestionBoolean } from '@/components/decide/QuestionBoolean';
import { QuestionOptions } from '@/components/decide/QuestionOptions';
import { QuestionScale } from '@/components/decide/QuestionScale';
import type { ClarifyingQuestion } from '@/types';

export function ClarifyingStep({
  questions,
  currentQuestionIndex,
  currentAnswer,
  onAnswer,
  onNext,
}: {
  questions: ClarifyingQuestion[];
  currentQuestionIndex: number;
  currentAnswer?: string;
  onAnswer: (value: string) => void;
  onNext: () => void;
}) {
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex gap-2">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className={`h-2 flex-1 rounded-full ${
              index < currentQuestionIndex
                ? 'bg-accent'
                : index === currentQuestionIndex
                  ? 'bg-accent/70'
                  : 'bg-elevated'
            }`}
          />
        ))}
      </div>
      <h2 className="text-2xl font-medium text-text-primary">{currentQuestion.text}</h2>
      {currentQuestion.type === 'options' ? (
        <QuestionOptions options={currentQuestion.options ?? []} value={currentAnswer} onSelect={onAnswer} />
      ) : null}
      {currentQuestion.type === 'scale' ? (
        <QuestionScale
          maxLabel={currentQuestion.scaleMax}
          minLabel={currentQuestion.scaleMin}
          value={currentAnswer}
          onChange={onAnswer}
        />
      ) : null}
      {currentQuestion.type === 'boolean' ? (
        <QuestionBoolean value={currentAnswer} onChange={onAnswer} />
      ) : null}
      <Button fullWidth disabled={!currentAnswer} onClick={onNext}>
        {currentQuestionIndex === questions.length - 1 ? 'Get My Answer →' : 'Next →'}
      </Button>
    </div>
  );
}
