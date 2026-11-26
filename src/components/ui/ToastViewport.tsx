import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const icons = { success: CircleCheck, error: CircleAlert, info: Info };

export function ToastViewport() {
  const { toasts, dismissToast } = useApp();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--dock,0px)+4.5rem)] z-50 flex flex-col items-center gap-2 px-4 sm:items-end"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.tone];
        return (
          <div
            key={toast.id}
            role={toast.tone === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex w-full max-w-sm animate-rise items-center gap-3 rounded-2xl bg-charcoal py-2 pr-2 pl-4 text-sm text-white shadow-lg"
          >
            <Icon className={toast.tone === 'error' ? 'size-5 shrink-0 text-blush' : 'size-5 shrink-0 text-sage-200'} aria-hidden />
            <p className="flex-1 py-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Dismiss notification"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
