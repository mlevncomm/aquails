import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';
import { syncAbandonedCart } from '@/services/abandonedCartService';
import { syncUserCartToServer } from '@/services/cartSyncService';
import { useAuthStore } from '@/stores/authStore';

export interface AppliedCartCoupon {
  code: string;
  discount: number;
  type: string;
}

function trackAbandonedCartFromStore(items: CartItem[]): void {
  if (!items.length) return;
  const user = useAuthStore.getState().user;
  syncAbandonedCart(
    items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images?.[0],
    })),
    user?.name ?? 'Misafir',
    user?.email
  );
  void syncUserCartToServer(items);
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  appliedCoupon: AppliedCartCoupon | null;
  setAppliedCoupon: (coupon: AppliedCartCoupon | null) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  openDrawer: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      appliedCoupon: null,
      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          const nextItems = existingItem
            ? state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            : [...state.items, { product, quantity }];
          trackAbandonedCartFromStore(nextItems);
          return { items: nextItems };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const nextItems = state.items.filter((item) => item.product.id !== productId);
          trackAbandonedCartFromStore(nextItems);
          return { items: nextItems };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => {
          const nextItems = state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );
          trackAbandonedCartFromStore(nextItems);
          return { items: nextItems };
        });
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      closeDrawer: () => set({ isDrawerOpen: false }),
      openDrawer: () => set({ isDrawerOpen: true }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getSubtotal: () => {
        return get().getTotalPrice();
      },
    }),
    { name: 'aquails_cart' }
  )
);
