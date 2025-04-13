import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, AlertTriangle } from 'lucide-react';
import { useToast } from './Toast';
import debounce from 'lodash/debounce';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectNotes({ projectId }) {
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const textareaRef = useRef(null);
  const { addToast } = useToast();

  // Load initial notes
  useEffect(() => {
    const loadNotes = async () => {
      try {
        // Simulated API call
        const response = await import('../data/notes');
        const projectNotes = response.notes.find(n => n.projectId === projectId);
        setNotes(projectNotes?.content || '');
      } catch (error) {
        console.error('Error loading notes:', error);
        addToast('Failed to load notes', 'error');
      }
    };

    loadNotes();
  }, [projectId, addToast]);

  // Autosave functionality
  const saveNotes = debounce(async (content) => {
    setIsSaving(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setHasUnsavedChanges(false);
      addToast('Notes saved successfully', 'success');
    } catch (error) {
      console.error('Error saving notes:', error);
      addToast('Failed to save notes', 'error');
    } finally {
      setIsSaving(false);
    }
  }, 1000);

  // Handle changes
  const handleChange = (e) => {
    const content = e.target.value;
    setNotes(content);
    setHasUnsavedChanges(true);
    saveNotes(content);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    } else if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        saveNotes.flush();
      } else if (e.key === 'e') {
        e.preventDefault();
        setIsEditing(true);
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && isEditing) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [notes, isEditing]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (hasUnsavedChanges) {
        saveNotes.flush();
      }
    };
  }, [hasUnsavedChanges, saveNotes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Project Notes</h2>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-yellow-600 text-sm"
            >
              <AlertTriangle size={14} />
              <span>Unsaved changes</span>
            </motion.div>
          )}
          {isSaving && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 text-blue-600 text-sm"
            >
              <Save size={14} className="animate-pulse" />
              <span>Saving...</span>
            </motion.div>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 
                     bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {isEditing ? 'Preview' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <textarea
                ref={textareaRef}
                value={notes}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Write your notes here... (Markdown supported)"
                className="w-full min-h-[200px] p-4 text-gray-800 bg-gray-50 rounded-lg 
                         border border-gray-200 focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent resize-none outline-none"
                spellCheck="true"
                autoFocus
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                Press Esc to exit, Ctrl+S to save
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg min-h-[200px]"
              onClick={() => setIsEditing(true)}
            >
              {notes ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {notes}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-400 italic">
                  Click to add project notes...
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
