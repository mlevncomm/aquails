import { useMemo } from 'react';
import { Link } from 'react-router';
import { X, ShoppingCart, Check, GitCompare, Loader2 } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { EmptyState } from '@/components/EmptyState';
import { SEO } from '@/components/SEO';
import { useCompareStore, COMPARE_MAX } from '@/stores/compareStore';
import { useCartStore } from '@/stores/cartStore';
import { useCatalog } from '@/hooks/useCatalog';
import { useToastStore } from '@/components/Toast';
import { ProductPrice } from '@/components/ProductPrice';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

function collectSpecRows(products: Product[]): { key: string; label: string }[] {
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const p of products) {
    for (const key of Object.keys(p.specifications || {})) {
      if (!seen.has(key)) {
        seen.add(key);
        keys.push(key);
      }
    }
  }
  return keys.map((key) => ({ key, label: key }));
}

export default function ComparePage() {
  const { ids, remove, clear } = useCompareStore();
  const { products, loading } = useCatalog();
  const { addItem, openDrawer } = useCartStore();
  const addToast = useToastStore((s) => s.add);

  const compareProducts = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
  }, [ids, products]);

  const orphanCount = ids.length - compareProducts.length;
  const specRows = useMemo(() => collectSpecRows(compareProducts), [compareProducts]);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      addToast('Bu ürün stokta yok.', 'error');
      return;
    }
    addItem(product);
    addToast(`${product.name} sepete eklendi`, 'success');
    openDrawer();
  };

  if (loading && ids.length > 0 && compareProducts.length === 0) {
    return (
      <PageLayout>
        <SEO title="Ürün Karşılaştırma" description="Aquails ürünlerini yan yana karşılaştırın." />
        <div className="page-container py-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-aq-blue" />
        </div>
      </PageLayout>
    );
  }

  if (compareProducts.length === 0) {
    return (
      <PageLayout>
        <SEO title="Ürün Karşılaştırma" description="Aquails ürünlerini yan yana karşılaştırın." />
        <div className="relative bg-gradient-to-br from-aq-ice via-white to-aq-sky/50 border-b border-aq-border/60">
          <div className="page-container py-10 md:py-12">
            <div className="flex items-center gap-2 text-[13px] text-aq-muted mb-2">
              <Link to="/" className="hover:text-aq-blue">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-aq-text">Karşılaştır</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-aq-text">Ürün Karşılaştırma</h1>
            <p className="text-sm text-aq-muted mt-1.5">
              En fazla {COMPARE_MAX} ürünü yan yana karşılaştırın.
            </p>
          </div>
        </div>
        <div className="page-container py-8">
          <EmptyState
            icon={<GitCompare className="w-8 h-8" />}
            title="Karşılaştırma Listeniz Boş"
            description={
              orphanCount > 0
                ? 'Listedeki ürünler artık katalogda yok. Yeni ürün eklemek için mağazaya gidin.'
                : 'Ürün kartındaki veya detay sayfasındaki karşılaştır ikonuna tıklayarak ekleyin. En fazla 4 ürün.'
            }
            action={{ label: 'Ürünleri Keşfet', href: '/urunler' }}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO
        title="Ürün Karşılaştırma"
        description={`${compareProducts.length} Aquails ürününü yan yana karşılaştırın.`}
      />
      <div className="relative bg-gradient-to-br from-aq-ice via-white to-aq-sky/50 border-b border-aq-border/60">
        <div className="page-container py-10 md:py-12">
          <div className="flex items-center gap-2 text-[13px] text-aq-muted mb-2">
            <Link to="/" className="hover:text-aq-blue">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-aq-text">Karşılaştır</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-aq-text">
                Ürün Karşılaştırma ({compareProducts.length}/{COMPARE_MAX})
              </h1>
              <p className="text-sm text-aq-muted mt-1.5">
                Özellikleri yan yana inceleyin, doğru cihazı seçin.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                clear();
                addToast('Karşılaştırma listesi temizlendi.', 'info');
              }}
              className="text-sm text-[#E85454] font-medium hover:underline"
            >
              Tümünü Temizle
            </button>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[640px] bg-white border border-aq-border/60 rounded-2xl overflow-hidden shadow-sm">
            <thead>
              <tr>
                <th className="text-left p-4 w-[160px] bg-aq-ice text-xs font-semibold text-aq-muted uppercase tracking-wide">
                  Özellik
                </th>
                {compareProducts.map((p) => {
                  const img = p.images?.[0] || '/images/products/placeholder.jpg';
                  return (
                    <th key={p.id} className="p-4 bg-aq-ice min-w-[200px]">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            remove(p.id);
                            addToast('Ürün listeden çıkarıldı.', 'info');
                          }}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-white border border-aq-border/60 rounded-full flex items-center justify-center text-[#E85454] hover:bg-red-50 z-10"
                          aria-label="Kaldır"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <Link to={`/urun/${p.slug}`} className="block group">
                          <div className="w-24 h-24 bg-white border border-aq-border/60 rounded-2xl flex items-center justify-center mx-auto mb-3 overflow-hidden">
                            <img
                              src={img}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg';
                              }}
                            />
                          </div>
                          <p className="text-sm font-semibold text-aq-text line-clamp-2 group-hover:text-aq-blue transition-colors">
                            {p.name}
                          </p>
                        </Link>
                        <div className="mt-2 flex justify-center">
                          <ProductPrice product={p} size="sm" />
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-aq-border/60">
                <td className="p-4 text-sm font-medium text-aq-muted">Kategori</td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 text-sm text-aq-text text-center">
                    {p.category || '-'}
                  </td>
                ))}
              </tr>
              {specRows.map(({ key, label }) => (
                <tr key={key} className="border-t border-aq-border/60">
                  <td className="p-4 text-sm font-medium text-aq-muted">{label}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 text-sm text-aq-text text-center">
                      {p.specifications?.[key] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-aq-border/60">
                <td className="p-4 text-sm font-medium text-aq-muted">Puan</td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 text-sm text-aq-text text-center font-semibold">
                    {p.rating > 0 ? `${p.rating} / 5` : '-'}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-aq-border/60">
                <td className="p-4 text-sm font-medium text-aq-muted">Stok</td>
                {compareProducts.map((p) => {
                  const inStock = p.stock > 0;
                  return (
                    <td key={p.id} className="p-4 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full',
                          inStock ? 'bg-aq-sky text-aq-blue' : 'bg-red-50 text-red-500',
                        )}
                      >
                        {inStock ? (
                          <>
                            <Check className="w-3 h-3" /> Stokta ({p.stock})
                          </>
                        ) : (
                          'Tükendi'
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>
              <tr className="border-t border-aq-border/60">
                <td className="p-4" />
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      disabled={p.stock <= 0}
                      aria-label="Sepete Ekle"
                      title="Sepete Ekle"
                      className={cn(
                        'mx-auto w-11 h-11 flex items-center justify-center rounded-full border transition-all active:scale-[0.96]',
                        p.stock > 0
                          ? 'border-aq-border/60 text-aq-deep hover:border-aq-blue hover:text-aq-blue hover:bg-aq-sky'
                          : 'border-aq-border/60 text-aq-muted bg-aq-ice cursor-not-allowed',
                      )}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        {compareProducts.length < COMPARE_MAX && (
          <p className="text-center text-sm text-aq-muted mt-6">
            Daha fazla ürün eklemek için{' '}
            <Link to="/urunler" className="text-aq-blue font-medium hover:underline">
              mağazaya
            </Link>{' '}
            gidin.
          </p>
        )}
      </div>
    </PageLayout>
  );
}
