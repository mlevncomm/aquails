import type { Product } from '@/types';

interface CartItem {
  product: Product;
  quantity: number;
}

export function getSmartRecommendations(cartItems: CartItem[]): Product[] {
  void cartItems;
  return [];
}
