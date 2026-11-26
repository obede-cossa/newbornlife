import { Check } from 'lucide-react';
import { cx } from '../../lib/cx';

export function ProgressIndicator({
  steps,
  current,
  reachable,
  disabled,
  onSelect,
}: {
  steps: string[];
  current: number;
  /** Furthest step that can be opened with the choices made so far. */
  reachable: number;
  disabled?: boolean;
  onSelect: (step: number) => void;
}) {
  return (
    <nav aria-label="Booking progress">
      <p className="sr-only" aria-live="polite">
        Step {current} of {steps.length}
      </p>
      <ol className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {steps.map((label, index) => {
          const step = index + 1;
          const active = step === current;
          const done = step < reachable && !active;
          const clickable = step <= reachable && !active && !disabled;
          return (
            <li key={label}>
              <button
                type="button"
                disabled={!clickable}
                aria-current={active ? 'step' : undefined}
                onClick={() => onSelect(step)}
                className="group flex min-h-[44px] w-full flex-col gap-2 rounded-lg pt-1 disabled:cursor-default"
              >
                <span
                  className={cx(
                    'h-1.5 w-full rounded-full transition-colors duration-500',
                    active ? 'bg-sage-600' : done ? 'bg-sage-500' : 'bg-sand-300',
                  )}
                />
                <span
                  className={cx(
                    'flex items-center justify-center gap-1 text-xs whitespace-nowrap',
                    active && 'font-semibold text-charcoal',
                    done && 'font-semibold text-sage-700',
                    !active && !done && 'text-slate-muted',
                    clickable && 'underline-offset-4 group-hover:underline',
                  )}
                >
                  {done && <Check className="hidden size-3.5 sm:block" aria-hidden />}
                  {step}. {label}
                  {done && <span className="sr-only"> (completed)</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
