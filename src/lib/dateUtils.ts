import {
  addDays,
  addMinutes,
  format,
  isSameDay,
  isToday as dfIsToday,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  startOfWeek,
} from 'date-fns'
import type { BusinessWindow } from './businessHours'

export const SLOT_MINUTES = 15
export const SLOT_HEIGHT_PX = 16

export function slotsPerDay(window: BusinessWindow): number {
  return ((window.endHour - window.startHour) * 60) / SLOT_MINUTES
}

export function dayStartFor(date: Date, window: BusinessWindow): Date {
  return setMilliseconds(
    setSeconds(setMinutes(setHours(date, window.startHour), 0), 0),
    0,
  )
}

export function dayEndFor(date: Date, window: BusinessWindow): Date {
  return setMilliseconds(
    setSeconds(setMinutes(setHours(date, window.endHour), 0), 0),
    0,
  )
}

/** Every slot start time across the shared business window for the day containing `date`. */
export function getDaySlots(date: Date, window: BusinessWindow): Date[] {
  const start = dayStartFor(date, window)
  return Array.from({ length: slotsPerDay(window) }, (_, i) =>
    addMinutes(start, i * SLOT_MINUTES),
  )
}

/** The 7 days (Mon-Sun) of the week containing `anchorDate`. */
export function getWeekDays(anchorDate: Date): Date[] {
  const weekStart = startOfWeek(anchorDate, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

export function minutesFromDayStart(date: Date, window: BusinessWindow): number {
  const start = dayStartFor(date, window)
  return (date.getTime() - start.getTime()) / 60000
}

export function slotTopPx(date: Date, window: BusinessWindow): number {
  return (minutesFromDayStart(date, window) / SLOT_MINUTES) * SLOT_HEIGHT_PX
}

export function durationPx(startIso: string, endIso: string): number {
  const minutes = (new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000
  return (minutes / SLOT_MINUTES) * SLOT_HEIGHT_PX
}

export function formatHourLabel(date: Date): string {
  return format(date, 'h a')
}

export function formatDayHeader(date: Date): string {
  return format(date, 'EEE d')
}

export function formatTime(iso: string): string {
  return format(new Date(iso), 'h:mm a')
}

export function isToday(date: Date): boolean {
  return dfIsToday(date)
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return isSameDay(a, b)
}

export function formatRangeLabel(viewMode: 'day' | 'week', anchorDate: Date): string {
  if (viewMode === 'day') {
    return format(anchorDate, 'EEEE, MMMM d, yyyy')
  }
  const days = getWeekDays(anchorDate)
  const first = days[0]
  const last = days[6]
  const sameMonth = first.getMonth() === last.getMonth()
  return sameMonth
    ? `${format(first, 'MMM d')} – ${format(last, 'd, yyyy')}`
    : `${format(first, 'MMM d')} – ${format(last, 'MMM d, yyyy')}`
}

export function navigateAnchor(
  viewMode: 'day' | 'week',
  anchorDate: Date,
  direction: 1 | -1,
): Date {
  return addDays(anchorDate, direction * (viewMode === 'day' ? 1 : 7))
}
