import { useEffect, useCallback } from 'react';
import { useToast } from './Toast';

const SHORTCUTS = {
  '/': 'search',
  'h': 'toggleHelp',
  'Escape': 'closeModal',
  'k': 'openCommandPalette',
  't': 'newTask',
  'n': 'newNote',
  '?': 'toggleHelp',
  'ArrowLeft': 'previousSection',
  'ArrowRight': 'nextSection'
};

const CTRL_SHORTCUTS = {
  's': 'save',
  '/': 'toggleComments',
  'Enter': 'quickAdd'
};

const ALT_SHORTCUTS = {
  't': 'toggleTheme',
  'v': 'toggleView',
  'f': 'toggleFilter'
};

export default function KeyboardShortcuts({ onAction }) {
  const { addToast } = useToast();

  const handleKeyDown = useCallback((e) => {
    // Don't trigger shortcuts when typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const key = e.key;
    
    // Handle Ctrl/Cmd combinations
    if (e.metaKey || e.ctrlKey) {
      const action = CTRL_SHORTCUTS[key.toLowerCase()];
      if (action) {
        e.preventDefault();
        onAction(action);
        addToast(`Executing: ${action}`, 'info');
        return;
      }
    }

    // Handle Alt combinations
    if (e.altKey) {
      const action = ALT_SHORTCUTS[key.toLowerCase()];
      if (action) {
        e.preventDefault();
        onAction(action);
        addToast(`Executing: ${action}`, 'info');
        return;
      }
    }

    // Handle special keyboard commands like Cmd/Ctrl + K
    if ((e.metaKey || e.ctrlKey) && key.toLowerCase() === 'k') {
      e.preventDefault();
      onAction('openCommandPalette');
      return;
    }

    // Handle single key shortcuts
    const action = SHORTCUTS[key];
    if (action && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      onAction(action);
    }
  }, [onAction, addToast]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null;
}