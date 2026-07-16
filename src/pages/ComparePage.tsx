import { X, ShoppingCart, Check, Minus } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { EmptyState } from '@/components/EmptyState';
import { useCompareStore } from '@/stores/compareStore';
import { useCartStore } from '@/stores/cartStore';
import { products } from '@/data';
import { useToastStore } from '@/components/Toast';

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
  '4': { asama: '6 Aşama', filtreOmru: '6-12 Ay', tankKapasite: '15 Litre', pomba: 'Var', mineral: 'Var', kurulum: 'Dahil', garanti: '5 Yıl', debi: '250 L/Gün' },
  '5': { asama: '5 Aşama', filtreOmru: '6-12 Ay', tankKapasite: '10 Litre', pompa: 'Var', mineral: 'Var', kurulum: 'Dahil', garanti: '5 Yıl', debi: '200 L/Gün' },
  '6': { asama: '7 Aşama', filtreOmru: '3-6 Ay', tankKapasite: '-', pompa: 'Yok', mineral: 'Var', kurulum: '-', garanti: '2 Yıl', debi: '80 L/Gün' },
};

export default function ComparePage() {
  const { ids, remove, clear } = useCompareStore();
  const { addItem, openDrawer } = useCartStore();
  const addToast = useToastStore(s => s.add);

  const compareProducts = products.filter(p => ids.includes(p.id));

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    addToast(`${product.name} sepete eklendi`, 'success');
    openDrawer();
  };

  if (compareProducts.length === 0) {
    return (
      <PageLayout>
        <div className="page-container py-8">
          <h1 className="text-xl font-bold text-[#0D2137] mb-6">Ürün Karşılaştırma</h1>
          <EmptyState
            icon={<Minus className="w-8 h-8" />}
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
      <div className="page-container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#0D2137]">Ürün Karşılaştırma ({compareProducts.length}/4)</h1>
          <button onClick={clear} className="text-sm text-[#E85454] font-medium hover:underline">Tümünü Temizle</button>
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[600px] bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
            <thead>
              <tr>
                <th className="text-left p-4 w-[160px] bg-[#F8FBFF] text-xs font-semibold text-[#8B9DAF] uppercase">Özellik</th>
                {compareProducts.map(p => (
                  <th key={p.id} className="p-4 bg-[#F8FBFF] min-w-[180px]">
                    <div className="relative">
                      <button
                        onClick={() => remove(p.id)}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-red-500 hover:bg-red-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="w-20 h-20 bg-[#F0F6FF] rounded-xl flex items-center justify-center mx-auto mb-2">
                        <ShoppingCart className="w-8 h-8 text-[#1A73E8]/20" />
                      </div>
                      <p className="text-sm font-semibold text-[#0D2137] line-clamp-2">{p.name}</p>
                      <p className="text-lg font-bold text-[#1A73E8] mt-1">{p.price.toLocaleString('tr-TR')}₺</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(specLabels).map(([key, label]) => (
                <tr key={key} className="border-t border-[#F0F6FF]">
                  <td className="p-4 text-sm font-medium text-[#5A6B7B]">{label}</td>
                  {compareProducts.map(p => (
                    <td key={p.id} className="p-4 text-sm text-[#0D2137] text-center">
                      {specDefaults[p.id]?.[key] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Rating */}
              <tr className="border-t border-[#F0F6FF]">
                <td className="p-4 text-sm font-medium text-[#5A6B7B]">Puan</td>
                {compareProducts.map(p => (
                  <td key={p.id} className="p-4 text-sm text-[#0D2137] text-center font-semibold">{p.rating} / 5</td>
                ))}
              </tr>
              {/* Stock */}
              <tr className="border-t border-[#F0F6FF]">
                <td className="p-4 text-sm font-medium text-[#5A6B7B]">Stok</td>
                {compareProducts.map(p => (
                  <td key={p.id} className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" /> Stokta ({p.stock})
                    </span>
                  </td>
                ))}
              </tr>
              {/* Add to cart */}
              <tr className="border-t border-[#F0F6FF]">
                <td className="p-4" />
                {compareProducts.map(p => (
                  <td key={p.id} className="p-4">
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="w-full flex items-center justify-center gap-2 bg-[#1A73E8] text-white py-2.5 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" /> Sepete Ekle
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
