import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmDialogContext = createContext(null);

export const ConfirmDialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    tone: "danger",
    resolve: null,
  });

  const closeDialog = useCallback((result) => {
    if (dialog.resolve) {
      dialog.resolve(result);
    }

    setDialog((prev) => ({
      ...prev,
      open: false,
      resolve: null,
    }));
  }, [dialog]);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setDialog({
        open: true,
        title: options.title || "Please confirm",
        message: options.message || "Are you sure you want to continue?",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        tone: options.tone || "danger",
        resolve,
      });
    });
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}

      {dialog.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => closeDialog(false)}
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
            aria-label="Close confirmation dialog"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div>
                  <h3 id="confirm-dialog-title" className="text-base font-bold text-slate-900">
                    {dialog.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{dialog.message}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2.5">
                <button type="button" onClick={() => closeDialog(false)} className="btn-secondary px-4 py-2 text-sm">
                  {dialog.cancelText}
                </button>

                <button
                  type="button"
                  onClick={() => closeDialog(true)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors ${
                    dialog.tone === "danger"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {dialog.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);

  if (!context) {
    throw new Error("useConfirmDialog must be used within ConfirmDialogProvider");
  }

  return context;
};
