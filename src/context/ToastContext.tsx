import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface ToastContextValue {
  toast: (message: string, type?: Toast["type"]) => void;
  pushToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback(
    (message: string, type: Toast["type"] = "info") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ pushToast, toast: pushToast }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const colors = {
    success: "bg-green-500/15 border-green-500/30 text-green-400",
    error: "bg-red-500/15 border-red-500/30 text-red-400",
    info: "bg-blue-500/15 border-blue-500/30 text-blue-400",
    warning: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  };

  return (
    <div
      className={`pointer-events-auto animate-slide-up px-5 py-3 rounded-xl border backdrop-blur-xl shadow-card flex items-center gap-3 min-w-[280px] ${colors[toast.type]}`}
    >
      <span className="text-sm font-semibold flex-1">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="text-white/40 hover:text-white text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
