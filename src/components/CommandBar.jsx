import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'cmdk';
import { Search, Calendar, ListTodo, FileText, Users, Settings, ExternalLink } from 'lucide-react';

export default function CommandBar({ isOpen, onClose, onAction }) {
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);
  const [pages] = useState(['home', 'tasks', 'calendar', 'notes', 'team']);
  const [selectedPage, setSelectedPage] = useState('home');

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setSelectedPage('home');
    }
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const commands = useMemo(() => ({
    home: [
      {
        id: 'new-task',
        name: 'Create New Task',
        shortcut: ['N', 'T'],
        action: () => onAction('newTask'),
        icon: ListTodo
      },
      {
        id: 'new-note',
        name: 'Create New Note',
        shortcut: ['N', 'N'],
        action: () => onAction('newNote'),
        icon: FileText
      },
      {
        id: 'toggle-theme',
        name: 'Toggle Dark Mode',
        shortcut: ['⌘', 'D'],
        action: () => onAction('toggleTheme'),
        icon: Settings
      }
    ],
    tasks: [
      {
        id: 'view-all-tasks',
        name: 'View All Tasks',
        action: () => onAction('viewAllTasks'),
        icon: ListTodo
      },
      {
        id: 'view-calendar',
        name: 'View Calendar',
        action: () => onAction('viewCalendar'),
        icon: Calendar
      }
    ],
    team: [
      {
        id: 'view-team',
        name: 'View Team Members',
        action: () => onAction('viewTeam'),
        icon: Users
      },
      {
        id: 'invite-member',
        name: 'Invite Team Member',
        action: () => onAction('inviteTeam'),
        icon: ExternalLink
      }
    ]
  }), [onAction]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Command Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-x-0 top-[20%] max-w-xl mx-auto z-50"
          >
            <Command
              className="rounded-xl border border-gray-100 bg-white shadow-2xl"
              loop
            >
              <div className="border-b border-gray-100 px-3 py-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Search size={18} />
                  <Command.Input
                    ref={inputRef}
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Search commands..."
                    className="w-full bg-transparent outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto overscroll-contain py-2 px-1">
                <Command.Empty className="py-6 text-center text-sm text-gray-500">
                  No results found.
                </Command.Empty>

                {/* Render commands for current page */}
                {commands[selectedPage]?.map((command) => (
                  <Command.Item
                    key={command.id}
                    value={command.name}
                    onSelect={command.action}
                    className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none data-[selected]:bg-gray-100"
                  >
                    <div className="flex flex-1 items-center gap-2 text-gray-700">
                      <command.icon size={18} className="text-gray-500" />
                      <span>{command.name}</span>
                    </div>

                    {command.shortcut && (
                      <div className="flex items-center gap-1">
                        {command.shortcut.map((key, i) => (
                          <kbd
                            key={i}
                            className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                  </Command.Item>
                ))}

                {/* Page navigation */}
                <Command.Group
                  heading="Navigation"
                  className="relative mt-2 border-t border-gray-100 pt-4"
                >
                  {pages.map((page) => (
                    <Command.Item
                      key={page}
                      value={`Navigate to ${page}`}
                      onSelect={() => setSelectedPage(page)}
                      className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none data-[selected]:bg-gray-100"
                    >
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="capitalize">{page}</span>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}