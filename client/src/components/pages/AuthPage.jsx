import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AuthPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'register' && form.password !== form.confirmPassword) {
      return setError('Password tidak cocok')
    }
    setLoading(true)
    try {
      if (mode === 'login') await login(form.email, form.password)
      else await register(form.email, form.password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-border text-text text-sm transition-all focus:outline-none focus:border-accent'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(198,169,107,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(43,43,43,0.04) 0%, transparent 50%)',
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo/Logo-Color.png" alt="Wedspace" className="mx-auto mb-4 h-14 w-14 rounded-2xl object-cover shadow-lg" />
          <h1 className="font-bold text-2xl tracking-tight mb-1 text-text">Wedspace</h1>
          <p className="text-sm text-text-muted">Persiapan nikah jadi lebih tenang</p>
        </div>

        <div className="rounded-2xl p-6 bg-surface border border-border shadow-md">
          {/* Tab */}
          <div className="flex rounded-xl p-1 mb-6 bg-bg">
            {['login', 'register'].map((m) => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  mode === m
                    ? 'bg-surface text-text shadow-xs'
                    : 'text-text-muted'
                }`}>
                {m === 'login' ? 'Masuk' : 'Daftar'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-text-muted">Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="nama@email.com" required
                className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-text-muted">Password</label>
              <input type="password" value={form.password} onChange={set('password')}
                placeholder={mode === 'register' ? 'Minimal 6 karakter' : '••••••••'} required
                className={inputCls} />
            </div>
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-text-muted">Konfirmasi Password</label>
                <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')}
                  placeholder="Ulangi password" required
                  className={inputCls} />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl border border-danger bg-danger-light">
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-primary shadow-sm hover:shadow-md hover:-translate-y-0.5"
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}>
              {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Buat Akun'}
            </button>
          </form>
        </div>

        {mode === 'register' && (
          <p className="text-center text-xs mt-4 text-text-subtle">
            1 akun = 1 workspace pasangan · Data tersimpan aman
          </p>
        )}

        <div className="text-center mt-6">
          <div className="divider-gold mx-auto w-24 mb-3" />
          <p className="text-xs text-text-subtle">Wedspace — Wedding Planner</p>
        </div>
      </div>
    </div>
  )
}
