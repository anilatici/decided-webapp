'use client';

import { motion } from 'framer-motion';

export function LoadingStep() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <motion.div
        className="h-4 w-4 rounded-full bg-accent"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <div className="font-display text-6xl uppercase">Deciding...</div>
      <div className="text-text-secondary">Thinking through your situation</div>
    </div>
  );
}
