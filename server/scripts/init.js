#!/usr/bin/env node

/**
 * One-command database initialization
 * Runs: setup-db → migrate
 */

const { spawn } = require('child_process')
const path = require('path')

async function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname
    })

    proc.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with code ${code}`))
      }
    })

    proc.on('error', reject)
  })
}

async function init() {
  try {
    console.log('🚀 Initializing Wedspace database...\n')

    console.log('📦 Step 1: Setting up database...')
    await runCommand('node', ['setup-db.js'])

    console.log('\n📊 Step 2: Running migration...')
    await runCommand('node', ['migrate.js'])

    console.log('\n✨ All done! You can now start the server.')
    console.log('\n📝 Next steps:')
    console.log('   1. Start server: npm run dev')
    console.log('   2. Start client: cd ../client && npm run dev')
    console.log('   3. Login with: demo@wedspace.com / Demo123456')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Initialization failed:', error.message)
    process.exit(1)
  }
}

init()
