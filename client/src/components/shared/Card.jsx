/**
 * Card Component
 * Reusable card wrapper dengan styling konsisten
 */
export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        hover ? 'card-hover' : ''
      } ${className}`}
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * SummaryCard Component
 * Card kecil untuk menampilkan ringkasan data
 */
export function SummaryCard({ label, value, bg, color, className = '' }) {
  return (
    <div
      className={`rounded-2xl p-4 transition-all card-hover ${className}`}
      style={{ background: bg, color, boxShadow: 'var(--shadow-xs)' }}
    >
      <p className="text-xs font-medium mb-1 opacity-70">{label}</p>
      <p className="text-base font-bold leading-tight">{value}</p>
    </div>
  )
}

/**
 * LockedCard Component
 * Card untuk fitur yang terkunci (premium only)
 */
export function LockedCard({ title, subtitle, onUpgrade }) {
  return (
    <div
      className="rounded-2xl p-5 text-center relative overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
        style={{ background: 'var(--color-accent-light)' }}
      >
        <span className="text-lg">🔒</span>
      </div>
      <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text)' }}>
        {title}
      </p>
      <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
        {subtitle}
      </p>
      <button
        onClick={onUpgrade}
        className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:-translate-y-1"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
          color: 'white',
          boxShadow: 'var(--shadow-gold)',
        }}
      >
        💎 Upgrade Premium
      </button>
    </div>
  )
}
