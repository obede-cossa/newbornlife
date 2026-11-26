import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useDock } from '../../lib/hooks';
import { formatShortDate } from '../../lib/format';
import type { BookingDraft, Catalog } from '../../types';
import { Button, ButtonLink } from '../ui/Button';

const prompts = [
  'Choose a service to continue',
  'Choose a location to continue',
  'Choose a date and time to continue',
];

/** Always-visible summary and primary action. Must be rendered inside the booking form. */
export function BookingActionBar({
  catalog,
  draft,
  step,
  canContinue,
  submitting,
  onBack,
}: {
  catalog?: Catalog | null;
  draft: BookingDraft;
  step: number;
  canContinue: boolean;
  submitting: boolean;
  onBack: () => void;
}) {
  const dock = useDock<HTMLDivElement>();
  const service = catalog?.services.find((s) => s.id === draft.serviceId);
  const location = catalog?.locations.find((l) => l.id === draft.locationId);
  const when = draft.date && draft.time ? `${formatShortDate(draft.date)} at ${draft.time}` : undefined;
  const details = [location?.shortName, when].filter(Boolean).join(' • ');
  const hint = step < 4 && !canContinue ? prompts[step - 1] : undefined;

  return (
    <div
      ref={dock}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-300 bg-white/95 shadow-[0_-4px_20px_-4px_rgba(44,48,46,0.1)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:gap-4 sm:px-6">
        <div className="min-w-0 flex-1" aria-live="polite">
          <p className="text-sm font-semibold">
            {service ? `Selected: ${service.name} (${service.durationMinutes} min)` : 'Nothing selected yet'}
          </p>
          {(hint || details) && <p className="text-xs text-slate-muted">{hint ?? details}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {step > 1 ? (
            <Button variant="ghost" onClick={onBack} disabled={submitting} className="px-4">
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </Button>
          ) : (
            <ButtonLink variant="ghost" to="/" className="px-4">
              <ArrowLeft className="size-4" aria-hidden />
              Home
            </ButtonLink>
          )}
          {/* Distinct keys stop a click on "Continue" from submitting the final step. */}
          {step < 4 ? (
            <Button key="continue" type="submit" disabled={!catalog || !canContinue} className="flex-1 sm:flex-none">
              Continue
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button key="confirm" type="submit" busy={submitting} disabled={!catalog} className="flex-1 sm:flex-none">
              {submitting ? 'Sending…' : 'Confirm request'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
