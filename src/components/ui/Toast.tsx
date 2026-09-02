import { type ReactNode, createContext, useCallback, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'info' | 'error';
interface Toast { id: number; message: string; type: ToastType }

const ToastContext = createContext<{ push: (message: string, type?: ToastType) => void }>({ push: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    info: <Info className="w-5 h-5 text-brand-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              className="glass-strong rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 max-w-sm"
            >
              {icons[t.type]}
              <span className="text-sm font-medium">{t.message}</span>
              <button onClick={() => setToasts((toasts) => toasts.filter((x) => x.id !== t.id))} className="ml-2 text-muted hover:text-[rgb(var(--text))]">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
