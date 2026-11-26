import { Award, MapPin, ShieldCheck, type LucideIcon } from 'lucide-react';
import type { TrustPillar } from '../../types';

const icons: Record<TrustPillar['id'], LucideIcon> = {
  experience: Award,
  locations: MapPin,
  privacy: ShieldCheck,
};

export function TrustStrip({ pillars }: { pillars: TrustPillar[] }) {
  return (
    <section aria-label="Practice highlights" className="border-y border-sand-300/70 bg-sand">
      <ul className="mx-auto grid max-w-6xl gap-5 px-4 py-6 sm:px-6 md:grid-cols-3 md:gap-8 md:py-8">
        {pillars.map(({ id, title, detail }) => {
          const Icon = icons[id];
          return (
            <li key={id} className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-sage-600">
                <Icon className="size-6" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <p className="font-serif text-lg leading-snug">{title}</p>
                <p className="text-sm leading-snug text-slate-muted">{detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
