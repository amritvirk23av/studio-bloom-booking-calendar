import { format, parseISO } from 'date-fns'
import { useState, type FormEvent } from 'react'
import { useAppData } from '../../context/useAppData'

export function HolidaysSection() {
  const { holidays, addHoliday, removeHoliday } = useAppData()
  const [date, setDate] = useState('')
  const [label, setLabel] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!date || !label.trim()) return
    addHoliday({ date, label: label.trim() })
    setDate('')
    setLabel('')
  }

  return (
    <div>
      <h2 className="mb-1 font-display text-lg font-semibold text-ink-900">Holidays</h2>
      <p className="mb-4 text-sm text-ink-400">
        Studio-wide closed dates. The calendar shows the whole studio as closed on these days.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mb-5 flex flex-wrap items-end gap-3 rounded-2xl border border-cream-300 bg-white p-4 shadow-sm"
      >
        <label className="text-sm">
          <span className="mb-1 block text-ink-500">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-cream-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-400"
          />
        </label>
        <label className="flex-1 text-sm">
          <span className="mb-1 block text-ink-500">Label</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Christmas Day"
            className="w-full rounded-lg border border-cream-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-400"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-bloom-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-bloom-600"
        >
          Add holiday
        </button>
      </form>

      {holidays.length === 0 ? (
        <p className="text-sm text-ink-400">No holidays added.</p>
      ) : (
        <ul className="space-y-2">
          {holidays.map((holiday) => (
            <li
              key={holiday.id}
              className="flex items-center gap-3 rounded-xl border border-cream-300 bg-white px-4 py-3 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">{holiday.label}</p>
                <p className="text-xs text-ink-400">{format(parseISO(holiday.date), 'EEEE, MMMM d, yyyy')}</p>
              </div>
              <button
                type="button"
                onClick={() => removeHoliday(holiday.id)}
                className="rounded-full px-3 py-1 text-xs font-medium text-bloom-600 hover:bg-bloom-500/10"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
