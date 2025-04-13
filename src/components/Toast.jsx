import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 text-green-800 border-green-200',
    iconClass: 'text-green-500'
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 text-red-800 border-red-200',
    iconClass: 'text-red-500'
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    iconClass: 'text-yellow-500'
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 text-blue-800 border-blue-200',
    iconClass: 'text-blue-500'
  }
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const value = { addToast, removeToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
        role="region"
        aria-label="Notifications"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => {
            const { icon: Icon, className, iconClass } = TOAST_TYPES[toast.type] || TOAST_TYPES.info;

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 40
                }}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-md ${className}`}
                role="alert"
                aria-live="polite"
              >
                <Icon className={`flex-shrink-0 ${iconClass}`} size={20} />
                <p className="flex-1 text-sm font-medium pr-6">{toast.message}</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeToast(toast.id)}
                  className="absolute right-2 top-2 p-1 rounded-full hover:bg-black/5"
                  aria-label="Dismiss notification"
                >
                  <X size={16} />
                </motion.button>
                
                {/* Auto-dismiss progress bar */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0, transition: { duration: toast.duration / 1000 } }}
                  onAnimationComplete={() => removeToast(toast.id)}
                  style={{ originX: 0 }}
                />
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