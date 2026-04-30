require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const { initSchema, get, run } = require('./db')

const app = express()
const PORT = process.env.PORT || 3001

// Seed admin user on startup
async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@wedspace.id'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    const existing = await get('SELECT id FROM users WHERE email = $1', [adminEmail])
    if (!existing) {
      const hash = await bcrypt.hash(adminPassword, 10)
      await run('INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)', [adminEmail, hash, 'admin'])
      console.log(`✅ Admin seeded: ${adminEmail}`)
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error)
  }
}

// Initialize database
initSchema().then(() => {
  console.log('Database initialized')

  app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
  app.use(express.json())

  // Routes
  app.use('/api/auth',    require('./routes/auth'))
  app.use('/api/workspace', require('./routes/workspace'))
  app.use('/api/tasks',   require('./routes/tasks'))
  app.use('/api/budget',  require('./routes/budget'))
  app.use('/api/savings', require('./routes/savings'))
  app.use('/api/notes',   require('./routes/notes'))
  app.use('/api/admin',   require('./routes/admin'))

  // Health check
  app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

  // Seed admin user on startup
  seedAdmin()

  app.listen(PORT)
    .on("listening", () => {
      console.log(`🚀 Wedspace API running on http://localhost:${PORT}`)
    })
    .on("error", (err) => {
      console.error("Server error:", err.message)
    })
}).catch(err => {
  console.error('Failed to initialize database:', err)
})