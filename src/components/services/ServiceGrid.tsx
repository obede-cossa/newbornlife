import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SkeletonGroup } from '../ui/Skeleton';
import { ServiceIcon } from './ServiceIcon';

const grid = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3';

export function ServiceGrid() {
  const { catalog } = useApp();

  if (!catalog) return <SkeletonGroup label="Loading services" count={6} className={grid} itemClassName="h-48" />;

  return (
    <ul className={grid}>
      {catalog.services.map((service) => (
        <li key={service.id} className="animate-rise">
          <Link
            to={`/services/${service.id}`}
            className="group flex h-full flex-col rounded-3xl border border-sand-300/70 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(44,48,46,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6B8E78]/40"
          >
            <div className="flex items-start justify-between gap-3">
              <ServiceIcon id={service.id} />
              <p className="flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-xs font-semibold text-slate-muted">
                <Clock className="size-3.5" aria-hidden />
                <span className="sr-only">Estimated duration: </span>~{service.durationMinutes} min
              </p>
            </div>
            <h3 className="mt-4 text-xl">{service.name}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-muted">{service.summary}</p>
            <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-sage-700">
              View details
              <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
