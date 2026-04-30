const express = require('express')
const { get, run, all } = require('../db')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

async function getWorkspace(userId) {
  return await get('SELECT * FROM workspaces WHERE user_id = $1', [userId])
}

// GET /api/notes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const notes = await all(
      'SELECT * FROM notes WHERE workspace_id = $1 ORDER BY updated_at DESC',
      [workspace.id]
    )
    res.json({ notes })
  } catch (err) {
    console.error('Get notes error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// POST /api/notes
router.post('/', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const { title, content, category } = req.body
    if (!content) return res.status(400).json({ error: 'Konten catatan wajib diisi' })

    await run(
      'INSERT INTO notes (workspace_id, title, content, category) VALUES ($1, $2, $3, $4)',
      [workspace.id, title || '', content, category || 'lainnya']
    )

    const note = await get('SELECT * FROM notes WHERE workspace_id = $1 ORDER BY id DESC LIMIT 1', [workspace.id])
    res.status(201).json({ note })
  } catch (err) {
    console.error('Create note error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// PUT /api/notes/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const note = await get('SELECT * FROM notes WHERE id = $1 AND workspace_id = $2', [req.params.id, workspace.id])
    if (!note) return res.status(404).json({ error: 'Catatan tidak ditemukan' })

    const { title, content, category } = req.body
    await run(
      `UPDATE notes SET title = $1, content = $2, category = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND workspace_id = $5`,
      [title ?? note.title, content ?? note.content, category ?? note.category, req.params.id, workspace.id]
    )

    const updated = await get('SELECT * FROM notes WHERE id = $1', [req.params.id])
    res.json({ note: updated })
  } catch (err) {
    console.error('Update note error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// DELETE /api/notes/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    await run('DELETE FROM notes WHERE id = $1 AND workspace_id = $2', [req.params.id, workspace.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Delete note error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

module.exports = router
