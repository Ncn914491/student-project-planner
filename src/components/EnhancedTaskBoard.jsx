import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CheckSquare, Clock, AlertCircle, Calendar, User, X, Plus, Edit, Tag, Search, Filter, SortAsc, SortDesc, TrendingUp, PlusCircle } from 'lucide-react';
import { useToast } from './Toast';
import { useTheme } from '../context/ThemeContext';
import { formatDistanceToNow, format, isValid, parseISO } from 'date-fns';

export default function EnhancedTaskBoard({ initialTasks = [] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isLoading, setIsLoading] = useState(true);
  const [focusedTaskId, setFocusedTaskId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('due');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterSection, setFilterSection] = useState('all');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const taskRefs = useRef(new Map());
  const { addToast } = useToast();
  const { isDarkMode } = useTheme();

  const taskStatuses = [
    {
      name: 'To Do',
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-300',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-100 dark:border-red-800/30',
      ariaLabel: 'Tasks to be started'
    },
    {
      name: 'In Progress',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-300',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-100 dark:border-blue-800/30',
      ariaLabel: 'Tasks in progress'
    },
    {
      name: 'Done',
      icon: CheckSquare,
      color: 'text-green-600 dark:text-green-300',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-100 dark:border-green-800/30',
      ariaLabel: 'Completed tasks'
    }
  ];

  useEffect(() => {
    const loadTasks = async () => {
      try {
        // If we have initial tasks, use them
        if (initialTasks.length > 0) {
          setTasks(initialTasks);
          setIsLoading(false);
          return;
        }

        // Otherwise, simulate API call
        setTimeout(() => {
          setTasks([]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading tasks:', error);
        addToast('Failed to load tasks', 'error');
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [addToast, initialTasks]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId;
    const destinationStatus = result.destination.droppableId;
    const taskId = parseInt(result.draggableId);

    if (sourceStatus === destinationStatus) return;

    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: destinationStatus } : task
    ));

    addToast(`Task moved to ${destinationStatus}`, 'success');
  };

  const handleTaskKeyDown = (e, taskId, currentStatus, taskIndex) => {
    const statuses = taskStatuses.map(s => s.name);
    const currentStatusIndex = statuses.indexOf(currentStatus);

    switch (e.key) {
      case 'ArrowLeft':
        if (currentStatusIndex > 0) {
          moveTask(taskId, statuses[currentStatusIndex - 1]);
        }
        break;
      case 'ArrowRight':
        if (currentStatusIndex < statuses.length - 1) {
          moveTask(taskId, statuses[currentStatusIndex + 1]);
        }
        break;
      case 'ArrowUp':
        if (taskIndex > 0) {
          const prevTask = tasks.filter(t => t.status === currentStatus)[taskIndex - 1];
          if (prevTask) {
            setFocusedTaskId(prevTask.id);
            taskRefs.current.get(prevTask.id)?.focus();
          }
        }
        break;
      case 'ArrowDown':
        const nextTask = tasks.filter(t => t.status === currentStatus)[taskIndex + 1];
        if (nextTask) {
          setFocusedTaskId(nextTask.id);
          taskRefs.current.get(nextTask.id)?.focus();
        }
        break;
      case 'Enter':
      case ' ':
        // Toggle task completion
        if (currentStatus === 'Done') {
          moveTask(taskId, 'To Do');
        } else {
          moveTask(taskId, 'Done');
        }
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    addToast(`Task moved to ${newStatus}`, 'success');
  };

  const openEditModal = (task) => {
    setEditingTask(task ? { ...task } : {
      id: Date.now(),
      title: '',
      description: '',
      status: 'To Do',
      priority: 'medium',
      due: new Date().toISOString().split('T')[0],
      assignee: null,
      section: 'UI'
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const saveTask = () => {
    if (!editingTask.title) {
      addToast('Task title is required', 'error');
      return;
    }

    if (editingTask.id && tasks.some(task => task.id === editingTask.id)) {
      // Update existing task
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? editingTask : task
      ));
      addToast('Task updated successfully', 'success');
    } else {
      // Add new task
      const newTask = {
        ...editingTask,
        id: Date.now()
      };
      setTasks([...tasks, newTask]);
      addToast('Task added successfully', 'success');
    }

    closeModal();
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-200',
          border: 'border-red-200 dark:border-red-800/30',
          icon: <span className="w-2 h-2 rounded-full bg-red-600 mr-1.5"></span>
        };
      case 'medium':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          text: 'text-amber-700 dark:text-amber-200',
          border: 'border-amber-200 dark:border-amber-800/30',
          icon: <span className="w-2 h-2 rounded-full bg-orange-500 mr-1.5"></span>
        };
      case 'low':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-200',
          border: 'border-blue-200 dark:border-blue-800/30',
          icon: <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5"></span>
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-slate-800',
          text: 'text-gray-700 dark:text-slate-200',
          border: 'border-gray-200 dark:border-slate-700',
          icon: <span className="w-2 h-2 rounded-full bg-gray-500 mr-1.5"></span>
        };
    }
  };

  const getSectionStyles = (section) => {
    switch (section) {
      case 'UI':
        return {
          bg: 'badge-purple',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1"></span>
        };
      case 'API':
        return {
          bg: 'badge-indigo',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1"></span>
        };
      case 'Testing':
        return {
          bg: 'badge-emerald',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
        };
      default:
        return {
          bg: 'badge-blue',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span>
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid date';

      // For dates in the past or very near future/past, use relative time
      const now = new Date();
      const diffInDays = Math.abs(Math.floor((now - date) / (1000 * 60 * 60 * 24)));

      if (diffInDays < 30) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else {
        // For dates further away, use a more readable format
        return format(date, 'MMM d, yyyy');
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const TaskCard = ({ task, index, statusStyles }) => {
    const priorityStyles = getPriorityStyles(task.priority);
    const sectionStyles = getSectionStyles(task.section);
    const isDue = task.due && new Date(task.due) < new Date();
    const formattedDate = task.due ? formatDate(task.due) : '';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        tabIndex={0}
        ref={el => taskRefs.current.set(task.id, el)}
        onKeyDown={(e) => handleTaskKeyDown(e, task.id, task.status, index)}
        className="task-card group hover:scale-[1.01] shadow-sm hover:shadow-md active:scale-[0.99] transition-all min-h-[120px] flex flex-col rounded-md p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/50 h-full"
        aria-label={`Task: ${task.title}, status: ${task.status}, priority: ${task.priority}`}
        onClick={() => openDetailModal(task)}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-base line-clamp-1">{task.title}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(task);
            }}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label={`Edit task ${task.title}`}
          >
            <Edit size={14} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`badge ${priorityStyles.bg} ${priorityStyles.text}`}>
            {priorityStyles.icon}
            {task.priority}
          </span>
          <span className={`badge ${sectionStyles.bg}`}>
            {sectionStyles.icon}
            {task.section}
          </span>
        </div>

        <p className="text-gray-700 dark:text-slate-300 text-sm line-clamp-2 mb-3 flex-grow">{task.description}</p>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center mt-auto">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
            <Calendar size={12} />
            <span className={isDue ? 'text-red-500 dark:text-red-300 font-medium' : ''}>
              {formattedDate}
            </span>
          </div>

          <div className="flex gap-2">
            {task.status !== 'Done' && (
              <button
                onClick={() => moveTask(task.id, 'Done')}
                className="btn-sm btn-success"
                aria-label={`Mark task ${task.title} as done`}
              >
                Done
              </button>
            )}
            {task.status === 'Done' && (
              <button
                onClick={() => moveTask(task.id, 'To Do')}
                className="btn-sm btn-warning"
                aria-label={`Mark task ${task.title} as to do`}
              >
                Undo
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const TaskSkeleton = () => (
    <div className="task-card animate-pulse rounded-lg p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/50 shadow-sm min-h-[180px] h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-5"></div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-3"></div>
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  );

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Priority filter
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

      // Section filter
      const matchesSection = filterSection === 'all' || task.section === filterSection;

      return matchesSearch && matchesPriority && matchesSection;
    })
    .sort((a, b) => {
      // Sort by selected field
      let comparison = 0;

      switch(sortBy) {
        case 'due':
          comparison = new Date(a.due) - new Date(b.due);
          break;
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }

      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const openDetailModal = (task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <section className="card" aria-label="Task Management Board">
      <div className="card-header mb-1 flex justify-between items-center">
        <h2 className="section-title text-sm">Tasks</h2>
        <button
          onClick={() => openEditModal({ status: 'To Do' })}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm hover:shadow transition-all focus:outline-none active:scale-95"
        >
          <PlusCircle size={14} />
          <span>Add</span>
        </button>

      </div>

      {/* Search and filter bar */}
      <div className="mb-1 flex flex-wrap gap-1">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-2 py-1 text-sm w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none dark:bg-gray-700 dark:text-gray-100 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 appearance-none hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <Filter size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 appearance-none hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
            >
              <option value="all">All Sections</option>
              <option value="UI">UI</option>
              <option value="API">API</option>
              <option value="Testing">Testing</option>
            </select>
            <Tag size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 appearance-none hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
            >
              <option value="due">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
            {sortDirection === 'asc' ? (
              <SortAsc size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            ) : (
              <SortDesc size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            )}
          </div>

          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors active:scale-95"
            aria-label={sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
          >
            {sortDirection === 'asc' ? (
              <SortAsc size={16} className="text-gray-500 dark:text-gray-400" />
            ) : (
              <SortDesc size={16} className="text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap gap-1">
          {taskStatuses.map(status => (
            <div key={status.name} className="flex flex-col flex-1 min-w-[200px]">
              <div className={`flex items-center gap-1 ${status.color} font-medium mb-1 px-1 text-xs`}>
                <status.icon size={18} />
                <span className="text-gray-800 dark:text-gray-200">{status.name}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400 text-sm">
                  ({tasks.filter(task => task.status === status.name).length})
                </span>
              </div>

              <Droppable droppableId={status.name}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="status-column flex-1 min-h-[300px]"
                  >
                    <AnimatePresence>
                      {isLoading ? (
                        Array.from({ length: 2 }).map((_, i) => <div key={i} className="mb-3"><TaskSkeleton /></div>)
                      ) : (
                        filteredAndSortedTasks
                          .filter(task => task.status === status.name)
                          .map((task, index) => (
                            <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-3 last:mb-0"
                                >
                                  <TaskCard
                                    task={task}
                                    index={index}
                                    statusStyles={status}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                      )}
                    </AnimatePresence>
                    {provided.placeholder}

                    {!isLoading && tasks.filter(task => task.status === status.name).length === 0 && (
                      <div className="text-center p-6 flex flex-col items-center">
                        <div className="mb-2 text-gray-400 dark:text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 mb-1">No tasks in this status</p>
                        <button
                          onClick={() => openEditModal({ status: status.name })}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1 transition-colors mt-2"
                        >
                          + Add a task
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {detailModalOpen && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={closeDetailModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-lg border border-gray-100 dark:border-slate-700/50 ${isDarkMode ? 'dark' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                  Task Details
                </h3>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none active:scale-90 transition-transform p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">{selectedTask.title}</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`badge ${getPriorityStyles(selectedTask.priority).bg} ${getPriorityStyles(selectedTask.priority).text}`}>
                      {getPriorityStyles(selectedTask.priority).icon}
                      {selectedTask.priority} priority
                    </span>
                    <span className={`badge ${getSectionStyles(selectedTask.section).bg}`}>
                      {getSectionStyles(selectedTask.section).icon}
                      {selectedTask.section}
                    </span>
                    <span className={`badge ${selectedTask.status === 'Done' ? 'badge-green' : selectedTask.status === 'In Progress' ? 'badge-blue' : 'badge-yellow'}`}>
                      {selectedTask.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap">{selectedTask.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-500 dark:text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedTask.due ? format(new Date(selectedTask.due), 'MMM d, yyyy') : 'Not set'}
                          {selectedTask.due && (
                            <span className="ml-2 text-xs">
                              ({formatDate(selectedTask.due)})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <User size={16} className="text-blue-500 dark:text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Assigned To</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedTask.assignee ? `User #${selectedTask.assignee}` : 'Unassigned'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={closeDetailModal}
                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all active:scale-95"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      closeDetailModal();
                      openEditModal(selectedTask);
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all active:scale-95 shadow-sm hover:shadow"
                  >
                    Edit
                  </button>
                  {selectedTask.status !== 'Done' ? (
                    <button
                      onClick={() => {
                        moveTask(selectedTask.id, 'Done');
                        closeDetailModal();
                      }}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all active:scale-95 shadow-sm hover:shadow"
                    >
                      Mark Done
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        moveTask(selectedTask.id, 'To Do');
                        closeDetailModal();
                      }}
                      className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all active:scale-95 shadow-sm hover:shadow"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Edit Modal */}
      <AnimatePresence>
        {modalOpen && editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-lg border border-gray-100 dark:border-slate-700/50 ${isDarkMode ? 'dark' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                  {editingTask.id && tasks.some(task => task.id === editingTask.id) ? 'Edit Task' : 'Add Task'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none active:scale-90 transition-transform p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingTask.title || ''}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Task title"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={editingTask.description || ''}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    className="w-full h-24 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
                    placeholder="Task description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      value={editingTask.status || 'To Do'}
                      onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      {taskStatuses.map(status => (
                        <option key={status.name} value={status.name}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">
                      Priority
                    </label>
                    <select
                      value={editingTask.priority || 'medium'}
                      onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={editingTask.due || ''}
                      onChange={(e) => setEditingTask({...editingTask, due: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">
                      Section
                    </label>
                    <select
                      value={editingTask.section || 'UI'}
                      onChange={(e) => setEditingTask({...editingTask, section: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="UI">UI</option>
                      <option value="API">API</option>
                      <option value="Testing">Testing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">
                    Assignee
                  </label>
                  <select
                    value={editingTask.assignee || ''}
                    onChange={(e) => setEditingTask({...editingTask, assignee: e.target.value ? Number(e.target.value) : null})}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="">Unassigned</option>
                    <option value="1">Alice (Project Manager)</option>
                    <option value="2">Bob (Frontend Developer)</option>
                    <option value="3">Charlie (Backend Developer)</option>
                    <option value="4">Dana (UI/UX Designer)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveTask}
                  className="btn btn-primary active:scale-95 transition-all"
                >
                  {editingTask.id && tasks.some(task => task.id === editingTask.id) ? 'Update' : 'Create'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
