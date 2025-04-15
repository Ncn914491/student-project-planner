import React from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import './index.css';
import { ToastProvider } from './components/Toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import RefactoredHeader from './components/RefactoredHeader';
import RefactoredTaskBoard from './components/RefactoredTaskBoard';
import RefactoredProjectNotes from './components/RefactoredProjectNotes';
import RefactoredStatusOverview from './components/RefactoredStatusOverview';
import RefactoredTeamProgress from './components/RefactoredTeamProgress';

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

// Main App component
function App() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen bg-[#f9f9f9] dark:bg-gray-900 p-5 md:p-8 transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <RefactoredHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RefactoredTaskBoard initialTasks={sampleTasks} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RefactoredProjectNotes initialNotes={sampleNotes} />
              <RefactoredStatusOverview tasks={sampleTasks} />
            </div>
          </div>
          
          <div className="space-y-6">
            <RefactoredTeamProgress tasks={sampleTasks} />
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
