/**
 * Mobile Header Layout Component
 * Mobile header dengan logo, workspace name, dan menu dropdown
 */

import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { settingsNavItems } from '../../data/navigation'
import { Menu, X, LogOut } from 'lucide-react'

export default function MobileHeader({ currentView, setCurrentView }) {
  const { logout } = useAuth()
  const { workspace } = useApp()
  const [showMenu, setShowMenu] = useState(false)

  const relationshipName = workspace?.relationship_name?.trim()
  const partnerDisplay =
    workspace?.partner_a_name && workspace?.partner_b_name
      ? `${workspace.partner_a_name} & ${workspace.partner_b_name}`
      : workspace?.partner_a_name || workspace?.partner_b_name || 'Pasangan'

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-border shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-2">
          <img
            src="/logo/Logo-Gold.png"
            alt="Wedspace"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div>
            <p className="text-xs font-medium text-text-muted">Wedspace</p>
            <p className="text-sm font-semibold text-text">
              {relationshipName || partnerDisplay}
            </p>
          </div>
        </div>

        {/* Menu button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg transition-all"
            style={{
              background: showMenu ? 'var(--color-primary-light)' : 'transparent',
              color: showMenu ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
          >
            {showMenu ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border bg-white shadow-lg overflow-hidden z-50 border-border">
              {settingsNavItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 transition-all hover:bg-primary-light text-text"
                  >
                    <IconComponent size={16} />
                    {item.label}
                  </button>
                )
              })}
              <div className="border-t border-border" />
              <button
                onClick={() => {
                  logout()
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 transition-all hover:bg-danger-light text-danger"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
