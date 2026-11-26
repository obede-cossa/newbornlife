import { Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LoadError } from '../ui/LoadError';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function PublicLayout() {
  const { loadError, reload } = useApp();

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only z-50 rounded-full bg-sage-600 px-4 py-3 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1">
        {loadError ? (
          <div className="mx-auto max-w-lg px-4 py-16">
            <LoadError onRetry={reload} />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  );
}
