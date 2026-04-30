const { Pool } = require('pg')
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })

async function setupDatabase() {
  // Connect to default postgres database to create wedspace
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL.replace('/wedspace', '/postgres'),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })

  try {
    console.log('🔧 Setting up database...\n')
    console.log('👉 DATABASE_URL:', process.env.DATABASE_URL)
    console.log('📍 Connecting to PostgreSQL...')

    // Check if database exists
    const result = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = 'wedspace'`
    )

    if (result.rows.length > 0) {
      console.log('✅ Database "wedspace" already exists')
    } else {
      console.log('📦 Creating database "wedspace"...')
      await pool.query('CREATE DATABASE wedspace')
      console.log('✅ Database "wedspace" created successfully')
    }

    console.log('\n✨ Database setup completed!')
    console.log('\nNext step: Run migration')
    console.log('  npm run migrate')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error setting up database:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Make sure PostgreSQL is running')
    console.error('2. Check DATABASE_URL in .env file')
    console.error('3. Verify username and password are correct')
    process.exit(1)
  } finally {
    await pool.end()
  }
}

setupDatabase()
