import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { getAssigneeLabel } from '../../utils/workspace'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Plus, Trash2, ChevronDown } from 'lucide-react'

const PHASES = ['6-12 bulan', '3-6 bulan', '1-3 bulan', 'H-30', 'H-7', 'H-1']
const ASSIGNEES = ['berdua', 'pasanganA', 'pasanganB', 'keluarga']
const PREMIUM_DUMMY_DATA = [
  { phase: '6-12 bulan', done: 5, inProgress: 2, todo: 3 },
  { phase: '3-6 bulan', done: 3, inProgress: 1, todo: 6 },
  { phase: '1-3 bulan', done: 1, inProgress: 3, todo: 5 },
  { phase: 'H-30', done: 0, inProgress: 2, todo: 4 },
  { phase: 'H-7', done: 0, inProgress: 1, todo: 3 },
]

export default function Timeline() {
  const { workspace, tasks, toggleTaskStatus, updateTaskAssignee, addTask, deleteTask, loading, loadAll } = useApp()
  const [filterAssignee, setFilterAssignee] = useState('semua')
  const [expandedPhases, setExpandedPhases] = useState({})
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [showAddTask, setShowAddTask] = useState(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  useEffect(() => { loadAll() }, [])

  const label = (a) => getAssigneeLabel(a, workspace)
  const isPremium = workspace?.plan === 'premium'

  const handleAddTask = async (phase) => {
    if (!newTaskTitle.trim()) return
    await addTask({ title: newTaskTitle.trim(), phase, assignee: 'berdua' })
    setNewTaskTitle('')
    setShowAddTask(null)
  }

  const filteredTasks = filterAssignee === 'semua' ? tasks : tasks.filter((t) => t.assignee === filterAssignee)

  const getPhaseStats = (phase) => {
    const pt = filteredTasks.filter((t) => t.phase === phase)
    return {
      total:      pt.length,
      done:       pt.filter((t) => t.status === 'done').length,
      inProgress: pt.filter((t) => t.status === 'in_progress').length,
    }
  }

  const phaseProgress = PHASES.map((phase) => {
    const phaseTasks = tasks.filter((t) => t.phase === phase)
    const done = phaseTasks.filter((t) => t.status === 'done').length
    return {
      phase,
      total: phaseTasks.length,
      done,
      inProgress: phaseTasks.filter((t) => t.status === 'in_progress').length,
      todo: phaseTasks.filter((t) => t.status === 'todo').length,
      pct: phaseTasks.length > 0 ? Math.round((done / phaseTasks.length) * 100) : 0,
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: 'var(--color-text-subtle)' }}>Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 xl:p-8 max-w-none">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>Timeline & Task</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Semua yang perlu disiapkan menuju hari H</p>
      </div>

      {/* XL Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* LEFT — Phases (2/3) */}
        <div className="xl:col-span-2 space-y-4">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {['semua', ...ASSIGNEES].map((a) => (
              <button
                key={a}
                onClick={() => setFilterAssignee(a)}
                className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all border min-h-[40px]"
                style={filterAssignee === a
                  ? {
                      background: 'var(--color-primary)',
                      color: 'white',
                      borderColor: 'var(--color-primary)',
                      boxShadow: 'var(--shadow-sm)',
                    }
                  : {
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-muted)',
                      borderColor: 'var(--color-border)',
                    }}
                onMouseEnter={e => {
                  if (filterAssignee !== a) {
                    e.currentTarget.style.borderColor = 'var(--color-accent)'
                    e.currentTarget.style.color = 'var(--color-accent)'
                  }
                }}
                onMouseLeave={e => {
                  if (filterAssignee !== a) {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.color = 'var(--color-text-muted)'
                  }
                }}
              >
                {a === 'semua' ? '👥 Semua' : label(a)}
              </button>
            ))}
          </div>

          {/* Phases */}
          <div className="space-y-3">
            {PHASES.map((phase) => {
              const { total, done, inProgress } = getPhaseStats(phase)
              const phaseTasks = filteredTasks.filter((t) => t.phase === phase)
              const isExpanded = expandedPhases[phase] !== false
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              const dotColor = pct === 100
                ? 'var(--color-success)'
                : inProgress > 0
                ? 'var(--color-accent)'
                : 'var(--color-border)'

              return (
                <div
                  key={phase}
                  className="rounded-2xl overflow-visible transition-all"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <button
                    onClick={() => setExpandedPhases((p) => ({ ...p, [phase]: !isExpanded }))}
                    className="w-full flex items-center justify-between px-5 py-4 transition-all"
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0 transition-all"
                        style={{ background: dotColor }}
                      />
                      <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{phase}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'var(--color-bg)', color: 'var(--color-text-subtle)' }}
                        >
                          {done}/{total}
                        </span>
                        {inProgress > 0 && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}
                          >
                            {inProgress} sedang
                          </span>
                        )}
                        {pct === 100 && total > 0 && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}
                          >
                            ✓ Selesai
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                        <div
                          className="h-full rounded-full progress-bar"
                          style={{
                            width: `${pct}%`,
                            background: pct === 100 ? 'var(--color-success)' : 'var(--color-accent)',
                          }}
                        />
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        style={{ color: 'var(--color-text-subtle)' }}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                      {phaseTasks.length === 0 ? (
                        <p className="text-center text-sm py-5" style={{ color: 'var(--color-text-subtle)' }}>
                          Tidak ada task
                        </p>
                      ) : (
                        phaseTasks.map((task) => (
                          <TaskRow
                            key={task.id}
                            task={task}
                            onCycleStatus={toggleTaskStatus}
                            onUpdateAssignee={updateTaskAssignee}
                            onDelete={deleteTask}
                            editingTaskId={editingTaskId}
                            setEditingTaskId={setEditingTaskId}
                            assigneeLabel={label}
                          />
                        ))
                      )}

                      {showAddTask === phase ? (
                        <div className="p-3 border-t flex gap-2" style={{ borderColor: 'var(--color-border)' }}>
                          <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask(phase)}
                            placeholder="Nama task baru..."
                            autoFocus
                            className="flex-1 px-3 py-2 text-sm rounded-xl border focus:outline-none"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                          />
                          <button
                            onClick={() => handleAddTask(phase)}
                            className="px-3 py-2 text-white text-sm rounded-xl transition-all"
                            style={{ background: 'var(--color-primary)' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = '' }}
                          >
                            Tambah
                          </button>
                          <button
                            onClick={() => { setShowAddTask(null); setNewTaskTitle('') }}
                            className="px-3 py-2 text-sm rounded-xl"
                            style={{ color: 'var(--color-text-muted)', background: 'var(--color-bg)' }}
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddTask(phase)}
                          className="w-full p-3.5 text-sm flex items-center gap-2 border-t transition-all"
                          style={{ color: 'var(--color-text-subtle)', borderColor: 'var(--color-border)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.background = 'var(--color-accent-light)' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-subtle)'; e.currentTarget.style.background = '' }}
                        >
                          <Plus size={14} />
                          Tambah task
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT — Chart (1/3) */}
        <div>
          {isPremium ? (
            <div
              className="rounded-2xl p-5 card-hover sticky top-6"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>Progress per Fase</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--color-text-subtle)' }}>Distribusi status task</p>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={phaseProgress} layout="vertical" margin={{ left: 0, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: 'var(--color-text-subtle)' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="phase"
                    tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                    width={55}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid var(--color-border)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="done" name="Selesai" fill="var(--color-success)" radius={[0, 3, 3, 0]} stackId="a" />
                  <Bar dataKey="inProgress" name="Sedang" fill="var(--color-accent)" radius={[0, 0, 0, 0]} stackId="a" />
                  <Bar dataKey="todo" name="Belum" fill="var(--color-border)" radius={[0, 3, 3, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>

              {/* Phase summary */}
              <div className="mt-4 space-y-2 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                {phaseProgress.map((p) => (
                  <div key={p.phase} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.phase}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${p.pct}%`,
                            background: p.pct === 100 ? 'var(--color-success)' : 'var(--color-accent)',
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold w-8 text-right" style={{ color: 'var(--color-text)' }}>
                        {p.pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl p-5 text-center sticky top-6"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>Progress Chart</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Intip bentuk progress chart pada Free Plan dengan data dummy
              </p>
              <div className="h-64 mb-4 rounded-2xl overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PREMIUM_DUMMY_DATA} layout="vertical" margin={{ left: 0, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="phase" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} width={55} axisLine={false} tickLine={false} />
                    <Bar dataKey="done" fill="var(--color-success)" radius={[0, 3, 3, 0]} stackId="a" />
                    <Bar dataKey="inProgress" fill="var(--color-accent)" radius={[0, 0, 0, 0]} stackId="a" />
                    <Bar dataKey="todo" fill="var(--color-border)" radius={[0, 3, 3, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <button
                className="text-xs font-bold px-4 py-2 rounded-full transition-all"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                  color: 'white',
                  boxShadow: 'var(--shadow-gold)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = '' }}
              >
                💎 Upgrade Premium
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TaskRow({ task, onCycleStatus, onUpdateAssignee, onDelete, editingTaskId, setEditingTaskId, assigneeLabel }) {
  const isDone       = task.status === 'done'
  const isInProgress = task.status === 'in_progress'

  return (
    <div
      className="flex items-center gap-3 px-5 py-3.5 transition-all group border-b last:border-0"
      style={{ borderColor: 'var(--color-border-soft)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
      onMouseLeave={e => e.currentTarget.style.background = ''}
    >
      <button
        onClick={() => onCycleStatus(task.id)}
        title="Klik untuk ubah status"
        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
        style={{
          background: isDone
            ? 'var(--color-success)'
            : isInProgress
            ? 'var(--color-accent-light)'
            : 'transparent',
          borderColor: isDone
            ? 'var(--color-success)'
            : isInProgress
            ? 'var(--color-accent)'
            : 'var(--color-border)',
        }}
        onMouseEnter={e => {
          if (!isDone) e.currentTarget.style.borderColor = 'var(--color-accent)'
        }}
        onMouseLeave={e => {
          if (!isDone && !isInProgress) e.currentTarget.style.borderColor = 'var(--color-border)'
          if (isInProgress) e.currentTarget.style.borderColor = 'var(--color-accent)'
        }}
        aria-label="Ubah status task"
      >
        {isDone && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {isInProgress && (
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
        )}
      </button>

      <p
        className="flex-1 text-sm min-w-0"
        style={{
          color: isDone ? 'var(--color-text-subtle)' : 'var(--color-text)',
          textDecoration: isDone ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </p>

      {/* Assignee dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={() => setEditingTaskId(editingTaskId === task.id ? null : task.id)}
          className="text-xs px-2.5 py-1 rounded-lg transition-all whitespace-nowrap"
          style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-light)'; e.currentTarget.style.color = 'var(--color-accent)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bg)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
        >
          {assigneeLabel(task.assignee)}
        </button>
        {editingTaskId === task.id && (
          <div
            className="absolute right-0 top-8 bg-white border rounded-xl z-50 overflow-hidden min-w-36"
            style={{ borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-md)' }}
          >
            {ASSIGNEES.map((a) => (
              <button
                key={a}
                onClick={() => { onUpdateAssignee(task.id, a); setEditingTaskId(null) }}
                className="w-full text-left px-3 py-2.5 text-sm transition-all"
                style={{
                  color: task.assignee === a ? 'var(--color-accent)' : 'var(--color-text)',
                  fontWeight: task.assignee === a ? 600 : 400,
                  background: task.assignee === a ? 'var(--color-accent-light)' : '',
                }}
                onMouseEnter={e => { if (task.assignee !== a) e.currentTarget.style.background = 'var(--color-bg)' }}
                onMouseLeave={e => { if (task.assignee !== a) e.currentTarget.style.background = '' }}
              >
                {assigneeLabel(a)}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-all shrink-0"
        style={{ color: 'var(--color-text-subtle)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-subtle)'}
        aria-label="Hapus task"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
