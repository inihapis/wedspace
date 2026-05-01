/**
 * IndexedDB client-side utility
 * Digunakan oleh AppContext untuk offline fallback dan cache management.
 *
 * Semua data di-scope per userId — tidak ada cross-user leakage.
 */

const IDB_NAME = 'wedspace-offline'
const IDB_VERSION = 1
const STORES = ['workspace', 'tasks', 'budget', 'savings', 'notes', 'meta']

let _db = null

function openDB() {
  if (_db) return Promise.resolve(_db)

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION)

    req.onupgradeneeded = (e) => {
      const db = e.target.result
      STORES.forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'userId' })
        }
      })
    }

    req.onsuccess = () => {
      _db = req.result
      resolve(_db)
    }

    req.onerror = () => reject(req.error)
  })
}

/**
 * Read cached data for a user from a store.
 * Returns { data, updatedAt } or null.
 */
export async function idbGet(store, userId) {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly')
      const req = tx.objectStore(store).get(String(userId))
      req.onsuccess = () => resolve(req.result ?? null)
      req.onerror = () => reject(req.error)
    })
  } catch {
    return null
  }
}

/**
 * Write data for a user to a store.
 */
export async function idbSet(store, userId, data) {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite')
      tx.objectStore(store).put({ userId: String(userId), data, updatedAt: Date.now() })
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // Silently fail — IDB is best-effort
  }
}

/**
 * Clear ALL data for a specific user across all stores.
 * Called on logout.
 */
export async function idbClearUser(userId) {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES, 'readwrite')
      STORES.forEach((name) => tx.objectStore(name).delete(String(userId)))
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // Silently fail
  }
}

/**
 * Check if cached data is stale (older than maxAgeMs).
 */
export function isStale(record, maxAgeMs = 5 * 60 * 1000) {
  if (!record?.updatedAt) return true
  return Date.now() - record.updatedAt > maxAgeMs
}
