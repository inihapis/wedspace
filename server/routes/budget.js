const express = require('express')
const { get, run, all } = require('../db')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

async function getWorkspace(userId) {
  return await get('SELECT * FROM workspaces WHERE user_id = $1', [userId])
}

// GET /api/budget
router.get('/', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const items = await all('SELECT * FROM budget_items WHERE workspace_id = $1 ORDER BY sort_order ASC', [workspace.id])
    res.json({ items })
  } catch (err) {
    console.error('Get budget error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// PUT /api/budget/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const item = await get('SELECT * FROM budget_items WHERE id = $1 AND workspace_id = $2', [req.params.id, workspace.id])
    if (!item) return res.status(404).json({ error: 'Item tidak ditemukan' })

    const { planned, actual, category } = req.body
    await run(
      `UPDATE budget_items SET
        planned = $1, actual = $2, category = $3
       WHERE id = $4 AND workspace_id = $5`,
      [
        planned !== undefined ? Number(planned) : item.planned,
        actual  !== undefined ? Number(actual)  : item.actual,
        category ?? item.category,
        req.params.id,
        workspace.id,
      ]
    )

    const updated = await get('SELECT * FROM budget_items WHERE id = $1', [req.params.id])
    res.json({ item: updated })
  } catch (err) {
    console.error('Update budget error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// POST /api/budget — add category
router.post('/', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const { category } = req.body
    if (!category) return res.status(400).json({ error: 'Nama kategori wajib diisi' })

    const maxOrder = await get('SELECT MAX(sort_order) as max FROM budget_items WHERE workspace_id = $1', [workspace.id])
    const sortOrder = (maxOrder?.max || 0) + 1
    const id = `b-${workspace.id}-${Date.now()}`

    await run(
      'INSERT INTO budget_items (id, workspace_id, category, planned, actual, sort_order) VALUES ($1, $2, $3, 0, 0, $4)',
      [id, workspace.id, category, sortOrder]
    )

    const item = await get('SELECT * FROM budget_items WHERE id = $1', [id])
    res.status(201).json({ item })
  } catch (err) {
    console.error('Create budget error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// DELETE /api/budget/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    await run('DELETE FROM budget_items WHERE id = $1 AND workspace_id = $2', [req.params.id, workspace.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Delete budget error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

module.exports = router
