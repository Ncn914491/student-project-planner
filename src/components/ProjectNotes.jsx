import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Edit2, X } from 'lucide-react';
import { notes as initialNotes } from '../data/notes';

export default function ProjectNotes() {
  const [notes, setNotes] = useState(initialNotes);
  const [expandedNoteIds, setExpandedNoteIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedNoteIds((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    );
  };

  const openEditModal = (note) => {
    setModalContent(note.content);
    setModalTitle(note.title);
    setEditingNoteId(note.id);
    setModalOpen(true);
  };

  const openAddModal = () => {
    setModalContent('');
    setModalTitle('');
    setEditingNoteId(null);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const saveModalContent = () => {
    if (editingNoteId !== null) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editingNoteId ? { ...note, content: modalContent, title: modalTitle } : note
        )
      );
    } else {
      const newNote = {
        id: Date.now(),
        title: modalTitle || 'Untitled',
        content: modalContent,
        date: new Date().toISOString().split('T')[0],
        author: 'Unknown',
      };
      setNotes((prevNotes) => [...prevNotes, newNote]);
    }
    closeModal();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Project Notes
          <Plus
            size={20}
            className="cursor-pointer text-blue-600 hover:text-blue-800"
            onClick={openAddModal}
            aria-label="Add new note"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') openAddModal();
            }}
          />
        </h2>
      </div>

      {notes.map((note) => (
        <div key={note.id} className="mb-4 border border-gray-200 rounded-lg shadow-sm">
          <button
            className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => toggleExpand(note.id)}
            aria-expanded={expandedNoteIds.includes(note.id)}
            aria-controls={`note-content-${note.id}`}
          >
            <span className="font-semibold text-lg">{note.title}</span>
            {expandedNoteIds.includes(note.id) ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedNoteIds.includes(note.id) && (
            <div
              id={`note-content-${note.id}`}
              className="p-4 bg-white prose max-w-none whitespace-pre-wrap"
            >
              <p>{note.content}</p>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>{note.date}</span>
                <span>{note.author}</span>
                <button
                  onClick={() => openEditModal(note)}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Edit note ${note.title}`}
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="modal-title" className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editingNoteId !== null ? 'Edit Note' : 'Add Note'}
            </h3>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Title
              <input
                type="text"
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </label>
            <label className="block mb-4 font-semibold text-gray-700 dark:text-gray-300">
              Content
              <textarea
                value={modalContent}
                onChange={(e) => setModalContent(e.target.value)}
                className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-gray-100"
                aria-label="Note content editor"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveModalContent}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
