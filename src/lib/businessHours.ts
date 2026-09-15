import { format } from 'date-fns'
import type { DayHours, Holiday, WorkingHours } from '../types'

export interface BusinessWindow {
  startHour: number
  endHour: number
}

const FALLBACK_WINDOW: BusinessWindow = { startHour: 8, endHour: 20 }

function parseHour(time: string): number {
  const [hour, minute] = time.split(':').map(Number)
  return hour + minute / 60
}

export function dayHoursFor(date: Date, workingHours: WorkingHours): DayHours {
  return workingHours[date.getDay()] ?? { closed: true, openTime: '09:00', closeTime: '17:00' }
}

export function holidayFor(date: Date, holidays: Holiday[]): Holiday | undefined {
  const key = format(date, 'yyyy-MM-dd')
  return holidays.find((h) => h.date === key)
}

export function isDayClosed(date: Date, workingHours: WorkingHours, holidays: Holiday[]): boolean {
  return dayHoursFor(date, workingHours).closed || holidayFor(date, holidays) !== undefined
}

/** The widest open window across all non-closed days, so a shared time axis fits every day's hours. */
export function getBusinessWindow(workingHours: WorkingHours): BusinessWindow {
  const openDays = Object.values(workingHours).filter((d) => !d.closed)
  if (openDays.length === 0) return FALLBACK_WINDOW

  const startHour = Math.min(...openDays.map((d) => Math.floor(parseHour(d.openTime))))
  const endHour = Math.max(...openDays.map((d) => Math.ceil(parseHour(d.closeTime))))
  return { startHour, endHour }
}

/** Whether `date` (a specific slot instant) falls within that day's own open hours. */
export function isSlotWithinDayHours(date: Date, dayHours: DayHours): boolean {
  if (dayHours.closed) return false
  const hour = date.getHours() + date.getMinutes() / 60
  return hour >= parseHour(dayHours.openTime) && hour < parseHour(dayHours.closeTime)
}
