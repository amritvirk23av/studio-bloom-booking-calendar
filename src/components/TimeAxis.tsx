import type { BusinessWindow } from '../lib/businessHours'
import { SLOT_HEIGHT_PX, SLOT_MINUTES, slotsPerDay } from '../lib/dateUtils'

function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour} ${period}`
}

interface Props {
  businessWindow: BusinessWindow
}

export function TimeAxis({ businessWindow }: Props) {
  const slotsPerHour = 60 / SLOT_MINUTES
  const hours = Array.from(
    { length: businessWindow.endHour - businessWindow.startHour },
    (_, i) => businessWindow.startHour + i,
  )
  const gridHeight = slotsPerDay(businessWindow) * SLOT_HEIGHT_PX

  return (
    <div className="sticky left-0 z-20 w-14 shrink-0 bg-cream-50">
      <div className="sticky top-0 z-20 h-14 border-b border-cream-300 bg-cream-50" />
      <div className="relative" style={{ height: gridHeight }}>
        {hours.map((hour) => (
          <div
            key={hour}
            className="absolute right-2 -translate-y-1/2 whitespace-nowrap text-[11px] text-ink-400"
            style={{ top: (hour - businessWindow.startHour) * slotsPerHour * SLOT_HEIGHT_PX }}
          >
            {formatHourLabel(hour)}
          </div>
        ))}
      </div>
    </div>
  )
}
