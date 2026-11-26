import { ArrowRight, MapPin, Quote, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MidwifePortrait } from '../components/home/MidwifePortrait';
import { TrustStrip } from '../components/home/TrustStrip';
import { ServiceGrid } from '../components/services/ServiceGrid';
import { ButtonLink } from '../components/ui/Button';
import { Photo } from '../components/ui/Photo';
import { Skeleton, SkeletonGroup } from '../components/ui/Skeleton';
import { useApp } from '../context/AppContext';
import { useDocumentTitle } from '../lib/hooks';

export function HomePage() {
  const { catalog } = useApp();
  const practice = catalog?.practice;
  useDocumentTitle('Care through every chapter');

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-12 sm:px-6 lg:grid-cols-2 lg:py-16">
        <div className="animate-rise">
          <p className="mb-4 text-sm font-semibold tracking-widest text-blush-800 uppercase">Midwifery &amp; maternity care</p>
          <h1 className="text-4xl leading-tight sm:text-5xl lg:text-6xl">Your journey, held with care.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-muted">
            Personalised midwifery support from pregnancy through birth and the early days at home.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/book" className="px-8 py-3.5 tracking-wide uppercase">
              Book an appointment
            </ButtonLink>
            <ButtonLink to="/services" variant="secondary" className="py-3.5">
              Explore care services
            </ButtonLink>
          </div>
          {catalog ? (
            <p className="mt-8 flex w-fit items-start gap-2 rounded-3xl bg-sand px-4 py-2.5 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sage-600" aria-hidden />
              <span>
                <span className="sr-only">Practice locations: </span>
                {catalog.locations.map((location) => location.name).join(' • ')}
              </span>
            </p>
          ) : (
            <Skeleton className="mt-8 h-10 w-full max-w-md" />
          )}
        </div>
        {practice ? (
          <Photo
            photo={practice.photos.hero}
            eager
            className="aspect-[4/3] rounded-t-[10rem] rounded-b-3xl shadow-soft lg:aspect-[5/6]"
          />
        ) : (
          <Skeleton className="aspect-[4/3] lg:aspect-[5/6]" />
        )}
      </section>

      {practice ? <TrustStrip pillars={practice.trustPillars} /> : <Skeleton className="h-28 rounded-none" />}

      <section id="about" aria-labelledby="about-title" className="bg-white py-16 lg:py-24">
        {practice ? (
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[2fr_3fr] lg:gap-16">
            <MidwifePortrait photo={practice.photos.midwife} />
            <div>
              <p className="text-sm font-semibold tracking-widest text-blush-800 uppercase">About your midwife</p>
              <h2 id="about-title" className="mt-3 text-3xl sm:text-4xl">
                {practice.midwife.name}
              </h2>
              <p className="mt-2 font-semibold text-sage-700">{practice.midwife.role}</p>
              {practice.midwife.bio.map((paragraph) => (
                <p key={paragraph} className="mt-4 leading-relaxed text-slate-muted">
                  {paragraph}
                </p>
              ))}
              <ul className="mt-6 flex flex-wrap gap-2">
                {practice.midwife.highlights.map((item) => (
                  <li key={item} className="rounded-full bg-sand px-3.5 py-2 text-xs font-semibold text-sage-700">
                    {item}
                  </li>
                ))}
              </ul>
              <figure className="mt-8 rounded-3xl border-l-4 border-blush bg-cream p-6 shadow-soft">
                <Quote className="size-6 text-blush" aria-hidden />
                <blockquote className="mt-2 font-serif text-xl leading-relaxed italic">
                  “{practice.midwife.quote}”
                </blockquote>
                <figcaption className="mt-3 text-sm text-slate-muted">{practice.midwife.name}</figcaption>
              </figure>
            </div>
          </div>
        ) : (
          <SkeletonGroup
            label="Loading practice information"
            count={2}
            className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2"
            itemClassName="h-80"
          />
        )}
      </section>

      <section aria-labelledby="services-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="services-title" className="text-3xl sm:text-4xl">Care for every chapter</h2>
            <p className="mt-2 text-slate-muted">Six ways we can walk alongside your family.</p>
          </div>
          <Link to="/services" className="flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sage-700">
            All services <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ServiceGrid />
      </section>

      {practice && (
        <section aria-labelledby="cta-title" className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid overflow-hidden rounded-3xl bg-sage-600 text-white md:grid-cols-2">
            <Photo photo={practice.photos.family} className="min-h-64" />
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <h2 id="cta-title" className="text-3xl">When you’re ready, we’re here</h2>
              <p className="mt-3 leading-relaxed text-sage-50">
                Request a time in four short steps. The practice will contact you to confirm.
              </p>
              <p className="mt-4 flex gap-2 text-sm text-sage-50">
                <ShieldCheck className="size-5 shrink-0" aria-hidden />
                Only your contact details are collected. No clinical records.
              </p>
              <ButtonLink to="/book" variant="secondary" className="mt-6 self-start">
                Request a visit
              </ButtonLink>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
