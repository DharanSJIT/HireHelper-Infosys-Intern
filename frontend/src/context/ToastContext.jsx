import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

const ToastContext = createContext(null);

const TOAST_TONE_MAP = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
    progressClass: "bg-emerald-500",
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-600",
    progressClass: "bg-red-500",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-600",
    progressClass: "bg-blue-500",
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, closing: true } : toast)),
    );

    window.setTimeout(() => {
      removeToast(id);
    }, 260);
  }, [removeToast]);

  const pushToast = useCallback((options = {}) => {
    idRef.current += 1;

    const id = idRef.current;
    const toast = {
      id,
      title: options.title || "Update",
      message: options.message || "Action completed successfully.",
      tone: options.tone || "info",
      duration: options.duration ?? 3600,
      closing: false,
    };

    setToasts((prev) => [...prev, toast]);

    if (toast.duration > 0) {
      window.setTimeout(() => {
        dismissToast(id);
      }, toast.duration);
    }

    return id;
  }, [dismissToast]);

  const value = useMemo(
    () => ({
      toast: {
        show: pushToast,
        success: (title, message, duration = 3600) =>
          pushToast({ tone: "success", title, message, duration }),
        error: (title, message, duration = 4200) =>
          pushToast({ tone: "error", title, message, duration }),
        info: (title, message, duration = 3600) =>
          pushToast({ tone: "info", title, message, duration }),
        dismiss: dismissToast,
      },
    }),
    [pushToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="app-toast-region" aria-live="polite" aria-atomic="true">
        {toasts.map((toastItem) => {
          const toneMeta = TOAST_TONE_MAP[toastItem.tone] || TOAST_TONE_MAP.info;
          const Icon = toneMeta.icon;

          return (
            <div
              key={toastItem.id}
              className={`app-toast ${toastItem.closing ? "app-toast-exit" : "app-toast-enter"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${toneMeta.iconClass}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">{toastItem.title}</p>
                  <p className="text-sm text-slate-600 mt-1 leading-snug">{toastItem.message}</p>
                </div>

                <button
                  type="button"
                  onClick={() => dismissToast(toastItem.id)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="app-toast-progress-track mt-3">
                <div
                  className={`app-toast-progress ${toneMeta.progressClass}`}
                  style={{ animationDuration: `${toastItem.duration}ms` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};
