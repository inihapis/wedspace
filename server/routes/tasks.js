const express = require('express')
const { get, run, all } = require('../db')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

async function getWorkspace(userId) {
  return await get('SELECT * FROM workspaces WHERE user_id = $1', [userId])
}

// GET /api/tasks
router.get('/', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const tasks = await all('SELECT * FROM tasks WHERE workspace_id = $1 ORDER BY due_date ASC', [workspace.id])
    res.json({ tasks })
  } catch (err) {
    console.error('Get tasks error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// PUT /api/tasks/:id/status — cycle status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const task = await get('SELECT * FROM tasks WHERE id = $1 AND workspace_id = $2', [req.params.id, workspace.id])
    if (!task) return res.status(404).json({ error: 'Task tidak ditemukan' })

    const statusCycle = { todo: 'in_progress', in_progress: 'done', done: 'todo' }
    const nextStatus = statusCycle[task.status] || 'todo'

    await run(
      `UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND workspace_id = $3`,
      [nextStatus, req.params.id, workspace.id]
    )

    const updated = await get('SELECT * FROM tasks WHERE id = $1', [req.params.id])
    res.json({ task: updated })
  } catch (err) {
    console.error('Update task status error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// PUT /api/tasks/:id — update task (assignee, title, etc.)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const task = await get('SELECT * FROM tasks WHERE id = $1 AND workspace_id = $2', [req.params.id, workspace.id])
    if (!task) return res.status(404).json({ error: 'Task tidak ditemukan' })

    const { assignee, title, status } = req.body

    await run(
      `UPDATE tasks SET
        assignee = $1, title = $2, status = $3,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND workspace_id = $5`,
      [
        assignee ?? task.assignee,
        title ?? task.title,
        status ?? task.status,
        req.params.id,
        workspace.id,
      ]
    )

    const updated = await get('SELECT * FROM tasks WHERE id = $1', [req.params.id])
    res.json({ task: updated })
  } catch (err) {
    console.error('Update task error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// POST /api/tasks — add custom task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const { title, phase, assignee } = req.body
    if (!title || !phase) return res.status(400).json({ error: 'Title dan phase wajib diisi' })

    const id = `custom-${workspace.id}-${Date.now()}`
    await run(
      `INSERT INTO tasks (id, workspace_id, title, phase, assignee, status)
       VALUES ($1, $2, $3, $4, $5, 'todo')`,
      [id, workspace.id, title, phase, assignee || 'berdua']
    )

    const task = await get('SELECT * FROM tasks WHERE id = $1', [id])
    res.status(201).json({ task })
  } catch (err) {
    console.error('Create task error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// DELETE /api/tasks/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    await run('DELETE FROM tasks WHERE id = $1 AND workspace_id = $2', [req.params.id, workspace.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Delete task error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

module.exports = router
