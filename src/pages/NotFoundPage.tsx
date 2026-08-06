import { Link } from 'react-router';
import { Home, Search, ShoppingBag, ArrowLeft } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { SEO } from '@/components/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="Sayfa Bulunamadı | Aquails"
        description="Aradığınız sayfa bulunamadı. Ana sayfa veya ürünlere dönebilirsiniz."
        canonical="/404"
      />
      <PageLayout>
        <div className="max-w-[560px] mx-auto px-4 py-20 text-center">
          <p className="text-6xl font-bold text-aqua-primary mb-2">404</p>
          <h1 className="text-2xl font-bold text-aqua-secondary mb-3">Sayfa bulunamadı</h1>
          <p className="text-sm text-aqua-text-muted mb-8">
            Bu bağlantı taşınmış veya hiç var olmamış olabilir. Aşağıdan devam edebilirsiniz.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-aqua-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-aqua-primary-dark transition-colors"
            >
              <Home className="w-4 h-4" /> Ana Sayfa
            </Link>
            <Link
              to="/urunler"
              className="inline-flex items-center gap-2 border border-aqua-border text-aqua-secondary px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-aqua-bg transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Ürünler
            </Link>
            <Link
              to="/arama"
              className="inline-flex items-center gap-2 border border-aqua-border text-aqua-secondary px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-aqua-bg transition-colors"
            >
              <Search className="w-4 h-4" /> Ara
            </Link>
          </div>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 mt-6 text-sm text-aqua-text-muted hover:text-aqua-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Geri dön
          </button>
        </div>
      </PageLayout>
    </>
  );
}
