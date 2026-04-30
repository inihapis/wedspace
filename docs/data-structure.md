# Wedspace — Struktur Data

---

## Entity Relationship

```
users (1) ──── (1) workspaces
workspaces (1) ──── (N) tasks
workspaces (1) ──── (N) budget_items
workspaces (1) ──── (N) savings_entries
workspaces (1) ──── (N) notes
```

---

## Tabel: `users`

| Field | Type | Keterangan |
|-------|------|------------|
| `id` | INTEGER PK | Auto increment |
| `email` | TEXT UNIQUE | Email login |
| `password_hash` | TEXT | bcrypt hash |
| `role` | TEXT | `user` atau `admin` |
| `created_at` | TEXT | ISO datetime |

---

## Tabel: `workspaces`

| Field | Type | Keterangan |
|-------|------|------------|
| `id` | INTEGER PK | Auto increment |
| `user_id` | INTEGER FK | Relasi ke users |
| `partner_a_name` | TEXT | Nama lengkap pasangan A |
| `partner_b_name` | TEXT | Nama lengkap pasangan B |
| `relationship_name` | TEXT | Nama hubungan (opsional) |
| `hashtag` | TEXT | Hashtag pasangan (opsional) |
| `wedding_date` | DATE | Tanggal pernikahan |
| `venue_location` | TEXT | Lokasi venue (opsional) |
| `total_budget` | BIGINT | Budget total dalam Rupiah |
| `savings_target` | BIGINT | Target tabungan dalam Rupiah |
| `plan` | TEXT | `free` atau `premium` |
| `status` | TEXT | `active`, `inactive`, `suspended` |
| `plan_started_at` | TIMESTAMP | Tanggal mulai premium |
| `plan_expires_at` | TIMESTAMP | Tanggal berakhir premium |
| `created_at` | TIMESTAMP | ISO datetime |
| `updated_at` | TIMESTAMP | ISO datetime |

---

## Tabel: `tasks`

| Field | Type | Keterangan |
|-------|------|------------|
| `id` | TEXT PK | Format: `t1`..`t31` (default) atau `custom-{wsId}-{ts}` (custom) |
| `workspace_id` | INTEGER FK | Relasi ke workspaces |
| `title` | TEXT | Nama task |
| `phase` | TEXT | Fase: `6-12 bulan`, `3-6 bulan`, `1-3 bulan`, `H-30`, `H-7`, `H-1` |
| `assignee` | TEXT | `berdua`, `pasanganA`, `pasanganB`, `keluarga` |
| `status` | TEXT | `todo`, `in_progress`, `done` |
| `due_date` | TEXT | ISO date |
| `created_at` | TEXT | ISO datetime |
| `updated_at` | TEXT | ISO datetime |

> **Catatan:** Field `priority` tidak digunakan. Dihapus sejak PRD Beta.

---

## Tabel: `budget_items`

| Field | Type | Keterangan |
|-------|------|------------|
| `id` | TEXT PK | Format: `b{wsId}-{idx}` (default) atau `b-{wsId}-{ts}` (custom) |
| `workspace_id` | INTEGER FK | Relasi ke workspaces |
| `category` | TEXT | Nama kategori |
| `planned` | INTEGER | Anggaran rencana (Rupiah) |
| `actual` | INTEGER | Pengeluaran aktual (Rupiah) |
| `sort_order` | INTEGER | Urutan tampil |
| `created_at` | TEXT | ISO datetime |

---

## Tabel: `savings_entries`

| Field | Type | Keterangan |
|-------|------|------------|
| `id` | INTEGER PK | Auto increment |
| `workspace_id` | INTEGER FK | Relasi ke workspaces |
| `amount` | INTEGER | Jumlah tabungan (Rupiah) |
| `from_partner` | TEXT | `pasanganA`, `pasanganB`, `lainnya` |
| `note` | TEXT | Catatan opsional |
| `entry_date` | TEXT | Tanggal tabungan (bisa backdate) |
| `created_at` | TEXT | ISO datetime |

---

## Tabel: `notes`

| Field | Type | Keterangan |
|-------|------|------------|
| `id` | INTEGER PK | Auto increment |
| `workspace_id` | INTEGER FK | Relasi ke workspaces |
| `title` | TEXT | Judul (opsional) |
| `content` | TEXT | Isi catatan |
| `category` | TEXT | `vendor`, `ide`, `keluarga`, `lainnya` |
| `created_at` | TEXT | ISO datetime |
| `updated_at` | TEXT | ISO datetime |
