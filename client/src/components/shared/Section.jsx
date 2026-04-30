/**
 * Section Components
 * Reusable section wrappers untuk organizing content
 */

export function Section({ icon, title, children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${className}`}
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {(icon || title) && (
        <div className="flex items-center gap-2 mb-4">
          {icon && (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: 'var(--color-accent-light)',
                color: 'var(--color-accent)',
              }}
            >
              {icon}
            </div>
          )}
          {title && (
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {title}
            </h2>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export function FieldGroup({ label, hint, children }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </label>
      )}
      {children}
      {hint && (
        <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-subtle)' }}>
          {hint}
        </p>
      )}
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
