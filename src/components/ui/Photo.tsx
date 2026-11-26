import { useState } from 'react';
import { cx } from '../../lib/cx';
import type { Photo as PhotoData } from '../../types';

/** Image with a soft gradient placeholder that remains if the photo cannot load (e.g. offline demo). */
export function Photo({ photo, className, eager }: { photo: PhotoData; className?: string; eager?: boolean }) {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  return (
    <div className={cx('relative overflow-hidden bg-gradient-to-br from-sand via-blush-100 to-sage-100', className)}>
      {state === 'failed' ? (
        <span role="img" aria-label={photo.alt} className="absolute inset-0" />
      ) : (
        <img
          src={photo.src}
          alt={photo.alt}
          loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setState('ready')}
          onError={() => setState('failed')}
          className={cx(
            'absolute inset-0 size-full object-cover transition-opacity duration-700',
            state === 'ready' ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  );
}
