const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { noteValidation } = require('../middleware/validate');
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  toggleFavorite,
} = require('../controllers/noteController');

router.use(auth);

router.get('/', getNotes);
router.get('/search', searchNotes);
router.get('/:id', getNoteById);
router.post('/', noteValidation, createNote);
router.put('/:id', noteValidation, updateNote);
router.delete('/:id', deleteNote);
router.put('/:id/favorite', toggleFavorite);

module.exports = router;
