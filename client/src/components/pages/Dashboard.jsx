import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { formatRupiah, getDaysLeft } from '../../utils/storage'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Card, LockedCard } from '../../components/shared'
import { DonutGauge, ProgressBar } from '../../components/features'

const STATUS_CONFIG = {
  todo:        { label: 'Belum',   colorVar: 'var(--color-text-subtle)' },
  in_progress: { label: 'Sedang',  colorVar: 'var(--color-accent)' },
  done:        { label: 'Selesai', colorVar: 'var(--color-success)' },
}

const DUMMY_BUDGET_PREVIEW = [
  { name: 'Dekorasi', value: 30 },
  { name: 'Catering', value: 25 },
  { name: 'Gaun & Jas', value: 20 },
  { name: 'Dokumentasi', value: 15 },
  { name: 'Lainnya', value: 10 },
]

const PREVIEW_PIE_COLORS = [
  'var(--color-accent)',
  'var(--color-primary)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-danger)',
]

export default function Dashboard() {
  const { workspace, tasks, toggleTaskStatus, budgetItems, loading, loadAll } = useApp()
  const [selectedGreeting, setSelectedGreeting] = useState('')
  const [showGreetingMenu, setShowGreetingMenu] = useState(false)

  useEffect(() => { loadAll() }, [])

  const partnerDisplay = workspace?.partner_a_name && workspace?.partner_b_name
    ? `${workspace.partner_a_name} & ${workspace.partner_b_name}`
    : workspace?.partner_a_name || workspace?.partner_b_name || 'Pasangan'
  const relationshipName = workspace?.relationship_name?.trim()
  const greetingOptions = [
    { key: 'names', label: partnerDisplay },
    ...(relationshipName ? [{ key: 'relationship', label: relationshipName }] : []),
  ]

  useEffect(() => {
    if (!workspace) return
    setSelectedGreeting(relationshipName || partnerDisplay)
  }, [workspace?.id, relationshipName, partnerDisplay])

  if (loading || !workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-text-subtle">Memuat data...</p>
      </div>
    )
  }

  const daysLeft = getDaysLeft(workspace.wedding_date)
  const weddingDateFormatted = new Date(workspace.wedding_date).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const overdueTasks  = tasks.filter((t) => t.status !== 'done' && new Date(t.due_date) < today)
  const todayTasks    = tasks.filter((t) => t.status !== 'done' && new Date(t.due_date).toDateString() === today.toDateString())
  const upcomingTasks = tasks.filter((t) => {
    if (t.status === 'done') return false
    const due = new Date(t.due_date)
    const limit = new Date(today); limit.setDate(limit.getDate() + 7)
    return due > today && due <= limit
  })

  const doneCount   = tasks.filter((t) => t.status === 'done').length
  const inProgCount = tasks.filter((t) => t.status === 'in_progress').length
  const todoCount   = tasks.filter((t) => t.status === 'todo').length
  const totalCount  = tasks.length
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  const totalActual   = budgetItems.reduce((s, b) => s + (Number(b.actual) || 0), 0)
  const totalPlanned  = budgetItems.reduce((s, b) => s + (Number(b.planned) || 0), 0)
  const budgetPct     = workspace.total_budget > 0
    ? Math.min(Math.round((totalActual / workspace.total_budget) * 100), 100) : 0
  const budgetColor   = budgetPct > 90 ? 'var(--color-danger)' : budgetPct > 70 ? 'var(--color-warning)' : 'var(--color-success)'

  const isPremium = workspace?.plan === 'premium'

  // Pie data for task status
  const taskPieData = [
    { name: 'Selesai',  value: doneCount,   fill: 'var(--color-success)' },
    { name: 'Sedang',   value: inProgCount, fill: 'var(--color-accent)' },
    { name: 'Belum',    value: todoCount,   fill: 'var(--color-border)' },
  ].filter(d => d.value > 0)

  // Budget distribution for pie
  const budgetPieData = budgetItems
    .filter(b => Number(b.actual) > 0)
    .slice(0, 5)
    .map(b => ({ name: b.category, value: Number(b.actual) }))

  const PIE_COLORS = [
    'var(--color-accent)', 'var(--color-primary)', 'var(--color-success)',
    'var(--color-warning)', 'var(--color-danger)',
  ]

  return (
    <div className="p-4 sm:p-6 xl:p-8 max-w-none">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-semibold text-text">
              Halo, 
            </h1>
            {greetingOptions.length > 1 ? (
              <button
                onClick={() => setShowGreetingMenu((prev) => !prev)}
                className="text-xl sm:text-2xl font-semibold transition-all relative group text-accent group-hover:bg-primary/20"
              >
                {selectedGreeting || partnerDisplay}
                <span
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full transition-all bg-accent"
                  style={{
                    opacity: showGreetingMenu ? 1 : 0,
                  }}
                />
                {showGreetingMenu && (
                  <div
                    className="absolute left-0 mt-2 w-48 rounded-2xl border bg-white shadow-lg overflow-hidden z-50"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    {greetingOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setSelectedGreeting(option.label)
                          setShowGreetingMenu(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm transition-all hover:bg-accent-light"
                        style={{
                          color:
                            selectedGreeting === option.label
                              ? 'var(--color-accent)'
                              : 'var(--color-text)',
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </button>
            ) : (
              <span className="text-xl sm:text-2xl font-semibold text-accent">
                {selectedGreeting || partnerDisplay}
              </span>
            )}
            <span className="text-xl sm:text-2xl font-semibold text-text">👋</span>
          </div>
          <p className="text-sm mt-0.5 text-text-muted">{todayFormatted}</p>
        </div>
        {isPremium && (
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
            style={{
              background:
                'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
              boxShadow: 'var(--shadow-gold)',
            }}
          >
            💎 Premium
          </span>
        )}
      </div>

      {/* ── XL Grid Layout ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* LEFT COLUMN — Charts (2/3 width on XL) */}
        <div className="xl:col-span-2 space-y-5">

          {/* Hero countdown + gauges */}
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary) 0%, #3D3D3D 100%)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {/* Decorative ring */}
            <div
              className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
              style={{ border: '2px solid var(--color-accent)' }}
            />
            <div
              className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10"
              style={{ border: '2px solid var(--color-accent)' }}
            />

            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Countdown */}
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-widest mb-2"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Menuju Hari H
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl sm:text-6xl font-bold text-white leading-none">
                    {daysLeft}
                  </span>
                  <span
                    className="text-lg font-medium mb-1"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    hari
                  </span>
                </div>
                <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {weddingDateFormatted}
                </p>
                {workspace.venue_location && (
                  <p
                    className="text-xs mt-1.5 flex items-center gap-1"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    📍 {workspace.venue_location}
                  </p>
                )}
              </div>

              {/* Gauges */}
              <div className="flex items-center gap-6">
                <DonutGauge
                  percentage={progressPct}
                  color="var(--color-accent)"
                  size={88}
                  strokeWidth={9}
                  label="Progress"
                />
                <DonutGauge
                  percentage={budgetPct}
                  color={budgetColor}
                  size={88}
                  strokeWidth={9}
                  label="Budget"
                />
              </div>
            </div>

            {/* Quick stats row */}
            <div
              className="grid grid-cols-3 gap-3 mt-5 pt-5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <QuickStat
                label="Task Selesai"
                value={`${doneCount}/${totalCount}`}
                light
              />
              <QuickStat
                label="Budget Terpakai"
                value={formatRupiah(totalActual)}
                light
              />
              <QuickStat
                label="Overdue"
                value={overdueTasks.length}
                light
                warn={overdueTasks.length > 0}
              />
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Task status pie */}
            <Card hover>
              <h3 className="text-sm font-semibold mb-1 text-text">Status Task</h3>
              <p className="text-xs mb-4 text-text-subtle">{totalCount} task total</p>
              {totalCount === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-text-subtle">Belum ada task</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie
                        data={taskPieData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={38}
                        outerRadius={58}
                        paddingAngle={3}
                      >
                        {taskPieData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'white',
                          border: '1px solid var(--color-border)',
                          borderRadius: '10px',
                          fontSize: '12px',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    {taskPieData.map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: d.fill }}
                        />
                        <span
                          className="text-[11px] text-text-muted"
                        >
                          {d.name} ({d.value})
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>

            {/* Budget distribution pie — premium or locked preview */}
            {isPremium ? (
              <Card hover>
                <h3 className="text-sm font-semibold mb-1 text-text">
                  Distribusi Budget
                </h3>
                <p className="text-xs mb-4 text-text-subtle">
                  {formatRupiah(totalActual)} terpakai
                </p>
                {budgetPieData.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-sm text-text-subtle">Belum ada pengeluaran</p>
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie
                          data={budgetPieData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={38}
                          outerRadius={58}
                          paddingAngle={3}
                        >
                          {budgetPieData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v) => formatRupiah(v)}
                          contentStyle={{
                            background: 'white',
                            border: '1px solid var(--color-border)',
                            borderRadius: '10px',
                            fontSize: '12px',
                            boxShadow: 'var(--shadow-sm)',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1 mt-2">
                      {budgetPieData.map((d, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{
                                background: PIE_COLORS[i % PIE_COLORS.length],
                              }}
                            />
                            <span
                              className="text-[11px] truncate max-w-[100px] text-text-muted"
                            >
                              {d.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-text">
                            {Math.round((d.value / totalActual) * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            ) : (
              <LockedChartCard
                title="Distribusi Budget"
                subtitle="Lihat breakdown pengeluaran per kategori"
              />
            )}
          </div>

          {/* Budget progress bar card */}
          <Card hover>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-text">Budget Overview</h3>
                <p className="text-xs mt-0.5 text-text-subtle">
                  {formatRupiah(totalActual)} dari {formatRupiah(workspace.total_budget)}
                </p>
              </div>
              <span
                className="text-sm font-bold px-3 py-1 rounded-full"
                style={{
                  background:
                    budgetPct > 90
                      ? 'var(--color-danger-light)'
                      : budgetPct > 70
                      ? 'var(--color-warning-light)'
                      : 'var(--color-success-light)',
                  color: budgetColor,
                }}
              >
                {budgetPct}%
              </span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: 'var(--color-border)' }}
            >
              <div
                className="h-full rounded-full progress-bar"
                style={{ width: `${budgetPct}%`, background: budgetColor }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <MiniStat label="Total Budget" value={formatRupiah(workspace.total_budget)} />
              <MiniStat label="Direncanakan" value={formatRupiah(totalPlanned)} />
              <MiniStat
                label="Sisa"
                value={formatRupiah(workspace.total_budget - totalActual)}
                danger={workspace.total_budget - totalActual < 0}
              />
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN — Tasks (1/3 width on XL) */}
        <div className="space-y-4">
          {overdueTasks.length > 0 && (
            <TaskSection
              title="⚠️ Overdue"
              tasks={overdueTasks}
              onToggle={toggleTaskStatus}
              accent="danger"
            />
          )}
          <TaskSection
            title="☀️ Hari ini"
            tasks={todayTasks}
            onToggle={toggleTaskStatus}
            accent="primary"
            emptyText="Tidak ada task hari ini"
          />
          <TaskSection
            title="📅 7 hari ke depan"
            tasks={upcomingTasks}
            onToggle={toggleTaskStatus}
            accent="accent"
            emptyText="Tidak ada task dalam 7 hari"
          />
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function QuickStat({ label, value, light, warn }) {
  return (
    <div>
      <p
        className="text-[11px] font-medium mb-0.5"
        style={{
          color: light ? 'rgba(255,255,255,0.45)' : 'var(--color-text-muted)',
        }}
      >
        {label}
      </p>
      <p
        className="text-sm font-bold"
        style={{
          color: warn ? '#FCA5A5' : light ? 'white' : 'var(--color-text)',
        }}
      >
        {value}
      </p>
    </div>
  )
}

function MiniStat({ label, value, danger }) {
  return (
    <div className="rounded-xl p-3" style={{ background: 'var(--color-bg)' }}>
      <p className="text-[11px] mb-0.5 text-text-subtle">{label}</p>
      <p
        className="text-xs font-semibold"
        style={{
          color: danger ? 'var(--color-danger)' : 'var(--color-text)',
        }}
      >
        {value}
      </p>
    </div>
  )
}

function LockedChartCard({ title, subtitle }) {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <h3 className="text-sm font-semibold mb-1 text-text">{title}</h3>
      <p className="text-xs mb-4 text-text-subtle">{subtitle}</p>

      {/* Blurred dummy chart */}
      <div className="locked-blur" style={{ filter: 'blur(1.4px)' }}>
        <div
          className="h-32 rounded-xl overflow-hidden"
          style={{ background: 'var(--color-bg)' }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DUMMY_BUDGET_PREVIEW}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={56}
                paddingAngle={4}
              >
                {DUMMY_BUDGET_PREVIEW.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={PREVIEW_PIE_COLORS[index % PREVIEW_PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  background: 'white',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lock overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: 'rgba(247,243,238,0.7)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <div className="text-center px-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
            style={{ background: 'var(--color-accent-light)' }}
          >
            <span className="text-lg">🔒</span>
          </div>
          <p className="text-xs font-semibold mb-1 text-text">Fitur Premium</p>
          <button
            className="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all hover:-translate-y-1 text-white"
            style={{
              background:
                'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
              boxShadow: 'var(--shadow-gold)',
            }}
          >
            💎 Upgrade
          </button>
        </div>
      </div>
    </div>
  )
}

function TaskSection({ title, tasks, onToggle, accent, emptyText }) {
  const colorMap = {
    danger:  'var(--color-danger)',
    primary: 'var(--color-accent)',
    accent:  'var(--color-accent)',
  }
  return (
    <Card>
      <div className="px-4 py-3 border-b -m-5 mb-0 pb-3 border-accent-light">
        <h2
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: colorMap[accent] }}
        >
          {title}
        </h2>
      </div>
      {tasks.length === 0 ? (
        <div className="p-0 pt-3 text-center">
          <p className="text-xs text-text-subtle">{emptyText}</p>
        </div>
      ) : (
        <div className="divide-y -m-5 mt-0 divide-accent-light">
          {tasks.map((task) => (
            <DashboardTaskCard key={task.id} task={task} onToggle={onToggle} />
          ))}
        </div>
      )}
    </Card>
  )
}

function DashboardTaskCard({ task, onToggle }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isOverdue = new Date(task.due_date) < today && task.status !== 'done'
  const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo

  return (
    <div
      className="px-4 py-3 flex items-start gap-3 transition-all group"
      style={{ background: 'transparent' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <button
        onClick={() => onToggle(task.id)}
        title={`Status: ${cfg.label} — klik untuk ubah`}
        className="mt-0.5 w-5 h-5 rounded-full border-2 border-accent-light flex items-center justify-center shrink-0 transition-all"
        style={{
          background:
            task.status === 'done'
              ? 'var(--color-success)'
              : task.status === 'in_progress'
              ? 'var(--color-accent-light)'
              : 'transparent',
          borderColor:
            task.status === 'done'
              ? 'var(--color-success)'
              : task.status === 'in_progress'
              ? 'var(--color-accent)'
              : isOverdue
              ? 'var(--color-danger)'
              : 'var(--color-border)',
        }}
        aria-label="Ubah status task"
      >
        {task.status === 'done' && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {task.status === 'in_progress' && (
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--color-accent)' }}
          />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium leading-snug"
          style={{
            color:
              task.status === 'done'
                ? 'var(--color-text-subtle)'
                : 'var(--color-text)',
            textDecoration: task.status === 'done' ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[11px] text-text-subtle">{task.phase}</span>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <span
            className="text-[11px] font-medium"
            style={{ color: cfg.colorVar }}
          >
            {cfg.label}
          </span>
        </div>
      </div>
    </div>
  )
}
