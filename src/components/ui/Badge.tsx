import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "accent";
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: "bg-white/10 text-white",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
  error: "bg-red-500/15 text-red-300 border border-red-500/20",
  accent: "bg-sky-500/15 text-sky-200 border border-sky-500/20",
};

export default function Badge({
  variant = "default",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.12em]",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
