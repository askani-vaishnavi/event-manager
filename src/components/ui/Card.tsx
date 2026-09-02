import { type HTMLAttributes, type ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glass?: boolean;
}

export function Card({ children, hover = false, glass = false, className = '', ...props }: CardProps) {
  const base = glass
    ? 'glass rounded-2xl'
    : 'surface rounded-2xl';
  const hoverCls = hover ? 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1' : '';
  return (
    <div className={`${base} ${hoverCls} ${className}`} {...props}>
      {children}
    </div>
  );
}
