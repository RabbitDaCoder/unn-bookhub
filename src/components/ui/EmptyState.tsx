import { type ReactNode } from "react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  children,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center text-4xl mx-auto mb-5">
        {icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-ink-900 font-bold text-sm shadow-amber hover:bg-amber-600 hover:-translate-y-0.5 transition-all duration-200"
        >
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  );
}
