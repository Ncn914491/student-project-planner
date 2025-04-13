import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Search, Calendar, CheckSquare, Users, Settings, Plus } from 'lucide-react';
import { useToast } from './Toast';

const COMMANDS = [
  {
    id: 'new-task',
    icon: Plus,
    label: 'New Task',
    description: 'Create a new task',
    shortcut: ['t'],
    category: 'tasks'
  },
  {
    id: 'new-note',
    icon: Plus,
    label: 'New Note',
    description: 'Create a new project note',
    shortcut: ['n'],
    category: 'notes'
  },
  {
    id: 'assign-task',
    icon: Users,
    label: 'Assign Task',
    description: 'Assign a task to team member',
    category: 'tasks'
  },
  {
    id: 'view-deadlines',
    icon: Calendar,
    label: 'View Deadlines',
    description: 'Show upcoming deadlines',
    category: 'view'
  },
  {
    id: 'complete-task',
    icon: CheckSquare,
    label: 'Complete Task',
    description: 'Mark a task as completed',
    category: 'tasks'
  },
  {
    id: 'toggle-theme',
    icon: Settings,
    label: 'Toggle Theme',
    description: 'Switch between light and dark mode',
    category: 'settings'
  }
];

export default function CommandPalette({ isOpen, onClose, onAction }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { addToast } = useToast();

  const filteredCommands = query
    ? COMMANDS.filter(command => 
        command.label.toLowerCase().includes(query.toLowerCase()) ||
        command.description.toLowerCase().includes(query.toLowerCase()) ||
        command.category.toLowerCase().includes(query.toLowerCase())
      )
    : COMMANDS;

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => 
          i + 1 >= filteredCommands.length ? 0 : i + 1
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => 
          i - 1 < 0 ? filteredCommands.length - 1 : i - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onAction(filteredCommands[selectedIndex].id);
          onClose();
          addToast(`Executing: ${filteredCommands[selectedIndex].label}`, 'info');
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, selectedIndex, filteredCommands, onAction, onClose, addToast]);

  useEffect(() => {
    setSelectedIndex(0);
    setQuery('');
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div className="fixed inset-x-0 top-[20vh] max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-4 border-b flex items-center gap-3">
            <Command className="text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredCommands.length > 0 ? (
              <div className="grid gap-1">
                {filteredCommands.map((command, index) => {
                  const Icon = command.icon;
                  const isSelected = index === selectedIndex;

                  return (
                    <motion.button
                      key={command.id}
                      initial={false}
                      animate={{ 
                        backgroundColor: isSelected ? 'rgb(243 244 246)' : 'transparent'
                      }}
                      onClick={() => {
                        onAction(command.id);
                        onClose();
                        addToast(`Executing: ${command.label}`, 'info');
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                        isSelected ? 'bg-gray-100' : ''
                      }`}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <Icon className={`${
                        isSelected ? 'text-blue-500' : 'text-gray-400'
                      }`} size={18} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
                            isSelected ? 'text-blue-600' : 'text-gray-700'
                          }`}>
                            {command.label}
                          </span>
                          {command.shortcut && (
                            <kbd className="hidden sm:inline-flex text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                              {command.shortcut.join(' + ')}
                            </kbd>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {command.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No matching commands found
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
            <div className="flex gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white">↑↓</kbd> to navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white">enter</kbd> to select
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white">esc</kbd> to close
              </span>
            </div>
            <div className="hidden sm:block">
              <Search size={14} className="text-gray-400" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}