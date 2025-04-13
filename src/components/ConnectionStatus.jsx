import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useToast } from './Toast';

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsReconnecting(false);
      addToast('Connection restored', 'success');
      // Hide banner after a delay
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
      addToast('Connection lost', 'error');
    };

    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health-check');
        if (!response.ok) throw new Error('Health check failed');
        setIsReconnecting(false);
      } catch (error) {
        setIsReconnecting(true);
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set up periodic connection check when offline
    let intervalId;
    if (!isOnline) {
      intervalId = setInterval(checkConnection, 5000);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOnline, addToast]);

  return (
    <AnimatePresence>
      {(!isOnline || showBanner) && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 inset-x-0 z-50"
        >
          <div className={`w-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 flex-1">
                  {isOnline ? (
                    <>
                      <Wifi className="text-white" size={20} />
                      <p className="text-white font-medium text-sm">
                        Connection restored
                      </p>
                    </>
                  ) : (
                    <>
                      <WifiOff className="text-white" size={20} />
                      <div>
                        <p className="text-white font-medium text-sm">
                          You are currently offline
                        </p>
                        <p className="text-white/80 text-xs">
                          {isReconnecting ? 'Attempting to reconnect...' : 'Check your internet connection'}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {isReconnecting && (
                  <div className="flex-shrink-0">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  </div>
                )}

                {!isReconnecting && showBanner && isOnline && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowBanner(false)}
                    className="text-white/80 hover:text-white"
                    aria-label="Dismiss message"
                  >
                    <span className="sr-only">Dismiss</span>
                    <AlertCircle size={20} />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}