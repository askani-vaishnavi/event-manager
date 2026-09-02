import { type ReactNode } from 'react';

type Variant = 'default' | 'brand' | 'accent' | 'cyan' | 'success' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  default: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
  brand: 'bg-brand-500 text-white',
  accent: 'bg-accent-500 text-white',
  cyan: 'bg-cyan-500 text-white',
  success: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-300',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
