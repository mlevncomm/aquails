import { useCompareStore } from '@/stores/compareStore';
import { useCartStore } from '@/stores/cartStore';
import { EmptyState } from '@/components/EmptyState';
import { X, ShoppingCart, Minus } from 'lucide-react';
import { products } from '@/data';
import { useToastStore } from '@/components/Toast';

export default function CustomerComparePage() {
  const { ids, remove } = useCompareStore();
  const { addItem, openDrawer } = useCartStore();
  const addToast = useToastStore(s => s.add);
  const compareProducts = products.filter(p => ids.includes(p.id));

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    addToast('Sepete eklendi', 'success');
    openDrawer();
  };

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Karşılaştırma Listem ({compareProducts.length}/4)</h2>

      {compareProducts.length === 0 ? (
        <EmptyState icon={<Minus className="w-8 h-8" />} title="Liste Boş" description="Karşılaştırmak için ürün ekleyin." action={{ label: 'Ürünleri Keşfet', href: '/urunler' }} />
      ) : (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[500px] bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
            <thead>
              <tr>
                <th className="text-left p-4 w-[120px] bg-[#F8FBFF] text-xs font-semibold text-[#8B9DAF]">Özellik</th>
                {compareProducts.map(p => (
                  <th key={p.id} className="p-4 bg-[#F8FBFF] min-w-[160px]">
                    <div className="relative">
                      <button onClick={() => remove(p.id)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-50 rounded-full flex items-center justify-center text-red-500"><X className="w-3 h-3" /></button>
                      <div className="w-16 h-16 bg-[#F0F6FF] rounded-xl flex items-center justify-center mx-auto mb-2">
                        <ShoppingCart className="w-6 h-6 text-[#1A73E8]/20" />
                      </div>
                      <p className="text-xs font-semibold text-[#0D2137] line-clamp-2">{p.name}</p>
                      <p className="text-sm font-bold text-[#1A73E8]">{p.price.toLocaleString('tr-TR')}₺</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['Kategori', 'Puan', 'Stok'].map(label => (
                <tr key={label} className="border-t border-[#F0F6FF]">
                  <td className="p-4 text-xs font-medium text-[#5A6B7B]">{label}</td>
                  {compareProducts.map(p => (
                    <td key={p.id} className="p-4 text-sm text-[#0D2137] text-center">
                      {label === 'Kategori' ? p.category : label === 'Puan' ? `${p.rating}/5` : `${p.stock} adet`}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-[#F0F6FF]">
                <td className="p-4" />
                {compareProducts.map(p => (
                  <td key={p.id} className="p-4">
                    <button onClick={() => handleAddToCart(p)} className="w-full flex items-center justify-center gap-1.5 bg-[#1A73E8] text-white py-2 rounded-full text-xs font-semibold hover:bg-[#1557B0] transition-all">
                      <ShoppingCart className="w-3.5 h-3.5" /> Sepete Ekle
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      </>
  );
}
