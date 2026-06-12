import { products } from '@/data';
import type { Product } from '@/types';

interface CartItem {
  product: Product;
  quantity: number;
}

export function getSmartRecommendations(cartItems: CartItem[]): Product[] {
  const cartCategoryIds = cartItems.map((i) => i.product.category);
  const cartProductIds = new Set(cartItems.map((i) => i.product.id));

  const hasWaterDevice = cartCategoryIds.some(
    (c) => c === 'Su Arıtma Cihazları' || c === 'Direkt Akış Su Arıtma' || c === 'Dijital Su Arıtma'
  );
  const hasFilter = cartCategoryIds.includes('Filtreler') || cartCategoryIds.includes('Membran Filtreler');
  const hasSebil = cartCategoryIds.includes('Sebiller');

  let recs: Product[] = [];

  if (hasWaterDevice) {
    recs = products.filter(
      (p) =>
        (p.category === 'Filtreler' || p.category === 'Membran Filtreler') &&
        !cartProductIds.has(p.id)
    );
  } else if (hasFilter) {
    recs = products.filter(
      (p) =>
        (p.category === 'Su Arıtma Cihazları' || p.category === 'Direkt Akış Su Arıtma') &&
        !cartProductIds.has(p.id)
    );
  } else if (hasSebil) {
    recs = products.filter(
      (p) => (p.category === 'Filtreler' || p.category === 'Aksesuarlar') && !cartProductIds.has(p.id)
    );
  } else {
    recs = products.filter(
      (p) =>
        (p.category === 'Filtreler' || p.category === 'Aksesuarlar' || p.category === 'Musluklar') &&
        !cartProductIds.has(p.id)
    );
  }

  return recs
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);
}
