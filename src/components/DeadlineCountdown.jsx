import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, AlertTriangle, CheckCircle } from 'lucide-react';
import { tasks } from '../data/tasks';

export default function DeadlineCountdown() {
  const upcomingDeadlines = tasks
    .filter(task => task.status !== 'Done')
    .sort((a, b) => new Date(a.due) - new Date(b.due))
    .slice(0, 3);

  const calculateDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="bg-white p-4 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <CalendarDays size={18} className="text-blue-500" />
        </motion.div>
        Upcoming Deadlines
      </h2>
      <motion.ul 
        className="space-y-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {upcomingDeadlines.map(task => {
            const daysLeft = calculateDaysLeft(task.due);
            const isUrgent = daysLeft <= 3;
            const isPastDue = daysLeft < 0;
            
            return (
              <motion.li 
                key={task.id} 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: isUrgent ? 'rgb(254, 242, 242)' : 'rgb(239, 246, 255)'
                }}
                className={`py-3 px-4 rounded-lg transition-colors ${
                  isUrgent ? 'bg-red-50' : 'bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                  </div>
                  <motion.div 
                    className={`ml-4 flex items-center gap-1 px-3 py-1 rounded-full ${
                      isPastDue ? 'bg-red-100 text-red-700' :
                      isUrgent ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {isPastDue ? (
                      <AlertTriangle size={14} />
                    ) : isUrgent ? (
                      <AlertTriangle size={14} />
                    ) : (
                      <CheckCircle size={14} />
                    )}
                    <span className="text-xs font-semibold whitespace-nowrap">
                      {isPastDue ? 'Past due' :
                       `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                    </span>
                  </motion.div>
                </div>
                <motion.div 
                  className="w-full bg-gray-200 h-1 rounded-full mt-2 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className={`h-full rounded-full ${
                      isPastDue ? 'bg-red-500' :
                      isUrgent ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.max(0, Math.min(100, (1 - daysLeft/14) * 100))}%` 
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </motion.div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </motion.div>
  );
}
