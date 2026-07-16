import { Link } from 'react-router';
import { ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import { RatingStars } from './RatingStars';
import { useCartStore } from '@/stores/cartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useToastStore } from '@/components/Toast';
import { ProductPrice } from '@/components/ProductPrice';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem, openDrawer } = useCartStore();
  const { toggle, isFav } = useFavoritesStore();
  const addToast = useToastStore((s) => s.add);
  const isFavorited = isFav(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    addToast(`${product.name} sepete eklendi.`, 'success');
    openDrawer();
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    addToast(isFavorited ? 'Favorilerden çıkarıldı.' : 'Favorilere eklendi.', 'info');
  };

  const primaryImage = product.images?.[0] || '/images/products/placeholder.jpg';
  const shortFeatures = (product.features || []).slice(0, 2);
  const inStock = product.stock > 0;

  if (compact) {
    return (
      <Link to={`/urun/${product.slug}`} className="block group flex-shrink-0 w-[200px]">
        <div className="bg-aq-ice rounded-2xl aspect-square flex items-center justify-center mb-2 transition-all duration-300 overflow-hidden border border-aq-border/60">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
          />
        </div>
        <h4 className="text-[13px] font-medium text-aq-text line-clamp-1 group-hover:text-aq-blue transition-colors">
          {product.name}
        </h4>
        <ProductPrice product={product} size="sm" />
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group bg-white border border-aq-border/60 rounded-2xl overflow-hidden hover:border-aq-blue/20 transition-all duration-300 flex flex-col h-full"
    >
      <Link to={`/urun/${product.slug}`} className="flex flex-col flex-1 min-w-0">
        <div className="relative bg-aq-ice aspect-[4/3] sm:aspect-square flex items-center justify-center overflow-hidden">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
          />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.discountPercent && (
              <span className="bg-white/95 text-[#E85454] text-[11px] font-medium px-2.5 py-1 rounded-full shadow-sm border border-[#E85454]/15">
                %{product.discountPercent} İNDİRİM
              </span>
            )}
            {product.badge === 'new' && (
              <span className="bg-aq-deep text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-sm">
                YENİ
              </span>
            )}
            {product.badge === 'premium' && (
              <span className="bg-aq-deep text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-sm">
                PREMIUM
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleFavorite}
            aria-label={isFavorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm ring-1 ring-aq-border/80"
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-colors',
                isFavorited ? 'text-[#E85454] fill-[#E85454]' : 'text-aq-muted',
              )}
            />
          </button>
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <span className="inline-flex self-start bg-aq-sky text-aq-blue text-[11px] font-medium px-2.5 py-0.5 rounded-full">
            {product.category}
          </span>

          <h3 className="text-[15px] font-semibold text-aq-text mt-2.5 line-clamp-2 leading-snug group-hover:text-aq-blue transition-colors">
            {product.name}
          </h3>

          {shortFeatures.length > 0 && (
            <ul className="mt-2 space-y-0.5">
              {shortFeatures.map((f) => (
                <li key={f} className="text-[11px] text-aq-muted line-clamp-1">
                  · {f}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2.5">
            <RatingStars rating={product.rating} size="sm" showCount count={product.reviewCount} />
          </div>

          <div className="mt-auto pt-3">
            <ProductPrice product={product} size="md" />
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cn(
                  'text-[11px] font-medium px-2 py-0.5 rounded-full',
                  inStock
                    ? 'bg-aq-sky text-aq-blue'
                    : 'bg-red-50 text-red-500',
                )}
              >
                {inStock ? 'Stokta' : 'Tükendi'}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-3 sm:px-5 pb-3 sm:pb-5 flex items-center gap-2">
        <Link
          to={`/urun/${product.slug}`}
          className="flex-1 flex items-center justify-center gap-1.5 border border-aq-border/60 text-aq-text py-2.5 rounded-xl text-[13px] font-semibold hover:border-aq-blue hover:text-aq-blue active:scale-[0.98] transition-all duration-200"
        >
          İncele
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          aria-label="Sepete Ekle"
          title="Sepete Ekle"
          className={cn(
            'flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 inline-flex items-center justify-center rounded-full border transition-all duration-200 active:scale-[0.96]',
            inStock
              ? 'border-aq-border/60 text-aq-deep hover:border-aq-blue hover:text-aq-blue hover:bg-aq-sky'
              : 'border-aq-border/60 text-aq-muted bg-aq-ice cursor-not-allowed',
          )}
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
