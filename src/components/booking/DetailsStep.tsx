import { useApp } from '../../context/AppContext';
import { NOTE_LIMIT, type DetailsErrors } from '../../lib/validation';
import type { Catalog } from '../../types';
import { Checkbox, TextArea, TextField } from '../ui/Field';
import { AppointmentSummary } from './AppointmentSummary';

export function DetailsStep({ catalog, errors }: { catalog: Catalog; errors: DetailsErrors }) {
  const { draft, updateDetails } = useApp();
  const { serviceId, locationId, date, time, details } = draft;

  return (
    <div className="space-y-6">
      {serviceId && locationId && date && time && (
        <section className="rounded-3xl bg-sand p-5" aria-label="Your chosen appointment">
          <AppointmentSummary catalog={catalog} serviceId={serviceId} locationId={locationId} date={date} time={time} />
        </section>
      )}
      <div className="space-y-4">
        <TextField
          id="fullName"
          label="Full name"
          autoComplete="name"
          maxLength={80}
          value={details.fullName}
          error={errors.fullName}
          onChange={(e) => updateDetails({ fullName: e.target.value })}
        />
        <TextField
          id="phone"
          label="Phone / WhatsApp"
          type="tel"
          autoComplete="tel"
          maxLength={20}
          value={details.phone}
          error={errors.phone}
          onChange={(e) => updateDetails({ phone: e.target.value })}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          maxLength={120}
          value={details.email}
          error={errors.email}
          onChange={(e) => updateDetails({ email: e.target.value })}
        />
        <TextArea
          id="note"
          label="Short note"
          optional
          maxLength={NOTE_LIMIT}
          value={details.note}
          onChange={(e) => updateDetails({ note: e.target.value })}
          hint={`Please don’t include medical details. ${details.note.length}/${NOTE_LIMIT}`}
        />
        <Checkbox
          id="consent"
          required
          checked={details.consent}
          error={errors.consent}
          onChange={(e) => updateDetails({ consent: e.target.checked })}
          label={catalog.practice.consentText}
        />
      </div>
    </div>
  );
}
