'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  fullWidth,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-pill px-5 py-3 text-sm font-medium transition duration-150',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-accent text-black hover:bg-accent-dim',
        variant === 'secondary' && 'border border-border bg-elevated text-text-primary hover:border-accent/40',
        variant === 'ghost' && 'text-text-secondary hover:bg-elevated hover:text-text-primary',
        variant === 'danger' && 'bg-danger/10 text-danger hover:bg-danger/20',
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
}
