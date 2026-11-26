import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookingList } from '../components/admin/BookingList';
import { FeedbackList } from '../components/admin/FeedbackList';
import { Logo } from '../components/layout/Logo';
import { Button, ButtonLink } from '../components/ui/Button';
import { LoadError } from '../components/ui/LoadError';
import { SkeletonGroup } from '../components/ui/Skeleton';
import { useApp } from '../context/AppContext';
import { cx } from '../lib/cx';
import { useDocumentTitle, useFocusOnMount } from '../lib/hooks';

const TABS = [
  { id: 'bookings', label: 'Booking requests' },
  { id: 'feedback', label: 'Customer feedback' },
] as const;

const newestFirst = <T extends { createdAt: string }>(list: T[]) =>
  [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export function AdminPage() {
  const { catalog, bookings, feedback, loading, loadError, reload, resetDemo, notify } = useApp();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'feedback' ? 'feedback' : 'bookings';
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const heading = useFocusOnMount<HTMLHeadingElement>();
  useDocumentTitle('Practice View');

  const average = feedback.length
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : '–';
  const stats = [
    { label: 'New requests', value: bookings.filter((b) => b.status === 'new').length },
    { label: 'Confirmed', value: bookings.filter((b) => b.status === 'confirmed').length },
    { label: 'Average rating', value: average },
  ];

  const selectTab = (id: string) => setParams(id === 'bookings' ? {} : { tab: id }, { replace: true });

  const onTabKey = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const other = tab === 'bookings' ? 'feedback' : 'bookings';
    selectTab(other);
    document.getElementById(`tab-${other}`)?.focus();
  };

  const reset = async () => {
    setResetting(true);
    try {
      await resetDemo();
      notify('Demo data restored', 'info');
    } catch {
      notify('Could not reset the demo data.', 'error');
    } finally {
      setResetting(false);
      setConfirmingReset(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-sand-300 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Logo />
          <ButtonLink to="/" variant="secondary" className="px-4">
            <ArrowLeft className="size-4" aria-hidden />
            Back to site
          </ButtonLink>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <h1 ref={heading} tabIndex={-1} className="text-3xl">Practice View</h1>
        <p className="mt-1 text-slate-muted">For Sister Sally. Demo access, with no sign-in.</p>

        {loadError ? (
          <div className="mt-8">
            <LoadError onRetry={reload} />
          </div>
        ) : !catalog || loading ? (
          <SkeletonGroup label="Loading practice records" count={4} className="mt-6 space-y-3" itemClassName="h-24" />
        ) : (
          <>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse justify-end rounded-2xl bg-sand p-4">
                  <dt className="text-xs text-slate-muted sm:text-sm">{stat.label}</dt>
                  <dd className="font-serif text-3xl text-sage-700">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <div role="tablist" aria-label="Practice records" className="mt-8 grid grid-cols-2 gap-1 rounded-full bg-sand p-1 sm:inline-grid">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  id={`tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  aria-controls="tab-panel"
                  tabIndex={tab === item.id ? 0 : -1}
                  onClick={() => selectTab(item.id)}
                  onKeyDown={onTabKey}
                  className={cx(
                    'min-h-[44px] rounded-full px-3 text-sm font-semibold transition sm:px-6',
                    tab === item.id ? 'bg-white text-sage-800 shadow-soft' : 'text-slate-muted hover:text-charcoal',
                  )}
                >
                  {item.label} ({item.id === 'bookings' ? bookings.length : feedback.length})
                </button>
              ))}
            </div>

            <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} key={tab} className="mt-5 animate-rise">
              {tab === 'bookings' ? (
                <BookingList catalog={catalog} bookings={newestFirst(bookings)} />
              ) : (
                <FeedbackList feedback={newestFirst(feedback)} bookings={bookings} />
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-end gap-2">
              {confirmingReset ? (
                <>
                  <p className="text-sm">Replace all demo records with the original samples?</p>
                  <Button variant="ghost" onClick={() => setConfirmingReset(false)} disabled={resetting}>
                    Cancel
                  </Button>
                  <Button onClick={reset} busy={resetting}>Yes, reset</Button>
                </>
              ) : (
                <Button variant="ghost" onClick={() => setConfirmingReset(true)}>
                  <RotateCcw className="size-4" aria-hidden />
                  Reset demo data
                </Button>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-sand-300 bg-blush-100 px-4 pt-4 pb-24 text-center text-sm font-medium text-blush-800">
        Prototype only: no clinical records, payments or full scheduling engine.
      </footer>
    </div>
  );
}
