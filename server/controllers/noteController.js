const Note = require('../models/note');
const apiResponse = require('../utils/apiResponse');

const getNotes = async (req, res, next) => {
  try {
    const { search, category, sort, page = 1, limit = 10 } = req.query;
    const result = await Note.getAll({
      userId: req.user.id,
      search,
      category,
      sort,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    apiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.getById(req.params.id, req.user.id);
    if (!note) {
      return apiResponse.error(res, 'Note not found', 404);
    }
    apiResponse.success(res, { note });
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const { title, content, category, tags } = req.body;
    const note = await Note.create({
      userId: req.user.id,
      title,
      content,
      category,
      tags,
    });
    apiResponse.success(res, { note }, 'Note created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const { title, content, category, tags } = req.body;
    const note = await Note.update(req.params.id, req.user.id, { title, content, category, tags });
    if (!note) {
      return apiResponse.error(res, 'Note not found', 404);
    }
    apiResponse.success(res, { note }, 'Note updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.delete(req.params.id, req.user.id);
    if (!note) {
      return apiResponse.error(res, 'Note not found', 404);
    }
    apiResponse.success(res, null, 'Note deleted successfully');
  } catch (error) {
    next(error);
  }
};

const searchNotes = async (req, res, next) => {
  try {
    const { q } = req.query;
    const result = await Note.getAll({
      userId: req.user.id,
      search: q,
      page: 1,
      limit: 50,
    });
    apiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const toggleFavorite = async (req, res, next) => {
  try {
    const note = await Note.toggleFavorite(req.params.id, req.user.id);
    if (!note) {
      return apiResponse.error(res, 'Note not found', 404);
    }
    apiResponse.success(res, { note }, 'Favorite toggled');
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote, searchNotes, toggleFavorite };
