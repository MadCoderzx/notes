import { createContext, useState, useCallback } from 'react';
import notesService from '../services/notesService';

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchNotes = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await notesService.getNotes(params);
      setNotes(response.data.notes);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNote = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await notesService.getNote(id);
      setCurrentNote(response.data.note);
      return response.data.note;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = async (noteData) => {
    const response = await notesService.createNote(noteData);
    return response.data.note;
  };

  const updateNote = async (id, noteData) => {
    const response = await notesService.updateNote(id, noteData);
    return response.data.note;
  };

  const deleteNote = async (id) => {
    await notesService.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleFavorite = async (id) => {
    const response = await notesService.toggleFavorite(id);
    setNotes((prev) => prev.map((n) => (n.id === id ? response.data.note : n)));
    return response.data.note;
  };

  const searchNotes = async (q) => {
    setLoading(true);
    try {
      const response = await notesService.searchNotes(q);
      setNotes(response.data.notes);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        currentNote,
        loading,
        pagination,
        fetchNotes,
        fetchNote,
        createNote,
        updateNote,
        deleteNote,
        toggleFavorite,
        searchNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
