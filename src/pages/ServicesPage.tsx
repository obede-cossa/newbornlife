import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ServiceDialog } from '../components/services/ServiceDialog';
import { ServiceGrid } from '../components/services/ServiceGrid';
import { Photo } from '../components/ui/Photo';
import { useApp } from '../context/AppContext';
import { useDocumentTitle, useFocusOnMount } from '../lib/hooks';

export function ServicesPage() {
  const { serviceId } = useParams();
  const { catalog } = useApp();
  const navigate = useNavigate();
  const heading = useFocusOnMount<HTMLHeadingElement>();
  const selected = catalog?.services.find((service) => service.id === serviceId);
  useDocumentTitle(selected?.name ?? 'Care services');

  if (catalog && serviceId && !selected) return <Navigate to="/services" replace />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-10 grid items-center gap-6 md:grid-cols-[3fr_2fr]">
        <div>
          <h1 ref={heading} tabIndex={-1} className="text-4xl sm:text-5xl">Care services</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-muted">
            Choose a service to read more. You can book straight from its details.
          </p>
        </div>
        {catalog && <Photo photo={catalog.practice.photos.room} eager className="hidden h-52 rounded-3xl md:block" />}
      </div>
      <h2 className="sr-only">All services</h2>
      <ServiceGrid />
      {catalog && (
        <p className="mt-8 rounded-2xl bg-blush-100 p-4 text-sm leading-relaxed text-blush-800">
          {catalog.practice.urgentNote}
        </p>
      )}
      {selected && (
        <ServiceDialog key={selected.id} service={selected} onClose={() => navigate('/services', { replace: true })} />
      )}
    </div>
  );
}
