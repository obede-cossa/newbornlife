import { Button } from './Button';

export function LoadError({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl bg-blush-100 p-6 text-center" role="alert">
      <p className="mb-4 text-sm text-blush-800">{message ?? 'We couldn’t load this just now.'}</p>
      <Button variant="secondary" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
