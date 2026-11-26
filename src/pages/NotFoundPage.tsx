import { ButtonLink } from '../components/ui/Button';
import { useDocumentTitle } from '../lib/hooks';

export function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-3xl">This page isn’t here</h1>
      <p className="mt-3 text-slate-muted">Let’s take you back somewhere familiar.</p>
      <ButtonLink to="/" className="mt-6">Back to home</ButtonLink>
    </div>
  );
}
