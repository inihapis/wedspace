# Wedspace — Arsitektur Sistem

---

## Overview

```
Browser (React SPA)
        │
        │  HTTP/REST (JSON)
        ▼
Express API Server (port 3001)
        │
        │  sql.js
        ▼
SQLite Database (server/wedspace.db)
```

---

## Frontend Architecture

```
App.jsx
├── AuthProvider (AuthContext)
│   └── AppProvider (AppContext)
│       └── AppShell
│           ├── [loading]          → Loading screen
│           ├── [unauthenticated]  → AuthPage
│           ├── [admin]            → AdminPanel
│           ├── [no workspace]     → Onboarding
│           └── [main app]
│               ├── Sidebar (desktop)
│               ├── MobileNav (mobile)
│               └── Views:
│                   ├── Dashboard
│                   ├── Timeline
│                   ├── Budget
│                   ├── Savings
│                   ├── Notes
│                   ├── Charts (premium)
│                   └── Profile
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
```

---

## Data Flow

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
        │
        └── API call (async)
                │
                ├── Success → state sudah benar
                └── Error   → revert state
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
| PUT | `/api/admin/workspaces/:id/status` | Admin | Set status workspace |
| PUT | `/api/admin/workspaces/:id/plan` | Admin | Set plan workspace |
| GET | `/api/admin/users` | Admin | List semua user |

---

## Catatan Teknis

- **sql.js** menyimpan DB ke file setiap kali ada write. Untuk production traffic tinggi, pertimbangkan migrasi ke PostgreSQL.
- **JWT token** disimpan di localStorage. Untuk keamanan lebih tinggi, pertimbangkan httpOnly cookies.
- **CORS** saat ini hanya allow `http://localhost:5173`. Update untuk production domain.
- **Service Worker** menggunakan cache-first strategy untuk static assets. API calls tidak di-cache (by design).
