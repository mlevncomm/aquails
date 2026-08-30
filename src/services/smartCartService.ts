import type { Product } from '@/types';

interface CartItem {
  product: Product;
  quantity: number;
}

export function getSmartRecommendations(_cartItems: CartItem[]): Product[] {
  return [];
}
