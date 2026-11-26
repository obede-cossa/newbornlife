import { Check, CircleCheckBig } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatShortDate } from '../../lib/format';
import type { Booking, BookingStatus, Catalog } from '../../types';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';

function useRowDetails(catalog: Catalog, booking: Booking) {
  return {
    service: catalog.services.find((s) => s.id === booking.serviceId)?.name,
    location: catalog.locations.find((l) => l.id === booking.locationId)?.shortName,
    when: `${formatShortDate(booking.date)}, ${booking.time}`,
  };
}

function StatusAction({ booking }: { booking: Booking }) {
  const { setBookingStatus, notify } = useApp();
  const [busy, setBusy] = useState(false);

  if (booking.status === 'completed') return <span className="text-sm text-slate-muted">No action needed</span>;

  const next: BookingStatus = booking.status === 'new' ? 'confirmed' : 'completed';
  const label = next === 'confirmed' ? 'Confirm' : 'Mark completed';
  const Icon = next === 'confirmed' ? Check : CircleCheckBig;

  const apply = async () => {
    setBusy(true);
    try {
      await setBookingStatus(booking.ref, next);
      notify(`${booking.ref} marked ${next}`);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Update failed.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant={next === 'confirmed' ? 'primary' : 'secondary'}
      busy={busy}
      onClick={apply}
      className="px-5 whitespace-nowrap"
      aria-label={`${label} booking ${booking.ref} for ${booking.fullName}`}
    >
      {!busy && <Icon className="size-4" aria-hidden />}
      {label}
    </Button>
  );
}

function ContactDisclosure({ booking }: { booking: Booking }) {
  return (
    <details className="text-sm">
      <summary className="flex min-h-[44px] w-fit items-center rounded text-xs font-semibold text-sage-700">
        Contact details
      </summary>
      <div className="space-y-1 pb-2 break-all text-slate-muted">
        <p>{booking.phone}</p>
        <p>{booking.email}</p>
        {booking.note && <p className="break-words">Note: {booking.note}</p>}
      </div>
    </details>
  );
}

function BookingCard({ catalog, booking }: { catalog: Catalog; booking: Booking }) {
  const { service, location, when } = useRowDetails(catalog, booking);
  return (
    <li className="rounded-2xl border border-sand-300 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-lg">{booking.fullName}</p>
          <p className="text-xs font-semibold text-slate-muted">{booking.ref}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <p className="mt-3 text-sm">{service}</p>
      <p className="text-sm text-slate-muted">
        {location} · {when}
      </p>
      <ContactDisclosure booking={booking} />
      <div className="mt-1 [&>button]:w-full">
        <StatusAction booking={booking} />
      </div>
    </li>
  );
}

function BookingRow({ catalog, booking }: { catalog: Catalog; booking: Booking }) {
  const { service, location, when } = useRowDetails(catalog, booking);
  return (
    <tr className="border-t border-sand-300 align-top [&>td]:px-4 [&>td]:py-3">
      <td>
        <p className="pt-2 font-semibold">{booking.fullName}</p>
        <ContactDisclosure booking={booking} />
      </td>
      <td><p className="pt-2">{service}</p></td>
      <td><p className="pt-2">{location}</p></td>
      <td><p className="pt-2 whitespace-nowrap">{when}</p></td>
      <td><p className="pt-2 whitespace-nowrap text-slate-muted">{booking.ref}</p></td>
      <td><div className="pt-2"><StatusBadge status={booking.status} /></div></td>
      <td><StatusAction booking={booking} /></td>
    </tr>
  );
}

export function BookingList({ catalog, bookings }: { catalog: Catalog; bookings: Booking[] }) {
  if (bookings.length === 0) return <p className="rounded-2xl bg-white p-8 text-center">No booking requests yet.</p>;

  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2 xl:hidden">
        {bookings.map((booking) => (
          <BookingCard key={booking.ref} catalog={catalog} booking={booking} />
        ))}
      </ul>
      <div className="hidden overflow-x-auto rounded-2xl border border-sand-300 bg-white xl:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Booking requests, newest first</caption>
          <thead className="bg-sand text-xs tracking-wide text-slate-muted uppercase">
            <tr>
              {['Client name', 'Service', 'Location', 'Date', 'Reference', 'Status', 'Action'].map((heading) => (
                <th key={heading} scope="col" className="px-4 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <BookingRow key={booking.ref} catalog={catalog} booking={booking} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
