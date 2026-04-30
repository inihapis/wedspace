const BASE_URL = 'http://localhost:3001/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data.error || 'Terjadi kesalahan')
    err.status = res.status
    err.code = data.code
    throw err
  }

  return data
}

export const api = {
  // Auth
  login:    (email, password)  => request('POST', '/auth/login',    { email, password }),
  register: (email, password)  => request('POST', '/auth/register', { email, password }),
  me:       ()                 => request('GET',  '/auth/me'),

  // Workspace
  getWorkspace:   ()     => request('GET',  '/workspace'),
  setupWorkspace: (data) => request('POST', '/workspace/setup', data),
  updateWorkspace:(data) => request('PUT',  '/workspace', data),

  // Tasks
  getTasks:       ()           => request('GET',    '/tasks'),
  cycleTaskStatus:(id)         => request('PUT',    `/tasks/${id}/status`),
  updateTask:     (id, data)   => request('PUT',    `/tasks/${id}`, data),
  addTask:        (data)       => request('POST',   '/tasks', data),
  deleteTask:     (id)         => request('DELETE', `/tasks/${id}`),

  // Budget
  getBudget:      ()           => request('GET',    '/budget'),
  updateBudgetItem:(id, data)  => request('PUT',    `/budget/${id}`, data),
  addBudgetItem:  (data)       => request('POST',   '/budget', data),
  deleteBudgetItem:(id)        => request('DELETE', `/budget/${id}`),

  // Savings
  getSavings:     ()           => request('GET',    '/savings'),
  addSavingsEntry:(data)       => request('POST',   '/savings', data),
  updateSavingsEntry:(id, data) => request('PUT',   `/savings/${id}`, data),
  deleteSavingsEntry:(id)      => request('DELETE', `/savings/${id}`),

  // Notes
  getNotes:       ()           => request('GET',    '/notes'),
  addNote:        (data)       => request('POST',   '/notes', data),
  updateNote:     (id, data)   => request('PUT',    `/notes/${id}`, data),
  deleteNote:     (id)         => request('DELETE', `/notes/${id}`),

  // Admin
  adminStats:           ()           => request('GET', '/admin/stats'),
  adminWorkspaces:      ()           => request('GET', '/admin/workspaces'),
  adminGetWorkspace:    (id)         => request('GET', `/admin/workspaces/${id}`),
  adminSetStatus:       (id, status) => request('PUT', `/admin/workspaces/${id}/status`, { status }),
  adminSetPlan:         (id, plan, expiresAt) => request('PUT', `/admin/workspaces/${id}/plan`, { plan, expiresAt }),
  adminUsers:           ()           => request('GET', '/admin/users'),
}
