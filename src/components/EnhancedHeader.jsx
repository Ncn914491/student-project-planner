import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function EnhancedHeader({ projectData }) {
  const { isDarkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showInfo, setShowInfo] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Calculate days remaining until deadline
  const calculateDaysRemaining = () => {
    const today = new Date();
    const deadline = new Date(projectData.deadline);
    const timeDiff = deadline - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = calculateDaysRemaining();
  const isUrgent = daysRemaining <= 14; // Consider urgent if less than 2 weeks remaining

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-6 relative overflow-hidden transition-all duration-200"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="text-blue-600 dark:text-blue-500">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="36" 
                height="36" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="animate-pulse-subtle"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
              <div className="absolute inset-0 bg-blue-500 dark:bg-blue-400 rounded-full blur-xl opacity-40"></div>
            </div>
          </div>
          <div>
            <motion.h1 
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {projectData.name}
            </motion.h1>
            <div className="flex items-center gap-1.5 mt-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-blue-600 dark:text-blue-500"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-500">Organize • Track • Succeed</span>
              <button 
                onClick={() => setShowInfo(!showInfo)}
                className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showInfo ? "Hide project info" : "Show project info"}
              >
                {showInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 self-end md:self-auto">
          <div className="flex items-center gap-3">
            <div className={`${isUrgent ? 'countdown-badge' : 'deadline-badge'}`}>
              <Calendar size={16} />
              <span>
                {isUrgent 
                  ? `${daysRemaining} days left` 
                  : new Date(projectData.deadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                }
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Timeline</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium">Start:</span>
                      <span>{new Date(projectData.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium">Deadline:</span>
                      <span className={isUrgent ? "text-amber-600 dark:text-amber-400 font-medium" : ""}>
                        {new Date(projectData.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium">Current:</span>
                      <span>{currentTime.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Time</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {currentTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
              </div>
              
              {projectData.description && (
                <div className="flex items-start gap-2 md:ml-auto md:max-w-xs">
                  <div>
                    <p className="text-sm italic text-gray-600 dark:text-gray-400">
                      "{projectData.description}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// Helper component for AnimatePresence
const AnimatePresence = ({ children }) => {
  return children;
};
