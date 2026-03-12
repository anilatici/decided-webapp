'use client';

import { create } from 'zustand';
import type { ClarifyingQuestion, DecideStep, PaywallTrigger, Recommendation } from '@/types';

interface AnswerEntry {
  question: string;
  answer: string;
}

interface DecisionState {
  step: DecideStep;
  inputText: string;
  category: string;
  questions: ClarifyingQuestion[];
  currentQuestionIndex: number;
  answers: AnswerEntry[];
  recommendation: Recommendation | null;
  startedAt: string | null;
  showPaywall: boolean;
  paywallTrigger: PaywallTrigger | null;
  error: string | null;
  blockedMessage: string | null;
  setInputText: (value: string) => void;
  setCategory: (value: string) => void;
  setQuestions: (questions: ClarifyingQuestion[]) => void;
  answerQuestion: (answer: string) => void;
  nextQuestion: () => void;
  setStep: (step: DecideStep) => void;
  setRecommendation: (recommendation: Recommendation) => void;
  setStartedAt: (startedAt: string | null) => void;
  setPaywall: (trigger: PaywallTrigger | null) => void;
  clearPaywall: () => void;
  setError: (value: string | null) => void;
  setBlockedMessage: (value: string | null) => void;
  reset: () => void;
}

const initialState = {
  step: 'input' as DecideStep,
  inputText: '',
  category: 'Other',
  questions: [] as ClarifyingQuestion[],
  currentQuestionIndex: 0,
  answers: [] as AnswerEntry[],
  recommendation: null,
  startedAt: null,
  showPaywall: false,
  paywallTrigger: null as PaywallTrigger | null,
  error: null,
  blockedMessage: null,
};

export const useDecisionStore = create<DecisionState>((set, get) => ({
  ...initialState,
  setInputText: (inputText) => set({ inputText, error: null, blockedMessage: null }),
  setCategory: (category) => set({ category }),
  setQuestions: (questions) =>
    set({
      questions,
      currentQuestionIndex: 0,
      answers: [],
      step: 'clarifying',
      error: null,
      blockedMessage: null,
    }),
  answerQuestion: (answer) => {
    const { questions, currentQuestionIndex, answers } = get();
    const currentQuestion = questions[currentQuestionIndex];
    const nextAnswers = answers.filter((entry) => entry.question !== currentQuestion.text);
    nextAnswers.push({ question: currentQuestion.text, answer });
    set({ answers: nextAnswers });
  },
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1),
    })),
  setStep: (step) => set({ step }),
  setRecommendation: (recommendation) => set({ recommendation, step: 'result' }),
  setStartedAt: (startedAt) => set({ startedAt }),
  setPaywall: (paywallTrigger) => set({ showPaywall: Boolean(paywallTrigger), paywallTrigger }),
  clearPaywall: () => set({ showPaywall: false, paywallTrigger: null }),
  setError: (error) => set({ error }),
  setBlockedMessage: (blockedMessage) => set({ blockedMessage, step: 'blocked' }),
  reset: () => set(initialState),
}));
