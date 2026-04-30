# Wedspace Setup & Migration Guide

## Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Setup Environment Variables

#### Server (.env di server/)
Sudah ada di `server/.env`:
```bash
DATABASE_URL=postgresql://dwikyalvin76:12141618@localhost:5432/wedspace
NODE_ENV=development
JWT_SECRET=wedspace_jwt_secret_change_in_production_2025
JWT_EXPIRES_IN=7d
PORT=3001
```

#### Client (.env di client/)
```bash
VITE_API_URL=http://localhost:3001/api
```

### 3. Initialize Database (One Command!)
```bash
cd server
npm run init
```

Ini akan:
1. ✅ Create database `wedspace`
2. ✅ Create all tables
3. ✅ Seed demo data

Output akan terlihat seperti:
```
🚀 Initializing Wedspace database...

📦 Step 1: Setting up database...
🔧 Setting up database...

📦 Creating database "wedspace"...
✅ Database "wedspace" created successfully

✨ Database setup completed!

📊 Step 2: Running migration...
🚀 Starting database migration...

🗑️  Dropping all tables...
✅ All tables dropped
✅ Database schema initialized
🌱 Seeding demo data...
✅ Demo user created: demo@wedspace.com
✅ Demo workspace created
✅ 31 tasks created
✅ 8 budget items created
✅ 7 savings entries created
✅ 6 notes created

✨ Demo data seeding completed!

📧 Demo credentials:
   Email: demo@wedspace.com
   Password: Demo123456

✨ All done! You can now start the server.
```

### 4. Start Development Servers

#### Terminal 1 - Server
```bash
npm run server
```

#### Terminal 2 - Client
```bash
npm run client
```

### 5. Login dengan Demo Account
- Email: `demo@wedspace.com`
- Password: `Demo123456`

## Demo Data Overview

### Workspace
- **Couple**: Budi & Ani
- **Relationship Name**: BudiAni
- **Hashtag**: #BudiAni2025
- **Wedding Date**: 6 bulan dari sekarang
- **Venue**: Ballroom Mewah, Jakarta
- **Plan**: Premium

### Budget
- **Total Budget**: Rp 500,000,000
- **Total Spent**: Rp 481,000,000 (96.2%)
- **Remaining**: Rp 19,000,000

### Savings
- **Savings Target**: Rp 300,000,000
- **Total Saved**: Rp 260,000,000 (86.7%)
- **Remaining**: Rp 40,000,000

### Tasks
- **Total**: 31 tasks
- **Done**: ~40%
- **In Progress**: ~30%
- **Todo**: ~30%

### Notes
- 6 notes dengan berbagai kategori (vendor, tema, tamu, catering, timeline, dokumentasi)

## Available Commands

### Root Level
```bash
npm run install:all    # Install dependencies untuk server & client
npm run server         # Start server (port 3001)
npm run client         # Start client (port 5173)
npm run build          # Build client for production
```

### Server Level (cd server)
```bash
npm run dev            # Start server
npm run init           # Initialize database (setup + migrate)
npm run setup-db       # Create database only
npm run migrate        # Create tables & seed data
```

### Client Level (cd client)
```bash
npm run dev            # Start dev server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
```

## Troubleshooting

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Pastikan PostgreSQL service running
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL dari Services
```

### Database Already Exists
Jika ingin reset database:
```bash
cd server
npm run init
# Script akan drop dan recreate semua tables
```

### Port Already in Use
Jika port 3001 atau 5173 sudah digunakan:
```bash
# Change server port di server/.env
PORT=3002

# Change client port di client/vite.config.js
```

## Project Structure
```
wedspace/
├── server/
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utilities (taskGenerator)
│   ├── scripts/
│   │   ├── init.js      # One-command setup
│   │   ├── setup-db.js  # Create database
│   │   └── migrate.js   # Create tables & seed data
│   ├── db.js            # Database setup
│   ├── index.js         # Server entry
│   ├── .env             # Environment variables
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Context API
│   │   ├── utils/       # Utilities
│   │   └── main.jsx
│   ├── .env             # Environment variables
│   └── package.json
├── docs/                # Documentation
├── SETUP.md            # This file
└── package.json        # Root package.json
```

## Development Tips

### Hot Reload
- Client: Automatic dengan Vite
- Server: Restart manual atau gunakan `nodemon`

### Database Queries
- Gunakan `psql` untuk direct database access
- Check logs di server console

### API Testing
- Gunakan Postman atau curl
- Base URL: `http://localhost:3001/api`
- Include `Authorization: Bearer <token>` header

## Production Deployment

Untuk production:
1. Update `.env` dengan production values
2. Set `NODE_ENV=production`
3. Build client: `npm run build`
4. Deploy ke hosting (Vercel, Heroku, etc.)

Lihat `docs/deployment.md` untuk detail lebih lanjut.
