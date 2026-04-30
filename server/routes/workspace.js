const express = require('express')
const { get, run } = require('../db')
const { authMiddleware } = require('../middleware/auth')
const { generateTasks, DEFAULT_BUDGET_ITEMS } = require('../utils/taskGenerator')

const router = express.Router()

// GET /api/workspace
router.get('/', authMiddleware, async (req, res) => {
  try {
    const workspace = await get('SELECT * FROM workspaces WHERE user_id = $1', [req.user.id])
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace belum dibuat', code: 'NO_WORKSPACE' })
    }
    if (workspace.status === 'suspended') {
      return res.status(403).json({ error: 'Workspace ini telah disuspend. Hubungi admin.', code: 'SUSPENDED' })
    }
    res.json({ workspace })
  } catch (err) {
    console.error('Get workspace error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// POST /api/workspace/setup — onboarding
router.post('/setup', authMiddleware, async (req, res) => {
  try {
    const existing = await get('SELECT id FROM workspaces WHERE user_id = $1', [req.user.id])
    if (existing) return res.status(409).json({ error: 'Workspace sudah ada' })

    const {
      partnerAName, partnerBName,
      relationshipName,
      hashtag, weddingDate, venueLocation, totalBudget, savingsTarget,
    } = req.body

    if (!weddingDate || !totalBudget) {
      return res.status(400).json({ error: 'Tanggal pernikahan dan budget wajib diisi' })
    }

    await run(
      `INSERT INTO workspaces
        (user_id, partner_a_name, partner_b_name, relationship_name, hashtag, wedding_date, venue_location, total_budget, savings_target)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        req.user.id,
        partnerAName || '', partnerBName || '',
        relationshipName || '',
        hashtag || '', weddingDate, venueLocation || '',
        Number(totalBudget) || 0, Number(savingsTarget) || 0,
      ]
    )

    const workspace = await get('SELECT * FROM workspaces WHERE user_id = $1', [req.user.id])

    // Generate tasks (no priority)
    const tasks = generateTasks(weddingDate)
    for (const task of tasks) {
      await run(
        `INSERT INTO tasks (id, workspace_id, title, phase, assignee, status, due_date)
         VALUES ($1, $2, $3, $4, $5, 'todo', $6)`,
        [task.id, workspace.id, task.title, task.phase, task.assignee, task.dueDate]
      )
    }

    // Default budget items
    for (const [idx, item] of DEFAULT_BUDGET_ITEMS.entries()) {
      await run(
        `INSERT INTO budget_items (id, workspace_id, category, planned, actual, sort_order)
         VALUES ($1, $2, $3, 0, 0, $4)`,
        [`b${workspace.id}-${idx + 1}`, workspace.id, item, idx]
      )
    }

    res.status(201).json({ workspace })
  } catch (err) {
    console.error('Setup workspace error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// PUT /api/workspace
router.put('/', authMiddleware, async (req, res) => {
  try {
    const workspace = await get('SELECT * FROM workspaces WHERE user_id = $1', [req.user.id])
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const {
      partnerAName, partnerBName,
      relationshipName,
      hashtag, weddingDate, venueLocation, totalBudget, savingsTarget,
    } = req.body

    await run(
      `UPDATE workspaces SET
        partner_a_name = $1,
        partner_b_name = $2,
        relationship_name = $3,
        hashtag = $4, wedding_date = $5,
        venue_location = $6,
        total_budget = $7, savings_target = $8,
        updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $9`,
      [
        partnerAName !== undefined ? partnerAName : workspace.partner_a_name,
        partnerBName !== undefined ? partnerBName : workspace.partner_b_name,
        relationshipName !== undefined ? relationshipName : workspace.relationship_name,
        hashtag !== undefined ? hashtag : workspace.hashtag,
        weddingDate !== undefined ? weddingDate : workspace.wedding_date,
        venueLocation !== undefined ? venueLocation : workspace.venue_location,
        totalBudget !== undefined ? Number(totalBudget) : workspace.total_budget,
        savingsTarget !== undefined ? Number(savingsTarget) : workspace.savings_target,
        req.user.id,
      ]
    )

    const updated = await get('SELECT * FROM workspaces WHERE user_id = $1', [req.user.id])
    res.json({ workspace: updated })
  } catch (err) {
    console.error('Update workspace error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

module.exports = router
