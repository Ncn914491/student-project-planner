import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus, Edit2, X, Lightbulb, Database, Calendar, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function EnhancedProjectNotes({ initialNotes = [] }) {
  const [notes, setNotes] = useState(initialNotes.length > 0 ? initialNotes : [
    {
      id: 1,
      category: 'design',
      title: 'Design Notes',
      content: 'User interface should follow the design system guidelines. Use the approved color palette and typography.',
      date: '2025-06-01',
      author: 'Dana'
    },
    {
      id: 2,
      category: 'backend',
      title: 'Backend Integration',
      content: 'API endpoints need to be documented. Authentication flow needs review. Database schema is finalized.',
      date: '2025-06-05',
      author: 'Charlie'
    },
    {
      id: 3,
      category: 'meeting',
      title: 'Meeting Minutes',
      content: 'Team agreed on sprint goals. Next review scheduled for June 15. Action items assigned to team members.',
      date: '2025-06-10',
      author: 'Alice'
    }
  ]);

  const [expandedCategories, setExpandedCategories] = useState(['design', 'backend', 'meeting']);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalCategory, setModalCategory] = useState('design');
  const [editingNoteId, setEditingNoteId] = useState(null);

  const { isDarkMode } = useTheme();

  const categories = [
    { id: 'design', label: 'Design Notes', icon: Lightbulb, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'backend', label: 'Backend Integration', icon: Database, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 'meeting', label: 'Meeting Minutes', icon: Calendar, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' }
  ];

  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const openEditModal = (note) => {
    setModalContent(note.content);
    setModalTitle(note.title);
    setModalCategory(note.category);
    setEditingNoteId(note.id);
    setModalOpen(true);
  };

  const openAddModal = (category) => {
    setModalContent('');
    setModalTitle('');
    setModalCategory(category);
    setEditingNoteId(null);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const saveModalContent = () => {
    if (!modalTitle.trim()) {
      // You could add a toast notification here
      return;
    }

    if (editingNoteId !== null) {
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === editingNoteId
            ? {
                ...note,
                content: modalContent,
                title: modalTitle,
                category: modalCategory,
                date: new Date().toISOString().split('T')[0] // Update date on edit
              }
            : note
        )
      );
    } else {
      const newNote = {
        id: Date.now(),
        category: modalCategory,
        title: modalTitle || 'Untitled',
        content: modalContent,
        date: new Date().toISOString().split('T')[0],
        author: 'You', // In a real app, this would be the current user
      };
      setNotes(prevNotes => [...prevNotes, newNote]);
    }
    closeModal();
  };

  return (
    <section className="card" aria-label="Project Notes">
      <div className="card-header mb-1">
        <h2 className="section-title text-sm">Project Notes</h2>
        <button
          onClick={() => openAddModal('design')}
          className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md flex items-center gap-1 active:scale-95 transition-all"
          aria-label="Add new note"
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {categories.map(category => {
          const categoryNotes = notes.filter(note => note.category === category.id);
          const isExpanded = expandedCategories.includes(category.id);

          return (
            <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden transition-shadow duration-200 hover:shadow-md note-category flex-1">
              <button
                className={`w-full flex justify-between items-center p-1 ${category.bgColor} hover:bg-opacity-80 dark:hover:bg-opacity-80 focus:outline-none transition-colors duration-200`}
                onClick={() => toggleCategory(category.id)}
                aria-expanded={isExpanded}
                aria-controls={`category-content-${category.id}`}
              >
                <div className="flex items-center gap-2">
                  <category.icon className={category.color} size={18} />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{category.label}</span>
                  <span className="ml-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {categoryNotes.length}
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddModal(category.id);
                    }}
                    className="mr-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    aria-label={`Add new ${category.label} note`}
                  >
                    <Plus size={14} />
                  </button>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    id={`category-content-${category.id}`}
                    className="overflow-hidden"
                  >
                    {categoryNotes.length > 0 ? (
                      <div className="flex flex-wrap gap-1 p-1">
                        {categoryNotes.map(note => (
                          <div key={note.id} className="p-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 group min-h-[70px] flex flex-col shadow-sm hover:shadow-md rounded-md border border-gray-200 dark:border-gray-700 flex-1 min-w-[150px]">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-gray-800 dark:text-gray-200">{note.title}</h3>
                              <button
                                onClick={() => openEditModal(note)}
                                className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                aria-label={`Edit note ${note.title}`}
                              >
                                <Edit2 size={14} />
                              </button>
                            </div>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap line-clamp-3 flex-grow">{note.content}</p>
                            <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                              <span>{note.date}</span>
                              <span>{note.author}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <div className="mb-2 text-gray-400 dark:text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">No notes in this category yet</p>
                        <button
                          onClick={() => openAddModal(category.id)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1 transition-colors"
                        >
                          + Add a note
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-lg border border-gray-100 dark:border-gray-700/50 ${isDarkMode ? 'dark' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {editingNoteId !== null ? 'Edit Note' : 'Add Note'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">
                    Category
                    <select
                      value={modalCategory}
                      onChange={(e) => setModalCategory(e.target.value)}
                      className="w-full p-2.5 mt-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">
                    Title
                    <input
                      type="text"
                      value={modalTitle}
                      onChange={(e) => setModalTitle(e.target.value)}
                      className="w-full p-2.5 mt-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Enter note title"
                    />
                  </label>
                </div>

                <div>
                  <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">
                    Content
                    <textarea
                      value={modalContent}
                      onChange={(e) => setModalContent(e.target.value)}
                      className="w-full h-40 p-3 mt-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
                      placeholder="Write your note here..."
                      aria-label="Note content editor"
                    />
                  </label>
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
                  onClick={saveModalContent}
                  className="btn btn-primary flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
