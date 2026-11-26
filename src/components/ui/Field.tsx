import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../lib/cx';

const control =
  'w-full rounded-xl border bg-white px-4 py-3 text-base text-charcoal placeholder:text-slate-muted/70 transition focus:border-sage-600';

interface CommonProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
}

function Wrapper({ id, label, hint, error, optional, children }: CommonProps & { id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {optional && <span className="font-normal text-slate-muted"> (optional)</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, hint?: ReactNode, error?: string) =>
  cx(!!hint && `${id}-hint`, !!error && `${id}-error`) || undefined;

export function TextField({ label, hint, error, optional, ...props }: CommonProps & InputHTMLAttributes<HTMLInputElement>) {
  const generated = useId();
  const id = props.id ?? generated;
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        {...props}
        id={id}
        required={!optional}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, hint, error)}
        className={cx(control, 'min-h-[48px]', error ? 'border-danger' : 'border-sand-300')}
      />
    </Wrapper>
  );
}

export function TextArea({ label, hint, error, optional, ...props }: CommonProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generated = useId();
  const id = props.id ?? generated;
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        rows={3}
        {...props}
        id={id}
        required={!optional}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, hint, error)}
        className={cx(control, 'resize-y', error ? 'border-danger' : 'border-sand-300')}
      />
    </Wrapper>
  );
}

export function Checkbox({
  label,
  error,
  ...props
}: { label: ReactNode; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const generated = useId();
  const id = props.id ?? generated;
  return (
    <div>
      <label
        className={cx(
          'flex min-h-[44px] cursor-pointer items-start gap-3 rounded-2xl border bg-white p-4 text-sm leading-relaxed',
          error ? 'border-danger' : 'border-sand-300',
        )}
      >
        <input
          {...props}
          id={id}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 accent-sage-600"
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
