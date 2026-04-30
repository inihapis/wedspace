/**
 * Badge Components
 * Reusable badges untuk status, labels, dan indicators
 */

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-bg text-text-muted',
    primary: 'bg-primary text-white',
    accent: 'bg-accent text-white',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    danger: 'bg-danger-light text-danger',
    gold: 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-gold',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export function PlanBadge({ plan = 'free' }) {
  const isPremium = plan === 'premium'
  return (
    <Badge
      variant={isPremium ? 'gold' : 'default'}
      className={isPremium ? 'shadow-gold' : ''}
    >
      {isPremium ? '💎 Premium' : 'Free Plan'}
    </Badge>
  )
}

export function StatusBadge({ status, label }) {
  const variants = {
    done: 'success',
    in_progress: 'accent',
    todo: 'default',
  }

  return <Badge variant={variants[status] || 'default'}>{label}</Badge>
}
