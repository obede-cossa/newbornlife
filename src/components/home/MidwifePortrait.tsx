import { Info } from 'lucide-react';
import type { Photo as PhotoData } from '../../types';
import { Photo } from '../ui/Photo';

/** Stock stand-in, not Sister Sally. Replace with an approved photo before launch. */
export function MidwifePortrait({ photo }: { photo: PhotoData }) {
  return (
    <figure className="mx-auto w-full max-w-sm">
      <Photo photo={photo} className="aspect-[4/5] rounded-t-[10rem] rounded-b-3xl shadow-soft" />
      <figcaption className="mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-xs text-slate-muted">
        <Info className="size-3.5 shrink-0" aria-hidden />
        Illustrative concept image for this prototype
      </figcaption>
    </figure>
  );
}
