import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import { ToastProvider } from './components/Toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import ImprovedStatusOverview from './components/ImprovedStatusOverview';
import ImprovedProjectNotes from './components/ImprovedProjectNotes';
import ImprovedTaskBoard from './components/ImprovedTaskBoard';
import ImprovedTeamProgress from './components/ImprovedTeamProgress';

// Sample data
const sampleTasks = [
  { 
    id: 1, 
    title: "Design user dashboard", 
    description: "Create wireframes and mockups for the main dashboard", 
    status: "To Do", 
    priority: "high",
    due: "2025-06-15",
    assignee: 4, // Dana (UI/UX Designer)
    section: "UI"
  },
  { 
    id: 2, 
    title: "Implement API endpoints", 
    description: "Create RESTful API endpoints for user authentication", 
    status: "In Progress", 
    priority: "medium",
    due: "2025-06-20",
    assignee: 3, // Charlie (Backend Developer)
    section: "API"
  },
  { 
    id: 3, 
    title: "Write unit tests", 
    description: "Create comprehensive test suite for core functionality", 
    status: "Done", 
    priority: "low",
    due: "2025-06-10",
    completedDate: "2025-06-09",
    assignee: 2, // Bob (Frontend Developer)
    section: "Testing"
  },
  { 
    id: 4, 
    title: "Fix responsive layout", 
    description: "Ensure the application works well on mobile devices", 
    status: "In Progress", 
    priority: "high",
    due: "2025-06-18",
    assignee: 2, // Bob (Frontend Developer)
    section: "UI"
  },
  { 
    id: 5, 
    title: "Database optimization", 
    description: "Improve query performance for large datasets", 
    status: "To Do", 
    priority: "medium",
    due: "2025-06-25",
    assignee: 3, // Charlie (Backend Developer)
    section: "API"
  },
  { 
    id: 6, 
    title: "User acceptance testing", 
    description: "Coordinate UAT with stakeholders", 
    status: "To Do", 
    priority: "high",
    due: "2025-06-30",
    assignee: 1, // Alice (Project Manager)
    section: "Testing"
  },
  { 
    id: 7, 
    title: "Create user documentation", 
    description: "Write comprehensive user guide", 
    status: "Done", 
    priority: "medium",
    due: "2025-06-05",
    completedDate: "2025-06-04",
    assignee: 1, // Alice (Project Manager)
    section: "UI"
  },
  { 
    id: 8, 
    title: "Implement authentication", 
    description: "Add OAuth2 authentication flow", 
    status: "Done", 
    priority: "high",
    due: "2025-06-08",
    completedDate: "2025-06-07",
    assignee: 3, // Charlie (Backend Developer)
    section: "API"
  },
  { 
    id: 9, 
    title: "Design system integration", 
    description: "Ensure all components follow the design system", 
    status: "In Progress", 
    priority: "medium",
    due: "2025-06-22",
    assignee: 4, // Dana (UI/UX Designer)
    section: "UI"
  }
];

const sampleNotes = [
  {
    id: 1,
    category: 'design',
    title: 'Design System Guidelines',
    content: 'User interface should follow the design system guidelines. Use the approved color palette and typography.\n\nPrimary colors:\n- Blue: #2563eb\n- Green: #10b981\n- Red: #ef4444\n\nTypography:\n- Headings: Inter, sans-serif\n- Body: Inter, sans-serif',
    date: '2025-06-01',
    author: 'Dana'
  },
  {
    id: 2,
    category: 'backend',
    title: 'API Documentation',
    content: 'API endpoints need to be documented using OpenAPI/Swagger.\n\nAuthentication flow:\n1. OAuth2 with JWT tokens\n2. Refresh token mechanism\n3. Role-based access control\n\nDatabase schema is finalized and available in the docs folder.',
    date: '2025-06-05',
    author: 'Charlie'
  },
  {
    id: 3,
    category: 'meeting',
    title: 'Sprint Planning',
    content: 'Team agreed on sprint goals:\n- Complete user authentication\n- Finalize dashboard design\n- Implement task management API\n\nNext review scheduled for June 15. Action items assigned to team members.',
    date: '2025-06-10',
    author: 'Alice'
  }
];

// Simplified Header component
function Header() {
  const { isDarkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 relative overflow-hidden transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="text-blue-500 dark:text-blue-400">
              {/* Icon placeholder */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
              <div className="absolute inset-0 bg-blue-500 dark:bg-blue-400 rounded-full blur-xl opacity-50"></div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Student Project Planner
            </h1>
            <div className="flex items-center gap-1 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-blue-400">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
              <span className="text-xs text-blue-500 dark:text-blue-400">Organize • Track • Succeed</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
              <span>{currentTime.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}</span>
            </div>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
      
      <div className="mt-4 text-sm italic text-gray-600 dark:text-gray-400 flex items-start gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-blue-400 flex-shrink-0 mt-1">
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

// Main App component
function App() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ImprovedTaskBoard initialTasks={sampleTasks} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImprovedProjectNotes initialNotes={sampleNotes} />
              <ImprovedStatusOverview tasks={sampleTasks} />
            </div>
          </div>
          
          <div className="space-y-6">
            <ImprovedTeamProgress tasks={sampleTasks} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the app with providers
function AppWithProviders() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
);
