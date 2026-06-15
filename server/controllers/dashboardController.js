const Note = require('../models/note');
const apiResponse = require('../utils/apiResponse');

const getStats = async (req, res, next) => {
  try {
    const stats = await Note.getStats(req.user.id);
    const recentNotes = await Note.getRecent(req.user.id, 5);
    apiResponse.success(res, { stats, recentNotes });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
