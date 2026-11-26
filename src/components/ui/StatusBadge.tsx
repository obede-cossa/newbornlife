import { cx } from '../../lib/cx';
import type { BookingStatus } from '../../types';

const styles: Record<BookingStatus, string> = {
  new: 'bg-blush-100 text-blush-800',
  confirmed: 'bg-sage-100 text-sage-800',
  completed: 'bg-sand text-slate-muted',
};

/** The practice calls a fresh request "New"; the client sees it as "Requested". */
const labels = {
  practice: { new: 'New', confirmed: 'Confirmed', completed: 'Completed' },
  client: { new: 'Requested', confirmed: 'Confirmed', completed: 'Completed' },
} satisfies Record<string, Record<BookingStatus, string>>;

export function StatusBadge({ status, audience = 'practice' }: { status: BookingStatus; audience?: keyof typeof labels }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold', styles[status])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {labels[audience][status]}
    </span>
  );
}
