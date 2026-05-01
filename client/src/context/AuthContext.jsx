import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'
import { idbClearUser } from '../utils/idb'
import { notifySWLogout, onSWMessage } from '../utils/pwa'

const AuthContext = createContext(null)

function isLocalStorageAvailable() {
  try {
    const test = '__ls_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [hasWorkspace, setHasWorkspace] = useState(false)
  const [loading, setLoading]         = useState(true)
  const [isPrivateBrowsing, setIsPrivateBrowsing] = useState(false)

  // Restore session on mount
  useEffect(() => {
    const isPrivate = !isLocalStorageAvailable()
    setIsPrivateBrowsing(isPrivate)

    if (isPrivate) {
      console.warn('⚠️ Private Browsing — data may not persist')
      setLoading(false)
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    api.me()
      .then(({ user, hasWorkspace }) => {
        setUser(user)
        setHasWorkspace(hasWorkspace)
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
  }, [])

  // Listen for SW revalidation requests
  useEffect(() => {
    const unsub = onSWMessage((msg) => {
      if (msg?.type === 'REVALIDATE_REQUESTED') {
        // AppContext will handle actual refetch via its own listener
      }
    })
    return unsub
  }, [])

  const login = async (email, password) => {
    const data = await api.login(email, password)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    setHasWorkspace(data.hasWorkspace)
    return data
  }

  const register = async (email, password) => {
    const data = await api.register(email, password)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    setHasWorkspace(false)
    return data
  }

  const logout = async () => {
    const currentUser = user

    // Clear app state first
    localStorage.removeItem('token')
    setUser(null)
    setHasWorkspace(false)

    // Clear user's IDB data and notify SW — fire and forget
    if (currentUser?.id) {
      idbClearUser(currentUser.id).catch(() => {})
      notifySWLogout(currentUser.id).catch(() => {})
    }
  }

  const markWorkspaceCreated = () => setHasWorkspace(true)

  return (
    <AuthContext.Provider value={{
      user, hasWorkspace, loading,
      login, register, logout, markWorkspaceCreated,
      isPrivateBrowsing,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
