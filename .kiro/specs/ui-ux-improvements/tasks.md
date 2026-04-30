# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - UI Inconsistency & Navigation Defects
  - **CRITICAL**: Test ini HARUS GAGAL pada kode yang belum difix — kegagalan mengkonfirmasi bug ada
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: Test ini mengenkode expected behavior — akan memvalidasi fix ketika pass setelah implementasi
  - **GOAL**: Surface counterexample yang mendemonstrasikan bug ada
  - **Scoped PBT Approach**: Karena bug bersifat deterministik (bukan probabilistik), scope property ke kasus konkret yang gagal
  - Test cases yang harus ditulis (jalankan pada kode UNFIXED):
    - Render `Budget` dengan item budget yang punya nilai `actual` → assert kolom Aktual adalah `<input>` langsung (bukan `<button>` yang menampilkan `formatRupiah()`) — **EXPECTED: PASS** (konfirmasi bug 1 ada)
    - Render `Sidebar` → assert `navItems` mengandung item dengan `id === 'charts'` — **EXPECTED: PASS** (konfirmasi bug 2 ada)
    - Render `MobileNav` → assert ada tombol Charts yang dirender — **EXPECTED: PASS** (konfirmasi bug 2 ada)
    - Render `Sidebar` → assert icon item navigasi adalah emoji string (bukan komponen React) — **EXPECTED: PASS** (konfirmasi bug 4 ada)
    - Baca `index.css` → assert tidak ada rule `button { cursor: pointer }` — **EXPECTED: PASS** (konfirmasi bug 5 ada)
  - Run test pada kode UNFIXED
  - **EXPECTED OUTCOME**: Semua test PASS (ini benar — membuktikan bug ada)
  - Document counterexample yang ditemukan untuk memahami root cause
  - Mark task complete ketika test ditulis, dijalankan, dan kegagalan didokumentasikan
  - _Requirements: 1.1, 1.2, 2.4, 4.1, 5.1_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Budget Calculation & Navigation Behavior
  - **IMPORTANT**: Ikuti observation-first methodology
  - Observe behavior pada kode UNFIXED untuk input yang tidak termasuk bug condition:
    - Observe: `totalPlanned = SUM(item.planned)` untuk semua kombinasi nilai budget
    - Observe: `totalActual = SUM(item.actual)` untuk semua kombinasi nilai budget
    - Observe: `diff = item.planned - item.actual` untuk setiap item
    - Observe: `usedPct = Math.round((totalActual / totalBudget) * 100)` untuk berbagai nilai
    - Observe: Kolom Rencana toggle display/edit berfungsi normal (klik → input, blur → display)
    - Observe: Navigasi ke Dashboard, Timeline, Budget, Savings, Notes berfungsi normal
  - Write property-based tests dari Preservation Requirements di design:
    - **PBT**: Generate random array budget items → assert `totalActual === items.reduce((s,i) => s + i.actual, 0)` selalu benar
    - **PBT**: Generate random budget items → assert `diff === item.planned - item.actual` selalu benar untuk setiap item
    - **PBT**: Generate random savings entries → assert `total === entries.reduce((s,e) => s + e.amount, 0)` selalu benar
    - **PBT**: Generate random task arrays → assert phaseProgress data konsisten (done + inProgress + todo === total per fase)
    - **Unit**: Render `Budget` → klik kolom Rencana → assert input muncul; blur → assert kembali ke display mode
    - **Unit**: Render `Sidebar` → assert item navigasi Dashboard/Timeline/Budget/Savings/Notes ada dan berfungsi
  - Verify test PASS pada kode UNFIXED
  - **EXPECTED OUTCOME**: Semua test PASS (konfirmasi baseline behavior yang harus dipreservasi)
  - Mark task complete ketika test ditulis, dijalankan, dan passing pada kode unfixed
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 3. Fix: UI/UX Improvements — 6 Bug Conditions

  - [x] 3.1 Install lucide-react dependency
    - Jalankan `npm install lucide-react` di direktori `client/`
    - Verifikasi `lucide-react` muncul di `client/package.json` dependencies
    - _Bug_Condition: isBugCondition(element) where element IS NavigationItem AND element.icon IS EmojiString_
    - _Expected_Behavior: navItems icon adalah komponen Lucide React, bukan emoji string_
    - _Requirements: 2.8, 2.9_

  - [x] 3.2 Fix Bug 1 — Kolom Aktual toggle display/edit mode di Budget.jsx
    - Tambah state `editingActualId` di `Budget.jsx` (mirip `editingId` untuk kolom Rencana)
    - Ganti `<input>` langsung di kolom Aktual dengan pola toggle:
      - Saat `editingActualId !== item.id`: tampilkan `<button>` yang menampilkan `formatRupiah(item.actual)`
      - Saat `editingActualId === item.id`: tampilkan `<input type="number">` dengan `onBlur` untuk simpan dan reset state
    - Styling konsisten dengan kolom Rencana: `onMouseEnter`/`onMouseLeave` untuk color change, `text-right`
    - _Bug_Condition: isBugCondition(element) where element IS BudgetTableRow AND element.column IS 'aktual' AND element.mode IS ALWAYS_INPUT_
    - _Expected_Behavior: formatRupiah(item.actual) ditampilkan saat idle; beralih ke input saat diklik_
    - _Preservation: editingId toggle untuk kolom Rencana tidak berubah; kalkulasi totalActual tetap sama_
    - _Requirements: 2.1, 2.2, 3.3, 3.4_

  - [x] 3.3 Fix Bug 2 — Hapus Charts dari navigasi dan pindahkan chart ke halaman masing-masing
    - **Sidebar.jsx**: Hapus `{ id: 'charts', icon: '📊', label: 'Charts' }` dari array `navItems`; hapus logika `isChartsLocked`
    - **MobileNav.jsx**: Hapus item Charts dari `navItems` array; hapus tombol Charts yang dirender terpisah di luar map
    - **App.jsx**: Hapus `import Charts from './components/Charts'`; hapus `charts: <Charts />` dari objek `views`
    - **Timeline.jsx**: Import Recharts components dan `formatRupiah`/`formatRupiahShort` dari storage; tambah section "Progress per Fase" (BarChart) di bawah daftar task dengan premium gate (locked state jika non-premium)
    - **Budget.jsx**: Tambah section "Distribusi Budget" (PieChart) di bawah tabel dengan premium gate
    - **Savings.jsx**: Tambah section "Tabungan vs Pengeluaran" (BarChart horizontal) di bawah riwayat dengan premium gate
    - **Charts.jsx**: Hapus file setelah semua chart dipindahkan (atau jadikan utility kosong)
    - _Bug_Condition: isBugCondition(element) where element IS NavigationItem AND element.id IS 'charts'_
    - _Expected_Behavior: navItems tidak mengandung item Charts; chart muncul di halaman masing-masing_
    - _Preservation: Chart data (phaseProgress, budgetDistribution, savingsVsSpending) identik; locked state tetap muncul untuk non-premium_
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 3.1, 3.2_

  - [x] 3.4 Fix Bug 3 — Font mobile di index.css
    - Tambah media query di `client/src/index.css` untuk mobile typography scale:
      ```css
      @media (max-width: 640px) {
        h1, .text-2xl { font-size: 1.25rem; }
        h2, .text-xl  { font-size: 1.125rem; }
        .text-3xl     { font-size: 1.5rem; }
      }
      ```
    - _Bug_Condition: isBugCondition(element) where element IS TextElement AND viewport.width < 768px AND element.fontSize NOT IN mobileTypographyScale_
    - _Expected_Behavior: Heading lebih kecil di mobile (20px vs 24px); body tetap readable_
    - _Preservation: Ukuran font di desktop tidak berubah_
    - _Requirements: 2.7_

  - [x] 3.5 Fix Bug 4 — Ganti emoji icon dengan Lucide React di Sidebar.jsx dan MobileNav.jsx
    - **Sidebar.jsx**: Import `{ LayoutDashboard, Calendar, Wallet, PiggyBank, FileText }` dari `lucide-react`; update `navItems` array agar `icon` berupa komponen Lucide; update render untuk menggunakan `const IconComponent = item.icon; <IconComponent size={18} />`
    - **MobileNav.jsx**: Sama seperti Sidebar — import Lucide icons, update `navItems`, update render
    - Pengecualian: `💎` pada badge premium dan `💍` pada branding Wedspace tetap emoji
    - _Bug_Condition: isBugCondition(element) where element IS NavigationItem AND element.icon IS EmojiString_
    - _Expected_Behavior: Icon navigasi adalah komponen Lucide React, konsisten di semua platform_
    - _Preservation: Label navigasi tidak berubah; navigasi antar halaman tetap berfungsi_
    - _Requirements: 2.8, 3.7, 3.8_

  - [x] 3.6 Fix Bug 4 (lanjutan) — Ganti emoji status dengan Lucide icon di Budget.jsx dan Savings.jsx
    - **Budget.jsx**: Import `{ XCircle, AlertTriangle, CheckCircle2 }` dari `lucide-react`; ganti `statusLabel` string emoji dengan JSX yang menggunakan Lucide icon; ganti `⚠️ Melebihi budget` dengan `<AlertTriangle size={14} /> Melebihi budget`
    - **Savings.jsx**: Import `{ CheckCircle2, AlertTriangle }` dari `lucide-react`; ganti `✅ Tabungan lebih besar` dan `⚠️ Pengeluaran lebih besar` dengan Lucide icon
    - _Bug_Condition: isBugCondition(element) where element IS StatusIndicator AND element.icon IS EmojiString_
    - _Expected_Behavior: Status indicator menggunakan Lucide icon yang konsisten_
    - _Preservation: Logika kondisi status (usedPct > 90, usedPct > 70, dll.) tidak berubah_
    - _Requirements: 2.9_

  - [x] 3.7 Fix Bug 5 — Hover state & cursor pointer di index.css
    - Tambah global CSS rules di `client/src/index.css`:
      ```css
      button, [role="button"], select, label[for], a { cursor: pointer; }
      button:disabled, [disabled] { cursor: not-allowed; opacity: 0.5; }
      ```
    - Verifikasi filter buttons di Timeline sudah punya visual hover feedback (sudah ada `transition-all border`, pastikan konsisten)
    - Verifikasi baris tabel Budget sudah punya `hover:bg-gray-50/40` (sudah ada, pastikan tidak hilang setelah refactor)
    - Verifikasi baris riwayat Savings sudah punya `hover:bg-gray-50/50` (sudah ada)
    - _Bug_Condition: isBugCondition(element) where element IS InteractiveElement AND NOT hasCursorPointer(element)_
    - _Expected_Behavior: Semua elemen interaktif punya cursor pointer dan visual hover feedback_
    - _Preservation: Hover state yang sudah ada (onMouseEnter/onMouseLeave inline) tidak dihapus_
    - _Requirements: 2.10, 2.11_

  - [x] 3.8 Fix Bug 6 — Layout mobile Budget dan tap target minimum 44px
    - **Budget.jsx**: Tambah dual layout — `hidden sm:grid` untuk desktop table row, `sm:hidden` untuk mobile card layout per item; mobile card menampilkan kategori di atas, lalu grid 3 kolom (Rencana, Aktual, Selisih) di bawah; header tabel juga `hidden sm:grid`
    - **MobileNav.jsx**: Pastikan tap target minimum 44px — ubah `py-2` menjadi `py-3` atau tambah `min-h-[44px]` pada tombol nav
    - **Timeline.jsx**: Tambah `min-h-[44px]` atau `py-2.5` pada tombol filter assignee untuk memenuhi tap target 44px
    - _Bug_Condition: isBugCondition(element) where element IS BudgetTable AND viewport.width < 640px AND element.layout IS FOUR_COLUMN_TABLE_
    - _Expected_Behavior: Budget items ditampilkan sebagai card di mobile; tap target ≥ 44px_
    - _Preservation: Desktop layout 4 kolom tidak berubah; CRUD budget tetap berfungsi di mobile_
    - _Requirements: 2.12, 2.13_

  - [x] 3.9 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - UI Inconsistency & Navigation Defects Resolved
    - **IMPORTANT**: Re-run test yang SAMA dari task 1 — jangan tulis test baru
    - Test dari task 1 mengenkode expected behavior; ketika pass, konfirmasi fix berhasil
    - Jalankan ulang semua test dari task 1:
      - Kolom Aktual menampilkan `formatRupiah()` saat idle → **EXPECTED: PASS**
      - `navItems` Sidebar tidak mengandung item `id === 'charts'` → **EXPECTED: PASS**
      - Tidak ada tombol Charts di MobileNav → **EXPECTED: PASS**
      - Icon navigasi adalah komponen React (bukan emoji string) → **EXPECTED: PASS**
      - `index.css` mengandung rule `button { cursor: pointer }` → **EXPECTED: PASS**
    - **EXPECTED OUTCOME**: Semua test PASS (konfirmasi semua bug sudah difix)
    - _Requirements: 2.1, 2.2, 2.6, 2.8, 2.10_

  - [x] 3.10 Verify preservation tests still pass
    - **Property 2: Preservation** - Budget Calculation & Navigation Behavior
    - **IMPORTANT**: Re-run test yang SAMA dari task 2 — jangan tulis test baru
    - Jalankan ulang semua preservation tests dari task 2
    - **EXPECTED OUTCOME**: Semua test PASS (konfirmasi tidak ada regresi)
    - Konfirmasi: kalkulasi budget masih benar, navigasi masih berfungsi, kolom Rencana masih toggle normal
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 4. Checkpoint — Ensure all tests pass
  - Jalankan seluruh test suite dan pastikan semua test pass
  - Lakukan manual smoke test di browser:
    - Buka Budget → klik kolom Aktual → input muncul → blur → nilai tampil sebagai Rupiah ✓
    - Buka Sidebar → tidak ada menu Charts ✓
    - Buka Timeline (premium) → chart progress fase muncul di bawah daftar task ✓
    - Buka Budget (premium) → chart distribusi budget muncul di bawah tabel ✓
    - Buka Savings (premium) → chart tabungan vs pengeluaran muncul di bawah riwayat ✓
    - Buka Timeline/Budget/Savings (non-premium) → locked state muncul ✓
    - Resize ke 375px → Budget menampilkan card layout, bukan tabel 4 kolom ✓
    - Hover ke tombol filter Timeline → cursor pointer, ada visual feedback ✓
    - Icon navigasi di Sidebar dan MobileNav adalah Lucide icon (bukan emoji) ✓
    - Icon 💎 dan 💍 tetap emoji ✓
  - Tanyakan ke user jika ada pertanyaan atau ambiguitas
