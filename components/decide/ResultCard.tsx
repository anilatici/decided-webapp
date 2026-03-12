'use client';

import { motion } from 'framer-motion';
import { ConfidenceBar } from '@/components/ui/ConfidenceBar';
import { Button } from '@/components/ui/Button';
import { FeedbackBar } from '@/components/decide/FeedbackBar';
import { UpgradeNudge } from '@/components/paywall/UpgradeNudge';
import type { Recommendation } from '@/types';

export function ResultCard({
  recommendation,
  isPro,
  onShare,
  onSave,
  onReset,
  onFeedback,
  onUpgrade,
}: {
  recommendation: Recommendation;
  isPro: boolean;
  onShare: () => void;
  onSave: () => void;
  onReset: () => void;
  onFeedback: (type: 'liked' | 'disliked') => void;
  onUpgrade: () => void;
}) {
  return (
    <motion.div
      className="mx-auto max-w-3xl space-y-6"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
    >
      {[
        <div key="eyebrow" className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          ⚡ Decided
        </div>,
        <div key="headline" className="font-display text-7xl uppercase leading-none">
          {recommendation.headline}
        </div>,
        <div key="rule" className="h-0.5 w-12 bg-accent" />,
        <p key="recommendation" className="text-lg text-text-primary">
          {recommendation.recommendation}
        </p>,
        <div key="why" className="space-y-2">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-text-secondary">Why This?</div>
          <p className="text-sm leading-relaxed text-text-secondary">{recommendation.reasoning}</p>
        </div>,
        <div key="next" className="space-y-2">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Your Next Step →</div>
          <p className="text-base font-medium text-accent">{recommendation.nextStep}</p>
        </div>,
        <ConfidenceBar key="confidence" value={recommendation.confidence} />,
      ].map((node, index) => (
        <motion.div key={index} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          {node}
        </motion.div>
      ))}

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onShare} type="button">
          Share
        </Button>
        <Button variant="secondary" onClick={onSave} type="button">
          Save ✓
        </Button>
        <Button onClick={onReset} type="button">
          New Decision
        </Button>
      </div>

      {isPro ? <FeedbackBar onFeedback={onFeedback} /> : <UpgradeNudge onUpgrade={onUpgrade} />}
    </motion.div>
  );
}
