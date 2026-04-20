import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useStore";
import { FullPageSpinner } from "./ui/FullPageSpinner";

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, userProfile, loading } = useAuthStore();

  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && userProfile?.role !== "admin")
    return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
