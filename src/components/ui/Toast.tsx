interface ToastProps {
  title?: string;
  message: string;
  variant: "success" | "error" | "info";
}

const variantStyles: Record<ToastProps["variant"], string> = {
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
  error: "border-red-500/20 bg-red-500/10 text-red-100",
  info: "border-sky-500/20 bg-sky-500/10 text-sky-100",
};

export default function Toast({ title, message, variant }: ToastProps) {
  return (
    <div
      className={`max-w-sm rounded-3xl border p-4 shadow-2xl shadow-black/20 backdrop-blur ${variantStyles[variant]}`}
    >
      {title && <div className="mb-1 text-sm font-semibold">{title}</div>}
      <p className="text-sm leading-6 text-current">{message}</p>
    </div>
  );
}
