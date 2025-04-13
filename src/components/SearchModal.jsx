import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calendar, CheckSquare, Users, StickyNote } from 'lucide-react';
import { tasks } from '../data/tasks';
import { notes } from '../data/notes';
import { team } from '../data/team';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const searchResults = [
      ...tasks.map(task => ({
        type: 'task',
        icon: CheckSquare,
        title: task.title,
        description: task.description,
        meta: `Due: ${task.due}`,
        color: 'text-blue-500'
      })),
      ...notes.map(note => ({
        type: 'note',
        icon: StickyNote,
        title: note.title,
        description: note.content,
        meta: note.date,
        color: 'text-green-500'
      })),
      ...team.map(member => ({
        type: 'team',
        icon: Users,
        title: member.name,
        description: member.role,
        meta: `${member.tasksCompleted}/${member.totalTasks} tasks`,
        color: 'text-purple-500'
      }))
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery)
    );

    setResults(searchResults);
  }, [query]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks, notes, or team members..."
            className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              <AnimatePresence>
                {results.map((result, index) => {
                  const Icon = result.icon;
                  return (
                    <motion.div
                      key={`${result.type}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`${result.color} mt-1`} size={18} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {result.title}
                          </h4>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {result.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {result.meta}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : query ? (
            <div className="p-8 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                {Object.entries(QUICK_ACTIONS).map(([key, action]) => (
                  <div
                    key={key}
                    className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {action.label}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">{key}</kbd>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const QUICK_ACTIONS = {
  '/': { label: 'Search' },
  'N': { label: 'New Note' },
  'T': { label: 'New Task' },
  'H': { label: 'Help' },
  'ESC': { label: 'Close' },
};