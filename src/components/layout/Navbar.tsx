import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cx } from '../../lib/cx';
import { ButtonLink } from '../ui/Button';
import { Logo } from './Logo';

const links = [
  { to: '/#about', label: 'About', isActive: (path: string, hash: string) => path === '/' && hash === '#about' },
  { to: '/services', label: 'Services', isActive: (path: string) => path.startsWith('/services') },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname, hash, key } = useLocation();

  useEffect(() => setOpen(false), [key]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const items = links.map((link) => {
    const active = link.isActive(pathname, hash);
    return (
      <Link
        key={link.to}
        to={link.to}
        aria-current={active ? 'page' : undefined}
        className={cx(
          'flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold transition hover:bg-sage-100',
          active ? 'bg-sage-100 text-sage-800' : 'text-charcoal',
        )}
      >
        {link.label}
      </Link>
    );
  });

  return (
    <header className="sticky top-0 z-40 border-b border-sand-300/70 bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6" aria-label="Main">
        <Logo />
        <div className="hidden items-center gap-1 md:flex">
          {items}
          <ButtonLink to="/book" className="ml-3">
            Book Now
          </ButtonLink>
        </div>
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-sage-100 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="animate-rise border-t border-sand-300/70 px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2">
            {items}
            <ButtonLink to="/book">Book Now</ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
