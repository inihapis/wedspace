import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { api } from '../utils/api'
import { idbGet, idbSet, isStale } from '../utils/idb'
import { onSWMessage } from '../utils/pwa'
import { useAuth } from './AuthContext'

const AppContext = createContext(null)

// Map store name → API fetcher → response key
const DATA_SOURCES = [
  { store: 'workspace', fetch: () => api.getWorkspace(),  key: 'workspace',  setter: 'setWorkspace',  transform: (r) => r.workspace },
  { store: 'tasks',     fetch: () => api.getTasks(),      key: 'tasks',      setter: 'setTasks',      transform: (r) => r.tasks },
  { store: 'budget',    fetch: () => api.getBudget(),     key: 'budget',     setter: 'setBudgetItems',transform: (r) => r.items },
  { store: 'savings',   fetch: () => api.getSavings(),    key: 'savings',    setter: 'setSavingsData',transform: (r) => ({ entries: r.entries, totals: r.totals }) },
  { store: 'notes',     fetch: () => api.getNotes(),      key: 'notes',      setter: 'setNotes',      transform: (r) => r.notes },
]

export function AppProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ? String(user.id) : null

  const [workspace, setWorkspace]     = useState(null)
  const [tasks, setTasks]             = useState([])
  const [budgetItems, setBudgetItems] = useState([])
  const [savingsData, setSavingsData] = useState({ entries: [], totals: { pasanganA: 0, pasanganB: 0, lainnya: 0 } })
  const [notes, setNotes]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [offline, setOffline]         = useState(!navigator.onLine)
  const [error, setError]             = useState(null)

  const setterMap = { setWorkspace, setTasks, setBudgetItems, setSavingsData, setNotes }

  // ─── Offline detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const goOnline  = () => { setOffline(false); loadAll() }
    const goOffline = () => setOffline(true)
    window.addEventListener('online',  goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online',  goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── SW revalidation requests ───────────────────────────────────────────────
  useEffect(() => {
    const unsub = onSWMessage((msg) => {
      if (msg?.type === 'REVALIDATE_REQUESTED') loadAll()
    })
    return unsub
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Refetch on window focus ────────────────────────────────────────────────
  useEffect(() => {
    const onFocus = () => { if (navigator.onLine) loadAll() }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Load all data (network-first, IDB fallback) ────────────────────────────
  const loadAll = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)

    try {
      // Try network first
      const [wsRes, tasksRes, budgetRes, savingsRes, notesRes] = await Promise.all([
        api.getWorkspace(),
        api.getTasks(),
        api.getBudget(),
        api.getSavings(),
        api.getNotes(),
      ])

      const fresh = {
        workspace:  wsRes.workspace,
        tasks:      tasksRes.tasks,
        budget:     budgetRes.items,
        savings:    { entries: savingsRes.entries, totals: savingsRes.totals },
        notes:      notesRes.notes,
      }

      setWorkspace(fresh.workspace)
      setTasks(fresh.tasks)
      setBudgetItems(fresh.budget)
      setSavingsData(fresh.savings)
      setNotes(fresh.notes)

      // Persist to IDB for offline use
      idbSet('workspace', userId, fresh.workspace).catch(() => {})
      idbSet('tasks',     userId, fresh.tasks).catch(() => {})
      idbSet('budget',    userId, fresh.budget).catch(() => {})
      idbSet('savings',   userId, fresh.savings).catch(() => {})
      idbSet('notes',     userId, fresh.notes).catch(() => {})

    } catch (err) {
      // Network failed — try IDB fallback
      if (err?.message?.includes('fetch') || !navigator.onLine) {
        await loadFromIDB()
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Load from IndexedDB (offline mode)
  const loadFromIDB = useCallback(async () => {
    if (!userId) return
    try {
      const [ws, tk, bg, sv, nt] = await Promise.all([
        idbGet('workspace', userId),
        idbGet('tasks',     userId),
        idbGet('budget',    userId),
        idbGet('savings',   userId),
        idbGet('notes',     userId),
      ])

      if (ws?.data) setWorkspace(ws.data)
      if (tk?.data) setTasks(tk.data)
      if (bg?.data) setBudgetItems(bg.data)
      if (sv?.data) setSavingsData(sv.data)
      if (nt?.data) setNotes(nt.data)
    } catch {
      // IDB unavailable — leave state as-is
    }
  }, [userId])

  // ─── Workspace ──────────────────────────────────────────────────────────────
  const updateWorkspace = useCallback(async (data) => {
    const res = await api.updateWorkspace(data)
    setWorkspace(res.workspace)
    idbSet('workspace', userId, res.workspace).catch(() => {})
    return res.workspace
  }, [userId])

  // ─── Tasks ──────────────────────────────────────────────────────────────────
  const toggleTaskStatus = useCallback(async (id) => {
    const cycle = { todo: 'in_progress', in_progress: 'done', done: 'todo' }
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: cycle[t.status] || 'todo' } : t))
    try {
      const res = await api.cycleTaskStatus(id)
      setTasks((prev) => {
        const updated = prev.map((t) => t.id === id ? { ...t, ...res.task } : t)
        idbSet('tasks', userId, updated).catch(() => {})
        return updated
      })
    } catch {
      setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: cycle[cycle[t.status]] || 'todo' } : t))
    }
  }, [userId])

  const updateTaskAssignee = useCallback(async (id, assignee) => {
    setTasks((prev) => {
      const updated = prev.map((t) => t.id === id ? { ...t, assignee } : t)
      idbSet('tasks', userId, updated).catch(() => {})
      return updated
    })
    await api.updateTask(id, { assignee })
  }, [userId])

  const addTask = useCallback(async (taskData) => {
    const res = await api.addTask(taskData)
    setTasks((prev) => {
      const updated = [...prev, res.task]
      idbSet('tasks', userId, updated).catch(() => {})
      return updated
    })
    return res.task
  }, [userId])

  const deleteTask = useCallback(async (id) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id)
      idbSet('tasks', userId, updated).catch(() => {})
      return updated
    })
    await api.deleteTask(id)
  }, [userId])

  // ─── Budget ─────────────────────────────────────────────────────────────────
  const updateBudgetItem = useCallback(async (id, data) => {
    setBudgetItems((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, ...data } : i)
      idbSet('budget', userId, updated).catch(() => {})
      return updated
    })
    await api.updateBudgetItem(id, data)
  }, [userId])

  const addBudgetItem = useCallback(async (category) => {
    const res = await api.addBudgetItem({ category })
    setBudgetItems((prev) => {
      const updated = [...prev, res.item]
      idbSet('budget', userId, updated).catch(() => {})
      return updated
    })
    return res.item
  }, [userId])

  const deleteBudgetItem = useCallback(async (id) => {
    setBudgetItems((prev) => {
      const updated = prev.filter((i) => i.id !== id)
      idbSet('budget', userId, updated).catch(() => {})
      return updated
    })
    await api.deleteBudgetItem(id)
  }, [userId])

  // ─── Savings ────────────────────────────────────────────────────────────────
  const refreshSavings = useCallback(async () => {
    const res = await api.getSavings()
    const data = { entries: res.entries, totals: res.totals }
    setSavingsData(data)
    idbSet('savings', userId, data).catch(() => {})
    return data
  }, [userId])

  const addSavingsEntry = useCallback(async (data) => {
    const res = await api.addSavingsEntry(data)
    await refreshSavings()
    return res.entry
  }, [refreshSavings])

  const updateSavingsEntry = useCallback(async (id, data) => {
    await api.updateSavingsEntry(id, data)
    await refreshSavings()
  }, [refreshSavings])

  const deleteSavingsEntry = useCallback(async (id) => {
    await api.deleteSavingsEntry(id)
    await refreshSavings()
  }, [refreshSavings])

  // ─── Notes ──────────────────────────────────────────────────────────────────
  const addNote = useCallback(async (data) => {
    const res = await api.addNote(data)
    setNotes((prev) => {
      const updated = [res.note, ...prev]
      idbSet('notes', userId, updated).catch(() => {})
      return updated
    })
    return res.note
  }, [userId])

  const updateNote = useCallback(async (id, data) => {
    const res = await api.updateNote(id, data)
    setNotes((prev) => {
      const updated = prev.map((n) => n.id === id ? res.note : n)
      idbSet('notes', userId, updated).catch(() => {})
      return updated
    })
    return res.note
  }, [userId])

  const deleteNote = useCallback(async (id) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id)
      idbSet('notes', userId, updated).catch(() => {})
      return updated
    })
    await api.deleteNote(id)
  }, [userId])

  return (
    <AppContext.Provider value={{
      workspace, loading, error, offline, loadAll,
      updateWorkspace,
      tasks, toggleTaskStatus, updateTaskAssignee, addTask, deleteTask,
      budgetItems, updateBudgetItem, addBudgetItem, deleteBudgetItem,
      savingsData, addSavingsEntry, updateSavingsEntry, deleteSavingsEntry,
      notes, addNote, updateNote, deleteNote,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
