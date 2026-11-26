import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookingActionBar } from '../components/booking/BookingActionBar';
import { LocationStep, ServiceStep } from '../components/booking/ChoiceSteps';
import { DetailsStep } from '../components/booking/DetailsStep';
import { ProgressIndicator } from '../components/booking/ProgressIndicator';
import { ScheduleStep } from '../components/booking/ScheduleStep';
import { SkeletonGroup } from '../components/ui/Skeleton';
import { useApp } from '../context/AppContext';
import { cx } from '../lib/cx';
import { useDocumentTitle } from '../lib/hooks';
import { validateDetails } from '../lib/validation';

const STEPS = [
  { label: 'Care', title: 'Choose your care', intro: 'Which kind of support would you like?' },
  { label: 'Location', title: 'Choose a location', intro: 'Pick the setting that suits you best.' },
  { label: 'Time', title: 'Choose a date and time', intro: 'These are sample times. The practice confirms every request.' },
  { label: 'Details', title: 'Your details', intro: 'Just enough for the practice to get in touch.' },
];

export function BookingPage() {
  const { catalog, draft, submitBooking, clearSchedule, notify } = useApp();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);

  // The furthest step the visitor may open, given what has been chosen so far.
  const reachable = !draft.serviceId ? 1 : !draft.locationId ? 2 : !draft.date || !draft.time ? 3 : 4;
  const requested = Number(params.get('step') ?? 1) || 1;
  const step = Math.min(Math.max(Math.trunc(requested), 1), reachable);
  const { title, intro, label } = STEPS[step - 1];
  useDocumentTitle(`Book: ${label}`);

  // Keep the URL honest when someone deep-links past an unfinished step.
  useEffect(() => {
    if (requested !== step) setParams({ step: String(step) }, { replace: true });
  }, [requested, step, setParams]);

  const previousStep = useRef(step);
  const direction = useRef<'forward' | 'back'>('forward');
  if (previousStep.current !== step) {
    direction.current = step > previousStep.current ? 'forward' : 'back';
    previousStep.current = step;
  }

  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    heading.current?.focus({ preventScroll: true });
  }, [step]);

  const goTo = (next: number) => setParams({ step: String(next) });
  const errors = attempted ? validateDetails(draft.details) : {};
  const canContinue = step < reachable;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (step < 4) {
      if (canContinue) goTo(step + 1);
      return;
    }
    const found = validateDetails(draft.details);
    const firstInvalid = Object.keys(found)[0];
    setAttempted(true);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const booking = await submitBooking();
      notify(`Request ${booking.ref} sent`);
      navigate(`/book/confirmation/${booking.ref}`, { replace: true, state: { justBooked: true } });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'We couldn’t send your request.';
      notify(message, 'error');
      setSubmitting(false);
      if (message.includes('no longer available')) {
        clearSchedule();
        goTo(3);
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <ProgressIndicator
        steps={STEPS.map((s) => s.label)}
        current={step}
        reachable={reachable}
        disabled={submitting}
        onSelect={goTo}
      />

      <form onSubmit={onSubmit} noValidate className="mt-6">
        <div key={step} className={cx(direction.current === 'forward' ? 'animate-enter' : 'animate-back')}>
          <h1 ref={heading} tabIndex={-1} className="text-3xl sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 mb-6 text-slate-muted">{intro}</p>

          {!catalog ? (
            <SkeletonGroup label="Loading booking options" count={4} className="space-y-3" itemClassName="h-28" />
          ) : step === 1 ? (
            <ServiceStep catalog={catalog} />
          ) : step === 2 ? (
            <LocationStep catalog={catalog} />
          ) : step === 3 && draft.locationId ? (
            <ScheduleStep key={draft.locationId} locationId={draft.locationId} />
          ) : (
            <DetailsStep catalog={catalog} errors={errors} />
          )}
        </div>

        <BookingActionBar
          catalog={catalog}
          draft={draft}
          step={step}
          canContinue={canContinue}
          submitting={submitting}
          onBack={() => goTo(step - 1)}
        />
      </form>

      {catalog && <p className="mt-6 pb-14 text-xs leading-relaxed text-slate-muted">{catalog.practice.urgentNote}</p>}
    </div>
  );
}
