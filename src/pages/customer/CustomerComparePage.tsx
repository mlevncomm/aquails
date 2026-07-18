import { useCompareStore } from '@/stores/compareStore';
import { useCartStore } from '@/stores/cartStore';
import { X, ShoppingCart, GitCompare } from 'lucide-react';
import { Link } from 'react-router';
import { products } from '@/data';
import { useToastStore } from '@/components/Toast';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerEmpty,
  CustomerButton,
} from '@/components/customer/customer-ui';

export default function CustomerComparePage() {
  const { ids, remove } = useCompareStore();
  const { addItem, openDrawer } = useCartStore();
  const addToast = useToastStore((s) => s.add);
  const compareProducts = products.filter((p) => ids.includes(p.id));

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem(product);
    addToast('Sepete eklendi', 'success');
    openDrawer();
  };

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title="Karşılaştırma"
        description={`${compareProducts.length}/4 ürün listede`}
      />

      {compareProducts.length === 0 ? (
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={GitCompare}
            title="Liste boş"
            message="Karşılaştırmak için ürün ekleyin."
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
                  {compareProducts.map((p) => (
                    <th key={p.id} className="p-4 bg-aq-ice min-w-[160px]">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => remove(p.id)}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-red-500 hover:bg-red-100"
                          aria-label="Kaldır"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="w-16 h-16 bg-white border border-aq-border/40 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <ShoppingCart className="w-6 h-6 text-aq-blue/20" />
                        </div>
                        <p className="text-xs font-semibold text-aq-text line-clamp-2">{p.name}</p>
                        <p className="text-sm font-semibold text-aq-blue tabular-nums">
                          {p.price.toLocaleString('tr-TR')}₺
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['Kategori', 'Puan', 'Stok'].map((label) => (
                  <tr key={label} className="border-t border-aq-border/60">
                    <td className="p-4 text-xs font-medium text-aq-muted">{label}</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-4 text-sm text-aq-text text-center">
                        {label === 'Kategori'
                          ? p.category
                          : label === 'Puan'
                            ? `${p.rating}/5`
                            : `${p.stock} adet`}
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
                        aria-label="Sepete Ekle"
                        className="mx-auto w-10 h-10 flex items-center justify-center rounded-xl border border-aq-border/60 text-aq-deep hover:border-aq-blue hover:text-aq-blue hover:bg-aq-sky transition-all"
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
