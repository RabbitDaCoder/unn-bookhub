import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore, useUIStore } from "./store/useStore";
import { onAuthChange, getUserFromFirestore } from "./firebase";
import { cn } from "./lib/utils";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthGuard from "./components/AuthGuard";
import { ToastProvider } from "./components/ui/ToastContext";

import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetail";
import Library from "./pages/Library";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import Complaints from "./pages/Complaints";
import NewComplaint from "./pages/NewComplaint";
import ComplaintDetail from "./pages/ComplaintDetail";
import VerifyReceipt from "./pages/VerifyReceipt";
import Admin from "./pages/Admin";

export default function App() {
  const { theme } = useUIStore();
  const setUser = useAuthStore((state) => state.setUser);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserFromFirestore(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setUserProfile, setLoading]);

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col transition-colors duration-300",
        theme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-900",
      )}
    >
      <ToastProvider>
        <Router>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/library" element={<Library />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-receipt" element={<VerifyReceipt />} />
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
              <Route path="/cart" element={<CartPage />} />
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
                    <Complaints />
                  </AuthGuard>
                }
              />
              <Route
                path="/complaints/new"
                element={
                  <AuthGuard>
                    <NewComplaint />
                  </AuthGuard>
                }
              />
              <Route
                path="/complaints/:id"
                element={
                  <AuthGuard>
                    <ComplaintDetail />
                  </AuthGuard>
                }
              />
              <Route
                path="/admin"
                element={
                  <AuthGuard requireAdmin>
                    <Admin />
                  </AuthGuard>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </ToastProvider>
    </div>
  );
}
