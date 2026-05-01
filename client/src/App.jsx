import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { useApp } from './context/AppContext'
import { Sidebar, MobileHeader, MobileNav } from './components/layouts'
import {
  AuthPage,
  Onboarding,
  Dashboard,
  Timeline,
  Budget,
  Savings,
  Notes,
  Profile,
} from './components/pages'
import AdminPanel from './components/admin/AdminPanel'

function AppShell() {
  const { user, hasWorkspace, loading: authLoading } = useAuth()
  const { offline } = useApp()
  const [currentView, setCurrentView] = useState('dashboard')

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
              boxShadow: 'var(--shadow-gold)',
            }}
          >
            <span className="text-xl">💍</span>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Memuat...</p>
        </div>
      </div>
    )
  }

  if (!user) return <AuthPage />
  if (user.role === 'admin') return <AdminPanel />
  if (!hasWorkspace) return <Onboarding />

  const views = {
    dashboard: <Dashboard />,
    timeline:  <Timeline />,
    budget:    <Budget />,
    savings:   <Savings />,
    notes:     <Notes />,
    profile:   <Profile />,
  }

  return (
    <div className="flex h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Offline banner */}
      {offline && (
        <div
          className="fixed top-0 left-0 right-0 z-100 flex items-center justify-center gap-2 py-2 text-xs font-medium"
          style={{ background: '#B45309', color: 'white' }}
        >
          <span>📡</span>
          <span>Kamu sedang offline — menampilkan data terakhir yang tersimpan</span>
        </div>
      )}
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      {/* Mobile header */}
      <div className="md:hidden">
        <MobileHeader currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0 pt-16 md:pt-0">
        {views[currentView] || <Dashboard />}
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <MobileNav currentView={currentView} setCurrentView={setCurrentView} />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </AuthProvider>
  )
}
