/**
 * ProgressBar Component
 * Reusable progress bar dengan status indicator
 */

import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

export function ProgressBar({
  percentage,
  label,
  showLabel = true,
  showStatus = true,
  min = 0,
  max = 100,
  warning = 70,
  danger = 90,
}) {
  const getColor = () => {
    if (percentage > danger) return 'var(--color-danger)'
    if (percentage > warning) return 'var(--color-warning)'
    return 'var(--color-success)'
  }

  const getStatus = () => {
    if (percentage > danger) {
      return {
        icon: <XCircle size={13} />,
        label: 'Over limit',
        color: 'var(--color-danger)',
      }
    }
    if (percentage > warning) {
      return {
        icon: <AlertTriangle size={13} />,
        label: 'Waspada',
        color: 'var(--color-warning)',
      }
    }
    return {
      icon: <CheckCircle2 size={13} />,
      label: 'Aman',
      color: 'var(--color-success)',
    }
  }

  const status = getStatus()
  const color = getColor()

  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            {label}
          </span>
          {showStatus && (
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 text-xs font-medium"
                style={{ color: status.color }}
              >
                {status.icon}
                {status.label}
              </span>
              <span
                className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                style={{
                  background:
                    percentage > danger
                      ? 'var(--color-danger-light)'
                      : percentage > warning
                      ? 'var(--color-warning-light)'
                      : 'var(--color-success-light)',
                  color,
                }}
              >
                {percentage}%
              </span>
            </div>
          )}
        </div>
      )}
      <div
        className="h-3 rounded-full overflow-hidden"
        style={{ background: 'var(--color-border)' }}
      >
        <div
          className="h-full rounded-full progress-bar"
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
          {min}
        </span>
        <span className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
          {max}
        </span>
      </div>
    </div>
  )
}
