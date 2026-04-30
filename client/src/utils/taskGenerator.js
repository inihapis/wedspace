// Task status constants
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
}

export const TASK_TEMPLATES = [
  // 6-12 bulan
  { id: 't1',  title: 'Tentukan tanggal & venue pernikahan',       phase: '6-12 bulan', assignee: 'berdua',   priority: 'high' },
  { id: 't2',  title: 'Buat daftar tamu kasar',                    phase: '6-12 bulan', assignee: 'berdua',   priority: 'high' },
  { id: 't3',  title: 'Tentukan konsep & tema pernikahan',         phase: '6-12 bulan', assignee: 'berdua',   priority: 'high' },
  { id: 't4',  title: 'Cari & booking fotografer/videografer',     phase: '6-12 bulan', assignee: 'berdua',   priority: 'high' },
  { id: 't5',  title: 'Cari & booking catering',                   phase: '6-12 bulan', assignee: 'berdua',   priority: 'medium' },
  { id: 't6',  title: 'Tentukan anggaran total pernikahan',        phase: '6-12 bulan', assignee: 'berdua',   priority: 'high' },
  { id: 't7',  title: 'Cari Wedding Organizer (jika diperlukan)',  phase: '6-12 bulan', assignee: 'berdua',   priority: 'medium' },

  // 3-6 bulan
  { id: 't8',  title: 'Booking dekorasi & florist',                phase: '3-6 bulan',  assignee: 'berdua',   priority: 'high' },
  { id: 't9',  title: 'Cari & fitting baju pengantin',             phase: '3-6 bulan',  assignee: 'berdua',   priority: 'high' },
  { id: 't10', title: 'Booking MC & hiburan',                      phase: '3-6 bulan',  assignee: 'berdua',   priority: 'medium' },
  { id: 't11', title: 'Finalisasi daftar tamu',                    phase: '3-6 bulan',  assignee: 'berdua',   priority: 'high' },
  { id: 't12', title: 'Desain & cetak undangan',                   phase: '3-6 bulan',  assignee: 'berdua',   priority: 'medium' },
  { id: 't13', title: 'Urus dokumen pernikahan (KUA/Catatan Sipil)', phase: '3-6 bulan', assignee: 'berdua',  priority: 'high' },
  { id: 't14', title: 'Booking make-up artist',                    phase: '3-6 bulan',  assignee: 'pasanganB', priority: 'high' },

  // 1-3 bulan
  { id: 't15', title: 'Kirim undangan',                            phase: '1-3 bulan',  assignee: 'berdua',   priority: 'high' },
  { id: 't16', title: 'Konfirmasi semua vendor',                   phase: '1-3 bulan',  assignee: 'berdua',   priority: 'high' },
  { id: 't17', title: 'Fitting baju pengantin final',              phase: '1-3 bulan',  assignee: 'berdua',   priority: 'medium' },
  { id: 't18', title: 'Siapkan souvenir',                          phase: '1-3 bulan',  assignee: 'berdua',   priority: 'medium' },
  { id: 't19', title: 'Buat rundown acara',                        phase: '1-3 bulan',  assignee: 'berdua',   priority: 'high' },
  { id: 't20', title: 'Koordinasi dengan keluarga',                phase: '1-3 bulan',  assignee: 'keluarga', priority: 'medium' },

  // H-30
  { id: 't21', title: 'Konfirmasi jumlah tamu final ke catering',  phase: 'H-30',       assignee: 'berdua',   priority: 'high' },
  { id: 't22', title: 'Briefing semua vendor',                     phase: 'H-30',       assignee: 'berdua',   priority: 'high' },
  { id: 't23', title: 'Siapkan amplop & perlengkapan hari H',      phase: 'H-30',       assignee: 'berdua',   priority: 'medium' },
  { id: 't24', title: 'Cek dokumen pernikahan sudah lengkap',      phase: 'H-30',       assignee: 'berdua',   priority: 'high' },

  // H-7
  { id: 't25', title: 'Gladi resik / rehearsal',                   phase: 'H-7',        assignee: 'berdua',   priority: 'high' },
  { id: 't26', title: 'Konfirmasi ulang semua vendor',             phase: 'H-7',        assignee: 'berdua',   priority: 'high' },
  { id: 't27', title: 'Siapkan perlengkapan pengantin',            phase: 'H-7',        assignee: 'berdua',   priority: 'medium' },
  { id: 't28', title: 'Istirahat yang cukup',                      phase: 'H-7',        assignee: 'berdua',   priority: 'medium' },

  // H-1
  { id: 't29', title: 'Cek venue & dekorasi',                      phase: 'H-1',        assignee: 'berdua',   priority: 'high' },
  { id: 't30', title: 'Siapkan semua barang bawaan',               phase: 'H-1',        assignee: 'berdua',   priority: 'high' },
  { id: 't31', title: 'Tidur lebih awal',                          phase: 'H-1',        assignee: 'berdua',   priority: 'medium' },
]

export function generateTasks(weddingDate) {
  const wedding = new Date(weddingDate)

  return TASK_TEMPLATES.map((task) => {
    let dueDate = new Date(wedding)

    if (task.phase === '6-12 bulan')  dueDate.setMonth(dueDate.getMonth() - 8)
    else if (task.phase === '3-6 bulan') dueDate.setMonth(dueDate.getMonth() - 4)
    else if (task.phase === '1-3 bulan') dueDate.setMonth(dueDate.getMonth() - 2)
    else if (task.phase === 'H-30')   dueDate.setDate(dueDate.getDate() - 30)
    else if (task.phase === 'H-7')    dueDate.setDate(dueDate.getDate() - 7)
    else if (task.phase === 'H-1')    dueDate.setDate(dueDate.getDate() - 1)

    return {
      ...task,
      status: TASK_STATUS.TODO,
      dueDate: dueDate.toISOString().split('T')[0],
    }
  })
}

export function getPhaseOrder() {
  return ['6-12 bulan', '3-6 bulan', '1-3 bulan', 'H-30', 'H-7', 'H-1']
}
