/**
 * Input Components
 * Reusable input fields dengan styling konsisten
 */

export function Input({
  label,
  hint,
  error,
  icon: Icon,
  prefix,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-subtle)' }}
          />
        )}
        {prefix && (
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            {prefix}
          </span>
        )}
        <input
          disabled={disabled}
          className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(198,169,107,0.15)] ${
            Icon || prefix ? 'pl-9' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
          style={{
            borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
            background: disabled ? 'var(--color-bg)' : 'var(--color-surface)',
            color: 'var(--color-text)',
          }}
          {...props}
        />
      </div>
      {hint && (
        <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-subtle)' }}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-[11px] mt-1" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export function TextArea({
  label,
  hint,
  error,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </label>
      )}
      <textarea
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(198,169,107,0.15)] ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
        style={{
          borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
          background: disabled ? 'var(--color-bg)' : 'var(--color-surface)',
          color: 'var(--color-text)',
        }}
        {...props}
      />
      {hint && (
        <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-subtle)' }}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-[11px] mt-1" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
