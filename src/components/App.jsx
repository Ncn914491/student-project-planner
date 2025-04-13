import { useState } from 'react';
import CommandBar from './CommandBar';
import KeyboardShortcuts from './KeyboardShortcuts';
import ConnectionStatus from './ConnectionStatus';
import Header from './Header';
import TaskBoard from './TaskBoard';
import ProjectNotes from './ProjectNotes';
import DeadlineCountdown from './DeadlineCountdown';
import TeamProgress from './TeamProgress';
import { ToastProvider } from './Toast';

export default function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const handleKeyboardAction = (action) => {
    // Handle keyboard actions
    console.log('Keyboard action:', action);
    if (action === 'openCommandPalette') {
      setIsCommandPaletteOpen(true);
    }
  };

  const handleCommandAction = (action) => {
    console.log('Command action:', action);
    // Handle command actions
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 px-6 py-8">
        <KeyboardShortcuts onAction={handleKeyboardAction} />
        <CommandBar
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onAction={handleCommandAction}
        />
        <ConnectionStatus />

        <div className="max-w-6xl mx-auto">
          <Header />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-md p-4">
              <TaskBoard />
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <ProjectNotes />
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <DeadlineCountdown />
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <TeamProgress />
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}