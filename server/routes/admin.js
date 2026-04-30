const express = require('express')
const { get, run, all } = require('../db')
const { adminMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/admin/stats — overview stats
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const totalWorkspaces  = await get('SELECT COUNT(*) as count FROM workspaces')
    const activeWorkspaces = await get("SELECT COUNT(*) as count FROM workspaces WHERE status = 'active'")
    const totalUsers       = await get('SELECT COUNT(*) as count FROM users WHERE role = $1', ['user'])
    const premiumCount     = await get("SELECT COUNT(*) as count FROM workspaces WHERE plan = 'premium'")
    const newThisWeek      = await get(`
      SELECT COUNT(*) as count FROM users
      WHERE role = $1 AND created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'
    `, ['user'])

    res.json({
      totalWorkspaces:  totalWorkspaces?.count  || 0,
      activeWorkspaces: activeWorkspaces?.count || 0,
      totalUsers:       totalUsers?.count       || 0,
      premiumCount:     premiumCount?.count     || 0,
      newThisWeek:      newThisWeek?.count      || 0,
    })
  } catch (err) {
    console.error('Get admin stats error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// GET /api/admin/workspaces — list all workspaces
router.get('/workspaces', adminMiddleware, async (req, res) => {
  try {
    const workspaces = await all(`
      SELECT
        w.id, w.partner_a_name, w.partner_b_name, w.hashtag,
        w.wedding_date, w.plan, w.status,
        w.plan_started_at, w.plan_expires_at,
        w.created_at, w.updated_at,
        u.email, u.id as user_id
      FROM workspaces w
      JOIN users u ON w.user_id = u.id
      ORDER BY w.created_at DESC
    `)
    res.json({ workspaces })
  } catch (err) {
    console.error('Get admin workspaces error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// GET /api/admin/workspaces/:id
router.get('/workspaces/:id', adminMiddleware, async (req, res) => {
  try {
    const workspace = await get(`
      SELECT w.*, u.email, u.created_at as user_created_at
      FROM workspaces w
      JOIN users u ON w.user_id = u.id
      WHERE w.id = $1
    `, [req.params.id])

    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })
    res.json({ workspace })
  } catch (err) {
    console.error('Get admin workspace error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// PUT /api/admin/workspaces/:id/status — activate / deactivate / suspend
router.put('/workspaces/:id/status', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ['active', 'inactive', 'suspended']
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Status harus salah satu dari: ${allowed.join(', ')}` })
    }

    const workspace = await get('SELECT id FROM workspaces WHERE id = $1', [req.params.id])
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    await run(`UPDATE workspaces SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [status, req.params.id])
    const updated = await get('SELECT * FROM workspaces WHERE id = $1', [req.params.id])
    res.json({ workspace: updated })
  } catch (err) {
    console.error('Update workspace status error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// PUT /api/admin/workspaces/:id/plan — upgrade / downgrade plan
router.put('/workspaces/:id/plan', adminMiddleware, async (req, res) => {
  try {
    const { plan, expiresAt } = req.body
    const allowed = ['free', 'premium']
    if (!allowed.includes(plan)) {
      return res.status(400).json({ error: `Plan harus 'free' atau 'premium'` })
    }

    const workspace = await get('SELECT id FROM workspaces WHERE id = $1', [req.params.id])
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    await run(
      `UPDATE workspaces SET
        plan = $1,
        plan_started_at = CASE WHEN $1 = 'premium' THEN CURRENT_TIMESTAMP ELSE NULL END,
        plan_expires_at = $2,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [plan, expiresAt || null, req.params.id]
    )

    const updated = await get('SELECT * FROM workspaces WHERE id = $1', [req.params.id])
    res.json({ workspace: updated })
  } catch (err) {
    console.error('Update workspace plan error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// GET /api/admin/users — list all users (no sensitive data)
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await all(`
      SELECT u.id, u.email, u.role, u.created_at,
        w.id as workspace_id, w.plan, w.status as workspace_status
      FROM users u
      LEFT JOIN workspaces w ON w.user_id = u.id
      WHERE u.role = 'user'
      ORDER BY u.created_at DESC
    `)
    res.json({ users })
  } catch (err) {
    console.error('Get admin users error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

module.exports = router
