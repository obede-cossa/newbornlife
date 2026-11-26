import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const link = 'inline-flex min-h-[44px] items-center text-sm text-sage-100 underline-offset-4 hover:underline';

export function Footer() {
  const { catalog } = useApp();
  const practice = catalog?.practice;

  return (
    <footer className="mt-20 bg-sage-800 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg">New Born Life</p>
          <p className="mt-1 text-sm text-sage-100">{practice?.tagline}</p>
        </div>
        {practice && (
          <div className="text-sm text-sage-100">
            <p className="font-semibold text-white">Contact (placeholder)</p>
            <p className="mt-2">{practice.contact.phone}</p>
            <p>{practice.contact.email}</p>
            <p>{practice.contact.hours}</p>
          </div>
        )}
        <nav aria-label="Footer" className="flex flex-col items-start">
          <Link to="/services" className={link}>Care services</Link>
          <Link to="/book" className={link}>Book an appointment</Link>
          <Link to="/feedback" className={link}>Share visit feedback</Link>
        </nav>
      </div>
      <p className="border-t border-white/10 px-4 pt-4 pb-24 text-center text-xs text-sage-100">
        Concept prototype. Photography and portrait are illustrative. No clinical records or payments are handled.
      </p>
    </footer>
  );
}
