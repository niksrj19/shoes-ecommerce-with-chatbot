import { create } from "zustand";
import { CartItem, CartItemMutationDTO, CartSummary } from "@/types/cart";
import { CartService } from "@/services/cart.service";

interface CartStoreState {
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  totalQuantity: number;
  isDrawerOpen: boolean;
  isLoading: boolean;
  isAuthReady: boolean;

  openDrawer: () => void;
  closeDrawer: () => void;
  setAuthReady: () => void;
  fetchCart: () => Promise<void>;
  addItem: (item: CartItemMutationDTO & { quantity: number }) => Promise<boolean>;
  updateQuantity: (item: CartItemMutationDTO & { quantity: number }) => Promise<void>;
  removeItem: (item: CartItemMutationDTO) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeCartOnLogin: () => Promise<void>;
}

let cartFetchPromise: Promise<void> | null = null;

const getCartState = (cart: CartSummary) => {
  const items = cart.items || [];

  return {
    items,
    subtotal: cart.subtotal || 0,
    gstAmount: cart.gstAmount || 0,
    totalAmount: cart.totalAmount || 0,
    totalQuantity: items.reduce((quantity, item) => quantity + item.quantity, 0),
  };
};

export const useCartStore = create<CartStoreState>((set, get) => ({
  items: [],
  subtotal: 0,
  gstAmount: 0,
  totalAmount: 0,
  totalQuantity: 0,
  isDrawerOpen: false,
  isLoading: false,
  isAuthReady: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setAuthReady: () => set({ isAuthReady: true }),

  fetchCart: async () => {
    if (!get().isAuthReady) return;
    if (cartFetchPromise) return cartFetchPromise;

    cartFetchPromise = (async () => {
      try {
        set({ isLoading: true });
        const cart = await CartService.getCart();
        set(getCartState(cart));
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        set({ isLoading: false });
        cartFetchPromise = null;
      }
    })();

    return cartFetchPromise;
  },

  addItem: async (payload) => {
    try {
      set({ isLoading: true });
      const updatedCart = await CartService.addItem(payload);
      set(getCartState(updatedCart));
      return true;
    } catch (err) {
      console.error("Failed to add cart item:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (payload) => {
    try {
      set({ isLoading: true });
      const updatedCart = await CartService.updateQuantity(payload);
      set(getCartState(updatedCart));
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (payload) => {
    try {
      set({ isLoading: true });
      const updatedCart = await CartService.removeItem(payload);
      set(getCartState(updatedCart));
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true });
      await CartService.clearCart();
      set({
        items: [],
        subtotal: 0,
        gstAmount: 0,
        totalAmount: 0,
        totalQuantity: 0,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  mergeCartOnLogin: async () => {
    try {
      set({ isLoading: true });
      const merged = await CartService.mergeGuestCart();
      set(getCartState(merged));
    } finally {
      set({ isLoading: false });
    }
  },
}));