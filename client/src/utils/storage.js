/**
 * Utility helpers — formatting & date calculations
 */

/**
 * Format angka ke format Rupiah Indonesia
 * @param {number} amount
 * @returns {string} e.g. "Rp 10.000.000"
 */
export function formatRupiah(amount) {
  const num = Number(amount) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format angka ke format singkat (untuk chart labels)
 * @param {number} amount
 * @returns {string} e.g. "10 Jt", "500 Rb"
 */
export function formatRupiahShort(amount) {
  const num = Number(amount) || 0
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)} M`
  if (num >= 1_000_000)     return `${(num / 1_000_000).toFixed(1)} Jt`
  if (num >= 1_000)         return `${(num / 1_000).toFixed(0)} Rb`
  return `Rp ${num}`
}

/**
 * Hitung sisa hari menuju tanggal pernikahan
 * @param {string} weddingDate ISO date string
 * @returns {number}
 */
export function getDaysLeft(weddingDate) {
  if (!weddingDate) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const wedding = new Date(weddingDate)
  return Math.ceil((wedding - today) / (1000 * 60 * 60 * 24))
}

/**
 * Format tanggal ke locale Indonesia
 * @param {string} dateStr
 * @param {Intl.DateTimeFormatOptions} opts
 */
export function formatDate(dateStr, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', opts)
}
