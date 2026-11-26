import { PhoneCall, PhoneOff } from 'lucide-react';
import { formatTimestamp } from '../../lib/format';
import type { Booking, Feedback } from '../../types';
import { Stars } from '../ui/StarRating';

export function FeedbackList({ feedback, bookings }: { feedback: Feedback[]; bookings: Booking[] }) {
  if (feedback.length === 0) return <p className="rounded-2xl bg-white p-8 text-center">No feedback yet.</p>;

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {feedback.map((entry) => {
        // A client is only named when they agreed to be contacted.
        const client = entry.followUpConsent ? bookings.find((b) => b.ref === entry.bookingRef) : undefined;
        return (
          <li key={entry.id} className="flex flex-col rounded-2xl border border-sand-300 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <Stars value={entry.rating} />
              <span className="text-xs text-slate-muted">
                {formatTimestamp(entry.createdAt)}
                {entry.bookingRef && ` · ${entry.bookingRef}`}
              </span>
            </div>
            <dl className="mt-3 flex-1 space-y-3 text-sm">
              {entry.wentWell && (
                <div>
                  <dt className="text-xs font-semibold text-slate-muted">What went well</dt>
                  <dd className="break-words">{entry.wentWell}</dd>
                </div>
              )}
              {entry.canImprove && (
                <div>
                  <dt className="text-xs font-semibold text-slate-muted">What can improve</dt>
                  <dd className="break-words">{entry.canImprove}</dd>
                </div>
              )}
            </dl>
            {!entry.wentWell && !entry.canImprove && <p className="text-sm text-slate-muted">Rating only, no comments.</p>}
            <p className="mt-4 flex items-center gap-2 border-t border-sand-300 pt-3 text-xs font-semibold">
              {entry.followUpConsent ? (
                <>
                  <PhoneCall className="size-4 text-sage-600" aria-hidden />
                  <span className="text-sage-800">
                    Follow-up consent: yes
                    {client ? ` (${client.fullName})` : entry.bookingRef ? '' : ' (no reference given)'}
                  </span>
                </>
              ) : (
                <>
                  <PhoneOff className="size-4 text-slate-muted" aria-hidden />
                  <span className="text-slate-muted">Follow-up consent: no</span>
                </>
              )}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
