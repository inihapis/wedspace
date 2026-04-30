/**
 * Button Components
 * Reusable button variants dengan styling konsisten
 */

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const baseClasses = 'font-medium rounded-xl transition-all'

  const variants = {
    primary: 'bg-primary text-white hover:-translate-y-1 shadow-sm hover:shadow-md',
    secondary: 'border text-text-muted bg-surface hover:bg-bg',
    gold: 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-gold hover:-translate-y-1',
    ghost: 'text-text-muted hover:text-accent hover:bg-accent-light',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function IconButton({ children, className = '', ...props }) {
  return (
    <button
      className={`p-2 rounded-xl transition-all hover:bg-bg ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
