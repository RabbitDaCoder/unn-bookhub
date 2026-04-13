import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Book, CartItem } from "../types";
import type { User as FirebaseUser } from "firebase/auth";

type UserProfile = User;

interface AuthState {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  userProfile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setLoading: (loading) => set({ loading }),
}));

interface CartStore {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  updateQty: (bookId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalAmount: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (book) => {
        const items = get().items;
        const existing = items.find((item) => item.id === book.id);

        const updatedItems = existing
          ? items.map((item) =>
              item.id === book.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...items, { ...book, quantity: 1 }];

        const totalAmount = updatedItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
        const totalItems = updatedItems.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );

        set({
          items: updatedItems,
          totalAmount,
          totalItems,
          totalPrice: totalAmount,
        });
      },
      removeItem: (bookId) => {
        const updatedItems = get().items.filter((item) => item.id !== bookId);
        const totalAmount = updatedItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
        const totalItems = updatedItems.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );
        set({
          items: updatedItems,
          totalAmount,
          totalItems,
          totalPrice: totalAmount,
        });
      },
      updateQty: (bookId, qty) => {
        const updatedItems = get().items.map((item) =>
          item.id === bookId ? { ...item, quantity: Math.max(1, qty) } : item,
        );
        const totalAmount = updatedItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
        const totalItems = updatedItems.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );
        set({
          items: updatedItems,
          totalAmount,
          totalItems,
          totalPrice: totalAmount,
        });
      },
      clearCart: () =>
        set({ items: [], totalAmount: 0, totalItems: 0, totalPrice: 0 }),
      totalItems: 0,
      totalPrice: 0,
      totalAmount: 0,
    }),
    {
      name: "unn-bookhub-cart",
      partialize: (state) => ({ items: state.items }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
      }),
    },
  ),
);

interface UIStore {
  theme: "light" | "dark";
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: "dark",
      isDarkMode: true,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
          isDarkMode: state.theme !== "dark",
        })),
    }),
    {
      name: "unn-bookhub-ui",
    },
  ),
);
