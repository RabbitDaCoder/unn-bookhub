import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { MusicPlayer } from "./components/MusicPlayer";
import { AuthGuard } from "./components/AuthGuard";
import { GuestGuard } from "./components/GuestGuard";
import { ToastProvider } from "./context/ToastContext";
import { FullPageSpinner } from "./components/ui/FullPageSpinner";
import { useAuthStore, useCartStore } from "./store/useStore";
import {
  onAuthChange,
  fetchUserProfile,
  loadCartFromCloud,
  saveCartToCloud,
} from "./supabase";

const HomePage = lazy(() => import("./pages/HomePage"));
const BooksPage = lazy(() => import("./pages/BooksPage"));
const BookDetailPage = lazy(() => import("./pages/BookDetailPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const ReaderPage = lazy(() => import("./pages/ReaderPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const RegisterSuccessPage = lazy(() => import("./pages/RegisterSuccessPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const ComplaintsPage = lazy(() => import("./pages/ComplaintsPage"));
const NewComplaintPage = lazy(() => import("./pages/NewComplaintPage"));
const ComplaintDetailPage = lazy(() => import("./pages/ComplaintDetailPage"));

function AppContent() {
  const location = useLocation();
  const { setUser, setUserProfile, setLoading } = useAuthStore();
  const isLibraryRoute =
    location.pathname.startsWith("/library") ||
    location.pathname.startsWith("/reader");
  const showMusicPlayer = isLibraryRoute;

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      try {
        setUser(user);
        if (user) {
          const profile = await fetchUserProfile(user.id);
          setUserProfile(profile);
          // Load cart from cloud
          const cloudCart = await loadCartFromCloud(user.id);
          if (cloudCart && cloudCart.length > 0) {
            useCartStore.setState({
              items: cloudCart,
              totalItems: cloudCart.reduce(
                (a: number, i: any) => a + i.quantity,
                0,
              ),
              totalAmount: cloudCart.reduce(
                (a: number, i: any) => a + i.price * i.quantity,
                0,
              ),
              totalPrice: cloudCart.reduce(
                (a: number, i: any) => a + i.price * i.quantity,
                0,
              ),
            });
          }
        } else {
          // Save cart to cloud before clearing on logout
          const prevUser = useAuthStore.getState().user;
          if (prevUser) {
            const cartItems = useCartStore.getState().items;
            if (cartItems.length > 0) {
              await saveCartToCloud(prevUser.id, cartItems);
            }
          }
          setUserProfile(null);
        }
      } catch (err) {
        console.error("Auth state error:", err);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, [setUser, setUserProfile, setLoading]);

  // Sync cart to cloud on changes (debounced)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    const unsub = useCartStore.subscribe((state) => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveCartToCloud(user.id, state.items);
      }, 2000);
    });
    return () => {
      unsub();
      clearTimeout(saveTimer.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-ink-900 text-white flex flex-col">
      <Navbar />
      <main className={`flex-1 ${showMusicPlayer ? "pb-24" : ""}`}>
        <Suspense fallback={<FullPageSpinner />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/reader/:id" element={<ReaderPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/login"
              element={
                <GuestGuard>
                  <LoginPage />
                </GuestGuard>
              }
            />
            <Route
              path="/register"
              element={
                <GuestGuard>
                  <RegisterPage />
                </GuestGuard>
              }
            />
            <Route
              path="/register/success"
              element={
                <GuestGuard>
                  <RegisterSuccessPage />
                </GuestGuard>
              }
            />
            <Route path="/cart" element={<CartPage />} />

            {/* Protected */}
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <DashboardPage />
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <ProfilePage />
                </AuthGuard>
              }
            />
            <Route
              path="/checkout"
              element={
                <AuthGuard>
                  <CheckoutPage />
                </AuthGuard>
              }
            />
            <Route
              path="/orders"
              element={
                <AuthGuard>
                  <OrdersPage />
                </AuthGuard>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <AuthGuard>
                  <OrderDetailPage />
                </AuthGuard>
              }
            />
            <Route
              path="/complaints"
              element={
                <AuthGuard>
                  <ComplaintsPage />
                </AuthGuard>
              }
            />
            <Route
              path="/complaints/new"
              element={
                <AuthGuard>
                  <NewComplaintPage />
                </AuthGuard>
              }
            />
            <Route
              path="/complaints/:id"
              element={
                <AuthGuard>
                  <ComplaintDetailPage />
                </AuthGuard>
              }
            />
          </Routes>
        </Suspense>
      </main>
      {!isLibraryRoute && <Footer />}
      {showMusicPlayer && <MusicPlayer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
}
