import { Link } from 'react-router';
import { ArrowRight, Home } from 'lucide-react';
import { SEO } from '@/components/SEO';

/** Visible 404 for unknown SPA routes — never a blank screen. */
export default function NotFoundPage() {
  return (
    <>
      <SEO title="Sayfa Bulunamadı | Aquails" noindex />
      <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-aq-ink">
        <img
          src="/images/lifestyle/dusk-lake.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-aq-ink/75" />
        <div className="page-container py-20 text-center">
          <p className="font-script text-6xl leading-none text-aq-mist sm:text-7xl">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Sayfa bulunamadı</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
            Aradığınız adres taşınmış veya hiç var olmamış olabilir.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-aq-ink transition-colors hover:bg-aq-cloud"
            >
              <Home className="h-4 w-4" /> Ana Sayfa
            </Link>
            <Link
              to="/urunler"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-aq-mist px-6 py-3 text-sm font-semibold text-aq-ink transition-colors hover:bg-white"
            >
              Ürünleri İncele <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
