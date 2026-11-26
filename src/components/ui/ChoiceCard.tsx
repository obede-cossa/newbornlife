import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

/** A native radio styled as a card, so arrow keys and screen readers work out of the box. */
export function ChoiceCard({
  name,
  value,
  checked,
  onSelect,
  title,
  meta,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onSelect: () => void;
  title: string;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <label className="group relative flex cursor-pointer gap-4 rounded-2xl border border-sand-300 bg-white p-4 transition hover:border-sage-500 has-checked:border-sage-600 has-checked:bg-sage-50 has-checked:ring-1 has-checked:ring-sage-600 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-sage-600 sm:p-5">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-sage-200 text-transparent transition peer-checked:border-sage-600 peer-checked:bg-sage-600 peer-checked:text-white">
        <Check className="size-3.5" strokeWidth={3} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-lg leading-snug">{title}</span>
        {children && <span className="mt-1 block text-sm leading-relaxed text-slate-muted">{children}</span>}
        {meta && <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-sage-700">{meta}</span>}
      </span>
    </label>
  );
}
