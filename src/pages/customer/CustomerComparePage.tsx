import { useMemo } from 'react';
import { Link } from 'react-router';
import { X, ShoppingCart, GitCompare, Loader2 } from 'lucide-react';
import { useCompareStore, COMPARE_MAX } from '@/stores/compareStore';
import { useCartStore } from '@/stores/cartStore';
import { useCatalog } from '@/hooks/useCatalog';
import { useToastStore } from '@/components/Toast';
import { ProductPrice } from '@/components/ProductPrice';
import type { Product } from '@/types';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerEmpty,
  CustomerButton,
} from '@/components/customer/customer-ui';

export default function CustomerComparePage() {
  const { ids, remove } = useCompareStore();
  const { products, loading } = useCatalog();
  const { addItem, openDrawer } = useCartStore();
  const addToast = useToastStore((s) => s.add);

  const compareProducts = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
  }, [ids, products]);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      addToast('Bu ürün stokta yok.', 'error');
      return;
    }
    addItem(product);
    addToast('Sepete eklendi', 'success');
    openDrawer();
  };

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title="Karşılaştırma"
        description={`${compareProducts.length}/${COMPARE_MAX} ürün listede`}
      />

      {loading && ids.length > 0 && compareProducts.length === 0 ? (
        <CustomerCard>
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-aq-blue" />
          </div>
        </CustomerCard>
      ) : compareProducts.length === 0 ? (
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={GitCompare}
            title="Liste boş"
            message="Ürün kartındaki karşılaştır ikonuyla ekleyin."
            action={
              <Link to="/urunler">
                <CustomerButton>Ürünleri Keşfet</CustomerButton>
              </Link>
            }
          />
        </CustomerCard>
      ) : (
        <CustomerCard padding={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr>
                  <th className="text-left p-4 w-[120px] bg-aq-ice text-xs font-semibold text-aq-muted">
                    Özellik
                  </th>
                  {compareProducts.map((p) => {
                    const img = p.images?.[0] || '/images/products/placeholder.jpg';
                    return (
                      <th key={p.id} className="p-4 bg-aq-ice min-w-[160px]">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              remove(p.id);
                              addToast('Ürün listeden çıkarıldı.', 'info');
                            }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-red-500 hover:bg-red-100"
                            aria-label="Kaldır"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <Link to={`/urun/${p.slug}`} className="block group">
                            <div className="w-16 h-16 bg-white border border-aq-border/40 rounded-xl flex items-center justify-center mx-auto mb-2 overflow-hidden">
                              <img
                                src={img}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    '/images/products/placeholder.jpg';
                                }}
                              />
                            </div>
                            <p className="text-xs font-semibold text-aq-text line-clamp-2 group-hover:text-aq-blue">
                              {p.name}
                            </p>
                          </Link>
                          <div className="mt-1 flex justify-center">
                            <ProductPrice product={p} size="sm" />
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {['Kategori', 'Puan', 'Stok'].map((label) => (
                  <tr key={label} className="border-t border-aq-border/60">
                    <td className="p-4 text-xs font-medium text-aq-muted">{label}</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-4 text-sm text-aq-text text-center">
                        {label === 'Kategori'
                          ? p.category || '-'
                          : label === 'Puan'
                            ? p.rating > 0
                              ? `${p.rating}/5`
                              : '-'
                            : p.stock > 0
                              ? `${p.stock} adet`
                              : 'Tükendi'}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-aq-border/60">
                  <td className="p-4" />
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(p)}
                        disabled={p.stock <= 0}
                        aria-label="Sepete Ekle"
                        className="mx-auto w-10 h-10 flex items-center justify-center rounded-xl border border-aq-border/60 text-aq-deep hover:border-aq-blue hover:text-aq-blue hover:bg-aq-sky transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CustomerCard>
      )}
    </CustomerPageShell>
  );
}
