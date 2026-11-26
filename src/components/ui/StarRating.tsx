import { Star } from 'lucide-react';
import { useState } from 'react';
import { cx } from '../../lib/cx';

const LABELS = ['Very poor', 'Poor', 'Okay', 'Good', 'Excellent'];

export function StarRating({
  value,
  onChange,
  error,
}: {
  value: number;
  onChange: (rating: number) => void;
  error?: string;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <fieldset aria-describedby={error ? 'rating-error' : undefined}>
      <legend className="mb-2 w-full text-center text-sm font-semibold">Your rating</legend>
      <div className="flex justify-center gap-1" onMouseLeave={() => setHover(0)}>
        {LABELS.map((label, index) => {
          const rating = index + 1;
          return (
            <label
              key={rating}
              onMouseEnter={() => setHover(rating)}
              className="flex size-12 cursor-pointer items-center justify-center rounded-full transition hover:scale-110 has-focus-visible:outline-3 has-focus-visible:outline-sage-600 sm:size-14"
            >
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={value === rating}
                onChange={() => onChange(rating)}
                className="sr-only"
              />
              <Star
                className={cx(
                  'size-9 transition-colors sm:size-10',
                  rating <= shown ? 'fill-blush text-blush-800' : 'fill-transparent text-slate-muted',
                )}
                strokeWidth={1.5}
                aria-hidden
              />
              <span className="sr-only">
                {rating} out of 5: {label}
              </span>
            </label>
          );
        })}
      </div>
      <p className="mt-2 min-h-5 text-center text-sm text-slate-muted" aria-hidden>
        {shown ? LABELS[shown - 1] : 'Tap a star'}
      </p>
      {error && (
        <p id="rating-error" className="mt-1 text-center text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cx('size-4', n <= value ? 'fill-blush text-blush-800' : 'text-sand-300')}
          aria-hidden
        />
      ))}
    </span>
  );
}
