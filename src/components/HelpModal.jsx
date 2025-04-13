import { motion } from 'framer-motion';
import { X, Keyboard, Info, Command } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Command className="text-blue-500" />
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid gap-8">
            <section>
              <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
                <Keyboard className="text-blue-500" size={16} />
                Global Shortcuts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SHORTCUTS.map(({ key, description }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  >
                    <span className="text-sm text-gray-600">{description}</span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded">
                      {key}
                    </kbd>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
                <Info className="text-blue-500" size={16} />
                Quick Tips
              </h3>
              <ul className="space-y-3">
                {TIPS.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t text-center">
          <p className="text-sm text-gray-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">ESC</kbd> to close this window
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

const SHORTCUTS = [
  { key: '/', description: 'Quick search' },
  { key: 'N', description: 'Create new note' },
  { key: 'T', description: 'Create new task' },
  { key: 'H', description: 'Show this help dialog' },
  { key: 'ESC', description: 'Close any modal' },
  { key: '←/→', description: 'Navigate between sections' }
];

const TIPS = [
  'Drag and drop tasks between columns to update their status',
  'Click on team member cards to see detailed progress',
  'Use the search to quickly find tasks, notes, or team members',
  'Hover over deadline indicators to see countdown details',
  'Dark mode can be toggled using the theme switch in the header'
];