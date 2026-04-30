import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { Heart, Hash, Calendar, MapPin, Save, Edit3, CheckCircle2 } from 'lucide-react'
import { PageHeader, Section, FieldGroup, Button, Input } from '../../components/shared'
import { PlanBadge } from '../../components/shared/Badge'

export default function Profile() {
  const { workspace, updateWorkspace, loading, loadAll } = useApp()
  const { user } = useAuth()

  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    partner_a_name: '',
    partner_b_name: '',
    relationship_name: '',
    hashtag: '',
    wedding_date: '',
    venue_location: '',
    total_budget: '',
    savings_target: '',
  })

  useEffect(() => { loadAll() }, [])
  useEffect(() => {
    if (workspace) {
      // Handle date properly to avoid timezone shift
      let dateStr = ''
      if (workspace.wedding_date) {
        const date = new Date(workspace.wedding_date)
        // Format as YYYY-MM-DD in local timezone
        dateStr = date.toISOString().split('T')[0]
      }
      setForm({
        partner_a_name:     workspace.partner_a_name     || '',
        partner_b_name:     workspace.partner_b_name     || '',
        relationship_name:  workspace.relationship_name  || '',
        hashtag:            workspace.hashtag            || '',
        wedding_date:       dateStr,
        venue_location:     workspace.venue_location     || '',
        total_budget:       workspace.total_budget       || '',
        savings_target:     workspace.savings_target     || '',
      })
    }
  }, [workspace])

  if (loading || !workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-text-subtle">Memuat data...</p>
      </div>
    )
  }

  const handleSave = async () => {
    await updateWorkspace({
      partnerAName:      form.partner_a_name,
      partnerBName:      form.partner_b_name,
      relationshipName:  form.relationship_name,
      hashtag:           form.hashtag,
      weddingDate:       form.wedding_date,
      venueLocation:     form.venue_location,
      totalBudget:       Number(form.total_budget) || 0,
      savingsTarget:     Number(form.savings_target) || 0,
    })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSavingsTargetChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    setForm({ ...form, savings_target: value })
  }

  const handleBudgetChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    setForm({ ...form, total_budget: value })
  }

  const formatBudgetDisplay = (value) => {
    if (!value) return ''
    const num = Number(value)
    return new Intl.NumberFormat('id-ID').format(num)
  }

  const plan = workspace?.plan || 'free'
  const isPremium = plan === 'premium'

  const nameA = form.partner_a_name || 'Pasangan A'
  const nameB = form.partner_b_name || 'Pasangan B'

  return (
    <div className="p-4 sm:p-6 xl:p-8 max-w-none">
      {/* Header */}
      <PageHeader
        title="Profil & Pengaturan"
        subtitle="Kelola informasi workspace pernikahan kamu"
        action={
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-success-light text-success">
                <CheckCircle2 size={13} />
                Tersimpan
              </span>
            )}
            {editing ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save size={15} />
                Simpan
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="md"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit3 size={15} />
                Edit
              </Button>
            )}
          </div>
        }
      />

      {/* Plan badge */}
      <div
        className="rounded-2xl p-5 mb-6 flex items-center justify-between"
        style={{
          background: isPremium
            ? 'linear-gradient(135deg, var(--color-primary) 0%, #3D3D3D 100%)'
            : 'var(--color-surface)',
          border: isPremium ? 'none' : '1px solid var(--color-border)',
          boxShadow: isPremium ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        }}
      >
        <div>
          <p
            className="text-xs font-medium mb-0.5"
            style={{
              color: isPremium ? 'rgba(255,255,255,0.6)' : 'var(--color-text-muted)',
            }}
          >
            Akun
          </p>
          <p
            className="text-sm font-semibold"
            style={{
              color: isPremium ? 'white' : 'var(--color-text)',
            }}
          >
            {user?.email || '—'}
          </p>
        </div>
        <PlanBadge plan={plan} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Couple Identity + Hashtag */}
        <Section icon={<Heart size={16} />} title="Data Pengantin & Hashtag">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldGroup label="Nama Pengantin 1">
              <Input
                type="text"
                value={form.partner_a_name}
                onChange={(e) =>
                  setForm({ ...form, partner_a_name: e.target.value })
                }
                disabled={!editing}
                placeholder="Nama lengkap"
              />
            </FieldGroup>
            <FieldGroup label="Nama Pengantin 2">
              <Input
                type="text"
                value={form.partner_b_name}
                onChange={(e) =>
                  setForm({ ...form, partner_b_name: e.target.value })
                }
                disabled={!editing}
                placeholder="Nama lengkap"
              />
            </FieldGroup>
            <FieldGroup
              label="Nama Hubungan"
              hint="Contoh: BudiAni, Pasangan Lucu"
            >
              <Input
                type="text"
                value={form.relationship_name}
                onChange={(e) =>
                  setForm({ ...form, relationship_name: e.target.value })
                }
                disabled={!editing}
                placeholder="Nama tampilan di dashboard"
              />
            </FieldGroup>
            <FieldGroup label="Hashtag Pernikahan" hint="Tanpa tanda #">
              <Input
                type="text"
                value={form.hashtag}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hashtag: e.target.value.replace(/^#/, ''),
                  })
                }
                disabled={!editing}
                placeholder="BudiAni2025"
                prefix="#"
              />
            </FieldGroup>
          </div>

          {/* Preview */}
          {(form.relationship_name ||
            form.partner_a_name ||
            form.partner_b_name) && (
            <div className="mt-4 p-3 rounded-xl flex flex-wrap items-center gap-2 bg-bg">
              <span className="text-sm text-text-muted">Tampil sebagai:</span>
              <span className="text-sm font-semibold text-text">
                {form.relationship_name || `${nameA} & ${nameB}`}
              </span>
              {form.hashtag && (
                <>
                  <span style={{ color: 'var(--color-border)' }}>·</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent-light text-accent">
                    <Hash size={11} />
                    {form.hashtag}
                  </span>
                </>
              )}
            </div>
          )}
        </Section>

        {/* Wedding Details + Financial */}
        <Section icon={<Calendar size={16} />} title="Detail Pernikahan & Keuangan">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldGroup label="Tanggal Pernikahan">
              <Input
                type="date"
                value={form.wedding_date}
                onChange={(e) =>
                  setForm({ ...form, wedding_date: e.target.value })
                }
                disabled={!editing}
              />
            </FieldGroup>
            <FieldGroup label="Lokasi Venue" hint="Opsional">
              <Input
                type="text"
                value={form.venue_location}
                onChange={(e) =>
                  setForm({ ...form, venue_location: e.target.value })
                }
                disabled={!editing}
                placeholder="Nama venue atau alamat"
                icon={MapPin}
              />
            </FieldGroup>
            <FieldGroup label="Total Budget Pernikahan">
              <Input
                type="text"
                value={formatBudgetDisplay(form.total_budget)}
                onChange={handleBudgetChange}
                disabled={!editing}
                placeholder="0"
                prefix="Rp"
                className="text-right"
              />
            </FieldGroup>
            <FieldGroup label="Target Tabungan">
              <Input
                type="text"
                value={formatBudgetDisplay(form.savings_target)}
                onChange={handleSavingsTargetChange}
                disabled={!editing}
                placeholder="0"
                prefix="Rp"
                className="text-right"
              />
            </FieldGroup>
          </div>
        </Section>
      </div>

      {/* Save button at bottom */}
      {editing && (
        <div className="mt-6 flex gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            className="flex-1"
          >
            Simpan Perubahan
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              setEditing(false)
              if (workspace) {
                setForm({
                  partner_a_name: workspace.partner_a_name || '',
                  partner_b_name: workspace.partner_b_name || '',
                  relationship_name: workspace.relationship_name || '',
                  hashtag: workspace.hashtag || '',
                  wedding_date: workspace.wedding_date
                    ? workspace.wedding_date.split('T')[0]
                    : '',
                  venue_location: workspace.venue_location || '',
                  total_budget: workspace.total_budget || '',
                  savings_target: workspace.savings_target || '',
                })
              }
            }}
          >
            Batal
          </Button>
        </div>
      )}
    </div>
  )
}

// Remove old Section and FieldGroup functions - they're now in shared/Section.jsx
