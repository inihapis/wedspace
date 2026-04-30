# Wedspace — Deployment

> Panduan deployment untuk production.
> 
> **Last Updated**: v0.0.1a (May 2026)

---

## 📋 Perubahan di v0.0.1a

Berikut perubahan code yang mempengaruhi deployment:

### Frontend Changes
- ✅ **Component Refactoring** — Semua components menggunakan Tailwind CSS dengan CSS variables
- ✅ **Centralized Navigation** — Navigation configuration di `client/src/data/navigation.js`
- ✅ **Reusable Components** — Shared components di `client/src/components/shared/`
- ✅ **Tailwind Config** — Baru: `client/tailwind.config.js` dengan CSS variables mapping
- ✅ **Build Output** — Tetap sama: `client/dist/`

### Backend Changes
- ✅ **No breaking changes** — Backend API tetap kompatibel
- ✅ **Database** — Tetap menggunakan SQLite untuk development, PostgreSQL untuk production

### Build & Dependencies
- ✅ **Build Time** — ~300ms (tetap cepat)
- ✅ **Module Count** — 2317 modules (tetap sama)
- ✅ **No new dependencies** — Semua dependencies sudah ada

---

## Rekomendasi Arsitektur

```
Frontend (Vercel)  ←→  Backend API (Railway / Render / Fly.io)  ←→  Database (PostgreSQL)
```

**Mengapa tidak menempatkan SQLite di Vercel:**
- Vercel menggunakan storage ephemeral untuk serverless functions
- File SQLite tidak terjamin tersedia antar request atau build
- `wedspace.db` tidak cocok pada deployment Vercel yang bersifat immutable

---

## Opsi Deployment

### Opsi 1: Vercel (frontend) + Railway (backend) + PostgreSQL ⭐ Recommended

- Vercel menyajikan `client/` sebagai static site
- Railway menjalankan backend Node/Express dengan penyimpanan persisten
- Database di managed PostgreSQL di Railway

**Keuntungan:**
- Setup sederhana dengan Railway dashboard
- PostgreSQL terintegrasi di Railway
- Environment variables mudah diatur
- Monitoring & logs built-in

### Opsi 2: Vercel (frontend) + Render (backend) + PostgreSQL

- Vercel menyajikan `client/` sebagai static site
- Render menjalankan backend Node/Express
- Database di managed PostgreSQL di Render

**Keuntungan:**
- Free tier tersedia
- Deployment dari GitHub otomatis
- PostgreSQL included

### Opsi 3: Vercel (frontend) + Fly.io (backend) + PostgreSQL

- Vercel menyajikan `client/` sebagai static site
- Fly.io menjalankan backend dengan Docker
- Database di managed PostgreSQL di Fly.io

**Keuntungan:**
- Global deployment dengan edge locations
- Docker support
- Scaling otomatis

### Opsi 4: Vercel (frontend) + Supabase (backend/data)

- Frontend tetap di Vercel
- Supabase menyediakan database Postgres, auth, dan edge functions
- Backend Node/Express bisa dikurangi jika logika API dipindahkan ke Supabase

---

## Konfigurasi Vercel (Frontend)

### Project Settings

| Setting | Nilai |
|---------|-------|
| Root project | `client/` |
| Build command | `npm install && npm run build` |
| Output directory | `client/dist` |
| Node version | 18.x atau 20.x |

### Environment Variables di Vercel

### Environment Variables di Vercel

| Variable | Keterangan | Contoh |
|----------|------------|--------|
| `VITE_API_BASE_URL` | URL backend API | `https://your-railway-domain.up.railway.app/api` |

**Cara Setting di Vercel:**

1. Buka Vercel dashboard
2. Select project Wedspace
3. Go to Settings → Environment Variables
4. Add new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-railway-domain.up.railway.app/api` (ganti dengan URL Railway Anda)
   - **Environments**: Production, Preview, Development
5. Save dan redeploy

### Build Settings

```
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Local Development

Untuk development lokal, gunakan `.env` di folder `client/`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

File `.env` sudah tersedia di `client/.env` dengan default value untuk development.

**File yang digunakan:**
- `client/.env` — Development environment variables
- `client/.env.example` — Template untuk environment variables

---

## Konfigurasi Railway (Backend) ⭐ Recommended

### 1. Setup Railway Project

1. Buka [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Select `server/` directory (atau root jika monorepo)

### 2. Environment Variables di Railway

| Variable | Keterangan | Contoh |
|----------|------------|--------|
| `JWT_SECRET` | Secret untuk JWT signing | `your-secret-key-here` |
| `JWT_EXPIRES_IN` | Durasi token | `7d` |
| `PORT` | Port server | `3001` |
| `ADMIN_EMAIL` | Email akun admin | `admin@wedspace.com` |
| `ADMIN_PASSWORD` | Password akun admin | `secure-password` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `NODE_ENV` | Environment | `production` |

### 3. Database Setup di Railway

1. Add PostgreSQL plugin di Railway
2. Railway akan auto-generate `DATABASE_URL`
3. Jalankan migration script untuk setup schema

### 4. Deploy

Railway akan auto-deploy setiap push ke main branch

---

## Konfigurasi Render (Backend) - Alternative

### 1. Setup Render Service

1. Buka [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Select `server/` directory

### 2. Environment Variables di Render

Sama seperti Railway (lihat tabel di atas)

### 3. Database Setup di Render

1. Create PostgreSQL database di Render
2. Copy connection string ke `DATABASE_URL`

---

## Environment Variables Backend

### Development (`.env`)

```env
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
ADMIN_EMAIL=admin@wedspace.local
ADMIN_PASSWORD=admin123
DATABASE_URL=postgresql://localhost/wedspace_dev
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
```

### Production (Railway/Render)

```env
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRES_IN=7d
PORT=3001
ADMIN_EMAIL=admin@wedspace.com
ADMIN_PASSWORD=<generate-strong-password>
DATABASE_URL=<auto-generated-by-railway>
NODE_ENV=production
CORS_ORIGINS=https://your-vercel-domain.vercel.app,https://your-custom-domain.com
```

**CORS_ORIGINS Format:**
- Comma-separated list of allowed origins
- Example: `https://wedspace-five.vercel.app,https://wedspace.com`
- No spaces after commas
- Include protocol (http:// atau https://)

> ⚠️ **PENTING**: 
> - Ganti semua nilai default sebelum deploy ke production
> - Update `CORS_ORIGINS` setiap kali frontend domain berubah
> - Tidak perlu redeploy backend, cukup update environment variable di Railway/Render

---

## Langkah-Langkah Deployment

### Step 1: Prepare Repository

```bash
# Pastikan semua changes sudah di-commit
git status

# Push ke main branch
git push origin main
```

### Step 2: Deploy Frontend (Vercel)

1. Buka [vercel.com](https://vercel.com)
2. Import project dari GitHub
3. Select `client/` sebagai root directory
4. Add environment variable `VITE_API_BASE_URL`
5. Deploy

### Step 3: Deploy Backend (Railway)

1. Buka [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Select `server/` directory
5. Add PostgreSQL plugin
6. Set environment variables
7. Deploy

### Step 4: Verify Deployment

```bash
# Test frontend
curl https://your-vercel-domain.vercel.app

# Test backend
curl https://your-railway-domain.up.railway.app/health

# Test API connection
curl https://your-railway-domain.up.railway.app/api/auth/status
```

### Step 5: Update CORS (Backend)

Update `CORS_ORIGINS` environment variable di Railway untuk mengizinkan domain Vercel:

**Di Railway dashboard:**

1. Select project
2. Go to Variables
3. Add/Update `CORS_ORIGINS`:
   - **Value**: `https://your-vercel-domain.vercel.app,https://your-custom-domain.com`
   - Ganti dengan domain Vercel Anda
   - Jika ada multiple domains, pisahkan dengan koma (tanpa spasi)

**Contoh:**
```
CORS_ORIGINS=https://wedspace-five.vercel.app,https://wedspace.com
```

**Keuntungan:**
- ✅ Tidak perlu redeploy backend
- ✅ Bisa update CORS kapan saja
- ✅ Support multiple frontend domains
- ✅ Perubahan langsung berlaku

---

## CORS Configuration

### Bagaimana CORS Bekerja?

1. Frontend (Vercel) membuat request ke Backend (Railway)
2. Backend menerima request dan check `CORS_ORIGINS`
3. Jika origin ada di list, response include `Access-Control-Allow-Origin` header
4. Browser allow request jika header ada

### Troubleshooting CORS Error

**Error:**
```
Access to fetch at 'https://api.railway.app/api/auth/login' 
from origin 'https://wedspace.vercel.app' has been blocked by CORS policy
```

**Solusi:**

1. **Check CORS_ORIGINS di Railway:**
   ```bash
   # Di Railway dashboard, verify CORS_ORIGINS value
   # Pastikan include domain Vercel Anda
   ```

2. **Verify domain format:**
   ```
   ✅ Benar: https://wedspace-five.vercel.app
   ❌ Salah: wedspace-five.vercel.app (missing https://)
   ❌ Salah: https://wedspace-five.vercel.app/ (trailing slash)
   ```

3. **Restart backend:**
   - Di Railway dashboard, click "Redeploy"
   - Atau push commit baru ke GitHub

4. **Check browser console:**
   - Buka DevTools (F12)
   - Lihat Network tab untuk request yang failed
   - Check response headers untuk `Access-Control-Allow-Origin`

### Multiple Frontend Domains

Jika punya multiple frontend domains (development, staging, production):

```env
CORS_ORIGINS=http://localhost:5173,https://staging.vercel.app,https://wedspace.com
```

Setiap domain akan bisa akses backend tanpa CORS error.

## Migrasi Database (SQLite → PostgreSQL)

Untuk production, disarankan migrasi dari sql.js ke PostgreSQL:

### 1. Update Database Driver

Edit `server/db.js`:

```javascript
// Before (SQLite)
const initSqlJs = require('sql.js')

// After (PostgreSQL)
const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})
```

### 2. Update Query Syntax

Beberapa perbedaan syntax antara SQLite dan PostgreSQL:

| SQLite | PostgreSQL |
|--------|-----------|
| `INTEGER PRIMARY KEY AUTOINCREMENT` | `SERIAL PRIMARY KEY` |
| `DATETIME DEFAULT CURRENT_TIMESTAMP` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` |
| `PRAGMA foreign_keys = ON` | `SET CONSTRAINTS ALL IMMEDIATE` |

### 3. Run Migration

```bash
# Jalankan script setup database
node server/scripts/setup-db.js
```

### 4. Verify Migration

```bash
# Test koneksi database
psql $DATABASE_URL -c "SELECT version();"
```

---

## Monitoring & Logs

### Railway

1. Buka Railway dashboard
2. Select project
3. View logs di "Logs" tab
4. Monitor metrics di "Metrics" tab

### Vercel

1. Buka Vercel dashboard
2. Select project
3. View logs di "Deployments" tab
4. Monitor analytics di "Analytics" tab

---

## Troubleshooting

### Frontend Build Fails

**Error**: `Cannot find module 'tailwindcss'`

**Solution**: Pastikan `tailwind.config.js` ada di `client/` directory

```bash
ls -la client/tailwind.config.js
```

### Backend Connection Error

**Error**: `ECONNREFUSED 127.0.0.1:3001`

**Solution**: Pastikan backend URL di Vercel environment variable benar

```bash
# Di Vercel dashboard, check VITE_API_BASE_URL
echo $VITE_API_BASE_URL
```

### Database Connection Error

**Error**: `ECONNREFUSED - connect ECONNREFUSED`

**Solution**: Pastikan `DATABASE_URL` di Railway environment variable benar

```bash
# Di Railway dashboard, check DATABASE_URL
echo $DATABASE_URL
```

### CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Update CORS di backend untuk mengizinkan domain Vercel

```javascript
app.use(cors({
  origin: 'https://your-vercel-domain.vercel.app',
  credentials: true
}))
```

---

## Performance Optimization

### Frontend (Vercel)

- ✅ Static site generation (SSG) — Vercel auto-optimize
- ✅ Image optimization — Vercel built-in
- ✅ Code splitting — Vite auto-split
- ✅ Caching — Vercel auto-cache

### Backend (Railway)

- ✅ Connection pooling — PostgreSQL built-in
- ✅ Query optimization — Index pada frequently queried columns
- ✅ Caching — Redis optional
- ✅ Rate limiting — Implement di Express middleware

---

## Security Checklist

- [ ] JWT_SECRET di-generate dengan strong random string
- [ ] ADMIN_PASSWORD di-hash dengan bcryptjs
- [ ] CORS hanya mengizinkan domain yang diizinkan
- [ ] HTTPS enabled di semua endpoints
- [ ] Environment variables tidak di-commit ke repository
- [ ] Database backups di-enable di Railway
- [ ] Rate limiting di-implement di backend
- [ ] Input validation di-implement di semua endpoints
- [ ] SQL injection prevention (gunakan parameterized queries)
- [ ] XSS prevention (sanitize user input)

---

## Rollback Plan

### Jika deployment gagal:

1. **Frontend (Vercel)**
   - Vercel auto-keep previous deployments
   - Klik "Rollback" di Vercel dashboard

2. **Backend (Railway)**
   - Railway auto-keep previous deployments
   - Klik "Rollback" di Railway dashboard

3. **Database (PostgreSQL)**
   - Pastikan backup di-enable
   - Restore dari backup jika diperlukan

---

## Next Steps

1. ✅ Push repository ke GitHub
2. ⏳ Setup Vercel project untuk frontend
3. ⏳ Setup Railway project untuk backend
4. ⏳ Configure environment variables
5. ⏳ Deploy frontend
6. ⏳ Deploy backend
7. ⏳ Test endpoints
8. ⏳ Monitor logs & metrics

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Express.js Documentation](https://expressjs.com)
- [Vite Documentation](https://vitejs.dev)
