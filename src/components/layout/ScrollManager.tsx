import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/** Scrolls to the top on page changes, or to the #section once its content has rendered. */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const { catalog } = useApp();
  const previousPath = useRef(pathname);
  const ready = !!catalog;

  useEffect(() => {
    const changed = previousPath.current !== pathname;
    previousPath.current = pathname;
    // Opening or closing a service detail keeps the visitor's place in the directory.
    const withinServices = pathname.startsWith('/services');
    if (!hash && changed && !withinServices) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  useEffect(() => {
    if (hash && ready) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash, key, ready]);

  return null;
}
