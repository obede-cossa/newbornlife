import { Baby, BookOpen, HeartHandshake, HeartPulse, Home, Sun, type LucideIcon } from 'lucide-react';
import type { ServiceId } from '../../types';

const icons: Record<ServiceId, LucideIcon> = {
  antenatal: HeartPulse,
  'labour-birth': HeartHandshake,
  postnatal: Home,
  phototherapy: Sun,
  education: BookOpen,
  'well-baby': Baby,
};

export function ServiceIcon({ id }: { id: ServiceId }) {
  const Icon = icons[id];
  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
      <Icon className="size-6" strokeWidth={1.75} aria-hidden />
    </span>
  );
}
