'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const prompts = [
  'What are you stuck on?',
  'What decision is draining you?',
  "Say it out loud. I'll handle the rest.",
];

const categories = ['Food', 'Workout', 'Work', 'Time', 'Money', 'Other'];

export function DecisionInput({
  inputText,
  category,
  remaining,
  onInputChange,
  onCategoryChange,
  onSubmit,
  isLoading,
  isPro,
}: {
  inputText: string;
  category: string;
  remaining: number;
  onInputChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isPro: boolean;
}) {
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPromptIndex((current) => (current + 1) % prompts.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-[560px] space-y-6">
      <div className="overflow-hidden font-mono text-sm uppercase tracking-[0.28em] text-accent">
        <AnimatePresence mode="wait">
          <motion.div
            key={promptIndex}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
          >
            {prompts[promptIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
      <textarea
        autoFocus
        className="min-h-[120px] w-full rounded-card border border-border bg-elevated px-4 py-4 text-lg text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
        placeholder="e.g. Should I go to the gym or rest today?"
        value={inputText}
        onChange={(event) => onInputChange(event.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => {
          const active = item === category;
          return (
            <button
              key={item}
              className={`rounded-pill border px-4 py-2 text-sm ${
                active ? 'border-accent bg-accent text-black' : 'border-border bg-elevated text-text-secondary'
              }`}
              onClick={() => onCategoryChange(item)}
              type="button"
            >
              {item}
            </button>
          );
        })}
      </div>
      {!isPro && remaining <= 3 ? (
        <div className={`font-mono text-xs ${remaining > 0 ? 'text-text-secondary' : 'text-danger'}`}>
          {remaining > 0 ? `${remaining} decisions left today` : 'Daily limit reached'}
        </div>
      ) : null}
      <Button fullWidth disabled={!inputText.trim() || isLoading} onClick={onSubmit}>
        {isLoading ? 'Thinking...' : "Let's Decide →"}
      </Button>
    </div>
  );
}
