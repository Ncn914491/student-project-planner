import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CheckSquare, Clock, AlertCircle, Calendar, User, X, Plus, Edit, Tag } from 'lucide-react';
import { useToast } from './Toast';
import { useTheme } from '../context/ThemeContext';

export default function RefactoredTaskBoard({ initialTasks = [] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isLoading, setIsLoading] = useState(true);
  const [focusedTaskId, setFocusedTaskId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const taskRefs = useRef(new Map());
  const { addToast } = useToast();
  const { isDarkMode } = useTheme();

  const taskStatuses = [
    { 
      name: 'To Do', 
      icon: AlertCircle, 
      color: 'text-red-600 dark:text-red-400', 
      bgColor: 'bg-red-50 dark:bg-red-900/20', 
      borderColor: 'border-red-100 dark:border-red-800/30',
      ariaLabel: 'Tasks to be started' 
    },
    { 
      name: 'In Progress', 
      icon: Clock, 
      color: 'text-blue-600 dark:text-blue-400', 
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-100 dark:border-blue-800/30',
      ariaLabel: 'Tasks in progress' 
    },
    { 
      name: 'Done', 
      icon: CheckSquare, 
      color: 'text-green-600 dark:text-green-400', 
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
          const demoTasks = [
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
              assignee: 2, // Bob (Frontend Developer)
              section: "Testing"
            }
          ];
          setTasks(demoTasks);
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

    if (editingTask.id) {
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
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800/30',
          icon: <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
        };
      case 'medium':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800/30',
          icon: <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
        };
      case 'low':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-800/30',
          icon: <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-700',
          icon: <span className="w-2 h-2 rounded-full bg-gray-500 mr-1.5"></span>
        };
    }
  };

  const getSectionStyles = (section) => {
    switch (section) {
      case 'UI':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-700 dark:text-purple-300',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1"></span>
        };
      case 'API':
        return {
          bg: 'bg-indigo-100 dark:bg-indigo-900/30',
          text: 'text-indigo-700 dark:text-indigo-300',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1"></span>
        };
      case 'Testing':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          text: 'text-emerald-700 dark:text-emerald-300',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1"></span>
        };
    }
  };

  const TaskCard = ({ task, index, statusStyles }) => {
    const priorityStyles = getPriorityStyles(task.priority);
    const sectionStyles = getSectionStyles(task.section);
    const isDue = new Date(task.due) < new Date();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        tabIndex={0}
        ref={el => taskRefs.current.set(task.id, el)}
        onKeyDown={(e) => handleTaskKeyDown(e, task.id, task.status, index)}
        className={`p-4 bg-white dark:bg-gray-800 rounded-xl border ${statusStyles.borderColor} shadow-soft hover:shadow-card focus:shadow-card transition-all duration-200 outline-none cursor-pointer`}
        aria-label={`Task: ${task.title}, status: ${task.status}, priority: ${task.priority}`}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base line-clamp-1">{task.title}</h3>
          <button
            onClick={() => openEditModal(task)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Edit task ${task.title}`}
          >
            <Edit size={14} />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`tag flex items-center ${priorityStyles.bg} ${priorityStyles.text}`}>
            {priorityStyles.icon}
            {task.priority}
          </span>
          <span className={`tag flex items-center ${sectionStyles.bg} ${sectionStyles.text}`}>
            {sectionStyles.icon}
            {task.section}
          </span>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-3">{task.description}</p>
        
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            <span className={isDue ? 'text-red-500 dark:text-red-400 font-medium' : ''}>
              {task.due}
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
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft animate-pulse">
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

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="section-title">Tasks</h2>
        <button
          onClick={() => openEditModal()}
          className="btn btn-primary flex items-center gap-1.5"
          aria-label="Add new task"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {taskStatuses.map(status => (
            <div key={status.name} className="space-y-4">
              <div className={`flex items-center gap-2 ${status.color} font-medium`}>
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
                    className={`min-h-[200px] p-3 rounded-xl ${status.bgColor} transition-colors duration-200`}
                  >
                    <AnimatePresence>
                      {isLoading ? (
                        Array.from({ length: 2 }).map((_, i) => <div key={i} className="mb-3"><TaskSkeleton /></div>)
                      ) : (
                        tasks
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
                      <div className="text-center p-4 text-gray-500 dark:text-gray-400 italic">
                        No tasks in this status
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      
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
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-elevated ${isDarkMode ? 'dark' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {editingTask.id ? 'Edit Task' : 'Add Task'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-5">
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
              
              <div className="flex justify-end gap-3 mt-6">
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
                  className="btn btn-primary"
                >
                  {editingTask.id ? 'Update' : 'Create'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
