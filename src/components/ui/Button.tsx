import { LoaderCircle } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cx } from '../../lib/cx';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-center text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-sage-600 text-white shadow-soft enabled:hover:bg-sage-700 [a&]:hover:bg-sage-700',
  secondary: 'border border-sage-600/40 bg-white text-sage-700 hover:border-sage-600 hover:bg-sage-50',
  ghost: 'text-sage-700 hover:bg-sage-100',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  busy?: boolean;
}

export function Button({ variant = 'primary', busy, className, children, disabled, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(base, variants[variant], className)}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      {...props}
    >
      {busy && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function ButtonLink({ variant = 'primary', className, ...props }: LinkProps & { variant?: Variant }) {
  return <Link className={cx(base, variants[variant], className)} {...props} />;
}
