import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { formatRupiah, formatRupiahShort } from '../../utils/storage'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { XCircle, AlertTriangle, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { Card } from '../../components/shared'

const PIE_COLORS = [
  'var(--color-accent)', 'var(--color-primary)', 'var(--color-success)',
  'var(--color-warning)', 'var(--color-danger)', '#6366f1', '#ec4899', '#14b8a6',
]

export default function Budget() {
  const {
    workspace, budgetItems, updateBudgetItem, addBudgetItem,
    deleteBudgetItem, updateWorkspace, loading, loadAll,
  } = useApp()

  const [editingId, setEditingId] = useState(null)
  const [editingActualId, setEditingActualId] = useState(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [editingBudget, setEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')

  useEffect(() => { loadAll() }, [])
  useEffect(() => { if (workspace) setBudgetInput(workspace.total_budget || 0) }, [workspace])

  if (loading || !workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: 'var(--color-text-subtle)' }}>Memuat data...</p>
      </div>
    )
  }

  const totalBudget  = Number(workspace.total_budget) || 0
  const totalPlanned = budgetItems.reduce((s, i) => s + (Number(i.planned) || 0), 0)
  const totalActual  = budgetItems.reduce((s, i) => s + (Number(i.actual)  || 0), 0)
  const remaining    = totalBudget - totalActual
  const usedPct      = totalBudget > 0 ? Math.min(Math.round((totalActual / totalBudget) * 100), 100) : 0

  const barColor    = usedPct > 90 ? 'var(--color-danger)' : usedPct > 70 ? 'var(--color-warning)' : 'var(--color-success)'
  const statusLabel = usedPct > 90
    ? <span className="inline-flex items-center gap-1"><XCircle size={13} /> Over budget</span>
    : usedPct > 70
    ? <span className="inline-flex items-center gap-1"><AlertTriangle size={13} /> Waspada</span>
    : <span className="inline-flex items-center gap-1"><CheckCircle2 size={13} /> Aman</span>
  const statusColor = usedPct > 90 ? 'var(--color-danger)' : usedPct > 70 ? 'var(--color-warning)' : 'var(--color-success)'

  const isPremium = workspace?.plan === 'premium'

  const budgetDistribution = budgetItems
    .filter((b) => Number(b.actual) > 0)
    .map((b) => ({ name: b.category, value: Number(b.actual) }))

  const barData = budgetItems
    .filter(b => Number(b.planned) > 0 || Number(b.actual) > 0)
    .map(b => ({
      name: b.category.length > 10 ? b.category.slice(0, 10) + '…' : b.category,
      Rencana: Number(b.planned) || 0,
      Aktual: Number(b.actual) || 0,
    }))

  const saveBudget = async () => {
    await updateWorkspace({ totalBudget: Number(budgetInput) || 0 })
    setEditingBudget(false)
  }

  const inputCls = 'px-3 py-2 text-sm rounded-xl border border-border focus:outline-none transition-all text-text'

  return (
    <div className="p-4 sm:p-6 xl:p-8 max-w-none">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text">Budget Tracker</h1>
        <p className="text-sm mt-1 text-text-muted">Pantau pengeluaran pernikahan kamu</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-5">
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl p-4 relative overflow-hidden bg-gradient-to-br from-primary to-[#3D3D3D] shadow-sm">
              <p className="text-white/50 text-xs font-medium mb-1">Total Budget</p>
              {editingBudget ? (
                <div className="flex items-center gap-1 mt-1">
                  <input type="number" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveBudget()} autoFocus
                    className="w-full bg-white/20 text-white text-sm px-2 py-1 rounded-lg focus:outline-none" />
                  <button onClick={saveBudget} className="text-white/80 hover:text-white text-xs px-1">✓</button>
                </div>
              ) : (
                <button onClick={() => setEditingBudget(true)} className="text-left w-full group">
                  <p className="text-base font-bold leading-tight text-white group-hover:text-[#FAE6CC] transition-colors">{formatRupiah(totalBudget)}</p>
                  <p className="text-white/30 text-[10px] mt-0.5 group-hover:text-white/50 transition-all">klik untuk edit</p>
                </button>
              )}
            </div>
            <SummaryCard label="Direncanakan" value={formatRupiah(totalPlanned)} bg="bg-accent-light" color="text-accent" />
            <SummaryCard label="Terpakai" value={formatRupiah(totalActual)}
              bg={usedPct > 90 ? 'bg-danger-light' : usedPct > 70 ? 'bg-warning-light' : 'bg-success-light'}
              color={usedPct > 90 ? 'text-danger' : usedPct > 70 ? 'text-warning' : 'text-success'} />
            <SummaryCard label="Sisa" value={formatRupiah(remaining)}
              bg={remaining < 0 ? 'bg-danger-light' : 'bg-success-light'}
              color={remaining < 0 ? 'text-danger' : 'text-success'} />
          </div>

          {/* Progress bar */}
          <div className="rounded-2xl p-5 bg-surface border border-border shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text">Budget terpakai</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${
                  usedPct > 90 ? 'text-danger' : usedPct > 70 ? 'text-warning' : 'text-success'
                }`}>{statusLabel}</span>
                <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${
                  usedPct > 90 ? 'bg-danger-light text-danger' : usedPct > 70 ? 'bg-warning-light text-warning' : 'bg-success-light text-success'
                }`}>
                  {usedPct}%
                </span>
              </div>
            </div>
            <div className="h-3 rounded-full overflow-hidden bg-border">
              <div className="h-full rounded-full progress-bar" style={{ width: `${usedPct}%`, background: barColor }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-text-subtle">Rp 0</span>
              <span className="text-xs text-text-subtle">{formatRupiah(totalBudget)}</span>
            </div>
            {remaining < 0 && (
              <div className="mt-3 p-3 rounded-xl flex items-center gap-2 bg-danger-light">
                <AlertTriangle size={14} className="text-danger flex-shrink-0" />
                <p className="text-sm font-medium text-danger">Melebihi budget {formatRupiah(Math.abs(remaining))}</p>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="rounded-2xl overflow-hidden bg-surface border border-border shadow-xs">
            <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-3 border-b border-border bg-bg">
              {[['Kategori','col-span-4'],['Rencana','col-span-3 text-right'],['Aktual','col-span-3 text-right'],['Selisih','col-span-2 text-right']].map(([h,cls]) => (
                <div key={h} className={`text-xs font-semibold uppercase tracking-wide text-text-subtle ${cls}`}>{h}</div>
              ))}
            </div>

            {budgetItems.map((item) => {
              const diff = (Number(item.planned) || 0) - (Number(item.actual) || 0)
              return (
                <div key={item.id}>
                  <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-3.5 border-b border-accent-light items-center group transition-all hover:bg-bg"
                  >
                    <div className="col-span-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0 bg-accent" />
                      <span className="text-sm text-text">{item.category}</span>
                      <button onClick={() => deleteBudgetItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all ml-auto text-text-subtle hover:text-danger"
                        aria-label="Hapus"><Trash2 size={13} /></button>
                    </div>
                    <div className="col-span-3">
                      {editingId === item.id ? (
                        <input type="number" defaultValue={item.planned}
                          onBlur={(e) => { updateBudgetItem(item.id, { planned: e.target.value }); setEditingId(null) }}
                          autoFocus className={inputCls + ' w-full text-right border-accent'}
                          style={{ color: 'var(--color-text)' }} />
                      ) : (
                        <button onClick={() => setEditingId(item.id)} className="w-full text-right text-sm transition-all rounded-lg px-2 py-1 text-text hover:text-accent hover:bg-accent-light"
                        >
                          {formatRupiah(item.planned)}
                        </button>
                      )}
                    </div>
                    <div className="col-span-3">
                      {editingActualId === item.id ? (
                        <input type="number" defaultValue={item.actual || ''}
                          onBlur={(e) => { updateBudgetItem(item.id, { actual: e.target.value }); setEditingActualId(null) }}
                          autoFocus className={inputCls + ' w-full text-right border-accent'}
                          style={{ color: 'var(--color-text)' }} />
                      ) : (
                        <button onClick={() => setEditingActualId(item.id)} className="w-full text-right text-sm transition-all rounded-lg px-2 py-1 text-text hover:text-accent hover:bg-accent-light"
                        >
                          {formatRupiah(item.actual)}
                        </button>
                      )}
                    </div>
                    <div className="col-span-2 text-right">
                      <span className={`text-sm font-semibold ${diff >= 0 ? 'text-success' : 'text-danger'}`}>
                        {diff >= 0 ? '+' : ''}{formatRupiah(diff)}
                      </span>
                    </div>
                  </div>

                  <div className="sm:hidden px-4 py-3.5 border-b border-border-soft group transition-all hover:bg-bg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-sm font-medium text-text">{item.category}</span>
                      </div>
                      <button onClick={() => deleteBudgetItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all text-text-subtle hover:text-danger"
                        aria-label="Hapus"><Trash2 size={13} /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="mb-0.5 text-text-subtle">Rencana</p>
                        <p className="font-medium text-text">{formatRupiah(item.planned)}</p>
                      </div>
                      <div>
                        <p className="mb-0.5 text-text-subtle">Aktual</p>
                        <p className="font-medium text-text">{formatRupiah(item.actual)}</p>
                      </div>
                      <div>
                        <p className="mb-0.5 text-text-subtle">Selisih</p>
                        <p className={`font-medium ${diff >= 0 ? 'text-success' : 'text-danger'}`}>
                          {diff >= 0 ? '+' : ''}{formatRupiah(diff)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {showAddCategory ? (
              <div className="p-3 flex gap-2 border-t border-border">
                <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addBudgetItem(newCategory).then(() => { setNewCategory(''); setShowAddCategory(false) })}
                  placeholder="Nama kategori baru..." autoFocus
                  className={inputCls + ' flex-1 border-border text-text'} />
                <button onClick={() => addBudgetItem(newCategory).then(() => { setNewCategory(''); setShowAddCategory(false) })}
                  className="px-3 py-2 text-white text-sm rounded-xl bg-primary">Tambah</button>
                <button onClick={() => { setShowAddCategory(false); setNewCategory('') }}
                  className="px-3 py-2 text-sm rounded-xl text-text-muted bg-bg">Batal</button>
              </div>
            ) : (
              <button onClick={() => setShowAddCategory(true)}
                className="w-full p-3.5 text-sm flex items-center gap-2 transition-all border-t border-border text-text-subtle hover:text-accent hover:bg-accent-light"
              >
                <Plus size={15} />
                Tambah kategori
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — Charts */}
        <div className="space-y-5">
          {isPremium ? (
            <Card hover>
              <h2 className="text-sm font-semibold mb-1 text-text">Distribusi Budget</h2>
              <p className="text-xs mb-4 text-text-subtle">Berdasarkan pengeluaran aktual</p>
              {budgetDistribution.length === 0 ? (
                <p className="text-center text-sm py-8 text-text-subtle">Belum ada pengeluaran</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={budgetDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%"
                        innerRadius={50} outerRadius={75} paddingAngle={3}>
                        {budgetDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatRupiah(value)}
                        contentStyle={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '12px', boxShadow: 'var(--shadow-sm)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {budgetDistribution.map((d, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-xs truncate max-w-[110px] text-text-muted">{d.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-text">{formatRupiahShort(d.value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          ) : (
            <LockedChartCard title="Distribusi Budget" subtitle="Lihat breakdown pengeluaran per kategori" />
          )}

          {isPremium ? (
            <Card hover>
              <h2 className="text-sm font-semibold mb-1 text-text">Rencana vs Aktual</h2>
              <p className="text-xs mb-4 text-text-subtle">Per kategori</p>
              {barData.length === 0 ? (
                <p className="text-center text-sm py-8 text-text-subtle">Belum ada data</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--color-text-subtle)' }} tickFormatter={v => formatRupiahShort(v)} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} width={60} />
                    <Tooltip formatter={v => formatRupiah(v)}
                      contentStyle={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '12px', boxShadow: 'var(--shadow-sm)' }} />
                    <Bar dataKey="Rencana" fill="var(--color-accent-light)" stroke="var(--color-accent)" strokeWidth={1} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="Aktual" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          ) : (
            <LockedChartCard title="Rencana vs Aktual" subtitle="Lihat perbandingan rencana dan pengeluaran aktual" isBarChart={true} />
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, bg, color }) {
  return (
    <div className={`rounded-2xl p-4 transition-all card-hover shadow-xs ${bg} ${color}`}>
      <p className="text-xs font-medium mb-1 opacity-70">{label}</p>
      <p className="text-base font-bold leading-tight">{value}</p>
    </div>
  )
}

function LockedCard({ title, subtitle }) {
  return (
    <div className="rounded-2xl p-5 text-center relative overflow-hidden bg-surface border border-border shadow-xs">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 bg-accent-light">
        <span className="text-lg">🔒</span>
      </div>
      <p className="text-sm font-semibold mb-0.5 text-text">{title}</p>
      <p className="text-xs mb-3 text-text-muted">{subtitle}</p>
      <button className="text-xs font-bold px-4 py-2 rounded-full transition-all text-white bg-gradient-to-r from-accent to-accent-dark shadow-gold hover:-translate-y-0.5"
      >
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
                { name: 'Item 1', Rencana: 40, Aktual: 35 },
                { name: 'Item 2', Rencana: 30, Aktual: 28 },
              ]} layout="vertical" margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
                <Bar dataKey="Rencana" fill="var(--color-accent-light)" stroke="var(--color-accent)" strokeWidth={1} radius={[0, 4, 4, 0]} />
                <Bar dataKey="Aktual" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
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
