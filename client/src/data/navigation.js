/**
 * Navigation Data
 * Centralized navigation configuration untuk Sidebar, MobileNav, dan AdminPanel
 */

import {
  LayoutDashboard,
  Calendar,
  Wallet,
  PiggyBank,
  FileText,
  Users,
  Settings,
  BarChart3
} from 'lucide-react'

/**
 * Main Navigation Items
 * Desktop: Urutan sesuai array (Dashboard pertama)
 * Mobile: center: true untuk item yang ditampilkan di tengah
 */
export const mainNavItems = [
    { id: 'timeline', icon: Calendar, label: 'Timeline' },
    { id: 'budget', icon: Wallet, label: 'Budget' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', center: true },
    { id: 'savings', icon: PiggyBank, label: 'Tabungan' },
    { id: 'notes', icon: FileText, label: 'Catatan' },
]

/**
 * Admin Navigation Items
 * Desktop: Urutan sesuai array (stats pertama)
 * Mobile: center: true untuk item yang ditampilkan di tengah
 */
export const adminNavItems = [
    { id: 'workspaces', icon: Wallet, label: 'Workspaces' },
    { id: 'stats', icon: LayoutDashboard, label: 'Overview', center: true },
    { id: 'users', icon: Users, label: 'Users'},
]

/**
 * Premium Navigation Items
 * Digunakan untuk menampilkan fitur premium
 */
export const premiumNavItems = []

/**
 * Settings Navigation Items
 * Digunakan untuk menu settings
 */
export const settingsNavItems = [
  { id: 'profile', icon: Settings, label: 'Profil & Pengaturan' },
]

/**
 * Get all navigation items
 * @param {boolean} isPremium - Whether user has premium plan
 * @returns {Array} All available navigation items
 */
export function getAllNavItems(isPremium = false) {
  const items = [...mainNavItems]
  if (isPremium) {
    items.push(...premiumNavItems)
  }
  return items
}

/**
 * Get navigation item by id
 * @param {string} id - Navigation item id
 * @returns {Object|null} Navigation item or null
 */
export function getNavItemById(id) {
  const allItems = [
    ...mainNavItems,
    ...premiumNavItems,
    ...settingsNavItems,
    ...adminNavItems,
  ]
  return allItems.find((item) => item.id === id) || null
}

/**
 * Check if navigation item is active
 * @param {string} currentView - Current view id
 * @param {string} itemId - Navigation item id
 * @returns {boolean} Whether item is active
 */
export function isNavItemActive(currentView, itemId) {
  return currentView === itemId
}
