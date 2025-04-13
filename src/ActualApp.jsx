import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Import your actual components
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';
import ProjectNotes from './components/ProjectNotes';
import DeadlineCountdown from './components/DeadlineCountdown';
import { ToastProvider } from './components/Toast';

// Simplified App component that uses your actual components
function App() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isHelpOpen, setIsHelpOpen] = React.useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-md p-4">
              <TaskBoard />
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <ProjectNotes projectId={1} />
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <DeadlineCountdown />
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
