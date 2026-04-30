import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { api } from '../../utils/api'

export default function Onboarding() {
  const { user, markWorkspaceCreated } = useAuth()
  const { loadAll } = useApp()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    partnerAName: '',
    partnerBName: '',
    relationshipName: '',
    hashtag: '', weddingDate: '',
    venueLocation: '',
    totalBudget: '', savingsTarget: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const daysLeft = form.weddingDate
    ? Math.ceil((new Date(form.weddingDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await api.setupWorkspace({
        partnerAName:     form.partnerAName.trim(),
        partnerBName:     form.partnerBName.trim(),
        relationshipName: form.relationshipName.trim(),
        hashtag:          form.hashtag.trim(),
        weddingDate:      form.weddingDate,
        venueLocation:    form.venueLocation.trim(),
        totalBudget:      Number(form.totalBudget) || 0,
        savingsTarget:    Number(form.savingsTarget) || 0,
      })
      markWorkspaceCreated()
      await loadAll()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const isStep1Valid = form.partnerAName && form.partnerBName
  const isStep2Valid = form.weddingDate
  const isStep3Valid = form.totalBudget

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-border text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-surface'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo/Logo-Color.png" alt="Wedspace" className="mx-auto mb-4 h-14 w-14 rounded-2xl object-cover shadow-lg" />
          <h2 className="font-bold text-2xl text-primary">Wedspace</h2>
          <p className="text-sm text-text-muted">
            Halo, {user?.email}! Yuk setup workspace kalian 👋
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              s <= step ? 'bg-primary' : 'bg-border'
            }`} />
          ))}
        </div>

        <div className="bg-surface rounded-2xl shadow-sm border border-border p-6">

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-primary">Langkah 1 dari 3</p>
              <h2 className="font-semibold text-xl mb-1 text-text">Siapa kalian? 👫</h2>
              <p className="text-sm mb-6 text-text-muted">Data ini dipakai untuk personalisasi task dan tampilan dashboard.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-text">Nama Pengantin 1</label>
                    <input type="text" value={form.partnerAName} onChange={set('partnerAName')} placeholder="Nama lengkap" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-text">Nama Pengantin 2</label>
                    <input type="text" value={form.partnerBName} onChange={set('partnerBName')} placeholder="Nama lengkap" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text">
                    Nama Hubungan <span className="font-normal text-text-subtle">(opsional)</span>
                  </label>
                  <input type="text" value={form.relationshipName} onChange={set('relationshipName')} placeholder="Contoh: BudiAni, Pasangan Lucu" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text">
                    Hashtag pasangan <span className="font-normal text-text-subtle">(opsional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-subtle">#</span>
                    <input type="text" value={form.hashtag} onChange={set('hashtag')} placeholder="BudiAni2025"
                      className={inputCls + ' pl-8'} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-primary">Langkah 2 dari 3</p>
              <h2 className="font-semibold text-xl mb-1 text-text">Kapan & di mana? 📅</h2>
              <p className="text-sm mb-6 text-text-muted">Dipakai untuk generate timeline otomatis.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text">Tanggal pernikahan</label>
                  <input type="date" value={form.weddingDate} onChange={set('weddingDate')}
                    min={new Date().toISOString().split('T')[0]} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text">
                    Lokasi venue <span className="font-normal text-text-subtle">(opsional)</span>
                  </label>
                  <input type="text" value={form.venueLocation} onChange={set('venueLocation')} placeholder="Nama venue atau alamat" className={inputCls} />
                </div>
              </div>
              {daysLeft !== null && daysLeft > 0 && (
                <div className="mt-4 p-4 rounded-xl flex items-center gap-3 bg-primary-light">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="text-sm font-semibold text-primary">Tinggal {daysLeft} hari lagi!</p>
                    <p className="text-xs mt-0.5 text-text-muted">
                      {new Date(form.weddingDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-primary">Langkah 3 dari 3</p>
              <h2 className="font-semibold text-xl mb-1 text-text">Soal keuangan 💰</h2>
              <p className="text-sm mb-6 text-text-muted">Bisa diubah kapan saja nanti.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text">Total budget pernikahan</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-subtle">Rp</span>
                    <input type="number" value={form.totalBudget} onChange={set('totalBudget')} placeholder="0" className={inputCls + ' pl-10'} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text">
                    Target tabungan <span className="font-normal text-text-subtle">(opsional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-subtle">Rp</span>
                    <input type="number" value={form.savingsTarget} onChange={set('savingsTarget')} placeholder="0" className={inputCls + ' pl-10'} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl border border-danger bg-danger-light">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-xl border border-border text-sm font-medium transition-all hover:bg-bg text-text">
                Kembali
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                className="flex-1 py-3 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-primary">
                Lanjut →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!isStep3Valid || loading}
                className="flex-1 py-3 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-primary">
                {loading ? 'Menyiapkan...' : 'Mulai Persiapan 🎉'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
