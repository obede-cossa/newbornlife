import { Heart, Lock } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, ButtonLink } from '../components/ui/Button';
import { Checkbox, TextArea, TextField } from '../components/ui/Field';
import { FocusHeading } from '../components/ui/FocusHeading';
import { StarRating } from '../components/ui/StarRating';
import { useApp } from '../context/AppContext';
import { useDocumentTitle, useFocusOnMount } from '../lib/hooks';

const COMMENT_LIMIT = 500;
const REF_PATTERN = /^NBL-\d{3,}$/;

const emptyForm = { rating: 0, wentWell: '', canImprove: '', followUpConsent: false, ownRef: '' };

export function FeedbackPage() {
  const { submitFeedback, notify } = useApp();
  const [params, setParams] = useSearchParams();
  const linkedRef = REF_PATTERN.test(params.get('ref') ?? '') ? params.get('ref')! : undefined;
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<{ rating?: string; ownRef?: string }>({});
  const [status, setStatus] = useState<'editing' | 'sending' | 'sent'>('editing');
  const heading = useFocusOnMount<HTMLHeadingElement>();
  useDocumentTitle('Visit feedback');

  const update = (patch: Partial<typeof emptyForm>) => setForm((f) => ({ ...f, ...patch }));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const ownRef = form.followUpConsent && !linkedRef ? form.ownRef.trim().toUpperCase() : '';
    const found = {
      rating: form.rating ? undefined : 'Please choose a star rating.',
      ownRef: ownRef && !REF_PATTERN.test(ownRef) ? 'A reference looks like NBL-001.' : undefined,
    };
    setErrors(found);
    if (found.rating || found.ownRef) return;

    setStatus('sending');
    try {
      await submitFeedback({
        rating: form.rating,
        wentWell: form.wentWell.trim(),
        canImprove: form.canImprove.trim(),
        followUpConsent: form.followUpConsent,
        bookingRef: linkedRef ?? (ownRef || undefined),
      });
      setStatus('sent');
      notify('Thank you, your feedback was sent');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (error) {
      notify(error instanceof Error ? error.message : 'We couldn’t send your feedback.', 'error');
      setStatus('editing');
    }
  };

  if (status === 'sent') {
    return (
      <div className="mx-auto max-w-lg animate-rise px-4 py-16 text-center">
        <Heart className="mx-auto size-14 fill-blush-100 text-blush-800" strokeWidth={1.5} aria-hidden />
        <FocusHeading className="mt-4 text-3xl">Thank you for sharing</FocusHeading>
        <p className="mt-3 text-slate-muted">Your feedback is private and helps the practice care better.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink to="/">Back to home</ButtonLink>
          <Button
            variant="secondary"
            onClick={() => {
              setForm(emptyForm);
              setParams({}, { replace: true });
              setStatus('editing');
            }}
          >
            Send another response
          </Button>
        </div>
        <ButtonLink to="/admin?tab=feedback" variant="ghost" className="mt-4">
          Demo: see it in the Practice View
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 ref={heading} tabIndex={-1} className="text-center text-3xl sm:text-4xl">
        How was your visit? Your feedback helps us improve.
      </h1>
      <p className="mt-3 text-center text-slate-muted">
        Takes under a minute. Only the star rating is required.
        {linkedRef && <span className="mt-1 block text-sm">About booking {linkedRef}</span>}
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5 rounded-3xl border border-sand-300 bg-sand p-5 sm:p-8">
        <StarRating
          value={form.rating}
          error={errors.rating}
          onChange={(rating) => {
            update({ rating });
            setErrors((e) => ({ ...e, rating: undefined }));
          }}
        />
        <TextArea
          label="What went well?"
          optional
          maxLength={COMMENT_LIMIT}
          value={form.wentWell}
          onChange={(e) => update({ wentWell: e.target.value })}
        />
        <TextArea
          label="What can improve?"
          optional
          maxLength={COMMENT_LIMIT}
          value={form.canImprove}
          onChange={(e) => update({ canImprove: e.target.value })}
          hint="Please leave out medical details."
        />
        <Checkbox
          checked={form.followUpConsent}
          onChange={(e) => update({ followUpConsent: e.target.checked })}
          label="The practice may contact me about my feedback"
        />
        {form.followUpConsent && !linkedRef && (
          <div className="animate-rise">
            <TextField
              label="Booking reference"
              optional
              placeholder="NBL-001"
              maxLength={12}
              value={form.ownRef}
              error={errors.ownRef}
              onChange={(e) => update({ ownRef: e.target.value })}
              hint="Without it, the practice won’t know who to contact."
            />
          </div>
        )}
        <p className="flex gap-2.5 text-sm leading-relaxed text-slate-muted">
          <Lock className="mt-0.5 size-4 shrink-0 text-sage-600" aria-hidden />
          Private by default. Feedback is visible only in the practice admin view.
        </p>
        <Button type="submit" busy={status === 'sending'} className="w-full">
          {status === 'sending' ? 'Sending…' : 'Send feedback'}
        </Button>
      </form>
    </div>
  );
}
