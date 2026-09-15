import { useAppData } from '../../context/useAppData'

const DAY_ORDER: Array<{ dayOfWeek: number; label: string }> = [
  { dayOfWeek: 1, label: 'Monday' },
  { dayOfWeek: 2, label: 'Tuesday' },
  { dayOfWeek: 3, label: 'Wednesday' },
  { dayOfWeek: 4, label: 'Thursday' },
  { dayOfWeek: 5, label: 'Friday' },
  { dayOfWeek: 6, label: 'Saturday' },
  { dayOfWeek: 0, label: 'Sunday' },
]

export function WorkingHoursSection() {
  const { workingHours, updateWorkingHoursDay } = useAppData()

  return (
    <div>
      <h2 className="mb-1 font-display text-lg font-semibold text-ink-900">Working Hours</h2>
      <p className="mb-4 text-sm text-ink-400">
        Studio-wide hours per day. A closed day shows as closed for every staff member on the
        calendar.
      </p>

      <div className="overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-sm">
        {DAY_ORDER.map(({ dayOfWeek, label }, i) => {
          const hours = workingHours[dayOfWeek]
          return (
            <div
              key={dayOfWeek}
              className={`flex flex-wrap items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-cream-200' : ''}`}
            >
              <span className="w-24 shrink-0 text-sm font-medium text-ink-900">{label}</span>

              <label className="flex items-center gap-1.5 text-xs text-ink-500">
                <input
                  type="checkbox"
                  checked={!hours.closed}
                  onChange={(e) => updateWorkingHoursDay(dayOfWeek, { closed: !e.target.checked })}
                  className="size-4 accent-bloom-500"
                />
                Open
              </label>

              {!hours.closed && (
                <div className="flex items-center gap-2 text-sm text-ink-700">
                  <input
                    type="time"
                    value={hours.openTime}
                    onChange={(e) => updateWorkingHoursDay(dayOfWeek, { openTime: e.target.value })}
                    className="rounded-lg border border-cream-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-400"
                  />
                  <span className="text-ink-400">to</span>
                  <input
                    type="time"
                    value={hours.closeTime}
                    onChange={(e) => updateWorkingHoursDay(dayOfWeek, { closeTime: e.target.value })}
                    className="rounded-lg border border-cream-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-400"
                  />
                </div>
              )}
              {hours.closed && <span className="text-sm text-ink-400">Closed</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
