import { Check, Clock, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { Service } from '../../types';
import { Button } from '../ui/Button';
import { ServiceIcon } from './ServiceIcon';

/** Native modal dialog: focus is trapped and Escape closes it. */
export function ServiceDialog({ service, onClose }: { service: Service; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const { selectService } = useApp();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  const book = () => {
    selectService(service.id);
    navigate('/book');
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="service-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="sheet m-auto mb-0 max-h-[90dvh] w-full max-w-full animate-rise overflow-y-auto rounded-t-3xl bg-white p-0 text-charcoal sm:mb-auto sm:max-w-lg sm:rounded-3xl"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <ServiceIcon id={service.id} />
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-full bg-sand hover:bg-sand-300"
            aria-label="Close details"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <h2 id="service-title" className="mt-4 text-2xl">
          {service.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-muted">
          <strong className="font-semibold text-charcoal">Ideal for: </strong>
          {service.idealFor}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-sage-700">
          <Clock className="size-4" aria-hidden />
          {service.duration} (sample estimate)
        </p>
        <p className="mt-4 leading-relaxed">{service.description}</p>
        <h3 className="mt-6 text-base">What’s included</h3>
        <ul className="mt-3 space-y-2.5">
          {service.includes.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#6B8E78]/15 text-[#5A7263]">
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 rounded-r-2xl border-l-4 border-[#D4A387] bg-[#FAF8F5] p-4 text-sm leading-relaxed">
          <strong>Good to know: </strong>
          {service.goodToKnow}
        </p>
        <Button className="mt-6 w-full" onClick={book}>
          Book this service
        </Button>
      </div>
    </dialog>
  );
}
