import { useState } from 'react';
import { Link } from 'react-router';
import { Heart, ShoppingCart, Package } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { products } from '@/data/products';
import { useCartStore } from '@/stores/cartStore';

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState(products.slice(0, 5));
  const { addItem, openDrawer } = useCartStore();

  const remove = (id: string) => setFavorites(prev => prev.filter(f => f.id !== id));

  const handleAddToCart = (p: typeof products[0]) => {
    addItem(p);
    openDrawer();
  };

  return (
      <>      <h2 className="text-lg font-bold text-[#0D2137] mb-5">Favorilerim ({favorites.length})</h2>

      {favorites.length === 0 ? (
        <div className="bg-white border border-[#E8F0FE] rounded-2xl">
          <EmptyState icon={<Heart className="w-7 h-7 text-rose-300" />} title="Favoriniz yok" description="Beğendiğiniz ürünleri favorilere ekleyin." action={<Link to="/urunler" className="bg-[#1A73E8] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#1557B0]">Ürünleri Keşfet</Link>} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {favorites.map(p => (
            <div key={p.id} className="bg-white border border-[#E8F0FE] rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow">
              <Link to={`/urun/${p.slug}`} className="w-20 h-20 bg-[#F0F6FF] rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-8 h-8 text-[#1A73E8]/20" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/urun/${p.slug}`} className="text-sm font-semibold text-[#0D2137] line-clamp-1 hover:text-[#1A73E8] transition-colors">{p.name}</Link>
                <p className="text-xs text-[#8B9DAF] mt-0.5">{p.category}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-base font-bold text-[#0D2137]">{p.price.toLocaleString('tr-TR')}₺</span>
                  {p.oldPrice && <span className="text-xs text-[#8B9DAF] line-through">{p.oldPrice.toLocaleString('tr-TR')}₺</span>}
                </div>
                <div className="flex gap-1.5 mt-2.5">
                  <button onClick={() => handleAddToCart(p)} className="flex items-center gap-1.5 bg-[#1A73E8] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1557B0] transition-all">
                    <ShoppingCart className="w-3 h-3" /> Sepete Ekle
                  </button>
                  <button onClick={() => remove(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500 transition-all">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </>
  );
}
