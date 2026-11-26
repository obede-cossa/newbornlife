import { useCallback, useEffect, useRef, useState } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | New Born Life`;
  }, [title]);
}

/** Moves focus to a page heading when it appears, so keyboard and screen reader users follow along. */
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return ref;
}

/**
 * For a bar fixed to the bottom of the screen: publishes its height as `--dock`, so page
 * padding, toasts and the demo switcher can stay clear of it.
 */
export function useDock<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const root = document.documentElement.style;
    const publish = () => root.setProperty('--dock', `${element.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.removeProperty('--dock');
    };
  }, []);
  return ref;
}

type AsyncState<T> = { data?: T; error?: string; loading: boolean };

/** Runs an async loader, ignoring stale responses when `loader` changes. */
export function useAsync<T>(loader: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ loading: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ loading: true });
    loader().then(
      (data) => active && setState({ data, loading: false }),
      (error: unknown) =>
        active && setState({ error: error instanceof Error ? error.message : 'Something went wrong.', loading: false }),
    );
    return () => {
      active = false;
    };
  }, [loader, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
