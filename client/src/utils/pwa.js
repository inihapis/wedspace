/**
 * PWA / Service Worker utilities
 * Handles registration, messaging, and lifecycle events.
 */

let swRegistration = null

/**
 * Register the service worker.
 * Call once from main.jsx.
 */
export async function registerSW() {
  if (!('serviceWorker' in navigator)) return null

  try {
    swRegistration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none', // always check for SW updates
    })

    // Check for updates every 60 seconds
    setInterval(() => swRegistration?.update(), 60_000)

    // When a new SW is waiting, activate it immediately
    swRegistration.addEventListener('updatefound', () => {
      const newWorker = swRegistration.installing
      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New version available — tell it to skip waiting
          newWorker.postMessage({ type: 'SKIP_WAITING' })
        }
      })
    })

    // Reload page when new SW takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })

    console.log('✅ Service Worker registered')
    return swRegistration
  } catch (err) {
    console.warn('SW registration failed:', err)
    return null
  }
}

/**
 * Send a message to the active service worker.
 * Returns a Promise that resolves with the SW's response (if any).
 */
function sendMessage(message) {
  return new Promise((resolve) => {
    const sw = navigator.serviceWorker?.controller
    if (!sw) return resolve(null)

    const channel = new MessageChannel()
    channel.port1.onmessage = (e) => resolve(e.data)
    sw.postMessage(message, [channel.port2])
  })
}

/**
 * Notify SW that user logged out — clears their IDB data.
 */
export async function notifySWLogout(userId) {
  if (!userId) return
  await sendMessage({ type: 'LOGOUT', userId: String(userId) })
}

/**
 * Notify SW to trigger background revalidation.
 */
export async function notifySWRevalidate(userId) {
  if (!userId) return
  await sendMessage({ type: 'REVALIDATE', userId: String(userId) })
}

/**
 * Listen for messages from the SW (e.g. revalidation requests).
 */
export function onSWMessage(callback) {
  if (!('serviceWorker' in navigator)) return () => {}
  const handler = (event) => callback(event.data)
  navigator.serviceWorker.addEventListener('message', handler)
  return () => navigator.serviceWorker.removeEventListener('message', handler)
}

/**
 * Returns true if the app is currently offline.
 */
export function isOffline() {
  return !navigator.onLine
}
