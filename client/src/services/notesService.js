import api from './api';

const notesService = {
  getNotes: async (params = {}) => {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  getNote: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  searchNotes: async (q) => {
    const response = await api.get('/notes/search', { params: { q } });
    return response.data;
  },

  toggleFavorite: async (id) => {
    const response = await api.put(`/notes/${id}/favorite`);
    return response.data;
  },
};

export default notesService;
