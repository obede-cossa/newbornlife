import { ArrowLeftRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Stakeholder-only control for hopping between the two prototype views.
 * Remove before any real launch. `--dock` lifts it above a bottom action bar.
 */
export function DemoSwitcher() {
  const { pathname } = useLocation();
  const admin = pathname.startsWith('/admin');
  const view = admin ? 'Practice Admin' : 'Patient View';
  const target = admin ? 'Patient View' : 'Practice Admin';
  // On phones the booking flow needs the room, so the visible label shortens there.
  const compact = pathname === '/book';

  return (
    <Link
      to={admin ? '/' : '/admin'}
      className="fixed right-4 bottom-[calc(var(--dock,0px)+1rem)] z-50 flex min-h-[44px] max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full border border-white/15 bg-charcoal/90 px-4 py-2 text-xs text-white shadow-lg backdrop-blur transition-colors hover:bg-charcoal"
    >
      <ArrowLeftRight className="size-4 shrink-0 text-sage-200" aria-hidden />
      <span className={compact ? 'sr-only sm:not-sr-only sm:flex sm:gap-2' : 'flex flex-col sm:flex-row sm:gap-2'}>
        <span className="text-sage-200">Demo Mode: {view}</span>{' '}
        <span className="hidden text-white/40 sm:inline">|</span>{' '}
        <span className="font-semibold">Switch to {target}</span>
      </span>
      {compact && (
        <span className="font-semibold sm:hidden" aria-hidden>
          Admin demo
        </span>
      )}
    </Link>
  );
}
