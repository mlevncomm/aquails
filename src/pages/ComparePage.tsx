import { Link } from 'react-router';
import { X, ShoppingCart, Check, GitCompare } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { EmptyState } from '@/components/EmptyState';
import { useCompareStore } from '@/stores/compareStore';
import { useCartStore } from '@/stores/cartStore';
import { products } from '@/data';
import { useToastStore } from '@/components/Toast';
import { ProductPrice } from '@/components/ProductPrice';

const specLabels: Record<string, string> = {
  asama: 'Aşama Sayısı',
  filtreOmru: 'Filtre Ömrü',
  tankKapasite: 'Tank Kapasitesi',
  pompa: 'Pompa',
  mineral: 'Mineral Filtre',
  kurulum: 'Kurulum Dahil',
  garanti: 'Garanti',
  debi: 'Günlük Debi',
};

const specDefaults: Record<string, Record<string, string>> = {
  '1': { asama: '7 Aşama', filtreOmru: '6-12 Ay', tankKapasite: '12 Litre', pompa: 'Var', mineral: 'Var', kurulum: 'Dahil', garanti: '5 Yıl', debi: '189 L/Gün' },
  '2': { asama: '5 Aşama', filtreOmru: '6-12 Ay', tankKapasite: '8 Litre', pompa: 'Var', mineral: 'Var', kurulum: 'Dahil', garanti: '5 Yıl', debi: '150 L/Gün' },
  '3': { asama: '4 Aşama', filtreOmru: '3-6 Ay', tankKapasite: '-', pompa: 'Yok', mineral: 'Yok', kurulum: '-', garanti: '2 Yıl', debi: '100 L/Gün' },
  '4': { asama: '6 Aşama', filtreOmru: '6-12 Ay', tankKapasite: '15 Litre', pompa: 'Var', mineral: 'Var', kurulum: 'Dahil', garanti: '5 Yıl', debi: '250 L/Gün' },
  '5': { asama: '5 Aşama', filtreOmru: '6-12 Ay', tankKapasite: '10 Litre', pompa: 'Var', mineral: 'Var', kurulum: 'Dahil', garanti: '5 Yıl', debi: '200 L/Gün' },
  '6': { asama: '7 Aşama', filtreOmru: '3-6 Ay', tankKapasite: '-', pompa: 'Yok', mineral: 'Var', kurulum: '-', garanti: '2 Yıl', debi: '80 L/Gün' },
};

export default function ComparePage() {
  const { ids, remove, clear } = useCompareStore();
  const { addItem, openDrawer } = useCartStore();
  const addToast = useToastStore((s) => s.add);

  const compareProducts = products.filter((p) => ids.includes(p.id));

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem(product);
    addToast(`${product.name} sepete eklendi`, 'success');
    openDrawer();
  };

  if (compareProducts.length === 0) {
    return (
      <PageLayout>
        <div className="relative bg-gradient-to-br from-aq-ice via-white to-aq-sky/50 border-b border-aq-border/60">
          <div className="page-container py-10 md:py-12">
            <div className="flex items-center gap-2 text-[13px] text-aq-muted mb-2">
              <Link to="/" className="hover:text-aq-blue">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-aq-text">Karşılaştır</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-aq-text">Ürün Karşılaştırma</h1>
            <p className="text-sm text-aq-muted mt-1.5">En fazla 4 ürünü yan yana karşılaştırın.</p>
          </div>
        </div>
        <div className="page-container py-8">
          <EmptyState
            icon={<GitCompare className="w-8 h-8" />}
            title="Karşılaştırma Listeniz Boş"
            description="Karşılaştırmak istediğiniz ürünleri ürün kartlarından ekleyebilirsiniz. En fazla 4 ürün karşılaştırabilirsiniz."
            action={{ label: 'Ürünleri Keşfet', href: '/urunler' }}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
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
                Ürün Karşılaştırma ({compareProducts.length}/4)
              </h1>
              <p className="text-sm text-aq-muted mt-1.5">Özellikleri yan yana inceleyin, doğru cihazı seçin.</p>
            </div>
            <button
              type="button"
              onClick={clear}
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
                          onClick={() => remove(p.id)}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-white border border-aq-border/60 rounded-full flex items-center justify-center text-[#E85454] hover:bg-red-50 z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <Link to={`/urun/${p.slug}`} className="block group">
                          <div className="w-24 h-24 bg-white border border-aq-border/60 rounded-2xl flex items-center justify-center mx-auto mb-3 overflow-hidden">
                            <img
                              src={img}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
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
              {Object.entries(specLabels).map(([key, label]) => (
                <tr key={key} className="border-t border-aq-border/60">
                  <td className="p-4 text-sm font-medium text-aq-muted">{label}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 text-sm text-aq-text text-center">
                      {specDefaults[p.id]?.[key] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-aq-border/60">
                <td className="p-4 text-sm font-medium text-aq-muted">Puan</td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 text-sm text-aq-text text-center font-semibold">
                    {p.rating} / 5
                  </td>
                ))}
              </tr>
              <tr className="border-t border-aq-border/60">
                <td className="p-4 text-sm font-medium text-aq-muted">Stok</td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-aq-sky text-aq-blue px-2.5 py-1 rounded-full">
                      <Check className="w-3 h-3" /> Stokta ({p.stock})
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-t border-aq-border/60">
                <td className="p-4" />
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      aria-label="Sepete Ekle"
                      title="Sepete Ekle"
                      className="mx-auto w-11 h-11 flex items-center justify-center rounded-full border border-aq-border/60 text-aq-deep hover:border-aq-blue hover:text-aq-blue hover:bg-aq-sky transition-all active:scale-[0.96]"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
