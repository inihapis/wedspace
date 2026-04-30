const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { get, run } = require('../db')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' })
    }

    const existing = await get('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (existing) {
      return res.status(409).json({ error: 'Email sudah terdaftar' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    await run(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
      [email.toLowerCase(), passwordHash, 'user']
    )

    const user = await get('SELECT id, email, role, created_at FROM users WHERE email = $1', [email.toLowerCase()])
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' })
    }

    const user = await get('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Email atau password salah' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Check if workspace exists
    const workspace = await get('SELECT id FROM workspaces WHERE user_id = $1', [user.id])

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
      hasWorkspace: !!workspace,
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await get('SELECT id, email, role, created_at FROM users WHERE id = $1', [req.user.id])
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' })

    const workspace = await get('SELECT id FROM workspaces WHERE user_id = $1', [user.id])
    res.json({ user, hasWorkspace: !!workspace })
  } catch (err) {
    console.error('Me error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

module.exports = router
