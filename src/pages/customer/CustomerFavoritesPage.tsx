import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { ProductPrice } from '@/components/ProductPrice';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/components/Toast';
import { getFavoriteProducts, removeFavorite } from '@/services/favoriteService';
import type { Product } from '@/types';

export default function CustomerFavoritesPage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const { addItem, openDrawer } = useCartStore();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    if (!user) return;
    const data = await getFavoriteProducts(user.id);
    setFavorites(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadFavorites();
  }, [user]);

  const handleAddToCart = (p: Product) => {
    addItem(p);
    openDrawer();
  };

  const handleRemove = async (productId: string) => {
    if (!user) return;
    const res = await removeFavorite(user.id, productId);
    if (res.success) {
      setFavorites((prev) => prev.filter((p) => p.id !== productId));
      addToast('Favorilerden çıkarıldı.', 'info');
    } else {
      addToast(res.error ?? 'İşlem başarısız.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-aq-muted">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Yükleniyor...
      </div>
    );
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-aq-text mb-5">Favorilerim ({favorites.length})</h2>

      {favorites.length === 0 ? (
        <div className="bg-white border border-aq-border/60 rounded-2xl">
          <EmptyState
            icon={<Heart className="w-7 h-7 text-rose-300" />}
            title="Favoriniz yok"
            description="Beğendiğiniz ürünleri favorilere ekleyin."
            action={
              <Link to="/urunler" className="bg-aq-blue text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white">
                Ürünleri Keşfet
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {favorites.map((p) => (
            <div key={p.id} className="bg-white border border-aq-border/60 rounded-2xl p-4 flex gap-4 transition-shadow">
              <Link to={`/urun/${p.slug}`} className="w-20 h-20 bg-aq-ice rounded-xl flex-shrink-0 overflow-hidden">
                <img
                  src={p.images?.[0] || '/images/products/placeholder.jpg'}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/urun/${p.slug}`} className="text-sm font-semibold text-aq-text line-clamp-1 hover:text-aq-blue transition-colors">
                  {p.name}
                </Link>
                <p className="text-xs text-aq-muted mt-0.5">{p.category}</p>
                <ProductPrice product={p} size="sm" className="mt-2" />
                <div className="flex gap-1.5 mt-2.5">
                  <button
                    onClick={() => handleAddToCart(p)}
                    aria-label="Sepete Ekle"
                    title="Sepete Ekle"
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-aq-border/60 text-aq-deep hover:border-aq-blue hover:text-aq-blue hover:bg-aq-sky transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => void handleRemove(p.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-rose-500 transition-all"
                    aria-label="Favorilerden çıkar"
                  >
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
