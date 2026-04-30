const path = require('path')

require('dotenv').config({
  path: path.join(__dirname, './.env')
})

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})
console.log('🔥 DB INIT - DATABASE_URL:', process.env.DATABASE_URL)
// Initialize schema
async function initSchema() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL UNIQUE,
        partner_a_name TEXT,
        partner_b_name TEXT,
        relationship_name TEXT,
        hashtag TEXT,
        wedding_date DATE,
        venue_location TEXT,
        total_budget BIGINT DEFAULT 0,
        savings_target BIGINT DEFAULT 0,
        plan TEXT NOT NULL DEFAULT 'free',
        status TEXT NOT NULL DEFAULT 'active',
        plan_started_at TIMESTAMP,
        plan_expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        workspace_id BIGINT NOT NULL,
        title TEXT NOT NULL,
        phase TEXT NOT NULL,
        assignee TEXT NOT NULL DEFAULT 'berdua',
        status TEXT NOT NULL DEFAULT 'todo',
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS budget_items (
        id TEXT PRIMARY KEY,
        workspace_id BIGINT NOT NULL,
        category TEXT NOT NULL,
        planned BIGINT DEFAULT 0,
        actual BIGINT DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS savings_entries (
        id BIGSERIAL PRIMARY KEY,
        workspace_id BIGINT NOT NULL,
        amount BIGINT NOT NULL,
        from_partner TEXT NOT NULL,
        note TEXT,
        entry_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id BIGSERIAL PRIMARY KEY,
        workspace_id BIGINT NOT NULL,
        title TEXT,
        content TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'lainnya',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
      )
    `)

    console.log('✅ Database schema initialized')
  } catch (error) {
    console.error('❌ Error initializing schema:', error)
    throw error
  }
}

// Helper: run query (INSERT, UPDATE, DELETE)
async function run(sql, params = []) {
  try {
    const result = await pool.query(sql, params)
    return result
  } catch (error) {
    console.error('Database run error:', error)
    throw error
  }
}

// Helper: get one row
async function get(sql, params = []) {
  try {
    const result = await pool.query(sql, params)
    return result.rows[0] || null
  } catch (error) {
    console.error('Database get error:', error)
    throw error
  }
}

// Helper: get all rows
async function all(sql, params = []) {
  try {
    const result = await pool.query(sql, params)
    return result.rows
  } catch (error) {
    console.error('Database all error:', error)
    throw error
  }
}

module.exports = {
  pool,
  initSchema,
  run,
  get,
  all
}
