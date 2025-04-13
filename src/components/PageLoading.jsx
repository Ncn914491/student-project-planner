import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

export default function PageLoading({ isLoading, children }) {
  const [progress, setProgress] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let progressInterval;
    let spinnerTimeout;

    if (isLoading) {
      // Start progress bar immediately
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev; // Stop at 90% until actually loaded
          return prev + Math.random() * 15;
        });
      }, 500);

      // Show spinner after 1s of loading
      spinnerTimeout = setTimeout(() => {
        setShowSpinner(true);
      }, 1000);
    } else {
      // Complete the progress bar
      setProgress(100);
      setShowSpinner(false);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (spinnerTimeout) clearTimeout(spinnerTimeout);
    };
  }, [isLoading]);

  return (
    <div className="relative min-h-screen">
      {/* Progress bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut" }}
            style={{ transformOrigin: '0%' }}
          />
        )}
      </AnimatePresence>

      {/* Content with blur effect while loading */}
      <motion.div
        animate={{
          opacity: isLoading ? 0.5 : 1,
          filter: isLoading ? 'blur(2px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Centered spinner */}
      <AnimatePresence>
        {isLoading && showSpinner && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <LoadingSpinner size={40} color="blue" label="Loading page content..." />
              <p className="mt-2 text-sm text-gray-600 text-center animate-pulse">
                Loading...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}