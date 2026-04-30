import { useState, useEffect } from 'react'
import { api } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/storage'
import { adminNavItems } from '../../data/navigation'


export default function AdminPanel() {
  const { logout } = useAuth()
  const [view, setView] = useState('stats')
  const [stats, setStats] = useState(null)
  const [workspaces, setWorkspaces] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => { loadData() }, [view])

  const loadData = async () => {
    setLoading(true)
    try {
      if (view === 'stats') {
        const r = await api.adminStats()
        setStats(r)
      } else if (view === 'workspaces') {
        const r = await api.adminWorkspaces()
        setWorkspaces(Array.isArray(r?.workspaces) ? r.workspaces : [])
      } else if (view === 'users') {
        const r = await api.adminUsers()
        setUsers(Array.isArray(r?.users) ? r.users : [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSetStatus = async (id, status) => {
    setActionLoading(id)
    try { await api.adminSetStatus(id, status); await loadData() }
    finally { setActionLoading(null) }
  }

  const handleSetPlan = async (id, plan) => {
    setActionLoading(id)
    try {
      const expiresAt = plan === 'premium' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
      await api.adminSetPlan(id, plan, expiresAt)
      await loadData()
    } finally { setActionLoading(null) }
  }

  return (
    <div className="flex h-screen bg-bg">
      <div className="hidden md:block">
        <AdminSidebar view={view} setView={setView} logout={logout} />
      </div>

      <main className="flex-1 overflow-auto p-6 pb-28 md:pb-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-text-subtle">Memuat data...</p>
          </div>
        ) : (
          <>
            {view === 'stats'      && stats      && <StatsView stats={stats} />}
            {view === 'workspaces' && <WorkspacesView workspaces={workspaces} onSetStatus={handleSetStatus} onSetPlan={handleSetPlan} actionLoading={actionLoading} />}
            {view === 'users'      && <UsersView users={users} />}
          </>
        )}
      </main>

      <div className="md:hidden">
        <AdminBottomNav view={view} setView={setView} />
      </div>
    </div>
  )
}

function StatsView({ stats }) {
  const cards = [
    { label: 'Total Workspace', value: stats.totalWorkspaces, icon: '🏠', bg: 'bg-primary', color: 'text-white' },
    { label: 'Workspace Aktif', value: stats.activeWorkspaces, icon: '✅', bg: 'bg-success-light', color: 'text-success' },
    { label: 'Total User',      value: stats.totalUsers,       icon: '👥', bg: 'bg-primary-light', color: 'text-primary' },
    { label: 'Premium',         value: stats.premiumCount,     icon: '💎', bg: 'bg-accent-light', color: 'text-accent' },
    { label: 'Baru (7 hari)',   value: stats.newThisWeek,      icon: '🆕', bg: 'bg-purple-100', color: 'text-purple-700' },
  ]
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-text">Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-2xl p-5 ${c.bg} ${c.color}`}>
            <p className="text-2xl mb-2">{c.icon}</p>
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-xs font-medium mt-1 opacity-70">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function WorkspacesView({ workspaces, onSetStatus, onSetPlan, actionLoading }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-text">Workspaces ({workspaces.length})</h1>
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                {['Pasangan', 'Email', 'Hari H', 'Plan', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-subtle">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {workspaces.map((ws) => (
                <tr key={ws.id} className="transition-all hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text">
                      {ws.partner_a_name || '—'} & {ws.partner_b_name || '—'}
                    </p>
                    {ws.hashtag && <p className="text-xs text-accent">#{ws.hashtag}</p>}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{ws.email}</td>
                  <td className="px-4 py-3 text-text-muted">
                    {ws.wedding_date ? formatDate(ws.wedding_date) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      ws.plan === 'premium'
                        ? 'bg-accent-light text-accent'
                        : 'bg-bg text-text-muted'
                    }`}>
                      {ws.plan === 'premium' ? '💎 Premium' : 'Free'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      ws.status === 'active'
                        ? 'bg-success-light text-success'
                        : ws.status === 'suspended'
                        ? 'bg-danger-light text-danger'
                        : 'bg-bg text-text-muted'
                    }`}>
                      {ws.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {ws.status !== 'active' && (
                        <ActionBtn onClick={() => onSetStatus(ws.id, 'active')} loading={actionLoading === ws.id} bg="bg-success-light" color="text-success">Aktifkan</ActionBtn>
                      )}
                      {ws.status === 'active' && (
                        <ActionBtn onClick={() => onSetStatus(ws.id, 'suspended')} loading={actionLoading === ws.id} bg="bg-danger-light" color="text-danger">Suspend</ActionBtn>
                      )}
                      {ws.plan === 'free' ? (
                        <ActionBtn onClick={() => onSetPlan(ws.id, 'premium')} loading={actionLoading === ws.id} bg="bg-accent-light" color="text-accent">→ Premium</ActionBtn>
                      ) : (
                        <ActionBtn onClick={() => onSetPlan(ws.id, 'free')} loading={actionLoading === ws.id} bg="bg-bg" color="text-text-muted">→ Free</ActionBtn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {workspaces.length === 0 && <p className="text-center text-sm py-8 text-text-subtle">Belum ada workspace</p>}
        </div>
      </div>
    </div>
  )
}

function UsersView({ users = [] }) {
  const usersList = Array.isArray(users) ? users : []

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-text">Users ({usersList.length})</h1>
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg">
              {['Email', 'Plan', 'Status', 'Daftar'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-subtle">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {usersList.map((u) => (
              <tr key={u.id} className="transition-all hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium text-text">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    u.plan === 'premium'
                      ? 'bg-accent-light text-accent'
                      : 'bg-bg text-text-muted'
                  }`}>
                    {u.plan || 'Free'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    u.workspace_status === 'active'
                      ? 'bg-success-light text-success'
                      : u.workspace_status
                      ? 'bg-danger-light text-danger'
                      : 'bg-bg text-text-subtle'
                  }`}>
                    {u.workspace_status || 'no workspace'}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-muted">{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {usersList.length === 0 && <p className="text-center text-sm py-8 text-text-subtle">Belum ada user</p>}
      </div>
    </div>
  )
}

function AdminSidebar({ view, setView, logout }) {
  return (
    <aside className="w-56 bg-surface border-r border-border flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary">
            <span className="text-sm">💍</span>
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-primary">Wedspace</span>
            <p className="text-[10px] font-semibold text-danger">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const active = view === item.id
          return (
            <button key={item.id} onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                active
                  ? 'bg-primary text-white'
                  : 'text-text-muted'
              }`}>
              <Icon size={16} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button onClick={logout}
          className="w-full py-2 text-sm font-medium rounded-lg transition-all text-danger hover:bg-danger-light">
          Logout
        </button>
      </div>
    </aside>
  )
}

function AdminBottomNav({ view, setView }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border">
      <div className="flex items-end px-2">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const active = view === item.id

          // Center item (dengan center: true)
          if (item.center) {
            return (
              <div key={item.id} className="flex-1 flex justify-center mb-2">
                <button
                  onClick={() => setView(item.id)}
                  className={`nav-center-btn place-items-center ${
                    active ? 'nav-center-active' : 'nav-center-inactive'
                  }`}
                  aria-label={item.label}
                >
                  <Icon size={22} className="text-white" />
                </button>
              </div>
            )
          }

          // Side items
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`nav-item ${
                active ? 'text-primary' : 'text-text-subtle'
              }`}
            >
              {/* Active bar indicator */}
              {active && <div className="nav-item-active-bar" />}
              <div
                className={`nav-item-icon hover:bg-accent-light transition-all duration-300 ${
                  active ? 'bg-accent-light' : 'bg-transparent'
                }`}
              >
                <Icon size={19} />
              </div>
              <span
                className={`nav-item-label ${
                  active
                    ? 'text-primary font-semibold'
                    : 'text-text-subtle font-normal'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function ActionBtn({ onClick, loading, bg, color, children }) {
  return (
    <button onClick={onClick} disabled={loading}
      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all disabled:opacity-50 ${bg} ${color}`}>
      {loading ? '...' : children}
    </button>
  )
}
