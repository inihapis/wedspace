# Wedspace — Setup & Instalasi

> Persiapan nikah jadi lebih tenang.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 + CSS Variables (design tokens) |
| State | React Context API |
| Charts | Recharts |
| Backend | Node.js + Express 5 |
| Database | SQLite via sql.js (pure JS, no native build) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| PWA | Web App Manifest + Service Worker (manual) |

---

## Struktur Folder

```
wedspace/
├── client/                    # Frontend (React + Vite)
│   ├── public/
│   │   ├── manifest.json      # PWA manifest
│   │   ├── sw.js              # Service worker
│   │   └── icons/             # PWA icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminPanel.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   ├── Sidebar.jsx        # Desktop nav
│   │   │   ├── MobileNav.jsx      # Mobile bottom nav
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Timeline.jsx
│   │   │   ├── Budget.jsx
│   │   │   ├── Savings.jsx
│   │   │   ├── Notes.jsx
│   │   │   ├── Charts.jsx         # Premium feature
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state
│   │   │   └── AppContext.jsx     # App data state
│   │   ├── utils/
│   │   │   ├── api.js             # API client
│   │   │   ├── storage.js         # Format helpers
│   │   │   ├── taskGenerator.js   # Task auto-generate logic
│   │   │   └── workspace.js       # Partner name helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css              # Design tokens (CSS variables)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                    # Backend (Node.js + Express)
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── routes/
│   │   ├── auth.js
│   │   ├── workspace.js
│   │   ├── tasks.js
│   │   ├── budget.js
│   │   ├── savings.js
│   │   ├── notes.js
│   │   └── admin.js
│   ├── utils/
│   │   └── taskGenerator.js
│   ├── db.js                  # SQLite setup
│   ├── index.js               # Entry point
│   └── package.json
├── docs/
│   ├── setup.md               # File ini
│   ├── data-structure.md      # Struktur data & schema
│   ├── architecture.md        # Arsitektur sistem
│   ├── business-system.md     # Sistem bisnis & model premium
│   ├── development-notes.md   # Catatan pengembangan & roadmap
│   ├── deployment.md          # Panduan deployment
│   ├── prd-alpha.md           # PRD versi alpha (archived)
│   └── prd-beta.md            # PRD versi beta (archived)
├── CHANGELOG.md               # Riwayat perubahan
├── .env
├── .env.example
└── package.json               # Root scripts
```

---

## Instalasi

```bash
# 1. Clone / download project

# 2. Install semua dependencies
npm run install:all

# 3. Setup environment
cp .env.example .env
# Edit .env sesuai kebutuhan
```

---

## Menjalankan

```bash
# Terminal 1 — Backend (port 3001)
npm run server

# Terminal 2 — Frontend (port 5173)
npm run client
```

---

## Environment Variables

| Variable | Default | Keterangan |
|----------|---------|------------|
| `JWT_SECRET` | `wedspace_jwt_secret_...` | Secret untuk JWT signing |
| `JWT_EXPIRES_IN` | `7d` | Durasi token |
| `PORT` | `3001` | Port backend |
| `ADMIN_EMAIL` | `admin@wedspace.id` | Email admin default |
| `ADMIN_PASSWORD` | `admin123` | Password admin default |

> ⚠️ Ganti semua nilai default sebelum deploy ke production.

---

## Build Production

```bash
npm run build   # Build frontend ke client/dist/
```

---

## Akun Admin Default

Saat server pertama kali dijalankan, akun admin dibuat otomatis menggunakan nilai dari `.env`:

- Email: `ADMIN_EMAIL`
- Password: `ADMIN_PASSWORD`

Akses Admin Panel tersedia setelah login dengan akun admin.
