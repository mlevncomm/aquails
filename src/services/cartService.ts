import { apiClient, ensureCartSessionId } from '@/lib/apiClient';
import type { Product } from '@/types';

export interface ApiCartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface CartResponse {
  items: ApiCartItem[];
  subtotal: number;
  itemCount: number;
}

export async function fetchCart(): Promise<CartResponse> {
  ensureCartSessionId();
  return apiClient.get<CartResponse>('/api/cart');
}

export async function addCartItem(productId: string, quantity = 1): Promise<CartResponse> {
  ensureCartSessionId();
  return apiClient.post<CartResponse>('/api/cart/items', { productId, quantity });
}

export async function updateCartItem(itemId: string, quantity: number): Promise<CartResponse> {
  ensureCartSessionId();
  return apiClient.patch<CartResponse>(`/api/cart/items/${itemId}`, { quantity });
}

export async function removeCartItem(itemId: string): Promise<CartResponse> {
  ensureCartSessionId();
  return apiClient.delete<CartResponse>(`/api/cart/items/${itemId}`);
}

export async function clearCartApi(): Promise<CartResponse> {
  ensureCartSessionId();
  return apiClient.delete<CartResponse>('/api/cart');
}

export function mapCartToStoreItems(cart: CartResponse) {
  return cart.items.map((item) => ({
    id: item.id,
    product: item.product,
    quantity: item.quantity,
  }));
}
