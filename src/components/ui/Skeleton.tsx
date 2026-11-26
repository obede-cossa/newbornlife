import { cx } from '../../lib/cx';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('animate-pulse rounded-2xl bg-sand-300/60', className)} aria-hidden />;
}

export function SkeletonGroup({
  label,
  count,
  className,
  itemClassName,
}: {
  label: string;
  count: number;
  className?: string;
  itemClassName: string;
}) {
  return (
    <div className={className} role="status">
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={itemClassName} />
      ))}
    </div>
  );
}
