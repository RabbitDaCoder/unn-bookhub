import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useStore";
import { FullPageSpinner } from "./ui/FullPageSpinner";

interface GuestGuardProps {
  children: ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { user, loading } = useAuthStore();

  if (loading) return <FullPageSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
