import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { formatRupiah, formatRupiahShort } from '../../utils/storage'
import { getPartnerADisplay, getPartnerBDisplay } from '../../utils/workspace'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { CheckCircle2, AlertTriangle, Plus, Trash2 } from 'lucide-react'
import { Card } from '../../components/shared'

export default function Savings() {
  const { workspace, savingsData, budgetItems, addSavingsEntry,
    updateSavingsEntry, deleteSavingsEntry, updateWorkspace, loading, loadAll,
  } = useApp()

  const [showAddEntry, setShowAddEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({ amount: '', fromPartner: 'pasanganA', note: '', entryDate: '' })
  const [editingTarget, setEditingTarget] = useState(false)
  const [targetInput, setTargetInput] = useState('')
  const [editingEntryId, setEditingEntryId] = useState(null)
  const [editingEntryData, setEditingEntryData] = useState({})

  useEffect(() => { loadAll() }, [])
  useEffect(() => { if (workspace) setTargetInput(workspace.savings_target || 0) }, [workspace])

  if (loading || !workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: 'var(--color-text-subtle)' }}>Memuat data...</p>
      </div>
    )
  }

  const nameA = getPartnerADisplay(workspace)
  const nameB = getPartnerBDisplay(workspace)

  const target      = Number(workspace.savings_target) || 0
  const totalA      = savingsData.totals.pasanganA || 0
  const totalB      = savingsData.totals.pasanganB || 0
  const totalOther  = savingsData.totals.lainnya || 0
  const total       = totalA + totalB + totalOther
  const progressPct = target > 0 ? Math.min(Math.round((total / target) * 100), 100) : 0
  const remaining   = target - total
  const barColor    = progressPct >= 100 ? 'var(--color-success)' : progressPct >= 70 ? 'var(--color-accent)' : 'var(--color-primary)'

  const isPremium = workspace?.plan === 'premium'

  const totalActual = budgetItems.reduce((s, b) => s + (Number(b.actual) || 0), 0)
  const savingsVsSpending = [
    { name: 'Tabungan', value: total, fill: 'var(--color-success)' },
    { name: 'Pengeluaran', value: totalActual, fill: 'var(--color-danger)' },
  ]

  // Contribution bar data
  const contribData = [
    { name: nameA, value: totalA, fill: 'var(--color-accent)' },
    { name: nameB, value: totalB, fill: 'var(--color-primary)' },
    { name: 'Lainnya', value: totalOther, fill: 'var(--color-text-subtle)' },
  ].filter(d => d.value > 0)

  const handleAddEntry = async () => {
    const amount = Number(newEntry.amount)
    if (!amount || amount <= 0) return
    await addSavingsEntry({
      amount,
      fromPartner: newEntry.fromPartner,
      note: newEntry.note.trim(),
      entryDate: newEntry.entryDate || new Date().toISOString().split('T')[0],
    })
    setNewEntry({ amount: '', fromPartner: 'pasanganA', note: '', entryDate: '' })
    setShowAddEntry(false)
  }

  const saveTarget = async () => {
    await updateWorkspace({ savingsTarget: Number(targetInput) || 0 })
    setEditingTarget(false)
  }

  const fromLabel = (from) => {
    if (from === 'pasanganA') return nameA
    if (from === 'pasanganB') return nameB
    return 'Lainnya'
  }

  const inputCls = 'px-3.5 py-2.5 text-sm rounded-xl border border-border focus:outline-none transition-all text-text'

  return (
    <div className="p-4 sm:p-6 xl:p-8 max-w-none">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text">Tabungan Pernikahan</h1>
        <p className="text-sm mt-1 text-text-muted">Tracking tabungan menuju target dana nikah</p>
      </div>

      {/* XL Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* LEFT — Main content (2/3) */}
        <div className="xl:col-span-2 space-y-5">

          {/* Hero summary card */}
          <div className="rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-primary to-[#3D3D3D] shadow-md">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-5 relative z-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest mb-2 text-white/50">
                  Total Tabungan
                </p>
                <p className="text-4xl font-bold text-white leading-none">{formatRupiah(total)}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs mb-1 text-white/50">Target</p>
                {editingTarget ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveTarget()}
                      autoFocus
                      className="w-32 text-right text-sm px-2 py-1 rounded-lg focus:outline-none bg-white/20 text-white"
                    />
                    <button onClick={saveTarget} className="text-white/80 hover:text-white text-xs px-1">✓</button>
                  </div>
                ) : (
                  <button onClick={() => setEditingTarget(true)} className="text-left sm:text-right group">
                    <p className="text-xl font-semibold text-white group-hover:text-[#FAE6CC] transition-colors">{formatRupiah(target)}</p>
                    <p className="text-[10px] mt-0.5 text-white/35 group-hover:text-white/60 transition-all">
                      klik untuk edit
                    </p>
                  </button>
                )}
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full z-0 opacity-10 pointers-event-none border border-2 border-accent" />

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white/60">Progress</span>
                <span className="text-sm font-bold text-accent">{progressPct}%</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden bg-white/15">
                <div
                  className="h-full rounded-full progress-bar bg-gradient-to-r from-accent to-accent-dark"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {progressPct >= 100 ? (
              <p className="text-sm font-medium mt-3 text-accent">🎉 Target tercapai!</p>
            ) : (
              <p className="text-sm mt-3 text-white/50">
                Masih kurang{' '}
                <span className="font-semibold text-accent">
                  {formatRupiah(remaining)}
                </span>
              </p>
            )}
          </div>

          {/* Contribution cards */}
          <div className="grid grid-cols-3 gap-3">
            <ContribCard label={nameA} amount={totalA} bg="bg-accent-light" color="text-accent" />
            <ContribCard label={nameB} amount={totalB} bg="bg-primary-light" color="text-primary" />
            <ContribCard label="Lainnya" amount={totalOther} bg="bg-bg" color="text-text-muted" />
          </div>

          {/* Add entry button */}
          {!showAddEntry && (
            <button
              onClick={() => setShowAddEntry(true)}
              className="w-full py-3.5 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 text-sm transition-all bg-gradient-to-r from-accent to-accent-dark shadow-gold hover:shadow-[0_6px_24px_rgba(198,169,107,0.35)] hover:-translate-y-0.5"
            >
              <Plus size={16} />
              Tambah Tabungan
            </button>
          )}

          {/* Add entry form */}
          {showAddEntry && (
            <div className="rounded-2xl p-5 bg-surface border border-border shadow-sm">
              <h3 className="text-sm font-semibold mb-4 text-text">Tambah Tabungan Baru</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-text-muted">Jumlah</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-text-subtle">Rp</span>
                    <input
                      type="number"
                      value={newEntry.amount}
                      onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                      placeholder="0"
                      className={inputCls + ' w-full pl-9'}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-text-muted">Dari</label>
                    <select
                      value={newEntry.fromPartner}
                      onChange={(e) => setNewEntry({ ...newEntry, fromPartner: e.target.value })}
                      className={inputCls + ' w-full'}
                    >
                      <option value="pasanganA">{nameA}</option>
                      <option value="pasanganB">{nameB}</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-text-muted">Tanggal</label>
                    <input
                      type="date"
                      value={newEntry.entryDate}
                      onChange={(e) => setNewEntry({ ...newEntry, entryDate: e.target.value })}
                      className={inputCls + ' w-full'}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-text-muted">Catatan (opsional)</label>
                  <input
                    type="text"
                    value={newEntry.note}
                    onChange={(e) => setNewEntry({ ...newEntry, note: e.target.value })}
                    placeholder="Misal: Gaji bulan ini"
                    className={inputCls + ' w-full'}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddEntry}
                  className="flex-1 py-2.5 text-white text-sm font-semibold rounded-xl transition-all bg-primary hover:shadow-sm hover:-translate-y-0.5"
                >
                  Simpan
                </button>
                <button
                  onClick={() => { setShowAddEntry(false); setNewEntry({ amount: '', fromPartner: 'pasanganA', note: '', entryDate: '' }) }}
                  className="flex-1 py-2.5 border border-border text-sm font-medium rounded-xl transition-all text-text hover:bg-bg"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* History */}
          <div className="rounded-2xl overflow-hidden bg-surface border border-border shadow-xs">
            <div className="px-5 py-3.5 border-b border-border bg-bg">
              <h3 className="text-sm font-semibold text-text">Riwayat Tabungan</h3>
            </div>
            {savingsData.entries.length === 0 ? (
              <p className="text-center text-sm py-10 text-text-subtle">
                Belum ada riwayat tabungan
              </p>
            ) : (
              <div>
                {savingsData.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="px-5 py-3.5 transition-all group flex items-center gap-3 border-b border-accent-light last:border-0 hover:bg-bg"
                  >
                    {/* Avatar dot */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
                        entry.from_partner === 'pasanganA'
                          ? 'bg-accent'
                          : entry.from_partner === 'pasanganB'
                          ? 'bg-primary'
                          : 'bg-text-subtle'
                      }`}
                    >
                      {fromLabel(entry.from_partner).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingEntryId === entry.id ? (
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-text-subtle">Rp</span>
                            <input
                              type="number"
                              value={editingEntryData.amount || entry.amount}
                              onChange={(e) => setEditingEntryData({ ...editingEntryData, amount: e.target.value })}
                              className="w-full px-3 py-1.5 text-sm rounded-lg border border-accent pl-7 text-text"
                            />
                          </div>
                          <button
                            onClick={async () => {
                              await updateSavingsEntry(entry.id, { amount: Number(editingEntryData.amount) || entry.amount })
                              setEditingEntryId(null)
                              setEditingEntryData({})
                            }}
                            className="text-xs font-semibold px-2 py-1 rounded-lg transition-all bg-accent text-white"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => {
                              setEditingEntryId(null)
                              setEditingEntryData({})
                            }}
                            className="text-xs font-semibold px-2 py-1 rounded-lg transition-all bg-bg text-text-muted"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-0.5">
                            <button
                              onClick={() => {
                                setEditingEntryId(entry.id)
                                setEditingEntryData({ amount: entry.amount })
                              }}
                              className="text-sm font-semibold transition-all rounded-lg px-2 py-0.5 text-text hover:text-accent hover:bg-accent-light"
                            >
                              {formatRupiah(entry.amount)}
                            </button>
                            <span className="text-xs text-text-subtle">
                              dari {fromLabel(entry.from_partner)}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-xs text-text-muted">{entry.note}</p>
                          )}
                          <p className="text-xs mt-0.5 text-text-subtle">
                            {new Date(entry.entry_date || entry.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => deleteSavingsEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 transition-all text-text-subtle hover:text-danger"
                      aria-label="Hapus entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Charts (1/3) */}
        <div className="space-y-5">
          {/* Tabungan vs Pengeluaran */}
          {isPremium ? (
            <Card hover>
              <h2 className="text-sm font-semibold mb-1 text-text">Tabungan vs Pengeluaran</h2>
              <p className="text-xs mb-4 text-text-subtle">Perbandingan keuangan</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={savingsVsSpending} margin={{ left: 0, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-subtle)' }} tickFormatter={v => formatRupiahShort(v)} />
                  <Tooltip
                    formatter={v => formatRupiah(v)}
                    contentStyle={{
                      background: 'white',
                      border: '1px solid var(--color-border)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {savingsVsSpending.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
                total > totalActual ? 'bg-success-light' : 'bg-warning-light'
              }`}>
                {total > totalActual
                  ? <CheckCircle2 size={14} className="text-success flex-shrink-0" />
                  : <AlertTriangle size={14} className="text-warning flex-shrink-0" />}
                <p className={`text-xs font-medium ${
                  total > totalActual ? 'text-success' : 'text-warning'
                }`}>
                  {total > totalActual
                    ? `Tabungan lebih besar ${formatRupiah(total - totalActual)}`
                    : `Pengeluaran lebih besar ${formatRupiah(totalActual - total)}`}
                </p>
              </div>
            </Card>
          ) : (
            <LockedChartCard title="Tabungan vs Pengeluaran" subtitle="Lihat perbandingan tabungan dan pengeluaran" />
          )}

          {/* Kontribusi per pasangan */}
          {isPremium && contribData.length > 0 ? (
            <Card hover>
              <h2 className="text-sm font-semibold mb-1 text-text">Kontribusi</h2>
              <p className="text-xs mb-4 text-text-subtle">Per pasangan</p>
              <div className="space-y-3">
                {contribData.map((d) => {
                  const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
                  return (
                    <div key={d.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-text-muted">{d.name}</span>
                        <span className="text-xs font-semibold text-text">
                          {pct}% · {formatRupiahShort(d.value)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-border">
                        <div
                          className="h-full rounded-full progress-bar"
                          style={{ width: `${pct}%`, background: d.fill }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ContribCard({ label, amount, bg, color }) {
  return (
    <div className={`rounded-2xl p-4 transition-all card-hover shadow-xs ${bg} ${color}`}>
      <p className="text-xs font-medium mb-1 opacity-70 truncate">{label}</p>
      <p className="text-sm font-bold leading-tight">{formatRupiah(amount)}</p>
    </div>
  )
}

function LockedCard({ title, subtitle }) {
  return (
    <div className="rounded-2xl p-5 text-center bg-surface border border-border shadow-xs">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 bg-accent-light">
        <span className="text-lg">🔒</span>
      </div>
      <p className="text-sm font-semibold mb-0.5 text-text">{title}</p>
      <p className="text-xs mb-3 text-text-muted">{subtitle}</p>
      <button className="text-xs font-bold px-4 py-2 rounded-full transition-all text-white bg-gradient-to-r from-accent to-accent-dark shadow-gold hover:-translate-y-0.5">
        💎 Upgrade Premium
      </button>
    </div>
  )
}

function LockedChartCard({ title, subtitle, isBarChart }) {
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden bg-surface border border-border shadow-xs">
      <h2 className="text-sm font-semibold mb-1 text-text">{title}</h2>
      <p className="text-xs mb-4 text-text-subtle">{subtitle}</p>

      {/* Blurred dummy chart */}
      <div className="locked-blur" style={{ filter: 'blur(1.4px)' }}>
        <div className="h-32 rounded-xl overflow-hidden bg-bg">
          <ResponsiveContainer width="100%" height="100%">
            {isBarChart ? (
              <BarChart data={[
                { name: 'Item 1', value: 40 },
                { name: 'Item 2', value: 30 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Bar dataKey="value" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={[
                    { name: 'Item 1', value: 30 },
                    { name: 'Item 2', value: 25 },
                    { name: 'Item 3', value: 20 },
                    { name: 'Item 4', value: 15 },
                    { name: 'Item 5', value: 10 },
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={56}
                  paddingAngle={4}
                >
                  {[
                    'var(--color-accent)',
                    'var(--color-primary)',
                    'var(--color-success)',
                    'var(--color-warning)',
                    'var(--color-danger)',
                  ].map((color, index) => (
                    <Cell key={index} fill={color} />
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
            )}
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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 bg-accent-light">
            <span className="text-lg">🔒</span>
          </div>
          <p className="text-xs font-semibold mb-1 text-text">Fitur Premium</p>
          <button className="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all hover:-translate-y-1 text-white bg-gradient-to-r from-accent to-accent-dark shadow-gold">
            💎 Upgrade
          </button>
        </div>
      </div>
    </div>
  )
}
