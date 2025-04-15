import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ToastProvider } from './components/Toast';

import Header from './components/Header';
import TaskBoard from './components/TaskBoard';
import ProjectNotes from './components/ProjectNotes';
import DeadlineCountdown from './components/DeadlineCountdown';
import StatusOverview from './components/StatusOverview';
import TeamProgress from './components/TeamProgress';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Header />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <TaskBoard />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProjectNotes />
                <DeadlineCountdown />
              </div>
            </div>

            <div className="space-y-6">
              <StatusOverview />
              <TeamProgress />
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
