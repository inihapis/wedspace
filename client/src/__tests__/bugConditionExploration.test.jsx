/**
 * Bug Condition Exploration Tests — UPDATED for Fixed Behavior (Task 3.9)
 *
 * These tests were originally written to encode BROKEN BEHAVIOR (bug conditions).
 * After all fixes in Tasks 3.1–3.8, they have been updated to assert CORRECT behavior.
 * ALL tests should PASS — passing confirms the bugs are resolved.
 *
 * Validates: Requirements 1.1, 1.2, 2.4, 4.1, 5.1
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// ─── Mock contexts so components render without real API calls ────────────────

// Mock useAuth (used by Sidebar)
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: { id: 1, email: 'test@test.com' },
  }),
}))

// Mock useApp (used by Budget, Sidebar, MobileNav)
const mockWorkspace = {
  id: 1,
  plan: 'free',
  total_budget: 10000000,
  partner_a_name: 'Alice',
  partner_b_name: 'Bob',
  hashtag: 'AliceBob2025',
}

const mockBudgetItems = [
  { id: 1, category: 'Catering', planned: 5000000, actual: 3000000 },
  { id: 2, category: 'Venue',    planned: 3000000, actual: 2500000 },
]

vi.mock('../context/AppContext', () => ({
  useApp: () => ({
    workspace: mockWorkspace,
    budgetItems: mockBudgetItems,
    loading: false,
    loadAll: vi.fn(),
    updateBudgetItem: vi.fn(),
    addBudgetItem: vi.fn(),
    deleteBudgetItem: vi.fn(),
    updateWorkspace: vi.fn(),
  }),
}))

// ─── Import components AFTER mocks are set up ─────────────────────────────────
import Budget from '../components/Budget'
import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'

// ─── Bug 1 FIXED: Kolom Aktual sekarang toggle display/edit mode ──────────────

describe('Bug 1 FIXED — Kolom Aktual menampilkan formatRupiah() saat idle', () => {
  /**
   * Fix verified: Budget.jsx sekarang menggunakan editingActualId state.
   * Saat idle (editingActualId !== item.id), kolom Aktual menampilkan
   * <button> dengan formatRupiah(item.actual), bukan <input> langsung.
   *
   * Validates: Requirements 2.1, 2.2
   */
  it('kolom Aktual menampilkan <button> dengan formatRupiah() saat idle (bukan <input> langsung)', () => {
    render(<Budget />)

    // Setelah fix: ada button yang menampilkan nilai actual (2.500.000 hanya ada di actual)
    const buttons = screen.getAllByRole('button')
    const actualOnlyButtons = buttons.filter(btn =>
      btn.textContent.includes('2.500.000') && btn.textContent.includes('Rp')
    )

    // Fix condition: ada button yang menampilkan nilai actual (Rp 2.500.000)
    expect(actualOnlyButtons.length).toBeGreaterThan(0)
  })

  it('tidak ada <input type="number"> yang selalu tampil di kolom Aktual saat idle', () => {
    render(<Budget />)

    // Setelah fix: tidak ada input dengan placeholder "0" yang selalu tampil
    // (input hanya muncul saat editingActualId === item.id, yaitu setelah klik)
    const inputs = document.querySelectorAll('input[type="number"]')
    const alwaysVisibleActualInputs = Array.from(inputs).filter(input =>
      input.placeholder === '0' || input.getAttribute('placeholder') === '0'
    )

    // Fix condition: tidak ada input aktual yang selalu tampil (harus 0)
    expect(alwaysVisibleActualInputs.length).toBe(0)
  })
})

// ─── Bug 2 FIXED: Menu Charts sudah dihapus dari navigasi ────────────────────

describe('Bug 2 FIXED — Menu Charts sudah dihapus dari navigasi Sidebar', () => {
  /**
   * Fix verified: Array navItems di Sidebar.jsx tidak lagi mengandung
   * item dengan id === 'charts'. Tombol navigasi "Charts" tidak dirender.
   *
   * Validates: Requirements 2.4
   */
  it('navItems Sidebar TIDAK mengandung item dengan id === "charts"', () => {
    render(
      <Sidebar
        currentView="dashboard"
        setCurrentView={vi.fn()}
      />
    )

    // Fix condition: tidak ada tombol navigasi "Charts" di sidebar
    const chartsButton = screen.queryByRole('button', { name: /charts/i })
    expect(chartsButton).toBeNull()
  })

  it('teks "Charts" TIDAK muncul di Sidebar', () => {
    render(
      <Sidebar
        currentView="dashboard"
        setCurrentView={vi.fn()}
      />
    )

    // Fix condition: teks "Charts" tidak ada di sidebar
    const chartsText = screen.queryByText('Charts')
    expect(chartsText).toBeNull()
  })
})

describe('Bug 2 FIXED — Menu Charts sudah dihapus dari navigasi MobileNav', () => {
  /**
   * Fix verified: MobileNav.jsx tidak lagi memiliki tombol Charts.
   * navItems hanya berisi 5 item navigasi utama.
   *
   * Validates: Requirements 2.4
   */
  it('TIDAK ada tombol Charts yang dirender di MobileNav', () => {
    render(
      <MobileNav
        currentView="dashboard"
        setCurrentView={vi.fn()}
      />
    )

    // Fix condition: teks "Charts" tidak ada di mobile nav
    const chartsText = screen.queryByText('Charts')
    expect(chartsText).toBeNull()
  })

  it('MobileNav merender tepat 5 tombol navigasi (tanpa Charts)', () => {
    render(
      <MobileNav
        currentView="dashboard"
        setCurrentView={vi.fn()}
      />
    )

    // navItems memiliki 5 item: Home, Timeline, Budget, Tabungan, Catatan
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(5)
  })
})

// ─── Bug 4 FIXED: Icon navigasi sekarang menggunakan Lucide React ─────────────

describe('Bug 4 FIXED — Icon navigasi Sidebar menggunakan Lucide React (bukan emoji string)', () => {
  /**
   * Fix verified: Array navItems di Sidebar.jsx sekarang menggunakan
   * komponen Lucide React (LayoutDashboard, Calendar, Wallet, PiggyBank, FileText)
   * sebagai icon, bukan emoji string.
   *
   * Validates: Requirements 4.1
   */
  it('icon navigasi Dashboard adalah komponen Lucide React (bukan emoji string "☀️")', () => {
    render(
      <Sidebar
        currentView="dashboard"
        setCurrentView={vi.fn()}
      />
    )

    // Fix condition: emoji ☀️ TIDAK muncul di sidebar sebagai icon navigasi
    const emojiSpans = document.querySelectorAll('span.text-base')
    const dashboardEmoji = Array.from(emojiSpans).find(span =>
      span.textContent === '☀️'
    )
    expect(dashboardEmoji).toBeUndefined()
  })

  it('emoji navigasi utama (☀️, 📅, 💰, 🏦, 🧾) TIDAK ada di DOM', () => {
    render(
      <Sidebar
        currentView="dashboard"
        setCurrentView={vi.fn()}
      />
    )

    // Fix condition: emoji navigasi tidak ada di DOM
    const removedEmojis = ['☀️', '📅', '💰', '🏦', '🧾']
    const emojiSpans = document.querySelectorAll('span.text-base')
    const foundEmojis = Array.from(emojiSpans).map(span => span.textContent)

    removedEmojis.forEach(emoji => {
      expect(foundEmojis).not.toContain(emoji)
    })
  })

  it('setiap tombol navigasi memiliki SVG icon Lucide', () => {
    render(
      <Sidebar
        currentView="dashboard"
        setCurrentView={vi.fn()}
      />
    )

    // Fix condition: setiap nav button memiliki SVG dengan class lucide
    const navButtons = document.querySelectorAll('nav button')
    const buttonsWithSvg = Array.from(navButtons).filter(btn =>
      btn.querySelector('svg[class*="lucide"]')
    )

    // Semua 5 nav buttons harus memiliki Lucide SVG icon
    expect(buttonsWithSvg.length).toBe(5)
  })
})

// ─── Bug 5 FIXED: index.css sekarang mengandung rule `button { cursor: pointer }` ──

describe('Bug 5 FIXED — index.css mengandung rule "button { cursor: pointer }"', () => {
  /**
   * Fix verified: index.css sekarang memiliki global CSS rule untuk cursor pointer
   * pada elemen interaktif (button, [role="button"], select, label[for], a).
   *
   * Validates: Requirements 5.1
   */
  it('index.css mengandung rule "button { cursor: pointer }"', () => {
    const cssPath = resolve(__dirname, '../index.css')
    const cssContent = readFileSync(cssPath, 'utf-8')

    // Fix condition: ada rule cursor: pointer untuk button
    const hasCursorPointerRule = /button\s*[,{][^}]*cursor\s*:\s*pointer/.test(cssContent)
    expect(hasCursorPointerRule).toBe(true)
  })

  it('index.css mengandung section "Interactive Elements" dengan cursor rules', () => {
    const cssPath = resolve(__dirname, '../index.css')
    const cssContent = readFileSync(cssPath, 'utf-8')

    // Fix condition: ada section "Interactive Elements" di CSS
    const hasInteractiveSection = cssContent.includes('Interactive Elements')
    expect(hasInteractiveSection).toBe(true)
  })
})
