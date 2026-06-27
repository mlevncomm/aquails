import { create } from 'zustand';
import type { CartItem, Product } from '@/types';
import {
  addCartItem,
  clearCartApi,
  fetchCart,
  mapCartToStoreItems,
  removeCartItem,
  updateCartItem,
} from '@/services/cartService';

interface StoreCartItem extends CartItem {
  cartItemId: string;
}

interface CartStore {
  items: StoreCartItem[];
  subtotal: number;
  itemCount: number;
  isDrawerOpen: boolean;
  isLoading: boolean;
  syncCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  openDrawer: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
}

function applyCart(set: (partial: Partial<CartStore>) => void, cart: Awaited<ReturnType<typeof fetchCart>>) {
  set({
    items: mapCartToStoreItems(cart).map((item) => ({
      cartItemId: item.id,
      product: item.product,
      quantity: item.quantity,
    })),
    subtotal: cart.subtotal,
    itemCount: cart.itemCount,
  });
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  subtotal: 0,
  itemCount: 0,
  isDrawerOpen: false,
  isLoading: false,

  syncCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await fetchCart();
      applyCart(set, cart);
    } catch {
      // keep local state on failure
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (product, quantity = 1) => {
    set({ isLoading: true });
    try {
      const cart = await addCartItem(product.id, quantity);
      applyCart(set, cart);
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (productId) => {
    const item = get().items.find((i) => i.product.id === productId);
    if (!item) return;
    set({ isLoading: true });
    try {
      const cart = await removeCartItem(item.cartItemId);
      applyCart(set, cart);
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      await get().removeItem(productId);
      return;
    }
    const item = get().items.find((i) => i.product.id === productId);
    if (!item) return;
    set({ isLoading: true });
    try {
      const cart = await updateCartItem(item.cartItemId, quantity);
      applyCart(set, cart);
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await clearCartApi();
      applyCart(set, cart);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  closeDrawer: () => set({ isDrawerOpen: false }),
  openDrawer: () => set({ isDrawerOpen: true }),

  getTotalItems: () => get().itemCount || get().items.reduce((t, i) => t + i.quantity, 0),
  getTotalPrice: () => get().subtotal || get().items.reduce((t, i) => t + i.product.price * i.quantity, 0),
  getSubtotal: () => get().getTotalPrice(),
}));

void useCartStore.getState().syncCart();
