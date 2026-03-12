import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-card border border-border bg-elevated px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary',
        'transition focus:border-accent focus:outline-none',
        className,
      )}
      {...props}
    />
  );
});
