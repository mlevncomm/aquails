import { Link } from 'react-router';
import { Home, Search } from 'lucide-react';

/** Visible 404 for unknown SPA routes — never a blank screen. */
export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-sm font-semibold text-aq-blue tracking-wide">404</p>
        <h1 className="mt-2 text-2xl font-bold text-aq-text">Sayfa bulunamadı</h1>
        <p className="mt-2 text-sm text-aq-muted">
          Aradığınız adres taşınmış veya hiç var olmamış olabilir.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-aq-blue px-4 py-2.5 text-sm font-medium text-white"
          >
            <Home className="w-4 h-4" /> Ana Sayfa
          </Link>
          <Link
            to="/urunler"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-aq-border px-4 py-2.5 text-sm font-medium text-aq-text"
          >
            <Search className="w-4 h-4" /> Ürünleri İncele
          </Link>
        </div>
      </div>
    </div>
  );
}
