# Product Requirements Document — Alpha

**Nama Sementara:** Wedding Planner Personal
**Status:** Archived (digantikan oleh PRD Beta)

---

## 1. Tujuan Produk

Membantu individu/pasangan dalam:

- Mengetahui apa yang harus dilakukan menuju hari pernikahan
- Mengontrol progress persiapan
- Memantau kondisi keuangan (budget & tabungan)
- Mengurangi chaos & miskomunikasi

**Prinsip utama:**

> Simpel, jelas, dan bikin tenang — bukan makin stres.

---

## 2. Target User

**Primary:** Individu/pasangan yang sedang mempersiapkan pernikahan, tidak harus tech-savvy tapi terbiasa pakai aplikasi sederhana.

**Behavior:**
- Sering bingung mulai dari mana
- Sering cek budget
- Butuh sesuatu yang cepat dilihat, bukan dianalisis lama

---

## 3. Core User Needs

1. "Gue harus ngapain sekarang?"
2. "Udah sejauh mana persiapannya?"
3. "Uang gue masih aman gak?"
4. "Siapa yang harus ngerjain ini?"

---

## 4. Core Features (MVP)

### 4.1 Today View (Halaman Utama)

Halaman pertama yang dibuka user. Fokus ke aksi.

**Isi:**
- Task yang harus dikerjakan hari ini
- Task yang mendekati deadline
- Task yang overdue

**Fitur:**
- Checklist cepat (mark as done)
- Highlight prioritas

**Goal:** User langsung tahu harus ngapain dalam <5 detik.

---

### 4.2 Timeline & Task

Daftar aktivitas berdasarkan fase menuju hari H.

**Fitur:**
- Generate otomatis berdasarkan tanggal nikah
- Dikelompokkan per fase: 6–12 bulan, 3–6 bulan, 1–3 bulan, H-30, H-7, H-1
- Checklist per task
- Assign ke: diri sendiri, pasangan, keluarga

**Goal:** User ngerti posisi mereka dalam journey.

---

### 4.3 Budget Tracker

Monitoring anggaran secara simpel dan jelas.

**Fitur:**
- Input total budget
- Kategori pengeluaran (template default)
- Input planned cost & actual cost
- Summary: total terpakai, sisa budget

**Visual:**
- Progress bar
- Indikator warna: aman (hijau), waspada (kuning), over (merah)

**Goal:** User merasa "keuangan terkendali".

---

### 4.4 Savings Tracker

Tracking tabungan menuju target dana nikah.

**Fitur:**
- Input target dana
- Input tabungan berjalan
- Split kontribusi: user, pasangan, lainnya (opsional)
- Progress (%)
- Estimasi waktu tercapai (nice to have)

**Goal:** User punya gambaran realistis kondisi finansial.

---

### 4.5 Task Assignment

Menghindari semua tugas menumpuk di satu orang.

**Fitur:**
- Assign task ke: user, pasangan, anggota lain (manual input)
- Filter task berdasarkan orang

**Goal:** Distribusi kerja lebih adil & jelas.

---

### 4.6 Notes / Catatan

Tempat menyimpan informasi penting secara cepat.

**Fitur:**
- Text notes sederhana
- Kategori: vendor, ide, catatan keluarga
- Timestamp

**Goal:** Mengurangi kehilangan informasi penting.

---

## 5. Non-Goals (Alpha)

- Marketplace vendor
- Integrasi pembayaran
- Fitur undangan digital
- AI recommendation
- Reporting detail

---

## 6. User Flow

1. User masuk aplikasi
2. Input: nama pasangan, tanggal pernikahan, target budget
3. Sistem generate timeline & task
4. User diarahkan ke Today View
5. User mulai checklist task, input budget, update tabungan

---

## 7. Design Direction

**Prinsip:** Minimal, tidak ramai, fokus ke informasi penting, tidak "terlalu wedding".

**Color Palette:**

| Token | Hex | Keterangan |
|-------|-----|------------|
| Primary | `#003082` | Deep Blue — tenang, stabil, trusted |
| Background | `#FAFAFA` | Warm White |
| Accent | `#F5DADF` | Soft Peach — sentuhan emosional, subtle |
| Highlight | `#C8A96A` | Soft Gold — untuk elemen penting saja |
| Text | `#1E293B` | Dark Gray |

**Visual Feel:** Clean seperti dashboard kerja, tapi lebih hangat. Banyak whitespace, card-based layout.

---

## 8. Success Metrics

- User membuka aplikasi ≥3x per minggu
- Task completion rate tinggi
- Budget di-update secara berkala
- User tetap aktif sampai hari H

---

## 9. Risks

- User hanya aktif di awal
- Terlalu kompleks → ditinggalkan
- UX tidak intuitif → user balik ke catatan manual

---

## 10. Roadmap

| Phase | Scope |
|-------|-------|
| Phase 1 (MVP) | Today View, Timeline, Budget, Savings |
| Phase 2 | Guest management, Vendor tracking, Collaboration |
| Phase 3 | Insight / analytics, Vendor ecosystem |
