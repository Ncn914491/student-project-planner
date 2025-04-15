import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Simplified TaskBoard component
function TaskBoard() {
  const [tasks] = useState([
    { 
      id: 1, 
      title: "Wireframe the dashboard", 
      status: "To Do", 
      due: "2025-04-14",
      description: "Create wireframes for all main views"
    },
    { 
      id: 2, 
      title: "Write team notes", 
      status: "In Progress", 
      due: "2025-04-15",
      description: "Document meeting notes and decisions"
    },
    { 
      id: 3, 
      title: "Deploy app", 
      status: "Done", 
      due: "2025-04-16",
      description: "Deploy to Vercel for testing"
    }
  ]);

  const taskStatuses = [
    { name: 'To Do', color: 'text-red-500', bgColor: 'bg-red-50' },
    { name: 'In Progress', color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { name: 'Done', color: 'text-green-500', bgColor: 'bg-green-50' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {taskStatuses.map(status => (
          <div key={status.name} className="space-y-3">
            <div className={`flex items-center gap-2 ${status.color} font-medium`}>
              {status.name === 'To Do' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" x2="12" y1="8" y2="12"/>
                  <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
              )}
              {status.name === 'In Progress' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              )}
              {status.name === 'Done' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              )}
              <span>{status.name}</span>
              <span className="ml-1 text-gray-400 text-sm">
                ({tasks.filter(task => task.status === status.name).length})
              </span>
            </div>
            
            <div className="space-y-2">
              {tasks
                .filter(task => task.status === status.name)
                .map(task => (
                  <div 
                    key={task.id}
                    className={`${status.bgColor} p-3 rounded-lg border border-gray-200 shadow-sm`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <span className="text-xs text-gray-500">{task.due}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simplified Header component
function Header() {
  return (
    <header className="bg-white rounded-xl shadow-md p-6 mb-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="text-blue-500">
              {/* Icon placeholder */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50"></div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Student Project Planner
            </h1>
            <div className="flex items-center gap-1 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
              <span className="text-xs text-blue-500">Organize • Track • Succeed</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Header />
        <TaskBoard />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
