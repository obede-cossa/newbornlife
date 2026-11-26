import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export function Logo() {
  const { catalog } = useApp();
  const name = catalog?.practice.name ?? 'New Born Life';

  return (
    <Link to="/" className="flex min-h-[44px] items-center gap-2.5 rounded-lg" aria-label={`${name}, home`}>
      <img src="/favicon.svg" alt="" className="size-9 shrink-0" />
      <span className="leading-tight">
        <span className="block font-serif text-sm font-semibold tracking-[0.14em] uppercase">{name}</span>
        <span className="block min-h-4 text-[11px] text-slate-muted">{catalog?.practice.tagline}</span>
      </span>
    </Link>
  );
}
