const { pool, initSchema, run, get, all } = require('../db')
const bcrypt = require('bcryptjs')
const { generateTasks, DEFAULT_BUDGET_ITEMS } = require('../utils/taskGenerator')

async function dropAllTables() {
  try {
    console.log('🗑️  Dropping all tables...')
    await pool.query(`
      DROP TABLE IF EXISTS notes CASCADE;
      DROP TABLE IF EXISTS savings_entries CASCADE;
      DROP TABLE IF EXISTS budget_items CASCADE;
      DROP TABLE IF EXISTS tasks CASCADE;
      DROP TABLE IF EXISTS workspaces CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `)
    console.log('✅ All tables dropped')
  } catch (error) {
    console.error('❌ Error dropping tables:', error.message)
    throw error
  }
}

async function seedDemoData() {
  try {
    console.log('🌱 Seeding demo data...')

    // Create demo user
    const demoEmail = 'demo@wedspace.id'
    const demoPassword = 'demo123'
    const passwordHash = await bcrypt.hash(demoPassword, 10)

    const userRes = await get('SELECT id FROM users WHERE email = $1', [demoEmail])
    let userId

    if (!userRes) {
      await run(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
        [demoEmail, passwordHash, 'user']
      )
      const newUser = await get('SELECT id FROM users WHERE email = $1', [demoEmail])
      userId = newUser.id
      console.log(`✅ Demo user created: ${demoEmail}`)
    } else {
      userId = userRes.id
      console.log(`✅ Demo user already exists`)
    }

    // Create demo workspace
    const weddingDate = new Date()
    weddingDate.setMonth(weddingDate.getMonth() + 6) // 6 months from now
    const weddingDateStr = weddingDate.toISOString().split('T')[0]

    const workspace = await get('SELECT id FROM workspaces WHERE user_id = $1', [userId])
    let workspaceId

    if (!workspace) {
      await run(
        `INSERT INTO workspaces 
          (user_id, partner_a_name, partner_b_name, relationship_name, hashtag, wedding_date, venue_location, total_budget, savings_target, plan)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          userId,
          'Budi',
          'Ani',
          'BudiAni',
          'BudiAni2025',
          weddingDateStr,
          'Ballroom Mewah, Jakarta',
          500000000, // 500 juta
          300000000, // 300 juta
          'free'
        ]
      )
      const newWorkspace = await get('SELECT id FROM workspaces WHERE user_id = $1', [userId])
      workspaceId = newWorkspace.id
      console.log(`✅ Demo workspace created`)
    } else {
      workspaceId = workspace.id
      console.log(`✅ Demo workspace already exists`)
    }

    // Generate and insert tasks
    const tasks = generateTasks(weddingDateStr)
    let taskCount = 0
    for (const task of tasks) {
      const existing = await get('SELECT id FROM tasks WHERE id = $1', [task.id])
      if (!existing) {
        // Randomize status: 40% done, 30% in_progress, 30% todo
        const rand = Math.random()
        const status = rand < 0.4 ? 'done' : rand < 0.7 ? 'in_progress' : 'todo'

        await run(
          `INSERT INTO tasks (id, workspace_id, title, phase, assignee, status, due_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [task.id, workspaceId, task.title, task.phase, task.assignee, status, task.dueDate]
        )
        taskCount++
      }
    }
    console.log(`✅ ${taskCount} tasks created`)

    // Insert budget items with demo data
    let budgetCount = 0
    const budgetData = [
      { category: 'Dekorasi', planned: 50000000, actual: 45000000 },
      { category: 'Catering', planned: 150000000, actual: 155000000 },
      { category: 'Gaun & Jas', planned: 80000000, actual: 75000000 },
      { category: 'Dokumentasi', planned: 60000000, actual: 58000000 },
      { category: 'Undangan', planned: 15000000, actual: 12000000 },
      { category: 'Musik & Entertainment', planned: 70000000, actual: 70000000 },
      { category: 'Transportasi', planned: 30000000, actual: 28000000 },
      { category: 'Akomodasi Tamu', planned: 40000000, actual: 35000000 },
    ]

    for (const [idx, item] of budgetData.entries()) {
      const id = `b${workspaceId}-${idx + 1}`
      const existing = await get('SELECT id FROM budget_items WHERE id = $1', [id])
      if (!existing) {
        await run(
          `INSERT INTO budget_items (id, workspace_id, category, planned, actual, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, workspaceId, item.category, item.planned, item.actual, idx]
        )
        budgetCount++
      }
    }
    console.log(`✅ ${budgetCount} budget items created`)

    // Insert savings entries
    let savingsCount = 0
    const savingsData = [
      { amount: 50000000, fromPartner: 'pasanganA', note: 'Gaji bulan Januari', daysAgo: 60 },
      { amount: 50000000, fromPartner: 'pasanganB', note: 'Gaji bulan Januari', daysAgo: 60 },
      { amount: 30000000, fromPartner: 'pasanganA', note: 'Bonus tahunan', daysAgo: 45 },
      { amount: 40000000, fromPartner: 'pasanganB', note: 'Gaji bulan Februari', daysAgo: 30 },
      { amount: 35000000, fromPartner: 'pasanganA', note: 'Gaji bulan Februari', daysAgo: 30 },
      { amount: 25000000, fromPartner: 'pasanganA', note: 'Tabungan tambahan', daysAgo: 15 },
      { amount: 30000000, fromPartner: 'pasanganB', note: 'Gaji bulan Maret', daysAgo: 5 },
    ]

    for (const item of savingsData) {
      const entryDate = new Date()
      entryDate.setDate(entryDate.getDate() - item.daysAgo)
      const entryDateStr = entryDate.toISOString().split('T')[0]

      const existing = await get(
        'SELECT id FROM savings_entries WHERE workspace_id = $1 AND amount = $2 AND entry_date = $3',
        [workspaceId, item.amount, entryDateStr]
      )
      if (!existing) {
        await run(
          `INSERT INTO savings_entries (workspace_id, amount, from_partner, note, entry_date)
           VALUES ($1, $2, $3, $4, $5)`,
          [workspaceId, item.amount, item.fromPartner, item.note, entryDateStr]
        )
        savingsCount++
      }
    }
    console.log(`✅ ${savingsCount} savings entries created`)

    // Insert notes
    let notesCount = 0
    const notesData = [
      { title: 'Vendor Dekorasi', content: 'Hubungi Toko Bunga Indah untuk konsultasi dekorasi. Nomor: 0812-3456-7890', category: 'vendor' },
      { title: 'Tema Pernikahan', content: 'Tema: Elegant Gold & White. Warna utama: Gold, putih, dan cream. Gaya: Modern minimalis dengan sentuhan klasik.', category: 'tema' },
      { title: 'Daftar Tamu', content: 'Total tamu: 250 orang. Keluarga besar: 80 orang, Teman & kolega: 170 orang.', category: 'tamu' },
      { title: 'Menu Catering', content: 'Pilihan menu: Paket Premium dengan 3 pilihan hidangan utama. Minuman: Soft drink, air mineral, dan champagne.', category: 'catering' },
      { title: 'Timeline Hari H', content: '08:00 - Persiapan pengantin\n10:00 - Upacara adat\n12:00 - Resepsi dimulai\n17:00 - Acara selesai', category: 'timeline' },
      { title: 'Dokumentasi', content: 'Paket: Foto + Video. Fotografer: Studio Momen Indah. Videografer: Pro Video Production.', category: 'vendor' },
    ]

    for (const item of notesData) {
      const existing = await get(
        'SELECT id FROM notes WHERE workspace_id = $1 AND title = $2',
        [workspaceId, item.title]
      )
      if (!existing) {
        await run(
          `INSERT INTO notes (workspace_id, title, content, category)
           VALUES ($1, $2, $3, $4)`,
          [workspaceId, item.title, item.content, item.category]
        )
        notesCount++
      }
    }
    console.log(`✅ ${notesCount} notes created`)

    console.log('\n✨ Demo data seeding completed!')
    console.log(`\n📧 Demo credentials:`)
    console.log(`   Email: ${demoEmail}`)
    console.log(`   Password: ${demoPassword}`)
    
    return { userId, workspaceId }
  } catch (error) {
    console.error('❌ Error seeding demo data:', error.message)
    throw error
  }
}

async function migrate() {
  try {
    console.log('🚀 Starting database migration...\n')

    // Drop old tables
    await dropAllTables()

    // Initialize new schema
    await initSchema()

    // Seed demo data
    await seedDemoData()

    console.log('\n✅ Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check if PostgreSQL is running')
    console.error('2. Verify DATABASE_URL in .env file')
    console.error('3. Make sure database exists')
    process.exit(1)
  }
}

migrate()
