# Wedspace — Catatan Pengembangan

---

## Status Implementasi (v0.0.1)

### Sudah Selesai

- ✅ Auth (register, login, JWT session dengan auto-restore)
- ✅ Onboarding 3-step (nama pasangan + nickname, tanggal, keuangan)
- ✅ Dashboard dengan countdown, progress task & budget
- ✅ Timeline & Task (31 task auto-generate, 3 status, filter assignee, tambah custom)
- ✅ Budget Tracker (planned vs actual, progress bar, kategori custom)
- ✅ Savings Tracker (split kontribusi, backdate, riwayat)
- ✅ Notes (kategori, edit, filter)
- ✅ Charts (premium-gated: progress per fase, distribusi budget, tabungan vs pengeluaran)
- ✅ Admin Panel (stats, workspace management, plan upgrade)
- ✅ Profile page
- ✅ Design tokens (CSS variables, tidak hardcode warna)
- ✅ Format Rupiah konsisten (`Rp 10.000.000`)
- ✅ Welcome message dengan nickname (`Halo, Budi & Ani!`)
- ✅ Responsive (desktop sidebar + mobile bottom nav)
- ✅ PWA (manifest + service worker)

---

## Roadmap

### Phase 2

- [ ] Premium: Timeline Chart View (Gantt-like)
- [ ] Guest management (daftar tamu, RSVP)
- [ ] Vendor tracking (kontak, status booking, harga)
- [ ] Notifikasi / reminder task mendekati deadline
- [ ] Export data (PDF/Excel)
- [ ] UI polish & animasi

### Phase 3

- [ ] Multi-user collaboration (pasangan bisa login dengan akun berbeda ke workspace yang sama)
- [ ] Analytics lanjutan (trend pengeluaran, prediksi)
- [ ] Vendor marketplace
- [ ] Undangan digital
- [ ] Mobile app (React Native)

---

## Known Issues

| # | Issue | Keterangan |
|---|-------|------------|
| 1 | sql.js write performance | Menyimpan DB ke file setiap write — tidak ideal untuk traffic tinggi. Pertimbangkan migrasi ke PostgreSQL untuk production. |
| 2 | PWA icons | Saat ini menggunakan SVG placeholder. Untuk production, generate PNG 192×192 dan 512×512. |
| 3 | JWT di localStorage | Untuk keamanan lebih tinggi, pertimbangkan httpOnly cookies. |
| 4 | CORS | Saat ini hanya allow `http://localhost:5173`. Update untuk production domain. |

---

## Cara Mengganti Warna Tema

Edit `client/src/index.css`:

```css
:root {
  --color-primary: #1a56db;  /* Ganti ke warna yang diinginkan */
  /* ... */
}
```

Semua komponen akan otomatis menggunakan warna baru karena menggunakan CSS variables.

---

## Cara Menambah Task Default

Edit `server/utils/taskGenerator.js` atau `client/src/utils/taskGenerator.js`. Task default di-generate saat onboarding berdasarkan tanggal pernikahan.

Format ID task default: `t1`..`t31`
Format ID task custom: `custom-{workspaceId}-{timestamp}`
