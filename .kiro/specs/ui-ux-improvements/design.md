# UI/UX Improvements - Bugfix Design

## Overview

Dokumen ini mendeskripsikan desain teknis untuk 6 perbaikan UI/UX pada aplikasi **Wedspace**. Semua perbaikan bersifat targeted dan minimal — tidak mengubah logika bisnis, hanya memperbaiki inkonsistensi visual, navigasi, dan interaksi pengguna.

**Pendekatan fix:**
- Kolom Aktual di Budget: tambah toggle display/edit mode seperti kolom Rencana
- Chart: pindahkan dari halaman terpisah ke halaman Timeline, Budget, dan Savings; hapus menu Charts dari navigasi
- Font mobile: tambah CSS media query untuk skala tipografi yang lebih proporsional
- Icon: ganti emoji di `navItems` array dengan komponen Lucide React; ganti emoji status dengan Lucide icon
- Hover state: tambah `cursor-pointer` global dan perkuat visual feedback pada elemen interaktif
- Layout mobile: ubah tabel Budget menjadi card layout di mobile, perkuat tap target minimum 44px

---

## Glossary

- **Bug_Condition (C)**: Kondisi yang memicu defect — elemen UI yang tidak konsisten, tidak accessible, atau tidak memberikan feedback yang memadai
- **Property (P)**: Perilaku yang diharapkan setelah fix diterapkan
- **Preservation**: Perilaku fungsional yang tidak boleh berubah setelah fix
- **formatRupiah()**: Fungsi di `client/src/utils/storage.js` yang memformat angka menjadi string Rupiah (contoh: `Rp 1.500.000`)
- **navItems**: Array konstanta di `Sidebar.jsx` dan `MobileNav.jsx` yang mendefinisikan item navigasi
- **toggle display/edit mode**: Pola UI di mana elemen menampilkan nilai terformat saat idle, dan beralih ke input saat diklik (sudah diimplementasikan di kolom Rencana dan field Total Budget)
- **Lucide React**: Library icon berbasis SVG yang sudah tersedia di ekosistem React; perlu diinstall via `npm install lucide-react`
- **tap target**: Area yang bisa diklik/disentuh pada elemen interaktif; minimum 44×44px sesuai WCAG 2.5.5

---

## Bug Details

### Bug Condition

Terdapat 6 kondisi bug yang saling independen. Masing-masing dapat difix secara terpisah.

**Formal Specification:**

```
FUNCTION isBugCondition(element)
  INPUT: element — komponen atau elemen UI di aplikasi Wedspace
  OUTPUT: boolean

  RETURN (
    -- Bug 1: Kolom Aktual tidak punya display mode
    (element IS BudgetTableRow AND element.column IS 'aktual'
      AND element.mode IS ALWAYS_INPUT)

    OR

    -- Bug 2: Menu Charts masih ada di navigasi
    (element IS NavigationItem AND element.id IS 'charts')

    OR

    -- Bug 3: Font mobile tidak proporsional
    (element IS TextElement AND viewport.width < 768px
      AND element.fontSize NOT IN mobileTypographyScale)

    OR

    -- Bug 4: Icon navigasi menggunakan emoji
    (element IS NavigationItem AND element.icon IS EmojiString
      AND element.id IN ['dashboard','timeline','budget','savings','notes'])

    OR

    -- Bug 5: Elemen interaktif tanpa cursor pointer / hover state
    (element IS InteractiveElement
      AND NOT hasCursorPointer(element)
      AND NOT hasVisualHoverFeedback(element))

    OR

    -- Bug 6: Layout Budget mobile tidak readable
    (element IS BudgetTable AND viewport.width < 640px
      AND element.layout IS FOUR_COLUMN_TABLE)
  )
END FUNCTION
```

### Contoh Konkret

**Bug 1 — Kolom Aktual:**
- Input: Pengguna melihat baris budget "Catering" dengan aktual = 5000000
- Aktual: Kolom Aktual menampilkan `<input type="number" value="5000000">` selalu
- Expected: Kolom Aktual menampilkan `Rp 5.000.000` saat idle, beralih ke input saat diklik (sama seperti kolom Rencana)

**Bug 2 — Menu Charts:**
- Input: Pengguna membuka sidebar di desktop
- Aktual: Sidebar menampilkan 6 item nav termasuk "📊 Charts"
- Expected: Sidebar menampilkan 5 item nav (Dashboard, Timeline, Budget, Tabungan, Catatan) tanpa Charts

**Bug 3 — Font mobile:**
- Input: Pengguna membuka halaman Budget di iPhone SE (375px)
- Aktual: Heading `text-2xl` (24px) dan body `text-sm` (14px) sama seperti desktop
- Expected: Heading lebih kecil (misalnya `text-xl` / 20px) dan body tetap readable

**Bug 4 — Icon emoji:**
- Input: Pengguna melihat sidebar di Windows 11
- Aktual: Icon "☀️" untuk Dashboard terlihat berbeda dari macOS karena rendering emoji berbeda antar OS
- Expected: Icon `<LayoutDashboard />` dari Lucide React tampil konsisten di semua platform

**Bug 5 — Hover state:**
- Input: Pengguna mengarahkan kursor ke filter assignee di Timeline
- Aktual: Kursor tetap `default`, tidak ada perubahan visual
- Expected: Kursor berubah menjadi `pointer`, background berubah saat hover

**Bug 6 — Layout mobile:**
- Input: Pengguna membuka halaman Budget di mobile (375px)
- Aktual: Tabel 4 kolom (Kategori, Rencana, Aktual, Selisih) terlalu sempit, teks terpotong
- Expected: Setiap item budget ditampilkan sebagai card dengan layout yang readable

---

## Expected Behavior

### Preservation Requirements

**Perilaku yang TIDAK boleh berubah:**
- Logika penyimpanan dan pengambilan data budget (CRUD) tetap sama
- Logika penyimpanan dan pengambilan data tabungan tetap sama
- Logika toggle/cycle status task di Timeline tetap sama
- Kalkulasi total budget, total aktual, sisa, dan persentase tetap sama
- Kalkulasi total tabungan dan progress percentage tetap sama
- Chart data (phaseProgress, budgetDistribution, savingsVsSpending) tetap sama, hanya lokasi render yang berpindah
- Locked state / upgrade prompt untuk user non-premium tetap muncul di halaman masing-masing
- Icon 💎 pada badge premium dan icon 💍 pada branding Wedspace tetap menggunakan emoji
- Fungsi logout tetap berfungsi
- Navigasi antar halaman (Dashboard, Timeline, Budget, Tabungan, Catatan) tetap berfungsi

**Scope:**
Semua input yang tidak termasuk dalam 6 kondisi bug di atas tidak boleh terpengaruh oleh fix ini.

---

## Hypothesized Root Cause

### Bug 1 — Kolom Aktual selalu input

Kolom Rencana sudah mengimplementasikan toggle display/edit dengan state `editingId`. Kolom Aktual menggunakan `<input>` langsung tanpa state toggle, kemungkinan karena dianggap lebih mudah untuk input cepat. Namun ini menciptakan inkonsistensi visual.

**Root cause**: Implementasi yang tidak konsisten antara kolom Rencana dan Aktual di `Budget.jsx`.

### Bug 2 — Menu Charts di navigasi

Menu Charts ditambahkan sebagai fitur premium tersendiri. Setelah keputusan untuk memindahkan chart ke halaman masing-masing, array `navItems` di `Sidebar.jsx` dan `MobileNav.jsx` belum diupdate, dan `App.jsx` masih memiliki route `charts`.

**Root cause**: Array `navItems` dan routing di `App.jsx` belum direfactor setelah keputusan arsitektur berubah.

### Bug 3 — Font mobile tidak proporsional

`index.css` tidak memiliki media query untuk tipografi mobile. Semua ukuran font menggunakan Tailwind class yang sama di semua breakpoint.

**Root cause**: Tidak ada CSS mobile typography scale di `index.css`.

### Bug 4 — Icon emoji di navigasi

Array `navItems` menggunakan string emoji sebagai nilai `icon`. Lucide React belum diinstall sebagai dependency.

**Root cause**: Lucide React belum diinstall; `navItems` menggunakan emoji string bukan komponen React.

### Bug 5 — Hover state tidak konsisten

Beberapa elemen menggunakan `onMouseEnter`/`onMouseLeave` inline untuk hover state, tapi tidak semua elemen interaktif mendapatkan perlakuan yang sama. Tidak ada global CSS rule untuk `cursor: pointer` pada elemen interaktif.

**Root cause**: Tidak ada global CSS rule; hover state diterapkan secara ad-hoc per komponen.

### Bug 6 — Layout Budget mobile

Tabel Budget menggunakan `grid-cols-12` yang fixed, tidak ada breakpoint untuk mobile. Di layar kecil, 4 kolom menjadi sangat sempit.

**Root cause**: Tidak ada responsive layout untuk tabel Budget di `Budget.jsx`.

---

## Correctness Properties

Property 1: Bug Condition - Kolom Aktual Menampilkan Format Rupiah

_For any_ baris budget di tabel Budget, ketika kolom Aktual tidak sedang dalam mode edit (user belum mengklik kolom tersebut), nilai aktual SHALL ditampilkan menggunakan `formatRupiah()` — konsisten dengan kolom Rencana dan Selisih.

**Validates: Requirements 2.1, 2.2**

Property 2: Bug Condition - Menu Charts Tidak Ada di Navigasi

_For any_ render dari komponen `Sidebar` atau `MobileNav`, array `navItems` SHALL tidak mengandung item dengan `id === 'charts'`, dan tidak ada tombol navigasi Charts yang dirender.

**Validates: Requirements 2.6**

Property 3: Bug Condition - Icon Navigasi Menggunakan Lucide React

_For any_ item navigasi di `Sidebar` dan `MobileNav` dengan id dalam `['dashboard', 'timeline', 'budget', 'savings', 'notes']`, properti `icon` SHALL berupa komponen Lucide React (bukan emoji string).

**Validates: Requirements 2.8, 2.9**

Property 4: Preservation - Fungsionalitas Budget Tidak Berubah

_For any_ operasi CRUD pada budget items (tambah kategori, edit rencana, edit aktual, hapus kategori), perilaku penyimpanan dan kalkulasi SHALL tetap identik dengan implementasi sebelumnya.

**Validates: Requirements 3.3, 3.4**

Property 5: Preservation - Chart Data Tetap Sama

_For any_ user premium yang membuka halaman Timeline, Budget, atau Savings, data yang ditampilkan pada chart (phaseProgress, budgetDistribution, savingsVsSpending) SHALL identik dengan data yang sebelumnya ditampilkan di halaman Charts.

**Validates: Requirements 3.1, 3.2**

---

## Fix Implementation

### Perubahan yang Diperlukan

#### Fix 1: Kolom Aktual — Toggle Display/Edit Mode

**File**: `client/src/components/Budget.jsx`

**Perubahan**:
1. Tambah state `editingActualId` (mirip `editingId` untuk kolom Rencana)
2. Ganti `<input>` langsung di kolom Aktual dengan pola toggle:
   - Saat `editingActualId !== item.id`: tampilkan `<button>` yang menampilkan `formatRupiah(item.actual)`
   - Saat `editingActualId === item.id`: tampilkan `<input type="number">` dengan `onBlur` untuk simpan dan reset state
3. Styling konsisten dengan kolom Rencana (hover color change, text-right)

```jsx
// State baru
const [editingActualId, setEditingActualId] = useState(null)

// Di kolom Aktual (col-span-3):
{editingActualId === item.id ? (
  <input
    type="number"
    defaultValue={item.actual || ''}
    onBlur={(e) => {
      updateBudgetItem(item.id, { actual: e.target.value })
      setEditingActualId(null)
    }}
    autoFocus
    className={inputCls + ' w-full text-right'}
    style={{ borderColor: 'var(--color-primary)', color: 'var(--color-text)' }}
  />
) : (
  <button
    onClick={() => setEditingActualId(item.id)}
    className="w-full text-right text-sm transition-all"
    style={{ color: 'var(--color-text)' }}
    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text)'}>
    {formatRupiah(item.actual)}
  </button>
)}
```

---

#### Fix 2: Chart Dipindah ke Halaman Masing-masing

**File**: `client/src/components/Timeline.jsx`
- Import komponen chart dari Recharts dan fungsi dari `Charts.jsx`
- Tambah section "Progress per Fase" di bawah daftar task (hanya untuk user premium)
- Tampilkan locked state kecil jika non-premium

**File**: `client/src/components/Budget.jsx`
- Tambah section "Distribusi Budget" di bawah tabel (hanya untuk user premium)

**File**: `client/src/components/Savings.jsx`
- Tambah section "Tabungan vs Pengeluaran" di bawah riwayat (hanya untuk user premium)

**File**: `client/src/components/Charts.jsx`
- Ekstrak logika chart ke fungsi/komponen yang bisa di-reuse, atau pindahkan langsung ke masing-masing halaman
- File `Charts.jsx` bisa dihapus atau dijadikan utility setelah semua chart dipindahkan

**File**: `client/src/components/Sidebar.jsx`
- Hapus `{ id: 'charts', icon: '📊', label: 'Charts' }` dari array `navItems`
- Hapus logika `isChartsLocked`

**File**: `client/src/components/MobileNav.jsx`
- Hapus item Charts dari `navItems` array
- Hapus tombol Charts yang dirender secara terpisah di luar map

**File**: `client/src/App.jsx`
- Hapus `import Charts from './components/Charts'`
- Hapus `charts: <Charts />` dari objek `views`

---

#### Fix 3: Font Mobile — Skala Tipografi

**File**: `client/src/index.css`

Tambah media query untuk mobile typography:

```css
/* ─── Mobile Typography ──────────────────────────────────────────────────── */
@media (max-width: 640px) {
  h1, .text-2xl { font-size: 1.25rem; }   /* 20px instead of 24px */
  h2, .text-xl  { font-size: 1.125rem; }  /* 18px instead of 20px */
  .text-3xl     { font-size: 1.5rem; }    /* 24px instead of 30px */
}
```

Catatan: Karena aplikasi menggunakan Tailwind v4, pendekatan yang lebih tepat adalah menggunakan responsive prefix (`sm:text-2xl text-xl`) langsung di komponen. Kedua pendekatan valid; CSS global lebih mudah diterapkan secara konsisten.

---

#### Fix 4: Icon Lucide React

**Langkah 1 — Install dependency:**
```bash
npm install lucide-react
```

**File**: `client/src/components/Sidebar.jsx`

```jsx
import {
  LayoutDashboard, Calendar, Wallet, PiggyBank, FileText,
  CheckCircle2, AlertTriangle, XCircle
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'timeline',  icon: Calendar,        label: 'Timeline' },
  { id: 'budget',    icon: Wallet,          label: 'Budget' },
  { id: 'savings',   icon: PiggyBank,       label: 'Tabungan' },
  { id: 'notes',     icon: FileText,        label: 'Catatan' },
]

// Di render:
const IconComponent = item.icon
<IconComponent size={18} />
```

**File**: `client/src/components/MobileNav.jsx`
- Sama seperti Sidebar, ganti emoji dengan komponen Lucide

**File**: `client/src/components/Budget.jsx`
- Ganti `🔴 Over budget` → `<XCircle size={14} /> Over budget`
- Ganti `🟡 Waspada` → `<AlertTriangle size={14} /> Waspada`
- Ganti `🟢 Aman` → `<CheckCircle2 size={14} /> Aman`
- Ganti `⚠️ Melebihi budget` → `<AlertTriangle size={14} /> Melebihi budget`

**File**: `client/src/components/Savings.jsx`
- Ganti `✅ Tabungan lebih besar` → `<CheckCircle2 size={14} /> Tabungan lebih besar`
- Ganti `⚠️ Pengeluaran lebih besar` → `<AlertTriangle size={14} /> Pengeluaran lebih besar`

**Pengecualian (tetap emoji):**
- `💎` pada badge premium di Sidebar dan Charts
- `💍` pada branding Wedspace di Sidebar dan loading screen

---

#### Fix 5: Hover State & Cursor Pointer

**File**: `client/src/index.css`

Tambah global CSS rules:

```css
/* ─── Interactive Elements ───────────────────────────────────────────────── */
button,
[role="button"],
select,
label[for],
a {
  cursor: pointer;
}

/* Ensure disabled elements don't get pointer */
button:disabled,
[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
```

**File**: `client/src/components/Timeline.jsx`
- Filter buttons: tambah `cursor-pointer` class dan perkuat hover state
- TaskRow: pastikan `onMouseEnter`/`onMouseLeave` sudah ada (sudah ada, perlu verifikasi)

**File**: `client/src/components/Budget.jsx`
- Baris tabel: `hover:bg-gray-50/40` sudah ada, pastikan `cursor-pointer` diterapkan

**File**: `client/src/components/Savings.jsx`
- Baris riwayat: `hover:bg-gray-50/50` sudah ada, pastikan konsisten

---

#### Fix 6: Layout Mobile Budget

**File**: `client/src/components/Budget.jsx`

Strategi: Gunakan CSS grid yang responsive. Di mobile (`< sm`), tampilkan setiap item sebagai card 2-baris. Di desktop, tetap gunakan tabel 4 kolom.

```jsx
{/* Mobile: card layout, Desktop: table row */}
{budgetItems.map((item) => {
  const diff = (Number(item.planned) || 0) - (Number(item.actual) || 0)
  return (
    <div key={item.id}>
      {/* Desktop row (hidden on mobile) */}
      <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-3 border-b items-center group ...">
        {/* existing 4-column layout */}
      </div>

      {/* Mobile card (hidden on desktop) */}
      <div className="sm:hidden px-4 py-3 border-b group ...">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{item.category}</span>
          <button onClick={() => deleteBudgetItem(item.id)} ...>X</button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-text-subtle mb-0.5">Rencana</p>
            <p className="font-medium">{formatRupiah(item.planned)}</p>
          </div>
          <div>
            <p className="text-text-subtle mb-0.5">Aktual</p>
            <p className="font-medium">{formatRupiah(item.actual)}</p>
          </div>
          <div>
            <p className="text-text-subtle mb-0.5">Selisih</p>
            <p className="font-medium" style={{ color: diff >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {diff >= 0 ? '+' : ''}{formatRupiah(diff)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})}
```

**Tap target minimum 44px:**
- Semua tombol di MobileNav: pastikan `py-2` menghasilkan tinggi ≥ 44px (saat ini `py-2` = 8px padding × 2 + ~20px content ≈ 36px, perlu `py-3` atau `min-h-[44px]`)
- Tombol filter di Timeline: tambah `min-h-[44px]` atau `py-2.5`
- Tombol tambah kategori di Budget: sudah `p-3`, cukup

---

## Testing Strategy

### Validation Approach

Testing mengikuti dua fase: pertama verifikasi bug condition ada di kode yang belum difix (exploratory), kemudian verifikasi fix bekerja dan tidak merusak perilaku yang ada (fix checking + preservation checking).

---

### Exploratory Bug Condition Checking

**Goal**: Konfirmasi bahwa bug condition benar-benar ada sebelum fix diterapkan.

**Test Plan**: Render komponen dengan data mock dan verifikasi perilaku yang salah.

**Test Cases**:

1. **Aktual selalu input**: Render `Budget` dengan item budget, verifikasi bahwa kolom Aktual adalah `<input>` bukan `<button>` yang menampilkan `formatRupiah()` (akan pass pada kode lama, fail setelah fix)

2. **Charts di navItems**: Render `Sidebar`, verifikasi bahwa ada item dengan `id === 'charts'` di DOM (akan pass pada kode lama, fail setelah fix)

3. **Emoji di navItems**: Render `Sidebar`, verifikasi bahwa icon item navigasi adalah string emoji bukan komponen React (akan pass pada kode lama, fail setelah fix)

4. **Tidak ada cursor pointer global**: Verifikasi bahwa `index.css` tidak mengandung rule `button { cursor: pointer }` (akan pass pada kode lama, fail setelah fix)

**Expected Counterexamples**:
- Kolom Aktual tidak memiliki toggle display/edit mode
- Array `navItems` mengandung item Charts
- Icon navigasi adalah emoji string, bukan komponen Lucide

---

### Fix Checking

**Goal**: Verifikasi bahwa setelah fix, semua bug condition tidak lagi terjadi.

**Pseudocode:**
```
FOR ALL budgetItem WHERE budgetItem.actual IS NOT NULL DO
  render Budget component
  ASSERT column 'aktual' displays formatRupiah(budgetItem.actual) when not editing
  ASSERT column 'aktual' switches to input when clicked
END FOR

FOR ALL navItem IN Sidebar.navItems DO
  ASSERT navItem.id NOT EQUAL 'charts'
  IF navItem.id IN ['dashboard','timeline','budget','savings','notes'] THEN
    ASSERT navItem.icon IS LucideComponent (not emoji string)
  END IF
END FOR

FOR ALL viewport WHERE viewport.width < 640px DO
  render Budget component
  ASSERT budget items displayed as cards (not 4-column table)
END FOR
```

---

### Preservation Checking

**Goal**: Verifikasi bahwa fix tidak merusak perilaku yang sudah benar.

**Pseudocode:**
```
FOR ALL budgetItem DO
  -- Edit kolom Rencana masih berfungsi
  ASSERT editingId toggle behavior UNCHANGED
  -- Kalkulasi masih benar
  ASSERT totalPlanned = SUM(item.planned)
  ASSERT totalActual = SUM(item.actual)
  ASSERT diff = item.planned - item.actual
END FOR

FOR ALL user WHERE user.plan IS 'premium' DO
  -- Chart data di Timeline = data yang dulu di Charts
  ASSERT phaseProgress data IDENTICAL
  -- Chart data di Budget = data yang dulu di Charts
  ASSERT budgetDistribution data IDENTICAL
  -- Chart data di Savings = data yang dulu di Charts
  ASSERT savingsVsSpending data IDENTICAL
END FOR

FOR ALL user WHERE user.plan IS NOT 'premium' DO
  -- Locked state masih muncul di halaman masing-masing
  ASSERT locked/upgrade prompt IS VISIBLE in Timeline, Budget, Savings
END FOR
```

**Testing Approach**: Property-based testing direkomendasikan untuk preservation checking kalkulasi budget karena:
- Dapat generate banyak kombinasi nilai budget secara otomatis
- Menangkap edge case (nilai 0, nilai negatif, nilai sangat besar)
- Memberikan jaminan kuat bahwa kalkulasi tidak berubah

---

### Unit Tests

- Test toggle display/edit mode kolom Aktual: klik → input muncul, blur → kembali ke display
- Test bahwa `navItems` di Sidebar tidak mengandung item Charts setelah fix
- Test bahwa `navItems` di MobileNav tidak mengandung item Charts setelah fix
- Test bahwa icon di navItems adalah komponen React (bukan string) setelah fix
- Test kalkulasi budget (totalPlanned, totalActual, remaining, usedPct) dengan berbagai input
- Test mobile card layout Budget: pada viewport < 640px, item ditampilkan sebagai card

### Property-Based Tests

- Generate random array of budget items → verifikasi `totalActual = SUM(item.actual)` selalu benar
- Generate random budget items → verifikasi `diff = planned - actual` selalu benar untuk setiap item
- Generate random savings entries → verifikasi `total = SUM(entries.amount)` selalu benar
- Generate random task arrays → verifikasi phaseProgress data konsisten antara lokasi lama (Charts) dan baru (Timeline)

### Integration Tests

- Test full flow: buka Budget, klik kolom Aktual, isi nilai, blur → nilai tersimpan dan ditampilkan sebagai Rupiah
- Test navigasi: sidebar tidak menampilkan Charts, klik Timeline → halaman Timeline terbuka dengan chart (jika premium)
- Test premium flow: login sebagai user premium → chart muncul di Timeline/Budget/Savings
- Test non-premium flow: login sebagai user free → locked state muncul di Timeline/Budget/Savings (bukan halaman Charts terpisah)
- Test mobile: buka Budget di viewport 375px → item ditampilkan sebagai card, bukan tabel 4 kolom
