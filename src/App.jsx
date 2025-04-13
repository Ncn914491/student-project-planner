import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';
import DeadlineCountdown from './components/DeadlineCountdown';
import ProjectNotes from './components/ProjectNotes';
import TeamProgress from './components/TeamProgress';
import StatusOverview from './components/StatusOverview';
import { ToastProvider, useToast } from './components/Toast';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import SearchModal from './components/SearchModal';
import HelpModal from './components/HelpModal';
import ErrorBoundary from './components/ErrorBoundary';
import ConnectionStatus from './components/ConnectionStatus';
import PageLoading from './components/PageLoading';
import CommandPalette from './components/CommandPalette';

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyboardAction = (action) => {
    switch (action) {
      case 'search':
        setIsSearchOpen(true);
        break;
      case 'toggleHelp':
        setIsHelpOpen(true);
        break;
      case 'closeModal':
        setIsSearchOpen(false);
        setIsHelpOpen(false);
        setIsCommandPaletteOpen(false);
        break;
      case 'openCommandPalette':
        setIsCommandPaletteOpen(true);
        break;
    }
  };

  const handleCommandAction = (commandId) => {
    switch (commandId) {
      case 'new-task':
        addToast('Creating new task...', 'info');
        // Add task creation logic
        break;
      case 'new-note':
        addToast('Creating new note...', 'info');
        // Add note creation logic
        break;
      case 'assign-task':
        addToast('Opening task assignment...', 'info');
        // Add task assignment logic
        break;
      case 'view-deadlines':
        addToast('Showing deadlines...', 'info');
        // Add deadline view logic
        break;
      case 'complete-task':
        addToast('Opening task completion...', 'info');
        // Add task completion logic
        break;
      case 'toggle-theme':
        addToast('Toggling theme...', 'info');
        // Add theme toggle logic
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 px-6 py-8">
      <KeyboardShortcuts onAction={handleKeyboardAction} />
      <ConnectionStatus />
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <PageLoading />
        ) : (
          <div className="max-w-7xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Header 
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenHelp={() => setIsHelpOpen(true)}
                onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              />
            </motion.div>
            
            <Suspense fallback={<PageLoading />}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div 
                  className="lg:col-span-2 space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <ErrorBoundary>
                    <TaskBoard />
                  </ErrorBoundary>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ErrorBoundary>
                      <ProjectNotes />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <DeadlineCountdown />
                    </ErrorBoundary>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <ErrorBoundary>
                    <StatusOverview />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <TeamProgress />
                  </ErrorBoundary>
                </motion.div>
              </div>
            </Suspense>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchModal 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
          />
        )}
        {isHelpOpen && (
          <HelpModal 
            isOpen={isHelpOpen} 
            onClose={() => setIsHelpOpen(false)} 
          />
        )}
        {isCommandPaletteOpen && (
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onAction={handleCommandAction}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
