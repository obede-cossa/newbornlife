import { Clock, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Catalog } from '../../types';
import { ChoiceCard } from '../ui/ChoiceCard';

export function ServiceStep({ catalog }: { catalog: Catalog }) {
  const { draft, selectService } = useApp();

  return (
    <fieldset className="grid gap-3">
      <legend className="sr-only">Care service</legend>
      {catalog.services.map((service) => (
        <ChoiceCard
          key={service.id}
          name="service"
          value={service.id}
          checked={draft.serviceId === service.id}
          onSelect={() => selectService(service.id)}
          title={service.name}
          meta={
            <>
              <Clock className="size-3.5" aria-hidden />
              {service.duration}
            </>
          }
        >
          {service.summary}
        </ChoiceCard>
      ))}
    </fieldset>
  );
}

export function LocationStep({ catalog }: { catalog: Catalog }) {
  const { draft, selectLocation } = useApp();

  return (
    <fieldset className="grid gap-3">
      <legend className="sr-only">Practice location</legend>
      {catalog.locations.map((location) => (
        <ChoiceCard
          key={location.id}
          name="location"
          value={location.id}
          checked={draft.locationId === location.id}
          onSelect={() => selectLocation(location.id)}
          title={location.name}
          meta={
            <>
              <MapPin className="size-3.5" aria-hidden />
              {location.setting}
            </>
          }
        >
          {location.context}
        </ChoiceCard>
      ))}
    </fieldset>
  );
}
