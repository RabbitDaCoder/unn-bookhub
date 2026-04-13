import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useStore";
import FullPageSpinner from "../components/ui/FullPageSpinner";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({
  children,
  requireAdmin = false,
}: AuthGuardProps) {
  const { user, userProfile, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && userProfile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
