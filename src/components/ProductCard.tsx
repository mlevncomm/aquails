import { Link } from 'react-router';
import { ShoppingCart, Heart } from 'lucide-react';
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

  if (compact) {
    return (
      <Link to={`/urun/${product.slug}`} className="block group flex-shrink-0 w-[200px]">
        <div className="bg-aqua-bg rounded-xl aspect-square flex items-center justify-center mb-2 group-hover:shadow-card-hover transition-all duration-300 overflow-hidden">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
          />
        </div>
        <h4 className="text-[13px] font-medium text-aqua-secondary line-clamp-1 group-hover:text-aqua-primary transition-colors">
          {product.name}
        </h4>
        <ProductPrice product={product} size="sm" />
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group bg-white border border-aqua-border-light rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      <Link to={`/urun/${product.slug}`}>
        {/* Image */}
        <div className="relative bg-aqua-bg aspect-square flex items-center justify-center overflow-hidden">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.discountPercent && (
              <span className="bg-aqua-danger/10 text-aqua-danger text-[11px] font-semibold px-2.5 py-1 rounded-md">
                %{product.discountPercent} İNDİRİM
              </span>
            )}
            {product.badge === 'new' && (
              <span className="bg-aqua-secondary text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                YENİ
              </span>
            )}
          </div>

          {/* Favorite */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-colors',
                isFavorited ? 'text-aqua-danger fill-aqua-danger' : 'text-aqua-text-secondary'
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <span className="inline-block bg-aqua-primary/5 text-aqua-primary text-[11px] font-medium px-2.5 py-0.5 rounded-md">
            {product.category}
          </span>

          <h3 className="text-[15px] font-semibold text-aqua-secondary mt-2.5 line-clamp-2 leading-snug group-hover:text-aqua-primary transition-colors">
            {product.name}
          </h3>

          <div className="mt-2">
            <RatingStars rating={product.rating} size="sm" showCount count={product.reviewCount} />
          </div>

          <ProductPrice product={product} size="md" className="mt-3" />

          <div className="flex items-center gap-2 mt-3">
            <span className="text-[11px] font-medium bg-aqua-success/10 text-aqua-success px-2 py-0.5 rounded-md">
              Stokta
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-[#1A73E8]/5 text-[#1A73E8] py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-sm font-semibold hover:bg-[#1A73E8] hover:text-white active:scale-[0.98] transition-all duration-200"
        >
          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Sepete Ekle</span>
        </button>
      </div>
    </motion.div>
  );
}
