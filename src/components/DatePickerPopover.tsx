import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday as isTodayFn,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { useState } from 'react'
import { dayHoursFor, holidayFor } from '../lib/businessHours'
import type { Holiday, ViewMode, WorkingHours } from '../types'

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

interface Props {
  selected: Date
  viewMode: ViewMode
  workingHours: WorkingHours
  holidays: Holiday[]
  onSelect: (date: Date) => void
}

export function DatePickerPopover({ selected, viewMode, workingHours, holidays, onSelect }: Props) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selected))

  const gridStart = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 })
  const gridEnd = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })
  const selectedWeekStart = startOfWeek(selected, { weekStartsOn: 1 })

  function isHighlighted(day: Date): boolean {
    return viewMode === 'day'
      ? isSameDay(day, selected)
      : isSameDay(startOfWeek(day, { weekStartsOn: 1 }), selectedWeekStart)
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute left-0 top-full z-30 mt-2 w-64 rounded-2xl border border-cream-300 bg-white p-3 shadow-xl"
    >
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setVisibleMonth((m) => subMonths(m, 1))}
          aria-label="Previous month"
          className="grid size-6 place-items-center rounded-full text-ink-700 hover:bg-cream-100"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-ink-900">
          {format(visibleMonth, 'MMMM yyyy')}
        </span>
        <button
          type="button"
          onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
          aria-label="Next month"
          className="grid size-6 place-items-center rounded-full text-ink-700 hover:bg-cream-100"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[11px] text-ink-400">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-y-1 text-center text-sm">
        {days.map((day) => {
          const inMonth = isSameMonth(day, visibleMonth)
          const highlighted = isHighlighted(day)
          const today = isTodayFn(day)
          const holiday = holidayFor(day, holidays)
          const closed = holiday !== undefined || dayHoursFor(day, workingHours).closed

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelect(day)}
              title={holiday?.label}
              className={`relative mx-auto grid size-8 place-items-center rounded-full transition-colors ${
                highlighted
                  ? 'bg-bloom-500 text-white'
                  : today
                    ? 'border border-bloom-400 text-ink-900'
                    : closed
                      ? 'bg-cream-300/70 text-ink-500 hover:bg-cream-300'
                      : inMonth
                        ? 'text-ink-700 hover:bg-cream-100'
                        : 'text-ink-400/50 hover:bg-cream-100'
              }`}
            >
              {format(day, 'd')}
              {holiday && (
                <span
                  className={`absolute bottom-0.5 size-1 rounded-full ${
                    highlighted ? 'bg-white' : 'bg-bloom-500'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex items-center gap-3 border-t border-cream-200 pt-2 text-[11px] text-ink-400">
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded-full bg-cream-300" /> Closed
        </span>
        <span className="flex items-center gap-1">
          <span className="relative size-2.5 rounded-full bg-cream-100">
            <span className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-bloom-500" />
          </span>
          Holiday
        </span>
      </div>
    </div>
  )
}
