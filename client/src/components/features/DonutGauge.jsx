/**
 * DonutGauge Component
 * Reusable donut chart untuk menampilkan persentase
 */

export function DonutGauge({
  percentage,
  color,
  size = 120,
  strokeWidth = 12,
  label,
}) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (percentage / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-white">{percentage}%</span>
        </div>
      </div>
      {label && (
        <p
          className="text-[11px] font-medium"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          {label}
        </p>
      )}
    </div>
  )
}
