import type { Product } from '@/types';
import { getProductGrossPrice } from '@/lib/pricing';
import { useProductDisplayPrice } from '@/hooks/useProductDisplayPrice';
import { cn } from '@/lib/utils';

interface ProductPriceProps {
  product: Pick<Product, 'price' | 'taxRate' | 'oldPrice'>;
  size?: 'sm' | 'md' | 'lg';
  showTaxHint?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: { price: 'text-sm font-semibold', old: 'text-xs' },
  md: { price: 'text-lg font-bold', old: 'text-sm' },
  lg: { price: 'text-2xl sm:text-3xl font-bold', old: 'text-lg' },
};

/** Müşteriye KDV dahil fiyat gösterir (100₺ net + %20 → 120₺) */
export function ProductPrice({ product, size = 'md', showTaxHint = false, className }: ProductPriceProps) {
  const { grossOldPrice, taxRate, formattedGross, formattedOldGross } = useProductDisplayPrice(product);
  const sizes = sizeClasses[size];

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn(sizes.price, 'text-aqua-secondary')}>{formattedGross}</span>
        {grossOldPrice != null && formattedOldGross && (
          <span className={cn(sizes.old, 'text-aqua-text-muted line-through')}>{formattedOldGross}</span>
        )}
      </div>
      {showTaxHint && (
        <p className="text-[11px] text-aqua-text-muted mt-1">KDV dahil (%{taxRate})</p>
      )}
    </div>
  );
}

export function useGrossLineTotal(
  product: Pick<Product, 'price' | 'taxRate'>,
  quantity: number,
  defaultTaxRate = 20,
): number {
  return getProductGrossPrice(product, defaultTaxRate) * quantity;
}
