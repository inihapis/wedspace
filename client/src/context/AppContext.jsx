import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { api } from '../utils/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [workspace, setWorkspace]     = useState(null)
  const [tasks, setTasks]             = useState([])
  const [budgetItems, setBudgetItems] = useState([])
  const [savingsData, setSavingsData] = useState({ entries: [], totals: { pasanganA: 0, pasanganB: 0, lainnya: 0 } })
  const [notes, setNotes]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  // Load all data
  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [wsRes, tasksRes, budgetRes, savingsRes, notesRes] = await Promise.all([
        api.getWorkspace(),
        api.getTasks(),
        api.getBudget(),
        api.getSavings(),
        api.getNotes(),
      ])
      setWorkspace(wsRes.workspace)
      setTasks(tasksRes.tasks)
      setBudgetItems(budgetRes.items)
      setSavingsData({ entries: savingsRes.entries, totals: savingsRes.totals })
      setNotes(notesRes.notes)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Refresh data when app comes to focus (fixes mobile data sync issues)
  useEffect(() => {
    const handleFocus = () => {
      loadAll()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [loadAll])

  // ─── Workspace ─────────────────────────────────────────────────────────────
  const updateWorkspace = useCallback(async (data) => {
    const res = await api.updateWorkspace(data)
    setWorkspace(res.workspace)
    return res.workspace
  }, [])

  // ─── Tasks ─────────────────────────────────────────────────────────────────
  const toggleTaskStatus = useCallback(async (id) => {
    // Optimistic update
    const statusCycle = { todo: 'in_progress', in_progress: 'done', done: 'todo' }
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: statusCycle[t.status] || 'todo' } : t))
    try {
      const res = await api.cycleTaskStatus(id)
      setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...res.task } : t))
    } catch {
      // Revert on error
      setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: statusCycle[statusCycle[t.status]] || 'todo' } : t))
    }
  }, [])

  const updateTaskAssignee = useCallback(async (id, assignee) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, assignee } : t))
    await api.updateTask(id, { assignee })
  }, [])

  const addTask = useCallback(async (taskData) => {
    const res = await api.addTask(taskData)
    setTasks((prev) => [...prev, res.task])
    return res.task
  }, [])

  const deleteTask = useCallback(async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    await api.deleteTask(id)
  }, [])

  // ─── Budget ────────────────────────────────────────────────────────────────
  const updateBudgetItem = useCallback(async (id, data) => {
    setBudgetItems((prev) => prev.map((i) => i.id === id ? { ...i, ...data } : i))
    await api.updateBudgetItem(id, data)
  }, [])

  const addBudgetItem = useCallback(async (category) => {
    const res = await api.addBudgetItem({ category })
    setBudgetItems((prev) => [...prev, res.item])
    return res.item
  }, [])

  const deleteBudgetItem = useCallback(async (id) => {
    setBudgetItems((prev) => prev.filter((i) => i.id !== id))
    await api.deleteBudgetItem(id)
  }, [])

  // ─── Savings ───────────────────────────────────────────────────────────────
  const addSavingsEntry = useCallback(async (data) => {
    const res = await api.addSavingsEntry(data)
    // Reload savings to get updated totals
    const savingsRes = await api.getSavings()
    setSavingsData({ entries: savingsRes.entries, totals: savingsRes.totals })
    return res.entry
  }, [])

  const updateSavingsEntry = useCallback(async (id, data) => {
    await api.updateSavingsEntry(id, data)
    const savingsRes = await api.getSavings()
    setSavingsData({ entries: savingsRes.entries, totals: savingsRes.totals })
  }, [])

  const deleteSavingsEntry = useCallback(async (id) => {
    await api.deleteSavingsEntry(id)
    const savingsRes = await api.getSavings()
    setSavingsData({ entries: savingsRes.entries, totals: savingsRes.totals })
  }, [])

  // ─── Notes ─────────────────────────────────────────────────────────────────
  const addNote = useCallback(async (data) => {
    const res = await api.addNote(data)
    setNotes((prev) => [res.note, ...prev])
    return res.note
  }, [])

  const updateNote = useCallback(async (id, data) => {
    const res = await api.updateNote(id, data)
    setNotes((prev) => prev.map((n) => n.id === id ? res.note : n))
    return res.note
  }, [])

  const deleteNote = useCallback(async (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    await api.deleteNote(id)
  }, [])

  return (
    <AppContext.Provider value={{
      workspace, loading, error, loadAll,
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
