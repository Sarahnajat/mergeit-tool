"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastInput {
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<ToastType, string> = {
  success: "border-primary/25 bg-primary/5 text-foreground shadow-primary/10",
  error: "border-destructive/25 bg-destructive/5 text-foreground shadow-destructive/10",
};

function ToolToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 4500);
    return () => window.clearTimeout(timer);
  }, [onDismiss, toast.id]);

  const isSuccess = toast.type === "success";

  return (
    <motion.div
      layout
      role="alert"
      aria-live="polite"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn(
        "pointer-events-auto relative flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-lg backdrop-blur-md",
        toastStyles[toast.type],
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border",
          isSuccess
            ? "border-primary/20 bg-primary/10 text-primary"
            : "border-destructive/20 bg-destructive/10 text-destructive",
        )}
      >
        {isSuccess ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
      </div>

      <div className="min-w-0 flex-1 pr-6 text-left">
        <p className="text-sm font-semibold leading-tight">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{toast.message}</p>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="absolute right-2 top-2 size-7 text-muted-foreground hover:bg-background/60"
      >
        <X className="size-4" />
      </Button>
    </motion.div>
  );
}

function ToolToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4">
      <div className="flex w-full max-w-md flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToolToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: ToastInput) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current.slice(-2), { ...toast, id }]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToolToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToolToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToolToast must be used within ToastProvider.");
  }
  return context;
}
