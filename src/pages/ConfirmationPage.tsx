import { Backpack, ChevronDown, CircleCheck, ListChecks, MessageSquareHeart, Phone } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AppointmentSummary } from '../components/booking/AppointmentSummary';
import { ButtonLink } from '../components/ui/Button';
import { FocusHeading } from '../components/ui/FocusHeading';
import { SkeletonGroup } from '../components/ui/Skeleton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useApp } from '../context/AppContext';
import { useDocumentTitle } from '../lib/hooks';
import type { NextStep } from '../types';

const stepIcons: Record<NextStep['id'], typeof Phone> = { bring: Backpack, prepare: ListChecks, contact: Phone };

export function ConfirmationPage() {
  const { ref } = useParams();
  const { state, key } = useLocation();
  const { catalog, bookings, loading, resetDraft } = useApp();
  const booking = bookings.find((b) => b.ref === ref);
  const justBooked = !!(state as { justBooked?: boolean } | null)?.justBooked;
  useDocumentTitle(`Booking ${ref}`);

  // Start the next booking from a clean slate.
  useEffect(() => {
    if (justBooked) resetDraft();
  }, [justBooked, key, resetDraft]);

  if (!catalog || (loading && !booking)) {
    return (
      <SkeletonGroup
        label="Loading your booking"
        count={3}
        className="mx-auto max-w-2xl space-y-4 px-4 py-10"
        itemClassName="h-40"
      />
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-3xl">We couldn’t find that booking</h1>
        <p className="mt-3 text-slate-muted">
          No request with reference <strong>{ref}</strong> is saved in this browser.
        </p>
        <ButtonLink to="/book" className="mt-6">Book an appointment</ButtonLink>
      </div>
    );
  }

  const { contact, urgentNote, nextSteps } = catalog.practice;

  return (
    <div className="mx-auto max-w-2xl animate-rise px-4 py-8 sm:px-6 sm:py-12">
      <div className="text-center">
        <CircleCheck className="mx-auto size-14 text-sage-600" strokeWidth={1.5} aria-hidden />
        <FocusHeading className="mt-4 text-3xl sm:text-4xl">Your request is with us</FocusHeading>
        <p className="mt-3 text-slate-muted">
          {booking.status === 'new'
            ? 'This is not yet a confirmed appointment. The practice will contact you.'
            : 'Here is the latest status of your appointment.'}
        </p>
        <p className="mt-5 inline-block rounded-2xl border border-dashed border-sage-500 bg-white px-6 py-3">
          <span className="block text-xs font-semibold tracking-widest text-slate-muted uppercase">Reference</span>
          <span className="block font-serif text-3xl text-sage-700">{booking.ref}</span>
        </p>
      </div>

      <section className="mt-8 rounded-3xl border border-sand-300 bg-white p-6 shadow-soft" aria-labelledby="summary-title">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id="summary-title" className="text-xl">Appointment summary</h2>
          <StatusBadge status={booking.status} audience="client" />
        </div>
        <AppointmentSummary
          catalog={catalog}
          serviceId={booking.serviceId}
          locationId={booking.locationId}
          date={booking.date}
          time={booking.time}
        />
      </section>

      <section className="mt-8" aria-labelledby="next-title">
        <h2 id="next-title" className="mb-4 text-xl">Helpful next steps</h2>
        <div className="space-y-3">
          {nextSteps.map((item, index) => {
            const Icon = stepIcons[item.id];
            return (
              <details key={item.id} className="group rounded-2xl bg-sand" open={index === 0}>
                <summary className="flex min-h-[56px] list-none items-center gap-3 rounded-2xl px-5 font-semibold [&::-webkit-details-marker]:hidden">
                  <Icon className="size-5 text-sage-600" aria-hidden />
                  <span className="flex-1">{item.title}</span>
                  <ChevronDown className="size-5 transition group-open:rotate-180" aria-hidden />
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed">
                  <ul className="list-disc space-y-1.5 pl-5">
                    {item.items.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  {item.id === 'contact' && (
                    <>
                      <p className="mt-3 font-semibold">
                        {contact.phone} · {contact.email}
                      </p>
                      <p className="text-slate-muted">{contact.hours} (placeholder contact details)</p>
                      <p className="mt-3 rounded-xl bg-blush-100 p-3 text-blush-800">{urgentNote}</p>
                    </>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink to="/" variant="secondary">Back to home</ButtonLink>
        <ButtonLink to={`/feedback?ref=${booking.ref}`}>
          <MessageSquareHeart className="size-4" aria-hidden />
          Leave Visit Feedback (Demo Shortcut)
        </ButtonLink>
      </div>
    </div>
  );
}
