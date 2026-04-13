import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "danger";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyles = {
    primary:
      "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20",
    ghost: "bg-white/90 text-slate-900 hover:bg-white border border-border",
    outline:
      "bg-transparent text-white border border-white/20 hover:bg-white/10",
    danger: "bg-red-600 text-white hover:bg-red-500",
  };

  return (
    <button className={cn(base, variantStyles[variant], className)} {...props}>
      {children}
    </button>
  );
}
