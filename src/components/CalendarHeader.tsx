import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatRangeLabel } from '../lib/dateUtils'
import type { Holiday, Resource, ViewMode, WorkingHours } from '../types'
import { DatePickerPopover } from './DatePickerPopover'

interface Props {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  anchorDate: Date
  resources: Resource[]
  workingHours: WorkingHours
  holidays: Holiday[]
  selectedResourceId: string
  setSelectedResourceId: (id: string) => void
  goPrev: () => void
  goNext: () => void
  goToday: () => void
  goToDate: (date: Date) => void
  onReset: () => void
}

function CalendarGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4 text-ink-400" aria-hidden="true">
      <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 8h14" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 2.5v3M13 2.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function CalendarHeader({
  viewMode,
  setViewMode,
  anchorDate,
  resources,
  workingHours,
  holidays,
  selectedResourceId,
  setSelectedResourceId,
  goPrev,
  goNext,
  goToday,
  goToDate,
  onReset,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pickerOpen) return
    function handlePointerDown(e: PointerEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [pickerOpen])

  return (
    <header className="relative z-20 flex flex-wrap items-center gap-3 border-b border-cream-300 bg-cream-100/80 px-5 py-4 backdrop-blur-sm sm:px-8">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">
          Studio Bloom
        </h1>
        <span className="hidden text-sm text-ink-400 sm:inline">Booking Calendar</span>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1 rounded-full border border-cream-300 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous"
            className="grid size-7 place-items-center rounded-full text-ink-700 hover:bg-cream-200"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-full px-3 py-1 text-sm font-medium text-ink-700 hover:bg-cream-200"
          >
            Today
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next"
            className="grid size-7 place-items-center rounded-full text-ink-700 hover:bg-cream-200"
          >
            ›
          </button>
        </div>

        <div className="relative" ref={pickerRef}>
          <button
            type="button"
            onClick={() => setPickerOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium text-ink-700 hover:bg-cream-200 sm:text-base"
          >
            <CalendarGlyph />
            {formatRangeLabel(viewMode, anchorDate)}
          </button>
          {pickerOpen && (
            <DatePickerPopover
              selected={anchorDate}
              viewMode={viewMode}
              workingHours={workingHours}
              holidays={holidays}
              onSelect={(date) => {
                goToDate(date)
                setPickerOpen(false)
              }}
            />
          )}
        </div>

        <select
          value={selectedResourceId}
          onChange={(e) => setSelectedResourceId(e.target.value)}
          className="rounded-full border border-cream-300 bg-white px-3 py-1.5 text-sm text-ink-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-bloom-400"
        >
          {viewMode === 'day' && <option value="all">All Staff</option>}
          {resources.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 rounded-full border border-cream-300 bg-white p-1 shadow-sm">
          {(['day', 'week'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors ${
                viewMode === mode
                  ? 'bg-bloom-500 text-white shadow-sm'
                  : 'text-ink-700 hover:bg-cream-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-cream-300 bg-white px-3 py-1.5 text-sm text-ink-400 shadow-sm hover:bg-cream-200 hover:text-ink-700"
        >
          Reset demo data
        </button>

        <Link
          to="/admin"
          className="rounded-full bg-ink-900 px-3.5 py-1.5 text-sm font-medium text-cream-50 shadow-sm hover:bg-ink-700"
        >
          Admin
        </Link>
      </div>
    </header>
  )
}
