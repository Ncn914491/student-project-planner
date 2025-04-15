import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, X, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function RefactoredStatusOverview({ tasks = [], teamMembers = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['To Do', 'In Progress', 'Done']);
  const { isDarkMode } = useTheme();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'To Do').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group tasks by section (UI, API, Testing, etc.)
  const sections = [...new Set(tasks.map(task => task.section))];
  const tasksBySection = sections.map(section => {
    const sectionTasks = tasks.filter(task => task.section === section);
    return {
      section,
      tasks: sectionTasks,
      completedTasks: sectionTasks.filter(task => task.status === 'Done').length,
      totalTasks: sectionTasks.length
    };
  });

  const stats = [
    { 
      label: "Total Tasks", 
      value: totalTasks, 
      icon: Users, 
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
    },
    { 
      label: "Completed", 
      value: completedTasks, 
      icon: CheckCircle, 
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
    },
    { 
      label: "In Progress", 
      value: inProgressTasks, 
      icon: Clock, 
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" 
    },
    { 
      label: "Pending", 
      value: pendingTasks, 
      icon: AlertCircle, 
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" 
    }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="section-title">Project Status</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.color} p-4 rounded-xl transition-all duration-200 hover:shadow-soft flex items-center gap-3`}
          >
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</h3>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{progressPercentage}%</span>
        </div>
        
        {/* Interactive progress bar */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:h-3"
          aria-label="View detailed task breakdown"
        >
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </button>
        
        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>Started: May 1, 2025</span>
          <span>Deadline: July 15, 2025</span>
        </div>
      </div>
      
      {/* Team Member Sections */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Project Sections</h3>
        <div className="space-y-3">
          {tasksBySection.map(({ section, completedTasks, totalTasks }) => (
            <div key={section} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                section === 'UI' ? 'bg-purple-500' :
                section === 'API' ? 'bg-indigo-500' :
                section === 'Testing' ? 'bg-emerald-500' : 'bg-gray-500'
              }`}></div>
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{section}</span>
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-full rounded-full ${
                    section === 'UI' ? 'bg-purple-500' :
                    section === 'API' ? 'bg-indigo-500' :
                    section === 'Testing' ? 'bg-emerald-500' : 'bg-gray-500'
                  }`}
                  style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 w-16 text-right">
                {completedTasks}/{totalTasks}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Task Breakdown Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-elevated p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto ${isDarkMode ? 'dark' : ''}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Task Breakdown</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {['To Do', 'In Progress', 'Done'].map(status => (
                  <div key={status} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <button 
                      className={`w-full flex justify-between items-center p-3.5 ${
                        status === 'To Do' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                        status === 'In Progress' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                        'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      } font-medium focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      onClick={() => toggleSection(status)}
                      aria-expanded={expandedSections.includes(status)}
                    >
                      <div className="flex items-center gap-2">
                        {status === 'To Do' && <AlertCircle size={18} />}
                        {status === 'In Progress' && <Clock size={18} />}
                        {status === 'Done' && <CheckCircle size={18} />}
                        <span>{status}</span>
                        <span className="ml-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                          {tasks.filter(task => task.status === status).length}
                        </span>
                      </div>
                      {expandedSections.includes(status) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    
                    <AnimatePresence>
                      {expandedSections.includes(status) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {tasks.filter(task => task.status === status).map(task => (
                              <li key={task.id} className="p-3.5 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-800 dark:text-gray-200">{task.title}</span>
                                  <span className={`tag ${
                                    task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' :
                                    task.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300' :
                                    'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                  }`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">{task.description}</p>
                                <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                  <span>Due: {task.due}</span>
                                  <span>
                                    Section: {task.section}
                                  </span>
                                </div>
                              </li>
                            ))}
                            {tasks.filter(task => task.status === status).length === 0 && (
                              <li className="p-3.5 text-sm text-gray-500 dark:text-gray-400 italic">
                                No tasks in this status
                              </li>
                            )}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
