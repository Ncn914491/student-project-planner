import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function RefactoredHeader() {
  const { isDarkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="card mb-8 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
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
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Project Planner
            </motion.h1>
            <div className="flex items-center gap-1.5 mt-1.5">
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
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="text-gray-600 dark:text-gray-300 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-gray-500 dark:text-gray-400" />
              <span className="font-medium">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Calendar size={14} className="text-gray-500 dark:text-gray-400" />
              <span>{currentTime.toLocaleDateString('en-US', {
                weekday: 'short', 
                month: 'short', 
                day: 'numeric'
              })}</span>
            </div>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
      
      <div className="mt-5 text-sm italic text-gray-600 dark:text-gray-400 flex items-start gap-2.5 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-blue-600 dark:text-blue-500 flex-shrink-0 mt-1"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
        </svg>
        <p className="leading-relaxed">
          "Coming together is a beginning, keeping together is progress, working together is success."
        </p>
      </div>
    </header>
  );
}
