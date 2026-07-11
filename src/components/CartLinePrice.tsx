import type { Product } from '@/types';
import { useProductDisplayPrice } from '@/hooks/useProductDisplayPrice';
import { formatTryShort } from '@/lib/pricing';

interface CartLinePriceProps {
  product: Product;
  quantity: number;
  layout?: 'unit' | 'line';
}

/** Sepette KDV dahil birim / satır fiyatı */
export function CartLinePrice({ product, quantity, layout = 'line' }: CartLinePriceProps) {
  const { grossPrice } = useProductDisplayPrice(product);

  if (layout === 'unit') {
    return <>{formatTryShort(grossPrice)}</>;
  }

  return <>{formatTryShort(grossPrice * quantity)}</>;
}
