import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { formatLongDate, formatMonth, parseISODate, toISODate } from '../../lib/format';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const monthStart = (iso: string) => {
  const d = parseISODate(iso);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const navButton =
  'flex size-11 items-center justify-center rounded-full bg-sand transition enabled:hover:bg-sand-300 disabled:cursor-default disabled:opacity-40';

/** Month calendar where only dates with open times can be chosen. `dates` must be sorted. */
export function DatePicker({
  dates,
  selected,
  onSelect,
}: {
  dates: string[];
  selected?: string;
  onSelect: (date: string) => void;
}) {
  const open = new Set(dates);
  const first = monthStart(dates[0]);
  const last = monthStart(dates[dates.length - 1]);
  const [month, setMonth] = useState(() => monthStart(selected && open.has(selected) ? selected : dates[0]));

  const shift = (by: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + by, 1));
  const leading = (month.getDay() + 6) % 7;
  const length = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  /** Left and right arrows step between available dates in the visible month. */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
    const next = buttons[buttons.indexOf(document.activeElement as HTMLButtonElement) + step];
    if (next) {
      event.preventDefault();
      next.focus();
    }
  };

  return (
    <div className="rounded-3xl border border-sand-300 bg-white p-2 sm:p-5">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" className={navButton} onClick={() => shift(-1)} disabled={month <= first} aria-label="Previous month">
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <h3 className="text-lg" aria-live="polite">{formatMonth(month)}</h3>
        <button type="button" className={navButton} onClick={() => shift(1)} disabled={month >= last} aria-label="Next month">
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-muted" aria-hidden>
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-2">
            {day.slice(0, 2)}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px sm:gap-1" role="group" aria-label="Available dates" onKeyDown={onKeyDown}>
        {Array.from({ length: leading }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length }, (_, i) => {
          const iso = toISODate(new Date(month.getFullYear(), month.getMonth(), i + 1));
          const available = open.has(iso);
          const active = selected === iso;
          return (
            <button
              key={iso}
              type="button"
              disabled={!available}
              onClick={() => onSelect(iso)}
              aria-pressed={available ? active : undefined}
              aria-label={`${formatLongDate(iso)}${available ? '' : ', unavailable'}`}
              className={cx(
                'flex h-11 items-center justify-center rounded-xl text-sm transition',
                active && available && 'bg-sage-600 font-semibold text-white',
                !active && available && 'bg-sage-100 font-semibold text-sage-800 hover:bg-sage-200',
                !available && 'cursor-default text-slate-muted/50',
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-muted">
        <span className="size-3 rounded bg-sage-100 ring-1 ring-sage-200" aria-hidden />
        Shaded dates have sample availability
      </p>
    </div>
  );
}
