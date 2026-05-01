# Wedspace — Arsitektur Sistem

**Versi**: v0.0.3
**Last Updated**: May 1, 2026

---

## Overview

```
Browser (React SPA + PWA)
        │
        │  HTTP/REST (JSON) + JWT
        ▼
Express API Server (port 3001)
        │
        │  pg (node-postgres)
        ▼
PostgreSQL Database
```

---

## Frontend Architecture

```
main.jsx
├── registerSW()               ← Service Worker registration
└── <App />
    └── AuthProvider (AuthContext)
        └── AppProvider (AppContext)
            └── AppShell
                ├── [loading]          → Loading screen
                ├── [unauthenticated]  → AuthPage
                ├── [admin]            → AdminPanel
                ├── [no workspace]     → Onboarding
                └── [main app]
                    ├── OfflineBanner  ← Muncul saat offline
                    ├── Sidebar (desktop)
                    ├── MobileHeader (mobile)
                    ├── MobileNav (mobile, Home di tengah)
                    └── Views:
                        ├── Dashboard  (charts focus, XL grid)
                        ├── Timeline   (XL grid)
                        ├── Budget     (XL grid)
                        ├── Savings    (XL grid)
                        ├── Notes      (XL grid, 3-col)
                        ├── Charts     (premium)
                        └── Profile    (workspace settings)
```

---

## PWA Architecture

```
Browser
├── Service Worker (sw.js)
│   ├── Static Cache (Cache API)
│   │   └── Strategy: Cache-First
│   │       └── /, /index.html, /manifest.json
│   │
│   └── API Handling
│       ├── GET /api/workspace|tasks|budget|savings|notes
│       │   └── Strategy: Network-First + IDB Fallback
│       │       ├── Online  → fetch API → save to IDB → return response
│       │       └── Offline → load from IDB → return cached data
│       │
│       ├── GET /api/auth/me
│       │   └── Strategy: Network-First (no IDB)
│       │
│       ├── POST/PUT/DELETE (all)
│       │   └── Strategy: Network-Only (no cache)
│       │
│       ├── /api/auth/login|register
│       │   └── Never cached
│       │
│       └── /api/admin/*
│           └── Never cached
│
└── IndexedDB (wedspace-offline)
    ├── workspace  → { userId, data, updatedAt }
    ├── tasks      → { userId, data, updatedAt }
    ├── budget     → { userId, data, updatedAt }
    ├── savings    → { userId, data, updatedAt }
    ├── notes      → { userId, data, updatedAt }
    └── meta       → { userId, data, updatedAt }
```

### Multi-Tenant Safety

```
User A login
    └── JWT token → userId = "1"
        └── IDB keys: workspace["1"], tasks["1"], ...

User B login (same device)
    └── JWT token → userId = "2"
        └── IDB keys: workspace["2"], tasks["2"], ...
        └── Cannot access User A's data

User A logout
    └── idbClearUser("1") → delete all User A's IDB records
    └── notifySWLogout("1") → SW also clears User A's data
```

---

## Auth Flow

```
1. User buka app
2. AuthContext cek token di localStorage
3. Jika ada token → GET /api/auth/me → restore session
4. Jika tidak ada → tampil AuthPage (Login/Register)
5. Login sukses → simpan JWT token → redirect ke app
6. Setiap API request → kirim token di header: Authorization: Bearer {token}
7. Token expired → 401 → logout otomatis
8. Logout → clear token + IDB data + notify SW
```

---

## Data Flow

### Online Mode

```
User action (klik, input)
        │
        ▼
Component (local state update — optimistic)
        │
        ▼
AppContext action (updateBudgetItem, toggleTaskStatus, dll)
        │
        ├── Update React state (immediate)
        ├── API call (async)
        │       ├── Success → state sudah benar + save to IDB
        │       └── Error   → revert state
        └── IDB update (background, best-effort)
```

### Offline Mode

```
App load / focus
        │
        ▼
AppContext.loadAll()
        │
        ├── Try: fetch API → FAIL (offline)
        │
        └── Fallback: load from IndexedDB
                │
                └── Render data (read-only, stale indicator)

User comes back online
        │
        ▼
window 'online' event → loadAll() → fresh data from API → update IDB
```

---

## API Endpoints

### Auth

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| POST | `/api/auth/register` | — | Daftar akun baru |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | User | Cek & restore session |

### Workspace

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| GET | `/api/workspace` | User | Get workspace |
| POST | `/api/workspace/setup` | User | Setup workspace (onboarding) |
| PUT | `/api/workspace` | User | Update workspace |

### Tasks

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| GET | `/api/tasks` | User | Get semua task |
| POST | `/api/tasks` | User | Tambah task custom |
| PUT | `/api/tasks/:id` | User | Update task |
| PUT | `/api/tasks/:id/status` | User | Cycle status task |
| DELETE | `/api/tasks/:id` | User | Hapus task |

### Budget

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| GET | `/api/budget` | User | Get budget items |
| POST | `/api/budget` | User | Tambah kategori |
| PUT | `/api/budget/:id` | User | Update budget item |
| DELETE | `/api/budget/:id` | User | Hapus kategori |

### Savings

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| GET | `/api/savings` | User | Get tabungan |
| POST | `/api/savings` | User | Tambah entry tabungan |
| PUT | `/api/savings/:id` | User | Update entry |
| DELETE | `/api/savings/:id` | User | Hapus entry |

### Notes

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| GET | `/api/notes` | User | Get catatan |
| POST | `/api/notes` | User | Tambah catatan |
| PUT | `/api/notes/:id` | User | Edit catatan |
| DELETE | `/api/notes/:id` | User | Hapus catatan |

### Admin

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| GET | `/api/admin/stats` | Admin | Overview statistik |
| GET | `/api/admin/workspaces` | Admin | List semua workspace |
| GET | `/api/admin/workspaces/:id` | Admin | Detail workspace |
| PUT | `/api/admin/workspaces/:id/status` | Admin | Set status workspace |
| PUT | `/api/admin/workspaces/:id/plan` | Admin | Set plan workspace |
| GET | `/api/admin/users` | Admin | List semua user |

---

## Utilities

### `client/src/utils/api.js`
HTTP client wrapper. Otomatis attach JWT token dari localStorage ke setiap request.

### `client/src/utils/idb.js`
IndexedDB helper. Semua operasi scoped per `userId`.
- `idbGet(store, userId)` — baca data
- `idbSet(store, userId, data)` — tulis data
- `idbClearUser(userId)` — hapus semua data user
- `isStale(record, maxAgeMs)` — cek staleness

### `client/src/utils/pwa.js`
Service Worker utilities.
- `registerSW()` — register SW, auto-update check
- `notifySWLogout(userId)` — notify SW saat logout
- `notifySWRevalidate(userId)` — trigger revalidation
- `onSWMessage(callback)` — listen pesan dari SW

### `client/src/utils/storage.js`
Format helpers: `formatRupiah`, `formatRupiahShort`, `getDaysLeft`.

### `client/src/utils/workspace.js`
Partner name resolution: `getPartnerADisplay`, `getPartnerBDisplay`, `getAssigneeLabel`.

---

## Design System

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#2B2B2B` | Charcoal — primary actions, sidebar |
| `--color-primary-dark` | `#1A1A1A` | Hover state |
| `--color-primary-light` | `#F0EDEA` | Light background |
| `--color-accent` | `#C6A96B` | Gold — premium, highlights |
| `--color-accent-dark` | `#A8893A` | Deep gold |
| `--color-accent-light` | `#F5EDD8` | Gold background |
| `--color-bg` | `#F7F3EE` | Warm cream page background |
| `--color-surface` | `#FFFFFF` | Card surface |
| `--color-border` | `#E8E0D5` | Warm border |
| `--color-text` | `#1A1A1A` | Primary text |
| `--color-text-muted` | `#6B6560` | Secondary text |
| `--color-text-subtle` | `#A09890` | Tertiary text |

### Shadow Tokens

| Token | Usage |
|-------|-------|
| `--shadow-xs` | Subtle card |
| `--shadow-sm` | Button, input |
| `--shadow-md` | Elevated card |
| `--shadow-lg` | Modal, dropdown |
| `--shadow-gold` | Premium elements |

---

## Catatan Teknis

- **JWT token** disimpan di localStorage. Untuk keamanan lebih tinggi, pertimbangkan httpOnly cookies di v0.1.x.
- **IndexedDB** digunakan sebagai offline cache, bukan primary storage. Source of truth tetap PostgreSQL.
- **Service Worker** decode JWT hanya untuk extract `userId` sebagai cache key — tidak untuk auth. Verifikasi tetap di server.
- **CORS** dikonfigurasi via env `CORS_ORIGINS` (comma-separated). Update untuk production domain.
- **Bundle size** >500KB karena Recharts. Pertimbangkan dynamic import di v0.0.4.
- **PostgreSQL** — untuk Railway, gunakan `DATABASE_URL` dari PostgreSQL plugin.
