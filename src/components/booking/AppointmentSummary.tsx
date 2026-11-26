import { CalendarDays, HeartHandshake, MapPin } from 'lucide-react';
import { formatLongDate } from '../../lib/format';
import type { Catalog, LocationId, ServiceId } from '../../types';

export function AppointmentSummary({
  catalog,
  serviceId,
  locationId,
  date,
  time,
}: {
  catalog: Catalog;
  serviceId: ServiceId;
  locationId: LocationId;
  date: string;
  time: string;
}) {
  const rows = [
    { label: 'Service', icon: HeartHandshake, value: catalog.services.find((s) => s.id === serviceId)?.name },
    { label: 'Location', icon: MapPin, value: catalog.locations.find((l) => l.id === locationId)?.name },
    { label: 'Date & time', icon: CalendarDays, value: `${formatLongDate(date)} at ${time}` },
  ];

  return (
    <dl className="space-y-4">
      {rows.map(({ label, icon: Icon, value }) => (
        <div key={label} className="flex gap-3">
          <Icon className="mt-0.5 size-5 shrink-0 text-sage-600" aria-hidden />
          <div>
            <dt className="text-xs font-semibold tracking-wide text-slate-muted uppercase">{label}</dt>
            <dd className="mt-0.5 font-medium">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
