const { Pool, Client } = require('pg');

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT DEFAULT '',
  category VARCHAR(100) DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_is_favorite ON notes(is_favorite);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);
`;

function parseDatabaseUrl(url) {
  // Handle both postgresql:// and postgres:// schemes
  const parsed = new URL(url.replace(/^postgres:/, 'postgresql:'));
  return {
    dbName: parsed.pathname.slice(1), // remove leading /
    baseUrl: `${parsed.protocol}//${parsed.username ? parsed.username + (parsed.password ? ':' + parsed.password : '') + '@' : ''}${parsed.host}/`,
  };
}

async function ensureDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const { dbName, baseUrl } = parseDatabaseUrl(dbUrl);

  // Connect to the default 'postgres' database to check/create the target database
  const adminClient = new Client({ connectionString: baseUrl + 'postgres' });
  try {
    await adminClient.connect();
    const res = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    if (res.rowCount === 0) {
      // Database names can't be parameterized in CREATE DATABASE, so we quote it
      const safeName = dbName.replace(/[^a-zA-Z0-9_]/g, '');
      await adminClient.query(`CREATE DATABASE "${safeName}"`);
      console.log(`Created database "${safeName}"`);
    }
  } finally {
    await adminClient.end();
  }
}

async function migrate() {
  try {
    await ensureDatabase();

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    await pool.query(SCHEMA_SQL);
    await pool.end();

    console.log('Database schema migrated successfully');
  } catch (error) {
    console.error('Database migration failed:', error.message);
    process.exit(1);
  }
}

module.exports = migrate;
