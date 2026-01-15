"use client";
import React from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export type Toast = {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number; // ms
};

export type ToastContextValue = {
  show: (toast: Omit<Toast, 'id'> & { id?: string }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
  success: (message: string, opts?: Omit<Partial<Toast>, 'type' | 'message'>) => string;
  error: (message: string, opts?: Omit<Partial<Toast>, 'type' | 'message'>) => string;
  warning: (message: string, opts?: Omit<Partial<Toast>, 'type' | 'message'>) => string;
  info: (message: string, opts?: Omit<Partial<Toast>, 'type' | 'message'>) => string;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast phải được sử dụng trong ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const remove = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showBase = React.useCallback(
    (toast: Omit<Toast, 'id'> & { id?: string }) => {
      const id = toast.id ?? Math.random().toString(36).slice(2);
      const duration = toast.duration ?? 4000;
      const item: Toast = { id, duration, ...toast } as Toast;
      setToasts((prev) => [...prev, item]);
      // Auto dismiss
      if (duration && duration > 0) {
        setTimeout(() => remove(id), duration);
      }
      return id;
    },
    [remove],
  );

  const value: ToastContextValue = React.useMemo(
    () => ({
      show: showBase,
      dismiss: remove,
      clear: () => setToasts([]),
      success: (message, opts) => showBase({ type: 'success', message, ...opts }),
      error: (message, opts) => showBase({ type: 'error', message, ...opts }),
      warning: (message, opts) => showBase({ type: 'warning', message, ...opts }),
      info: (message, opts) => showBase({ type: 'info', message, ...opts }),
    }),
    [remove, showBase],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed top-24 right-4 z-[1000] flex w-full max-w-sm flex-col gap-2 p-2 sm:max-w-md">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const color =
    toast.type === 'success'
      ? 'border-emerald-400/30 bg-emerald-400/65 text-emerald-200'
      : toast.type === 'error'
        ? 'border-rose-400/30 bg-rose-400/65 text-rose-200'
        : toast.type === 'warning'
          ? 'border-amber-400/30 bg-amber-400/20 text-amber-100'
          : 'border-sky-400/30 bg-sky-400/65 text-sky-200';

  const icon = (
    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
      {toast.type === 'success' && '✓'}
      {toast.type === 'error' && '✕'}
      {toast.type === 'warning' && '!'}
      {toast.type === 'info' && 'i'}
    </span>
  );

  return (
    <div className={`pointer-events-auto flex items-start gap-2 rounded-md border p-3 shadow-lg backdrop-blur ${color}`}>
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium">{toast.message}</div>
        {toast.description && (
          <div className="mt-0.5 text-xs/5 text-black/70">{toast.description}</div>
        )}
      </div>
      <button
        aria-label="Close"
        className="ml-1 rounded px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white"
        onClick={onClose}
      >
        Đóng
      </button>
    </div>
  );
}
