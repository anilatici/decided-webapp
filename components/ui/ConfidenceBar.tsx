'use client';

import { motion } from 'framer-motion';

export function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="space-y-2">
      <div className="font-mono text-xs uppercase tracking-[0.24em] text-text-secondary">
        {value}% match
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-elevated">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
