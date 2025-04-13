import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CheckSquare, Clock, AlertCircle, GripVertical } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from './Toast';

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [focusedTaskId, setFocusedTaskId] = useState(null);
  const taskRefs = useRef(new Map());
  const { addToast } = useToast();
  
  const taskStatuses = [
    { name: 'To Do', icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-50', ariaLabel: 'Tasks to be started' },
    { name: 'In Progress', icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-50', ariaLabel: 'Tasks in progress' },
    { name: 'Done', icon: CheckSquare, color: 'text-green-500', bgColor: 'bg-green-50', ariaLabel: 'Completed tasks' }
  ];

  useEffect(() => {
    const loadTasks = async () => {
      try {
        // Simulating API call
        const response = await import('../data/tasks');
        setTasks(response.tasks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading tasks:', error);
        addToast('Failed to load tasks', 'error');
      }
    };

    loadTasks();
  }, [addToast]);

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

  const TaskSkeleton = () => (
    <motion.div 
      className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-start gap-2">
        <div className="w-4 h-4 rounded bg-gray-200 mt-1" />
        <div className="flex-1">
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-full bg-gray-100 rounded mb-1" />
          <div className="h-3 w-2/3 bg-gray-100 rounded" />
          <div className="flex items-center gap-2 mt-2">
            <div className="h-3 w-16 bg-gray-200 rounded-full" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Tasks</h2>
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{task.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
