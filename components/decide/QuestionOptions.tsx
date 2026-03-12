'use client';

import { motion } from 'framer-motion';

export function QuestionOptions({
  options,
  value,
  onSelect,
}: {
  options: string[];
  value?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <motion.div
      className="space-y-3"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
      {options.map((option) => (
        <motion.button
          key={option}
          className={`w-full rounded-card border px-5 py-4 text-left ${
            value === option
              ? 'border-accent bg-accent/5 text-text-primary'
              : 'border-border bg-elevated text-text-secondary'
          }`}
          onClick={() => onSelect(option)}
          type="button"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        >
          {option}
        </motion.button>
      ))}
    </motion.div>
  );
}
