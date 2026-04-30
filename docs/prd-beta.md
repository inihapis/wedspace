# Product Requirements Document — Beta

**Nama Produk:** Wedspace
**Status:** Archived (digantikan oleh v0.0.1)

---

## 1. Product Overview

Platform berbasis web untuk membantu satu entitas pasangan dalam mengelola persiapan pernikahan secara terstruktur, mudah dipantau, dan minim friction.

**Fokus utama:**

> "Biar user tau harus ngapain, udah sejauh mana, dan kondisi keuangan aman."

---

## 2. User & Workspace Model

**Workspace:**
- 1 akun = 1 workspace
- Digunakan bersama oleh pasangan A, pasangan B, dan pihak lain (opsional)

**Personalisasi:**
- Nama pasangan (opsional)
- Hashtag pasangan (opsional)

---

## 3. Core Features (Free Plan)

### 3.1 Dashboard / Today View

- Task hari ini
- Task mendekati fase
- Task overdue
- Progress timeline
- Budget terpakai vs sisa
- Progress tabungan

---

### 3.2 Timeline (Task List Mode)

Timeline berbasis fase — default & tersedia di Free Plan.

**Fitur:**
- Auto-generate berdasarkan tanggal nikah
- Dikelompokkan per fase: 6–12 bulan, 3–6 bulan, 1–3 bulan, H-30, H-7, H-1
- Task: nama, assignee (Berdua / Pasangan A / Pasangan B / Keluarga)
- Status: ⬜ Belum / 🟡 Sedang / ✅ Selesai

---

### 3.3 Budget Tracker

- Input & edit total budget
- Kategori pengeluaran
- Planned vs actual
- Summary: total terpakai, sisa budget

---

### 3.4 Savings Tracker

- Target dana
- Input tabungan (default tanggal = hari input, bisa backdate)
- Progress (%)
- Edit total tabungan

---

### 3.5 Notes

- Catatan sederhana
- Kategori ringan
- Timestamp

---

### 3.6 Task Assignment

- Assign ke: Pasangan A, Pasangan B, Keluarga
- Tanpa role kompleks

---

## 4. Premium Feature

### 4.1 Timeline Chart View

Visualisasi timeline dalam bentuk chart (Gantt-like).

**Fungsi:**
- Melihat keseluruhan progress secara visual
- Memahami overlap task
- Insight durasi

**Positioning:** Bukan fitur wajib, tapi "nice to have" untuk clarity.

**Kenapa cocok jadi Premium:**
- Tidak mengganggu core usage
- Tidak mengunci fitur penting
- Memberikan value tambahan yang jelas

---

## 5. UI/UX Requirements

**Prinsip:** Minimal, clean, tidak membingungkan, fokus ke "quick understanding".

**Visual:** Card-based layout, soft shadow, rounded modern.

**Icon:** Emoji diperbolehkan, harus konsisten & tidak berlebihan.

**Responsive:** Mobile-first, dioptimalkan untuk mobile (utama) dan desktop.

**Platform:** Web App, siap menjadi PWA.

---

## 6. System & Architecture

**Authentication:** 1 akun per workspace, login system, session-based (JWT).

**Data Model:** Workspace isolated, tidak ada akses antar workspace.

**Future-ready:** Multi-tenant ready, bisa upgrade ke multi-user (tidak di MVP).

---

## 7. Admin System

**Monitoring:**
- Total workspace
- Workspace aktif
- User baru (created_at)

**Subscription:**
- Status (Free / Premium)
- Tanggal mulai & berakhir

**Control:**
- Activate / deactivate workspace
- Suspend (opsional)

**Batasan:** Admin tidak bisa melihat task, budget, atau notes user.

---

## 8. Success Metrics

- User aktif ≥3x/minggu
- Task completion tinggi
- Budget di-update rutin
- Retensi sampai hari H

---

## 9. Risks

- Over-feature di awal
- UI terlalu kompleks
- Premium tidak terasa value-nya

---

## 10. Roadmap

| Phase | Scope |
|-------|-------|
| Phase 1 (Beta) | Semua fitur FREE, Timeline task list, Budget & Savings, Dashboard |
| Phase 2 | Premium: Timeline Chart View, UI polish, Performance optimization |
| Phase 3 | Collaboration improvement, Export/reporting, Extended features |

---

## 11. Guiding Principle

> "Kalau user gak bayar pun, dia tetap bisa nikah dengan tenang pakai produk ini."

Kalau dia bayar:

> "Hidupnya sedikit lebih rapi, bukan baru bisa jalan."
