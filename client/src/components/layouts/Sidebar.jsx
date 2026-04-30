/**
 * Sidebar Layout Component
 * Desktop navigation sidebar dengan workspace info dan plan badge
 */

import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { getPartnerADisplay, getPartnerBDisplay } from '../../utils/workspace'
import { mainNavItems, settingsNavItems } from '../../data/navigation'
import { LogOut } from 'lucide-react'

export default function Sidebar({ currentView, setCurrentView }) {
  const { logout } = useAuth()
  const { workspace } = useApp()

  const nameA = getPartnerADisplay(workspace)
  const nameB = getPartnerBDisplay(workspace)
  const names = workspace ? `${nameA} & ${nameB}` : '—'
  const hashtag = workspace?.hashtag ? `#${workspace.hashtag}` : null
  const plan = workspace?.plan || 'free'
  const isPremium = plan === 'premium'

  return (
    <aside className="w-60 flex flex-col h-screen sticky top-0 shrink-0 bg-primary shadow-lg">
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <img
            src="/logo/Logo-Gold.png"
            alt="Wedspace"
            className="w-9 h-9 rounded-xl object-cover shadow-lg"
          />
          <div>
            <span className="font-bold text-base tracking-tight text-white">Wedspace</span>
            <p className="text-[10px] mt-0 text-white/45">Wedding Planner</p>
          </div>
        </div>
      </div>

      {/* Workspace info */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="rounded-xl p-3 bg-white/6">
          <p className="text-xs font-semibold truncate text-white">{names}</p>
          {hashtag && (
            <p className="text-xs mt-0.5 font-medium text-accent">{hashtag}</p>
          )}
          <div className="mt-2">
            <span
              className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={
                isPremium
                  ? {
                      background:
                        'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                      color: 'white',
                      boxShadow: 'var(--shadow-gold)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.7)',
                    }
              }
            >
              {isPremium ? '💎 Premium' : 'Free Plan'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isActive = currentView === item.id
          const IconComponent = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-left group transition-all"
              style={
                isActive
                  ? {
                      background: 'rgba(255,255,255,0.14)',
                      color: 'white',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                    }
                  : {
                      color: 'rgba(255,255,255,0.55)',
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = ''
                  e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                }
              }}
            >
              {/* Active indicator bar */}
              <div
                className="w-0.5 h-4 rounded-full shrink-0 transition-all"
                style={{
                  background: isActive ? 'var(--color-accent)' : 'transparent',
                }}
              />
              <IconComponent size={17} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: 'var(--color-accent)' }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Profile / Settings shortcut */}
      <div className="px-3 pb-2">
        {settingsNavItems.map((item) => {
          const isActive = currentView === item.id
          const IconComponent = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-all text-white/45 hover:bg-white/8 hover:text-white/90"
            >
              <div
                className="w-0.5 h-4 rounded-full shrink-0"
                style={{ background: isActive ? 'var(--color-accent)' : 'transparent' }}
              />
              <IconComponent size={17} />
              <span className="flex-1">{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 pb-5 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-[10px] text-center mb-2 text-white/30">
          Semangat menuju hari H! 💪
        </p>
        <button
          onClick={logout}
          className="w-full py-2 text-xs rounded-xl flex items-center justify-center gap-2 transition-all text-white/40 hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </aside>
  )
}
