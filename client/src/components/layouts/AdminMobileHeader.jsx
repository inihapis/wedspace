/**
 * Admin Mobile Header Layout Component
 * Mobile header untuk admin panel dengan logout button
 */

import { LogOut } from 'lucide-react'

export default function AdminMobileHeader({ logout }) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-border shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
            <span className="text-sm">💍</span>
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted">Wedspace</p>
            <p className="text-sm font-semibold text-danger">Admin Panel</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="p-2 rounded-lg transition-all hover:bg-danger-light text-danger"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
