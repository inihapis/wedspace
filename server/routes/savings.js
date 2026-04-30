const express = require('express')
const { get, run, all } = require('../db')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

async function getWorkspace(userId) {
  return await get('SELECT * FROM workspaces WHERE user_id = $1', [userId])
}

// GET /api/savings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const entries = await all(
      'SELECT * FROM savings_entries WHERE workspace_id = $1 ORDER BY entry_date DESC, created_at DESC',
      [workspace.id]
    )

    // Compute totals per partner
    const totals = { pasanganA: 0, pasanganB: 0, lainnya: 0 }
    for (const e of entries) {
      if (e.from_partner === 'pasanganA')      totals.pasanganA += Number(e.amount)
      else if (e.from_partner === 'pasanganB') totals.pasanganB += Number(e.amount)
      else                                     totals.lainnya   += Number(e.amount)
    }

    res.json({ entries, totals })
  } catch (err) {
    console.error('Get savings error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// POST /api/savings
router.post('/', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const { amount, fromPartner, note, entryDate } = req.body
    if (!amount || Number(amount) <= 0) return res.status(400).json({ error: 'Jumlah harus lebih dari 0' })

    const date = entryDate || new Date().toISOString().split('T')[0]
    await run(
      'INSERT INTO savings_entries (workspace_id, amount, from_partner, note, entry_date) VALUES ($1, $2, $3, $4, $5)',
      [workspace.id, Number(amount), fromPartner || 'pasanganA', note || '', date]
    )

    const entry = await get('SELECT * FROM savings_entries WHERE workspace_id = $1 ORDER BY id DESC LIMIT 1', [workspace.id])
    res.status(201).json({ entry })
  } catch (err) {
    console.error('Create savings error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// DELETE /api/savings/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    await run('DELETE FROM savings_entries WHERE id = $1 AND workspace_id = $2', [req.params.id, workspace.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Delete savings error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

// PUT /api/savings/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await getWorkspace(req.user.id)
    if (!workspace) return res.status(404).json({ error: 'Workspace tidak ditemukan' })

    const { amount, fromPartner, note, entryDate } = req.body
    
    const updates = []
    const values = []
    let paramCount = 1

    if (amount !== undefined) {
      if (Number(amount) <= 0) return res.status(400).json({ error: 'Jumlah harus lebih dari 0' })
      updates.push(`amount = $${paramCount++}`)
      values.push(Number(amount))
    }
    if (fromPartner !== undefined) {
      updates.push(`from_partner = $${paramCount++}`)
      values.push(fromPartner)
    }
    if (note !== undefined) {
      updates.push(`note = $${paramCount++}`)
      values.push(note)
    }
    if (entryDate !== undefined) {
      updates.push(`entry_date = $${paramCount++}`)
      values.push(entryDate)
    }

    if (updates.length === 0) return res.status(400).json({ error: 'Tidak ada data untuk diupdate' })

    values.push(req.params.id)
    values.push(workspace.id)

    await run(
      `UPDATE savings_entries SET ${updates.join(', ')} WHERE id = $${paramCount++} AND workspace_id = $${paramCount++}`,
      values
    )

    const entry = await get('SELECT * FROM savings_entries WHERE id = $1 AND workspace_id = $2', [req.params.id, workspace.id])
    res.json({ entry })
  } catch (err) {
    console.error('Update savings error:', err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

module.exports = router
