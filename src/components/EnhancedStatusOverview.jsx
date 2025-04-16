import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, X, Users, ChevronDown, ChevronUp, Calendar, AlertTriangle, TrendingUp, Activity, Zap, BarChart2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { format, parseISO, isValid } from 'date-fns';

export default function EnhancedStatusOverview({ tasks = [], projectData = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['To Do', 'In Progress', 'Done']);
  const { isDarkMode } = useTheme();
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid date';
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'To Do').length;

  useEffect(() => {
    // Calculate days remaining until deadline
    if (projectData.deadline) {
      const today = new Date();
      const deadline = new Date(projectData.deadline);
      const timeDiff = deadline - today;
      setDaysRemaining(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
    }

    // Calculate percentage complete
    if (totalTasks > 0) {
      setPercentComplete(Math.round((completedTasks / totalTasks) * 100));
    }
  }, [tasks, projectData, completedTasks, totalTasks]);

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

  // We're using the formatDate function defined above

  return (
    <div className="card">
      <div className="card-header mb-1">
        <h2 className="section-title text-sm">Project Status</h2>
      </div>

      {/* Project Status Overview - Horizontal Layout */}
      <div className="flex flex-wrap gap-1 mb-1">
        {/* Project Deadline Section */}
        <div className="flex-1 p-1 bg-gray-50 dark:bg-slate-800/50 rounded-md border border-gray-200 dark:border-slate-700/50 shadow-sm min-w-[180px]">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
              Project Deadline
            </h3>
            {daysRemaining <= 14 && (
              <span className="badge badge-yellow flex items-center gap-1">
                <AlertTriangle size={12} />
                Approaching
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-800 dark:text-slate-200">
                {projectData.deadline ? formatDate(projectData.deadline) : 'Not set'}
              </span>
              <span className="text-sm text-gray-600 dark:text-slate-400">
                {daysRemaining > 0
                  ? `${daysRemaining} days remaining`
                  : daysRemaining === 0
                    ? 'Due today!'
                    : 'Overdue'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="flex-1 p-1 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700/50 shadow-sm flex items-center justify-center min-w-[180px]">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  className="text-gray-200 dark:text-gray-600"
                  strokeWidth="5"
                  stroke="currentColor"
                  fill="transparent"
                  r="24"
                  cx="32"
                  cy="32"
                />
                <circle
                  className={`${
                    percentComplete >= 75 ? 'text-green-500 dark:text-green-400' :
                    percentComplete >= 50 ? 'text-blue-500 dark:text-blue-400' :
                    percentComplete >= 25 ? 'text-amber-500 dark:text-amber-400' :
                    'text-red-500 dark:text-red-400'
                  }`}
                  strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - percentComplete / 100)}`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="24"
                  cx="32"
                  cy="32"
                />
              </svg>
              <span className="absolute text-sm font-bold text-gray-800 dark:text-slate-200">
                {percentComplete}%
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-400">
              <div className="font-medium">Overall Progress</div>
              <div>{completedTasks} of {totalTasks} tasks</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-1">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} p-1 rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1 border border-gray-200 dark:border-gray-700/30 flex-1 min-w-[100px]`}
          >
            <div className="bg-white dark:bg-gray-800 p-1.5 rounded-full">
              <stat.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-xs">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300">Progress Timeline</h3>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-300">{percentComplete}%</span>
            {completedTasks > 0 && (
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-0.5">
                <TrendingUp size={12} />
                +{completedTasks} completed
              </span>
            )}
          </div>
        </div>

        {/* Interactive progress bar */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:h-3 relative overflow-hidden"
          aria-label="View detailed task breakdown"
        >
          <div
            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out transform origin-left"
            style={{ width: `${percentComplete > 0 ? percentComplete : 3}%` }}
          ></div>
          {percentComplete === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] text-gray-400 dark:text-gray-500 px-1.5">No progress yet</span>
            </div>
          )}
        </button>

        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-slate-400">
          <span>Started: {projectData.startDate ? formatDate(projectData.startDate) : 'N/A'}</span>
          <span>Deadline: {projectData.deadline ? formatDate(projectData.deadline) : 'N/A'}</span>
        </div>
      </div>

      {/* Project Sections */}
      <div className="mb-1">
        <h3 className="text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Project Sections</h3>
        <div className="flex flex-wrap gap-1">
          {tasksBySection.map(({ section, completedTasks, totalTasks }) => (
            <div key={section} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                section === 'UI' ? 'bg-purple-500' :
                section === 'API' ? 'bg-indigo-500' :
                section === 'Testing' ? 'bg-emerald-500' :
                section === 'Documentation' ? 'bg-blue-500' :
                section === 'Security' ? 'bg-red-500' :
                section === 'Infrastructure' ? 'bg-amber-500' : 'bg-gray-500'
              }`}></div>
              <span className="text-sm text-gray-700 dark:text-slate-300 flex-1">{section}</span>
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-in-out transform origin-left ${
                    section === 'UI' ? 'bg-purple-500' :
                    section === 'API' ? 'bg-indigo-500' :
                    section === 'Testing' ? 'bg-emerald-500' :
                    section === 'Documentation' ? 'bg-blue-500' :
                    section === 'Security' ? 'bg-red-500' :
                    section === 'Infrastructure' ? 'bg-amber-500' : 'bg-gray-500'
                  }`}
                  style={{ width: `${totalTasks > 0 ? Math.max((completedTasks / totalTasks) * 100, 3) : 3}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-slate-400 w-16 text-right">
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
              className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-100 dark:border-slate-700/50 ${isDarkMode ? 'dark' : ''}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Task Breakdown</h2>
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
                                  <span className={`badge ${
                                    task.priority === 'high' ? 'badge-red' :
                                    task.priority === 'medium' ? 'badge-yellow' :
                                    'badge-blue'
                                  }`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">{task.description}</p>
                                <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                  <span>Due: {task.due ? formatDate(task.due) : 'Not set'}</span>
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
