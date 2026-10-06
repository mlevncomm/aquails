import { Link } from 'react-router';
import { Heart, GitCompare, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { RatingStars } from './RatingStars';
import { useCartStore } from '@/stores/cartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { compareToastMessage, useCompareStore } from '@/stores/compareStore';
import { useToastStore } from '@/components/Toast';
import { ProductPrice } from '@/components/ProductPrice';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const PLACEHOLDER = '/images/products/placeholder.jpg';

/** Reference-style product tile: soft image well, quiet type, small navy cart button. */
export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem, openDrawer } = useCartStore();
  const { toggle, isFav } = useFavoritesStore();
  const toggleCompare = useCompareStore((s) => s.toggle);
  const isComparing = useCompareStore((s) => s.ids.includes(product.id));
  const addToast = useToastStore((s) => s.add);
  const isFavorited = isFav(product.id);
  const inStock = product.stock > 0;
  const image = product.images?.[0] || PLACEHOLDER;

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    stop(e);
    addItem(product);
    addToast(`${product.name} sepete eklendi.`, 'success');
    openDrawer();
  };

  const handleFavorite = (e: React.MouseEvent) => {
    stop(e);
    toggle(product.id);
    addToast(isFavorited ? 'Favorilerden çıkarıldı.' : 'Favorilere eklendi.', 'info');
  };

  const handleCompare = (e: React.MouseEvent) => {
    stop(e);
    const result = toggleCompare(product.id);
    addToast(compareToastMessage(result), result === 'removed' ? 'info' : 'success');
  };

  return (
    <Link to={`/urun/${product.slug}`} className="group flex h-full min-w-0 flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F3F6F9]">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />

        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {product.discountPercent ? (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">%{product.discountPercent}</span>
          ) : null}
          {product.badge === 'new' && (
            <span className="rounded-full bg-aq-ink px-2 py-0.5 text-[10px] font-bold text-white">YENİ</span>
          )}
          {!inStock && (
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-aq-muted">Tükendi</span>
          )}
        </div>

        {!compact && (
          <div className="absolute right-2.5 top-2.5 hidden flex-col gap-1.5 transition-opacity sm:flex sm:opacity-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={handleFavorite}
              aria-label={isFavorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-aq-ink shadow-soft hover:bg-aq-cloud"
            >
              <Heart className={cn('h-4 w-4', isFavorited && 'fill-rose-500 text-rose-500')} />
            </button>
            <button
              type="button"
              onClick={handleCompare}
              aria-label={isComparing ? 'Karşılaştırmadan çıkar' : 'Karşılaştırmaya ekle'}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full shadow-soft',
                isComparing ? 'bg-aq-ink text-white' : 'bg-white text-aq-ink hover:bg-aq-cloud',
              )}
            >
              <GitCompare className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        {product.category && (
          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-aq-muted">{product.category}</span>
        )}
        <h3 className={cn('mt-1 line-clamp-2 font-semibold leading-snug text-aq-ink group-hover:text-aq-blue', compact ? 'text-[13px]' : 'text-[13px] sm:text-[14px]')}>
          {product.name}
        </h3>
        {!compact && product.reviewCount > 0 && (
          <div className="mt-1.5">
            <RatingStars rating={product.rating} size="sm" showCount count={product.reviewCount} />
          </div>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <ProductPrice product={product} size="sm" className="min-w-0 [&_span:first-child]:text-[15px] [&_span:first-child]:font-bold [&_span:first-child]:text-aq-ink" />
          {!compact && (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              aria-label="Sepete ekle"
              title="Sepete ekle"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-aq-ink text-white transition-colors hover:bg-aq-ink-soft disabled:cursor-not-allowed disabled:bg-aq-border disabled:text-aq-muted"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
