import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Book, CartItem } from "../types";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { musicTracks, type MusicTrack } from "../data/musicTracks";

type UserProfile = User;

interface AuthState {
  user: SupabaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setUser: (user: SupabaseUser | null) => void;
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
    { name: "unn-bookhub-ui" },
  ),
);

interface MusicState {
  tracks: MusicTrack[];
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  progress: number;
  isMuted: boolean;
  showPlayer: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  selectTrack: (index: number) => void;
  setVolume: (v: number) => void;
  setProgress: (p: number) => void;
  setShowPlayer: (show: boolean) => void;
}

export const useMusicStore = create<MusicState>()(
  persist(
    (set, get) => ({
      tracks: musicTracks,
      currentTrackIndex: 0,
      isPlaying: false,
      volume: 50,
      progress: 0,
      isMuted: false,
      showPlayer: false,
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
      next: () =>
        set((s) => ({
          currentTrackIndex: (s.currentTrackIndex + 1) % s.tracks.length,
          progress: 0,
        })),
      prev: () =>
        set((s) => ({
          currentTrackIndex:
            s.currentTrackIndex === 0
              ? s.tracks.length - 1
              : s.currentTrackIndex - 1,
          progress: 0,
        })),
      selectTrack: (index) =>
        set({ currentTrackIndex: index, progress: 0, isPlaying: true }),
      setVolume: (v) => set({ volume: v, isMuted: v === 0 }),
      setProgress: (p) => set({ progress: p }),
      setShowPlayer: (show) => set({ showPlayer: show }),
    }),
    {
      name: "unn-bookhub-music",
      partialize: (state) => ({
        currentTrackIndex: state.currentTrackIndex,
        volume: state.volume,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
      }),
    },
  ),
);
