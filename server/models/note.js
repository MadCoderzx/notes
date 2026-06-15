const pool = require('../config/db');

const Note = {
  async getAll({ userId, search, category, sort = 'latest', page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const conditions = ['user_id = $1'];
    const params = [userId];
    let paramIndex = 2;

    if (search) {
      conditions.push(`(title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      conditions.push(`category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');
    const orderClause = sort === 'oldest' ? 'created_at ASC' : 'created_at DESC';

    params.push(limit, offset);

    const query = `
      SELECT * FROM notes 
      WHERE ${whereClause} 
      ORDER BY ${orderClause} 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const countQuery = `SELECT COUNT(*) FROM notes WHERE ${whereClause}`;

    const [result, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, paramIndex - 2)),
    ]);

    return {
      notes: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(countResult.rows[0].count / limit),
    };
  },

  async getById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  },

  async create({ userId, title, content, category, tags }) {
    const result = await pool.query(
      `INSERT INTO notes (user_id, title, content, category, tags) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [userId, title, content, category || 'General', tags || []]
    );
    return result.rows[0];
  },

  async update(id, userId, { title, content, category, tags }) {
    const result = await pool.query(
      `UPDATE notes 
       SET title = $1, content = $2, category = $3, tags = $4, updated_at = NOW() 
       WHERE id = $5 AND user_id = $6 
       RETURNING *`,
      [title, content, category, tags, id, userId]
    );
    return result.rows[0];
  },

  async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0];
  },

  async toggleFavorite(id, userId) {
    const result = await pool.query(
      `UPDATE notes SET is_favorite = NOT is_favorite, updated_at = NOW() 
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );
    return result.rows[0];
  },

  async getStats(userId) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_notes,
        COUNT(*) FILTER (WHERE is_favorite = true) as favorite_count,
        COUNT(DISTINCT category) as category_count
       FROM notes WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },

  async getRecent(userId, limit = 5) {
    const result = await pool.query(
      'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  },

  async getCategories(userId) {
    const result = await pool.query(
      'SELECT DISTINCT category FROM notes WHERE user_id = $1 ORDER BY category',
      [userId]
    );
    return result.rows.map((r) => r.category);
  },
};

module.exports = Note;
