'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DecisionInput } from '@/components/decide/DecisionInput';
import { ClarifyingStep } from '@/components/decide/ClarifyingStep';
import { LoadingStep } from '@/components/decide/LoadingStep';
import { ResultCard } from '@/components/decide/ResultCard';
import { PaywallModal } from '@/components/paywall/PaywallModal';
import { Button } from '@/components/ui/Button';
import { getSafetyMessage } from '@/lib/safety/filter';
import { useDecisionStore } from '@/lib/store/decisionStore';
import { useSubscriptionStore } from '@/lib/store/subscriptionStore';
import type { ClarifyingQuestion, Recommendation, UserProfile } from '@/types';

export function DecideClient({
  profile,
  preferenceProfile,
}: {
  profile: UserProfile;
  preferenceProfile: string;
}) {
  const store = useDecisionStore();
  const { dailyCount, incrementDailyCount, isPro, setIsPro } = useSubscriptionStore();
  const [savePending, setSavePending] = useState(false);
  const trigger = (store.paywallTrigger ?? 'manual_upgrade') as
    | 'decision_limit'
    | 'autopilot_limit'
    | 'feedback_gate'
    | 'history_gate'
    | 'manual_upgrade';

  useEffect(() => {
    setIsPro(profile.is_premium);
  }, [profile.is_premium, setIsPro]);

  const remaining = Math.max(0, 5 - dailyCount);
  const currentQuestion = store.questions[store.currentQuestionIndex];
  const currentAnswer = currentQuestion
    ? store.answers.find((entry) => entry.question === currentQuestion.text)?.answer
    : undefined;

  async function handleStart() {
    if (!isPro && dailyCount >= 5) {
      store.setPaywall('decision_limit');
      return;
    }

    const safetyMessage = getSafetyMessage(store.inputText);
    if (safetyMessage) {
      store.setBlockedMessage(safetyMessage);
      return;
    }

    store.setStartedAt(new Date().toISOString());
    store.setStep('loading');

    try {
      const response = await fetch('/api/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: store.inputText, category: store.category }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'SENSITIVE_REQUEST') {
          store.setBlockedMessage(data.error ?? 'That request is outside what Decided can help with.');
          return;
        }

        throw new Error(data.error ?? 'Question generation failed');
      }

      const questions = (data.questions ?? []) as ClarifyingQuestion[];
      if (questions.length === 0) {
        await handleRecommendation([]);
        return;
      }

      store.setQuestions(questions);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to generate questions');
      store.setStep('input');
    }
  }

  async function handleRecommendation(answers = store.answers) {
    store.setStep('loading');
    const startTime = store.startedAt ? new Date(store.startedAt).getTime() : Date.now();

    try {
      const response = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: store.inputText,
          category: store.category,
          answers,
          preferenceProfile,
        }),
      });
      const data = (await response.json()) as Recommendation & { error?: string };
      if (!response.ok) {
        if ((data as { code?: string }).code === 'SENSITIVE_REQUEST') {
          store.setBlockedMessage(data.error ?? 'That request is outside what Decided can help with.');
          return;
        }

        throw new Error(data.error ?? 'Recommendation generation failed');
      }

      store.setRecommendation(data);
      if (!isPro) {
        incrementDailyCount();
      }

      const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      window.sessionStorage.setItem('decided:last-seconds-to-decide', String(elapsedSeconds));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to generate recommendation');
      store.setStep('input');
    }
  }

  async function handleSave() {
    if (!store.recommendation) return;
    setSavePending(true);

    try {
      const response = await fetch('/api/profile/save-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input_text: store.inputText,
          category: store.category,
          headline: store.recommendation.headline,
          recommendation: store.recommendation.recommendation,
          reasoning: store.recommendation.reasoning,
          next_step: store.recommendation.nextStep,
          confidence: store.recommendation.confidence,
          decision_label: store.recommendation.decisionLabel,
          seconds_to_decide: Number(window.sessionStorage.getItem('decided:last-seconds-to-decide') ?? '1'),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Save failed');
      toast.success('Decision saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setSavePending(false);
    }
  }

  async function handleFeedback(type: 'liked' | 'disliked') {
    toast.success(type === 'liked' ? 'Saved as liked' : 'Saved as disliked');
  }

  if (store.step === 'loading') {
    return <LoadingStep />;
  }

  if (store.step === 'blocked') {
    return (
      <div className="mx-auto max-w-xl space-y-4 rounded-card border border-danger/30 bg-danger/10 p-6">
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-danger">Blocked</div>
        <p className="text-sm text-text-primary">{store.blockedMessage}</p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            store.setBlockedMessage(null);
            store.setStep('input');
          }}
        >
          Return Back To Decision
        </Button>
      </div>
    );
  }

  if (store.step === 'clarifying') {
    return (
      <ClarifyingStep
        currentAnswer={currentAnswer}
        currentQuestionIndex={store.currentQuestionIndex}
        onAnswer={(value) => store.answerQuestion(value)}
        onNext={() => {
          if (store.currentQuestionIndex === store.questions.length - 1) {
            void handleRecommendation();
            return;
          }
          store.nextQuestion();
        }}
        questions={store.questions}
      />
    );
  }

  return (
    <>
      {store.step === 'result' && store.recommendation ? (
        <ResultCard
          isPro={isPro}
          onFeedback={(type) => void handleFeedback(type)}
          onReset={() => store.reset()}
          onSave={() => void handleSave()}
          onShare={() => {
            const text = `${store.recommendation?.headline}\n\n${store.recommendation?.recommendation}\n\nNext step: ${store.recommendation?.nextStep}`;
            navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard');
          }}
          onUpgrade={() => store.setPaywall('feedback_gate')}
          recommendation={store.recommendation}
        />
      ) : (
        <DecisionInput
          category={store.category}
          inputText={store.inputText}
          isLoading={savePending}
          isPro={isPro}
          onCategoryChange={store.setCategory}
          onInputChange={store.setInputText}
          onSubmit={() => void handleStart()}
          remaining={remaining}
        />
      )}
      <PaywallModal
        open={store.showPaywall}
        trigger={trigger}
        onClose={() => store.clearPaywall()}
      />
    </>
  );
}
