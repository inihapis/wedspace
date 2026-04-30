# Bugfix Requirements Document

## Introduction

Dokumen ini mencakup serangkaian perbaikan UI/UX pada aplikasi wedding planner **Wedspace**. Semua item adalah perbaikan pada fitur yang sudah ada — bukan fitur baru — yang bertujuan meningkatkan konsistensi visual, keterbacaan, dan kualitas interaksi pengguna di seluruh aplikasi.

Perbaikan meliputi: format mata uang pada kolom Aktual di Budget, pemindahan chart ke halaman masing-masing (menghapus sub-menu Charts), penyesuaian ukuran font di mobile, penggantian emoji icon dengan Lucide React, penambahan hover state dan cursor pointer pada elemen interaktif, serta optimasi layout mobile.

---

## Bug Analysis

### Current Behavior (Defect)

**1. Format Kolom Aktual di Budget**

1.1 WHEN pengguna melihat tabel budget THEN kolom "Aktual" menampilkan `<input type="number">` biasa tanpa format mata uang Rupiah, berbeda dengan kolom "Rencana" dan "Selisih" yang sudah diformat dengan `formatRupiah()`

1.2 WHEN pengguna mengisi nilai pada kolom Aktual THEN nilai yang tersimpan tidak ditampilkan dalam format Rupiah saat input tidak sedang aktif (tidak ada display mode seperti kolom Rencana)

**2. Chart sebagai Halaman Terpisah**

2.1 WHEN pengguna ingin melihat progress fase THEN mereka harus berpindah ke halaman "Charts" yang terpisah, padahal chart tersebut paling relevan ditampilkan di halaman Timeline

2.2 WHEN pengguna ingin melihat distribusi budget THEN mereka harus berpindah ke halaman "Charts", padahal chart tersebut paling relevan ditampilkan di halaman Budget

2.3 WHEN pengguna ingin melihat perbandingan tabungan vs pengeluaran THEN mereka harus berpindah ke halaman "Charts", padahal chart tersebut paling relevan ditampilkan di halaman Savings

2.4 WHEN pengguna melihat sidebar atau mobile nav THEN terdapat menu "Charts" (📊) yang menjadi navigasi tersendiri, menambah kompleksitas navigasi yang tidak perlu

**3. Ukuran Font di Mobile**

3.1 WHEN pengguna mengakses aplikasi di perangkat mobile THEN beberapa elemen teks menggunakan ukuran font yang kurang proporsional untuk layar kecil, mengurangi keterbacaan

**4. Icon Menggunakan Emoji**

4.1 WHEN pengguna melihat sidebar atau mobile nav THEN icon navigasi menggunakan emoji (☀️, 📅, 💰, 🏦, 🧾, 📊) yang tampilannya tidak konsisten antar platform/OS dan terlihat kurang profesional dibanding icon library

4.2 WHEN pengguna melihat status label di Budget (🔴, 🟡, 🟢) dan pesan di Savings (✅, ⚠️) THEN emoji digunakan sebagai pengganti icon yang seharusnya menggunakan komponen icon yang konsisten

**5. Hover State & Cursor Pointer**

5.1 WHEN pengguna mengarahkan kursor ke elemen yang bisa diklik (tombol filter, baris tabel, kartu interaktif) THEN beberapa elemen tidak menampilkan `cursor: pointer` sehingga pengguna tidak tahu elemen tersebut bisa diklik

5.2 WHEN pengguna mengarahkan kursor ke elemen interaktif tertentu THEN tidak ada perubahan visual (background, warna, atau scale) yang mengindikasikan elemen tersebut clickable

**6. Layout Mobile**

6.1 WHEN pengguna mengakses halaman Budget di mobile THEN tabel dengan 4 kolom (Kategori, Rencana, Aktual, Selisih) terlalu sempit untuk layar kecil dan sulit dibaca

6.2 WHEN pengguna mengakses aplikasi di mobile THEN beberapa spacing dan ukuran tap target belum dioptimalkan untuk interaksi sentuh

---

### Expected Behavior (Correct)

**1. Format Kolom Aktual di Budget**

2.1 WHEN pengguna melihat tabel budget dan kolom Aktual tidak sedang diedit THEN sistem SHALL menampilkan nilai dalam format Rupiah (menggunakan `formatRupiah()`) konsisten dengan kolom Rencana dan Selisih

2.2 WHEN pengguna mengklik kolom Aktual untuk mengedit THEN sistem SHALL beralih ke mode input angka, dan setelah blur SHALL kembali menampilkan nilai dalam format Rupiah

**2. Chart Dipindah ke Halaman Masing-masing**

2.3 WHEN pengguna membuka halaman Timeline (dan berstatus premium) THEN sistem SHALL menampilkan chart progress per fase langsung di halaman tersebut

2.4 WHEN pengguna membuka halaman Budget (dan berstatus premium) THEN sistem SHALL menampilkan chart distribusi budget langsung di halaman tersebut

2.5 WHEN pengguna membuka halaman Savings (dan berstatus premium) THEN sistem SHALL menampilkan chart tabungan vs pengeluaran langsung di halaman tersebut

2.6 WHEN pengguna melihat sidebar atau mobile nav THEN sistem SHALL tidak menampilkan menu "Charts" sebagai item navigasi tersendiri

**3. Ukuran Font di Mobile**

2.7 WHEN pengguna mengakses aplikasi di perangkat mobile THEN sistem SHALL menampilkan teks dengan ukuran font yang proporsional dan readable untuk layar kecil, mengikuti skala tipografi yang konsisten

**4. Icon Menggunakan Lucide React**

2.8 WHEN pengguna melihat sidebar atau mobile nav THEN sistem SHALL menampilkan icon dari Lucide React (bukan emoji) untuk item navigasi: Dashboard, Timeline, Budget, Tabungan, Catatan

2.9 WHEN pengguna melihat status atau indikator di halaman Budget dan Savings THEN sistem SHALL menggunakan Lucide icon yang sesuai sebagai pengganti emoji status (kecuali bagian premium/upgrade yang menggunakan 💎 dan branding 💍 yang boleh tetap)

**5. Hover State & Cursor Pointer**

2.10 WHEN pengguna mengarahkan kursor ke elemen yang bisa diklik THEN sistem SHALL menampilkan `cursor: pointer` pada semua elemen interaktif

2.11 WHEN pengguna mengarahkan kursor ke elemen interaktif THEN sistem SHALL menampilkan perubahan visual yang jelas (perubahan background, warna teks, atau scale) sebagai hover state

**6. Layout Mobile**

2.12 WHEN pengguna mengakses halaman Budget di mobile THEN sistem SHALL menampilkan tabel budget dalam layout yang readable di layar kecil (misalnya layout card per item atau kolom yang disederhanakan)

2.13 WHEN pengguna mengakses aplikasi di mobile THEN sistem SHALL menampilkan spacing dan tap target yang memadai untuk interaksi sentuh (minimum 44px tap target sesuai panduan aksesibilitas)

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN pengguna premium membuka halaman Timeline, Budget, atau Savings THEN sistem SHALL CONTINUE TO menampilkan data yang sama seperti sebelumnya, hanya posisi chart yang berpindah ke halaman masing-masing

3.2 WHEN pengguna non-premium mencoba mengakses fitur chart THEN sistem SHALL CONTINUE TO menampilkan locked state / upgrade prompt seperti sebelumnya

3.3 WHEN pengguna mengisi atau mengedit nilai pada kolom Rencana di tabel budget THEN sistem SHALL CONTINUE TO berfungsi dengan cara yang sama (klik untuk edit, blur untuk simpan)

3.4 WHEN pengguna menambah atau menghapus kategori budget THEN sistem SHALL CONTINUE TO berfungsi dengan cara yang sama

3.5 WHEN pengguna menambah atau menghapus entri tabungan THEN sistem SHALL CONTINUE TO berfungsi dengan cara yang sama

3.6 WHEN pengguna menambah, menghapus, atau mengubah status task di Timeline THEN sistem SHALL CONTINUE TO berfungsi dengan cara yang sama

3.7 WHEN pengguna mengakses aplikasi di desktop THEN sistem SHALL CONTINUE TO menampilkan sidebar dengan navigasi yang berfungsi normal (tanpa menu Charts)

3.8 WHEN pengguna mengakses aplikasi di mobile THEN sistem SHALL CONTINUE TO menampilkan bottom navigation dengan item yang berfungsi normal (tanpa menu Charts)

3.9 WHEN icon 💎 digunakan pada badge/label premium dan icon 💍 digunakan pada branding Wedspace THEN sistem SHALL CONTINUE TO menggunakan emoji tersebut (tidak diganti Lucide)

3.10 WHEN pengguna logout THEN sistem SHALL CONTINUE TO berfungsi dengan cara yang sama
