// Task templates — no priority field (removed per PRD beta)
const TASK_TEMPLATES = [
  // 6-12 bulan
  { id: 't1',  title: 'Tentukan tanggal & venue pernikahan',         phase: '6-12 bulan', assignee: 'berdua' },
  { id: 't2',  title: 'Buat daftar tamu kasar',                      phase: '6-12 bulan', assignee: 'berdua' },
  { id: 't3',  title: 'Tentukan konsep & tema pernikahan',           phase: '6-12 bulan', assignee: 'berdua' },
  { id: 't4',  title: 'Cari & booking fotografer/videografer',       phase: '6-12 bulan', assignee: 'berdua' },
  { id: 't5',  title: 'Cari & booking catering',                     phase: '6-12 bulan', assignee: 'berdua' },
  { id: 't6',  title: 'Tentukan anggaran total pernikahan',          phase: '6-12 bulan', assignee: 'berdua' },
  { id: 't7',  title: 'Cari Wedding Organizer (jika diperlukan)',    phase: '6-12 bulan', assignee: 'berdua' },
  // 3-6 bulan
  { id: 't8',  title: 'Booking dekorasi & florist',                  phase: '3-6 bulan',  assignee: 'berdua' },
  { id: 't9',  title: 'Cari & fitting baju pengantin',               phase: '3-6 bulan',  assignee: 'berdua' },
  { id: 't10', title: 'Booking MC & hiburan',                        phase: '3-6 bulan',  assignee: 'berdua' },
  { id: 't11', title: 'Finalisasi daftar tamu',                      phase: '3-6 bulan',  assignee: 'berdua' },
  { id: 't12', title: 'Desain & cetak undangan',                     phase: '3-6 bulan',  assignee: 'berdua' },
  { id: 't13', title: 'Urus dokumen pernikahan (KUA/Catatan Sipil)', phase: '3-6 bulan',  assignee: 'berdua' },
  { id: 't14', title: 'Booking make-up artist',                      phase: '3-6 bulan',  assignee: 'pasanganB' },
  // 1-3 bulan
  { id: 't15', title: 'Kirim undangan',                              phase: '1-3 bulan',  assignee: 'berdua' },
  { id: 't16', title: 'Konfirmasi semua vendor',                     phase: '1-3 bulan',  assignee: 'berdua' },
  { id: 't17', title: 'Fitting baju pengantin final',                phase: '1-3 bulan',  assignee: 'berdua' },
  { id: 't18', title: 'Siapkan souvenir',                            phase: '1-3 bulan',  assignee: 'berdua' },
  { id: 't19', title: 'Buat rundown acara',                          phase: '1-3 bulan',  assignee: 'berdua' },
  { id: 't20', title: 'Koordinasi dengan keluarga',                  phase: '1-3 bulan',  assignee: 'keluarga' },
  // H-30
  { id: 't21', title: 'Konfirmasi jumlah tamu final ke catering',   phase: 'H-30',       assignee: 'berdua' },
  { id: 't22', title: 'Briefing semua vendor',                       phase: 'H-30',       assignee: 'berdua' },
  { id: 't23', title: 'Siapkan amplop & perlengkapan hari H',       phase: 'H-30',       assignee: 'berdua' },
  { id: 't24', title: 'Cek dokumen pernikahan sudah lengkap',       phase: 'H-30',       assignee: 'berdua' },
  // H-7
  { id: 't25', title: 'Gladi resik / rehearsal',                    phase: 'H-7',        assignee: 'berdua' },
  { id: 't26', title: 'Konfirmasi ulang semua vendor',              phase: 'H-7',        assignee: 'berdua' },
  { id: 't27', title: 'Siapkan perlengkapan pengantin',             phase: 'H-7',        assignee: 'berdua' },
  { id: 't28', title: 'Istirahat yang cukup',                       phase: 'H-7',        assignee: 'berdua' },
  // H-1
  { id: 't29', title: 'Cek venue & dekorasi',                       phase: 'H-1',        assignee: 'berdua' },
  { id: 't30', title: 'Siapkan semua barang bawaan',                phase: 'H-1',        assignee: 'berdua' },
  { id: 't31', title: 'Tidur lebih awal',                           phase: 'H-1',        assignee: 'berdua' },
]

const DEFAULT_BUDGET_ITEMS = [
  'Venue', 'Catering', 'Fotografer & Videografer', 'Dekorasi & Florist',
  'Baju Pengantin', 'Make-up Artist', 'Undangan', 'Souvenir', 'MC & Hiburan', 'Lain-lain',
]

function generateTasks(weddingDate) {
  const wedding = new Date(weddingDate)
  return TASK_TEMPLATES.map((task) => {
    const due = new Date(wedding)
    if      (task.phase === '6-12 bulan') due.setMonth(due.getMonth() - 8)
    else if (task.phase === '3-6 bulan')  due.setMonth(due.getMonth() - 4)
    else if (task.phase === '1-3 bulan')  due.setMonth(due.getMonth() - 2)
    else if (task.phase === 'H-30')       due.setDate(due.getDate() - 30)
    else if (task.phase === 'H-7')        due.setDate(due.getDate() - 7)
    else if (task.phase === 'H-1')        due.setDate(due.getDate() - 1)
    return { ...task, dueDate: due.toISOString().split('T')[0] }
  })
}

module.exports = { generateTasks, DEFAULT_BUDGET_ITEMS }
