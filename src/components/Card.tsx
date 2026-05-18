import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-surface p-5 shadow-soft ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
