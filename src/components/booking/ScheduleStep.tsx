import { Sun, Sunrise } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatLongDate } from '../../lib/format';
import { useAsync } from '../../lib/hooks';
import { mockApi } from '../../services/mockApi';
import type { DayPeriod, LocationId } from '../../types';
import { LoadError } from '../ui/LoadError';
import { SkeletonGroup } from '../ui/Skeleton';
import { DatePicker } from './DatePicker';

const periods: Array<{ id: DayPeriod; label: string; icon: typeof Sun }> = [
  { id: 'morning', label: 'Morning', icon: Sunrise },
  { id: 'afternoon', label: 'Afternoon', icon: Sun },
];

export function ScheduleStep({ locationId }: { locationId: LocationId }) {
  const { draft, selectDate, selectTime, clearSchedule } = useApp();
  const loader = useCallback(() => mockApi.getAvailability(locationId), [locationId]);
  const { data: days, loading, error, retry } = useAsync(loader);
  const day = days?.find((d) => d.date === draft.date);

  // Drop a remembered choice that is no longer open (taken, or now in the past).
  useEffect(() => {
    if (!days || !draft.date) return;
    const match = days.find((d) => d.date === draft.date);
    if (!match || (draft.time && !match.slots.some((s) => s.time === draft.time))) clearSchedule();
  }, [days, draft.date, draft.time, clearSchedule]);

  if (error) return <LoadError message={error} onRetry={retry} />;
  if (loading || !days) {
    return <SkeletonGroup label="Loading available dates" count={2} className="space-y-4" itemClassName="h-40 first:h-96" />;
  }
  if (days.length === 0) {
    return <p className="rounded-2xl bg-sand p-6 text-center">No sample times are open here. Please try another location.</p>;
  }

  return (
    <div className="space-y-6">
      <DatePicker dates={days.map((d) => d.date)} selected={draft.date} onSelect={selectDate} />
      <div aria-live="polite">
        {day ? (
          <fieldset key={day.date} className="animate-rise space-y-4">
            <legend className="mb-3 font-serif text-lg">Times on {formatLongDate(day.date)}</legend>
            {periods.map(({ id, label, icon: Icon }) => {
              const slots = day.slots.filter((slot) => slot.period === id);
              return (
                <div key={id} role="group" aria-label={label}>
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-muted">
                    <Icon className="size-4" aria-hidden />
                    {label}
                  </p>
                  {slots.length === 0 ? (
                    <p className="text-sm text-slate-muted">No {label.toLowerCase()} times on this date.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slots.map((slot) => (
                        <label
                          key={slot.time}
                          className="flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border border-sand-300 bg-white text-sm font-semibold transition hover:border-sage-500 has-checked:border-sage-600 has-checked:bg-sage-600 has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-sage-600"
                        >
                          <input
                            type="radio"
                            name="time"
                            value={slot.time}
                            checked={draft.time === slot.time}
                            onChange={() => selectTime(slot.time)}
                            className="sr-only"
                          />
                          {slot.time}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </fieldset>
        ) : (
          <p className="rounded-2xl bg-sand p-4 text-center text-sm text-slate-muted">Choose a date to see times.</p>
        )}
      </div>
    </div>
  );
}
