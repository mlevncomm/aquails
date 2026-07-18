import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Heart, ShoppingCart } from 'lucide-react';
import { ProductPrice } from '@/components/ProductPrice';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/components/Toast';
import { getFavoriteProducts, removeFavorite } from '@/services/favoriteService';
import type { Product } from '@/types';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerEmpty,
  CustomerLoading,
  CustomerButton,
} from '@/components/customer/customer-ui';

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
      <CustomerPageShell>
        <CustomerLoading rows={3} />
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title="Favorilerim"
        description={
          favorites.length > 0
            ? `${favorites.length} ürün favorilerinizde`
            : 'Beğendiğiniz ürünleri buradan takip edin'
        }
      />

      {favorites.length === 0 ? (
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={Heart}
            title="Favoriniz yok"
            message="Beğendiğiniz ürünleri favorilere ekleyin."
            action={
              <Link to="/urunler">
                <CustomerButton>Ürünleri Keşfet</CustomerButton>
              </Link>
            }
          />
        </CustomerCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {favorites.map((p) => (
            <CustomerCard key={p.id} className="!p-4 flex gap-4">
              <Link
                to={`/urun/${p.slug}`}
                className="w-20 h-20 bg-aq-ice rounded-xl flex-shrink-0 overflow-hidden"
              >
                <img
                  src={p.images?.[0] || '/images/products/placeholder.jpg'}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg';
                  }}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/urun/${p.slug}`}
                  className="text-sm font-semibold text-aq-text line-clamp-1 hover:text-aq-blue transition-colors"
                >
                  {p.name}
                </Link>
                <p className="text-xs text-aq-muted mt-0.5">{p.category}</p>
                <ProductPrice product={p} size="sm" className="mt-2" />
                <div className="flex gap-1.5 mt-2.5">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(p)}
                    aria-label="Sepete Ekle"
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-aq-border/60 text-aq-deep hover:border-aq-blue hover:text-aq-blue hover:bg-aq-sky transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRemove(p.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 text-aq-blue transition-all"
                    aria-label="Favorilerden çıkar"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            </CustomerCard>
          ))}
        </div>
      )}
    </CustomerPageShell>
  );
}
