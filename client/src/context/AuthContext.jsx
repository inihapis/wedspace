import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [hasWorkspace, setHasWorkspace] = useState(false)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
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

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setHasWorkspace(false)
  }

  const markWorkspaceCreated = () => setHasWorkspace(true)

  return (
    <AuthContext.Provider value={{ user, hasWorkspace, loading, login, register, logout, markWorkspaceCreated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
