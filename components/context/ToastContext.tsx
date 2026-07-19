"use client";
import { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_STYLES: Record<ToastType, { border: string; iconBg: string; icon: string }> = {
  success: { border: "border-success", iconBg: "bg-success text-success-foreground", icon: "✓" },
  error: { border: "border-destructive", iconBg: "bg-destructive text-destructive-foreground", icon: "!" },
  info: { border: "border-secondary", iconBg: "bg-secondary text-secondary-foreground", icon: "i" },
};

const AUTO_DISMISS_MS = 4500;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { ...toast, id }]);
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type];
          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border-2 bg-card p-4 shadow-xl ${style.border}`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${style.iconBg}`}
              >
                {style.icon}
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold text-card-foreground">{toast.title}</p>
                {toast.message && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Cerrar alerta"
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
};