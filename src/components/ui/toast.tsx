"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (options: { type?: ToastType; title: string; description?: string; duration?: number }) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const toast = React.useCallback(
    ({
      type = "info",
      title,
      description,
      duration = 4000,
    }: {
      type?: ToastType;
      title: string;
      description?: string;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, description }]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-3.5 rounded-md border shadow-sm bg-white text-slate-800 transition-all animate-in slide-in-from-bottom-2",
              t.type === "success" && "border-emerald-300 bg-emerald-50/40 text-emerald-950",
              t.type === "error" && "border-red-300 bg-red-50/40 text-red-950",
              t.type === "info" && "border-slate-300 bg-white text-slate-900"
            )}
          >
            <div className="shrink-0 pt-0.5">
              {t.type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-700" />}
              {t.type === "error" && <AlertCircle className="h-4 w-4 text-red-700" />}
              {t.type === "info" && <Info className="h-4 w-4 text-teal-700" />}
            </div>
            <div className="flex-1 text-xs">
              <strong className="font-semibold block">{t.title}</strong>
              {t.description && <span className="text-slate-600 mt-0.5 block">{t.description}</span>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1 rounded hover:bg-slate-200/50 text-slate-400 hover:text-slate-700"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
