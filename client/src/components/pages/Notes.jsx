import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { Plus, Trash2 } from 'lucide-react'

const CATEGORIES = ['vendor', 'ide', 'keluarga', 'lainnya']
const CAT_CONFIG = {
  vendor:   { label: 'Vendor',   bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', icon: '🏪' },
  ide:      { label: 'Ide',      bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE', icon: '💡' },
  keluarga: { label: 'Keluarga', bg: '#FDF2F8', color: '#BE185D', border: '#FBCFE8', icon: '👨‍👩‍👧' },
  lainnya:  { label: 'Lainnya',  bg: 'var(--color-bg)', color: 'var(--color-text-muted)', border: 'var(--color-border)', icon: '📝' },
}

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote, loading, loadAll } = useApp()
  const [filterCat, setFilterCat] = useState('semua')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', content: '', category: 'lainnya' })

  useEffect(() => { loadAll() }, [])

  const filtered = filterCat === 'semua' ? notes : notes.filter((n) => n.category === filterCat)

  const openAdd = () => {
    setEditingId(null)
    setForm({ title: '', content: '', category: 'lainnya' })
    setShowForm(true)
  }
  const openEdit = (note) => {
    setEditingId(note.id)
    setForm({ title: note.title || '', content: note.content, category: note.category })
    setShowForm(true)
  }

  const saveNote = async () => {
    if (!form.content.trim()) return
    if (editingId) {
      await updateNote(editingId, { title: form.title.trim(), content: form.content.trim(), category: form.category })
    } else {
      await addNote({ title: form.title.trim(), content: form.content.trim(), category: form.category })
    }
    setShowForm(false)
    setEditingId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: 'var(--color-text-subtle)' }}>Memuat data...</p>
      </div>
    )
  }

  const inputCls = 'w-full px-3.5 py-2.5 text-sm rounded-xl border border-border focus:outline-none transition-all text-text'

  return (
    <div className="p-4 sm:p-6 xl:p-8 max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text">Catatan</h1>
          <p className="text-sm mt-1 text-text-muted">Simpan info penting di sini</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-all bg-primary shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus size={15} />
          Catatan Baru
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <FilterBtn active={filterCat === 'semua'} onClick={() => setFilterCat('semua')}>
          Semua ({notes.length})
        </FilterBtn>
        {CATEGORIES.map((cat) => {
          const cfg = CAT_CONFIG[cat]
          return (
            <FilterBtn key={cat} active={filterCat === cat} onClick={() => setFilterCat(cat)}>
              {cfg.icon} {cfg.label} ({notes.filter((n) => n.category === cat).length})
            </FilterBtn>
          )
        })}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl p-5 mb-5 bg-surface border border-border shadow-md">
          <h3 className="text-sm font-semibold mb-4 text-text">
            {editingId ? 'Edit Catatan' : 'Catatan Baru'}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-text-muted">
                Judul (opsional)
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Judul catatan..."
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-text-muted">
                Catatan
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Tulis catatanmu di sini..."
                rows={4}
                autoFocus
                className={inputCls + ' resize-none'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-text-muted">
                Kategori
              </label>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => {
                  const cfg = CAT_CONFIG[cat]
                  const isSelected = form.category === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : ''
                      }`}
                      style={!isSelected
                        ? {
                            background: cfg.bg,
                            color: cfg.color,
                            borderColor: cfg.border,
                          }
                        : {}}
                    >
                      {cfg.icon} {cfg.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={saveNote}
              disabled={!form.content.trim()}
              className="flex-1 py-2.5 text-white text-sm font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-primary hover:shadow-sm hover:-translate-y-0.5"
            >
              Simpan
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null) }}
              className="flex-1 py-2.5 border border-border text-sm font-medium rounded-xl transition-all text-text hover:bg-bg"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-sm font-medium text-text-muted">Belum ada catatan</p>
          <button
            onClick={openAdd}
            className="mt-3 text-sm font-medium transition-all text-accent hover:underline"
          >
            Buat catatan pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((note) => {
            const cfg = CAT_CONFIG[note.category] || CAT_CONFIG.lainnya
            return (
              <div
                key={note.id}
                onClick={() => openEdit(note)}
                className="rounded-2xl p-5 transition-all group cursor-pointer card-hover bg-surface border border-border shadow-xs"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    {note.title && (
                      <h3 className="text-sm font-semibold mb-1.5 truncate text-text">
                        {note.title}
                      </h3>
                    )}
                    <p className="text-sm line-clamp-3 whitespace-pre-wrap leading-relaxed text-text-muted">
                      {note.content}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id) }}
                    className="opacity-0 group-hover:opacity-100 transition-all shrink-0 p-1 rounded-lg text-text-subtle hover:text-danger hover:bg-danger-light"
                    aria-label="Hapus catatan"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="divider-gold mb-3" />
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                    style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
                  >
                    {cfg.icon} {cfg.label}
                  </span>
                  <span className="text-xs text-text-subtle">
                    {new Date(note.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all border ${
        active
          ? 'bg-primary text-white border-primary shadow-xs'
          : 'bg-surface text-text-muted border-border hover:border-accent hover:text-accent'
      }`}
    >
      {children}
    </button>
  )
}
