import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tasks } from '../data/tasks';
import { CheckCircle, Clock, AlertCircle, BarChart2, ChevronDown } from 'lucide-react';

const CircularProgress = ({ value, size = 120 }) => {
  const radius = size * 0.4;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className="text-green-500"
          strokeWidth="8"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          style={{ 
            strokeDasharray: circumference,
            transition: 'stroke-dashoffset 1s ease-in-out'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-2xl font-bold text-gray-800"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {value}%
        </motion.span>
      </div>
    </div>
  );
};

export default function StatusOverview() {
  const [showDetails, setShowDetails] = useState(false);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'To Do').length;

  const stats = [
    { 
      label: 'Completed', 
      count: completedTasks, 
      icon: CheckCircle, 
      color: 'green',
      description: 'Tasks successfully completed'
    },
    { 
      label: 'In Progress', 
      count: inProgressTasks, 
      icon: Clock, 
      color: 'blue',
      description: 'Tasks currently being worked on'
    },
    { 
      label: 'Pending', 
      count: pendingTasks, 
      icon: AlertCircle, 
      color: 'red',
      description: 'Tasks yet to be started'
    }
  ];

  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <motion.div 
      className="bg-white p-4 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BarChart2 className="text-blue-500" size={18} />
          Project Status
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-500 hover:text-gray-700"
        >
          <motion.div
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.button>
      </div>

      <div className="flex flex-col items-center mb-6">
        <CircularProgress value={completionPercentage} />
        <p className="text-sm text-gray-600 mt-2">Overall Progress</p>
      </div>

      <motion.div 
        className="grid grid-cols-3 gap-4"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        {stats.map(({ label, count, icon: Icon, color, description }) => (
          <motion.div
            key={label}
            className={`flex flex-col items-center p-3 bg-${color}-50 rounded-lg relative group`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Icon className={`text-${color}-500`} size={22} />
            <motion.span 
              className="text-2xl font-bold text-gray-800 mt-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {count}
            </motion.span>
            <span className="text-xs text-gray-600">{label}</span>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none"
            >
              {description}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800" />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                {stats.map(({ label, count, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-${color}-500`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / totalTasks) * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {Math.round((count / totalTasks) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
