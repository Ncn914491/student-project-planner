import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus, Edit2, X, Lightbulb, Database, Calendar, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ImprovedProjectNotes({ initialNotes = [] }) {
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
    { id: 'design', label: 'Design Notes', icon: Lightbulb, color: 'text-purple-500 dark:text-purple-400' },
    { id: 'backend', label: 'Backend Integration', icon: Database, color: 'text-blue-500 dark:text-blue-400' },
    { id: 'meeting', label: 'Meeting Minutes', icon: Calendar, color: 'text-green-500 dark:text-green-400' }
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

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return null;
    
    const IconComponent = category.icon;
    return <IconComponent className={`${category.color}`} size={20} />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Project Notes</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => openAddModal('design')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            aria-label="Add new note"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(category => {
          const categoryNotes = notes.filter(note => note.category === category.id);
          const isExpanded = expandedCategories.includes(category.id);
          
          return (
            <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-md">
              <button
                className="w-full flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                onClick={() => toggleCategory(category.id)}
                aria-expanded={isExpanded}
                aria-controls={`category-content-${category.id}`}
              >
                <div className="flex items-center gap-2">
                  <category.icon className={category.color} size={20} />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{category.label}</span>
                  <span className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
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
                    <Plus size={16} />
                  </button>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {categoryNotes.map(note => (
                          <div key={note.id} className="p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-gray-800 dark:text-gray-200">{note.title}</h3>
                              <button
                                onClick={() => openEditModal(note)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                aria-label={`Edit note ${note.title}`}
                              >
                                <Edit2 size={16} />
                              </button>
                            </div>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{note.content}</p>
                            <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>{note.date}</span>
                              <span>{note.author}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 italic">
                        No notes in this category yet
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
              className={`bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-xl ${isDarkMode ? 'dark' : ''}`}
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
              
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Category
                  <select
                    value={modalCategory}
                    onChange={(e) => setModalCategory(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Title
                  <input
                    type="text"
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Enter note title"
                  />
                </label>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Content
                  <textarea
                    value={modalContent}
                    onChange={(e) => setModalContent(e.target.value)}
                    className="w-full h-48 p-3 mt-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Write your note here..."
                    aria-label="Note content editor"
                  />
                </label>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveModalContent}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 flex items-center gap-1"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
