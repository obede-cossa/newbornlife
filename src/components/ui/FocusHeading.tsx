import type { ReactNode } from 'react';
import { useFocusOnMount } from '../../lib/hooks';

/** Page heading that takes focus once, for views that appear after loading or submitting. */
export function FocusHeading({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useFocusOnMount<HTMLHeadingElement>();
  return (
    <h1 ref={ref} tabIndex={-1} className={className}>
      {children}
    </h1>
  );
}
