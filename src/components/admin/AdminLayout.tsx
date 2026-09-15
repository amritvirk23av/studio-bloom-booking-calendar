import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAppData } from '../../context/useAppData'

export type AdminTab = 'staff' | 'hours' | 'holidays'

const TABS: Array<{ id: AdminTab; label: string }> = [
  { id: 'staff', label: 'Staff' },
  { id: 'hours', label: 'Working Hours' },
  { id: 'holidays', label: 'Holidays' },
]

interface Props {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
  children: ReactNode
}

export function AdminLayout({ activeTab, onTabChange, children }: Props) {
  const { resetAll } = useAppData()

  return (
    <div className="flex h-screen flex-col bg-cream-50">
      <header className="flex flex-wrap items-center gap-3 border-b border-cream-300 bg-cream-100/80 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">
            Studio Bloom
          </h1>
          <span className="hidden text-sm text-ink-400 sm:inline">Admin</span>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all demo data — staff, working hours, holidays, and appointments — back to defaults?')) {
                resetAll()
              }
            }}
            className="rounded-full border border-cream-300 bg-white px-3 py-1.5 text-sm text-ink-400 shadow-sm hover:bg-cream-200 hover:text-ink-700"
          >
            Reset all demo data
          </button>
          <Link
            to="/"
            className="rounded-full bg-ink-900 px-3.5 py-1.5 text-sm font-medium text-cream-50 shadow-sm hover:bg-ink-700"
          >
            ← Back to calendar
          </Link>
        </div>
      </header>

      <div className="flex items-center gap-1 border-b border-cream-300 bg-cream-100/50 px-5 py-2 sm:px-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-bloom-500 text-white shadow-sm'
                : 'text-ink-700 hover:bg-cream-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-5 py-6 sm:px-8">
        <div className="mx-auto max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
