import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'success', duration = 3500 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast = { id, title, message, type, duration };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (title, message) => addToast({ title, message, type: 'success' }),
    error: (title, message) => addToast({ title, message, type: 'error' }),
    warning: (title, message) => addToast({ title, message, type: 'warning' }),
    info: (title, message) => addToast({ title, message, type: 'info' }),
    remove: removeToast
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast Notification Container */}
      <div 
        role="region" 
        aria-live="polite"
        className="fixed top-20 right-4 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const isSuccess = t.type === 'success';
            const isError = t.type === 'error';
            const isWarning = t.type === 'warning';

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-start gap-3 relative overflow-hidden ${
                  isSuccess
                    ? 'bg-[#075E54] text-white border-emerald-600/40 shadow-[#075E54]/20'
                    : isError
                    ? 'bg-[#991B1B] text-white border-rose-600/40 shadow-rose-900/20'
                    : isWarning
                    ? 'bg-[#92400E] text-white border-amber-600/40 shadow-amber-900/20'
                    : 'bg-[#1E293B] text-white border-slate-700/40'
                }`}
              >
                {/* Icon */}
                <div className="mt-0.5 flex-shrink-0">
                  {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                  {isError && <AlertCircle className="w-5 h-5 text-rose-300" />}
                  {isWarning && <AlertTriangle className="w-5 h-5 text-amber-300" />}
                  {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-sky-300" />}
                </div>

                {/* Content */}
                <div className="flex-1 pr-2">
                  {t.title && (
                    <h4 className="text-xs font-bold leading-tight">
                      {t.title}
                    </h4>
                  )}
                  {t.message && (
                    <p className="text-[11px] text-white/90 mt-0.5 leading-relaxed">
                      {t.message}
                    </p>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(t.id)}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Animated timer bar at bottom */}
                {t.duration > 0 && (
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: 0 }}
                    transition={{ duration: t.duration / 1000, ease: 'linear' }}
                    className="absolute bottom-0 left-0 h-1 bg-white/30"
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

