/**
 * Wedspace Service Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Strategy:
 *  - Static assets  → Cache-First
 *  - API GET        → Network-First + IndexedDB fallback (per-user isolated)
 *  - API mutations  → Network-only (no cache)
 *  - Auth endpoints → Network-only (never cached)
 *  - Admin endpoints→ Network-only (never cached)
 *
 * Multi-tenant safety:
 *  - All cached data is keyed by userId
 *  - Logout clears only that user's data
 *  - No cross-user data leakage possible
 */

const SW_VERSION = 'v3'
const STATIC_CACHE = `wedspace-static-${SW_VERSION}`

// Static assets to precache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
]

// API routes that support offline fallback (GET only)
const CACHEABLE_API = [
  '/api/workspace',
  '/api/tasks',
  '/api/budget',
  '/api/savings',
  '/api/notes',
]

// Never cache these — always network
const NEVER_CACHE = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/admin',
]

// ─── IndexedDB helpers ────────────────────────────────────────────────────────

const IDB_NAME = 'wedspace-offline'
const IDB_VERSION = 1

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      // One store per data type — key is userId
      const stores = ['workspace', 'tasks', 'budget', 'savings', 'notes', 'meta']
      stores.forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'userId' })
        }
      })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbGet(store, userId) {
  const db = await openIDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).get(userId)
    req.onsuccess = () => resolve(req.result?.data ?? null)
    req.onerror = () => reject(req.error)
  })
}

async function idbSet(store, userId, data) {
  const db = await openIDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    tx.objectStore(store).put({ userId, data, updatedAt: Date.now() })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function idbClearUser(userId) {
  const db = await openIDB()
  const stores = ['workspace', 'tasks', 'budget', 'savings', 'notes', 'meta']
  return new Promise((resolve, reject) => {
    const tx = db.transaction(stores, 'readwrite')
    stores.forEach((name) => tx.objectStore(name).delete(userId))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Map API path → IDB store name
function apiPathToStore(pathname) {
  if (pathname.includes('/workspace')) return 'workspace'
  if (pathname.includes('/tasks'))     return 'tasks'
  if (pathname.includes('/budget'))    return 'budget'
  if (pathname.includes('/savings'))   return 'savings'
  if (pathname.includes('/notes'))     return 'notes'
  return null
}

// ─── Install ──────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// ─── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

// ─── Message handler (from app) ───────────────────────────────────────────────

self.addEventListener('message', async (event) => {
  const { type, userId } = event.data || {}

  if (type === 'LOGOUT' && userId) {
    // Clear this user's IndexedDB data
    await idbClearUser(String(userId))
    event.ports[0]?.postMessage({ ok: true })
    return
  }

  if (type === 'SKIP_WAITING') {
    self.skipWaiting()
    return
  }

  if (type === 'REVALIDATE' && userId) {
    // Trigger background revalidation — app will handle actual fetch
    const clients = await self.clients.matchAll()
    clients.forEach((c) => c.postMessage({ type: 'REVALIDATE_REQUESTED' }))
    return
  }
})

// ─── Fetch handler ────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Skip non-http(s) (chrome-extension, data:, blob:, etc.)
  if (!url.protocol.startsWith('http')) return

  const pathname = url.pathname

  // ── Never cache: auth mutations, admin, non-GET ──────────────────────────
  const isNeverCache = NEVER_CACHE.some((p) => pathname.startsWith(p))
  if (isNeverCache) return // let browser handle normally

  if (event.request.method !== 'GET') return // mutations: network-only

  // ── Static assets: Cache-First ───────────────────────────────────────────
  if (!pathname.startsWith('/api/')) {
    event.respondWith(cacheFirstStatic(event.request))
    return
  }

  // ── /api/auth/me: Network-First, no IDB cache ────────────────────────────
  if (pathname === '/api/auth/me') {
    event.respondWith(networkFirst(event.request, null, null))
    return
  }

  // ── Cacheable API: Network-First + IDB fallback ──────────────────────────
  const isCacheable = CACHEABLE_API.some((p) => pathname.startsWith(p))
  if (isCacheable) {
    event.respondWith(networkFirstWithIDB(event.request, pathname))
    return
  }
})

// ─── Strategy: Cache-First (static assets) ───────────────────────────────────

async function cacheFirstStatic(request) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response && response.status === 200) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    // SPA fallback
    const fallback = await caches.match('/index.html')
    return fallback || new Response('Offline', { status: 503 })
  }
}

// ─── Strategy: Network-First + IDB fallback (API data) ───────────────────────

async function networkFirstWithIDB(request, pathname) {
  const store = apiPathToStore(pathname)

  // Extract userId from Authorization header
  const authHeader = request.headers.get('Authorization') || ''
  const userId = getUserIdFromToken(authHeader)

  try {
    const response = await fetch(request)

    if (response && response.status === 200 && userId && store) {
      // Clone and save to IDB for offline use
      const clone = response.clone()
      clone.json().then((data) => {
        idbSet(store, userId, data).catch(() => {})
      })
    }

    return response
  } catch {
    // Offline — try IDB fallback
    if (userId && store) {
      const cached = await idbGet(store, userId)
      if (cached) {
        return new Response(JSON.stringify(cached), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Wedspace-Source': 'indexeddb-offline',
          },
        })
      }
    }

    // No cached data
    return new Response(
      JSON.stringify({ error: 'Offline — data tidak tersedia', offline: true }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// ─── Strategy: Network-First (no IDB) ────────────────────────────────────────

async function networkFirst(request, _store, _userId) {
  try {
    return await fetch(request)
  } catch {
    return new Response(
      JSON.stringify({ error: 'Offline', offline: true }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Decode userId from JWT without verifying signature.
 * We only use this as a cache key — security is enforced server-side.
 */
function getUserIdFromToken(authHeader) {
  try {
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return null
    const payload = token.split('.')[1]
    if (!payload) return null
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded.id ? String(decoded.id) : null
  } catch {
    return null
  }
}
