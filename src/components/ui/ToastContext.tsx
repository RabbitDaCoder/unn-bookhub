import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Toast from "./Toast";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  pushToast: (toast: {
    title?: string;
    message: string;
    variant?: ToastVariant;
  }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = ({
    title,
    message,
    variant = "info",
  }: {
    title?: string;
    message: string;
    variant?: ToastVariant;
  }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    setToasts((current: ToastItem[]) => [
      { id, title, message, variant },
      ...current,
    ]);
  };

  useEffect(() => {
    if (!toasts.length) {
      return;
    }

    const timers = toasts.map((toast: ToastItem) =>
      window.setTimeout(() => {
        setToasts((current: ToastItem[]) =>
          current.filter((item: ToastItem) => item.id !== toast.id),
        );
      }, 4200),
    );

    return () => timers.forEach(window.clearTimeout);
  }, [toasts]);

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0">
        {toasts.map((toast: ToastItem) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              title={toast.title}
              message={toast.message}
              variant={toast.variant}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
