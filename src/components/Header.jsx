import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Quote, GraduationCap, Sun, Moon, Sparkles, Search, HelpCircle, Command } from 'lucide-react';

const ParticleEffect = () => {
  const particles = Array.from({ length: 15 });
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-500/20 rounded-full"
          initial={{ 
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            scale: 0
          }}
          animate={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            scale: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

export default function Header({ onOpenSearch, onOpenHelp, onOpenCommandPalette }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDark, setIsDark] = useState(false);
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Show quote after a small delay
    const quoteTimer = setTimeout(() => {
      setShowQuote(true);
    }, 500);

    return () => {
      clearInterval(timer);
      clearTimeout(quoteTimer);
    };
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Here you would typically update your app's theme context
  };

  return (
    <motion.header 
      className={`bg-white relative rounded-xl shadow-md p-6 overflow-hidden ${isDark ? 'dark bg-gray-800' : ''} border-4 border-green-500`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ParticleEffect />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <GraduationCap size={32} className="text-blue-500" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50"
            />
          </motion.div>
          <div>
            <motion.h1 
              className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Student Project Planner
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1 mt-1"
            >
              <Sparkles size={14} className="text-blue-500" />
              <span className="text-xs text-blue-500">Organize • Track • Succeed</span>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <motion.div 
            className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            whileHover={{ scale: 1.05 }}
          >
            <Calendar size={18} className="text-blue-500" />
            <span className="text-sm">{formatDate(currentTime)}</span>
          </motion.div>
          <motion.div 
            className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            whileHover={{ scale: 1.05 }}
          >
            <Clock size={18} className="text-blue-500" />
            <span className="text-sm font-mono">{formatTime(currentTime)}</span>
          </motion.div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCommandPalette}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-2"
            >
              <Command size={16} />
              <div className="hidden sm:flex items-center gap-1">
                <kbd className="text-xs px-1.5 py-0.5 rounded bg-white text-gray-500">
                  {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                </kbd>
                <kbd className="text-xs px-1.5 py-0.5 rounded bg-white text-gray-500">K</kbd>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSearch}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-1"
            >
              <Search size={16} />
              <kbd className="text-xs px-1.5 py-0.5 rounded bg-white text-gray-500">/</kbd>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenHelp}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-1"
            >
              <HelpCircle size={16} />
              <kbd className="text-xs px-1.5 py-0.5 rounded bg-white text-gray-500">?</kbd>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'
              } hover:bg-gray-200`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showQuote && (
          <motion.div 
            className={`mt-4 text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-start gap-2`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Quote size={16} className="text-blue-500 flex-shrink-0 mt-1" />
            <p className="leading-relaxed">
              "Coming together is a beginning, keeping together is progress, working together is success."
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
