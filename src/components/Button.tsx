import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const variantClasses: Record<Variant, string> = {
  primary: 'bg-sage text-white hover:opacity-90 shadow-soft',
  secondary: 'bg-blush text-ink hover:bg-terracotta/20',
  ghost: 'bg-transparent text-ink hover:bg-blush',
  danger: 'bg-terracotta/30 text-ink hover:bg-terracotta/50',
};

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
