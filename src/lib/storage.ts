import { buildSeedAppointments, buildSeedHolidays, buildSeedResources, buildSeedWorkingHours } from '../data/mockData'
import type { Appointment, Holiday, Resource, WorkingHours } from '../types'

const APPOINTMENTS_KEY = 'booking-calendar:appointments'
const RESOURCES_KEY = 'booking-calendar:resources'
const WORKING_HOURS_KEY = 'booking-calendar:workingHours'
const HOLIDAYS_KEY = 'booking-calendar:holidays'

function isNonEmptyArray(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0
}

function isPlainObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function loadJSON<T>(key: string, seedFn: () => T, isValid: (value: unknown) => boolean): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return seedFn()
    const parsed = JSON.parse(raw)
    if (!isValid(parsed)) return seedFn()
    return parsed as T
  } catch {
    return seedFn()
  }
}

function saveJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function resetJSON<T>(key: string, seedFn: () => T): T {
  localStorage.removeItem(key)
  const seeded = seedFn()
  saveJSON(key, seeded)
  return seeded
}

export function loadAppointments(): Appointment[] {
  return loadJSON(APPOINTMENTS_KEY, buildSeedAppointments, isNonEmptyArray)
}
export function saveAppointments(appointments: Appointment[]): void {
  saveJSON(APPOINTMENTS_KEY, appointments)
}
export function resetAppointments(): Appointment[] {
  return resetJSON(APPOINTMENTS_KEY, buildSeedAppointments)
}

export function loadResources(): Resource[] {
  return loadJSON(RESOURCES_KEY, buildSeedResources, isNonEmptyArray)
}
export function saveResources(resources: Resource[]): void {
  saveJSON(RESOURCES_KEY, resources)
}
export function resetResources(): Resource[] {
  return resetJSON(RESOURCES_KEY, buildSeedResources)
}

export function loadWorkingHours(): WorkingHours {
  return loadJSON(WORKING_HOURS_KEY, buildSeedWorkingHours, isPlainObject)
}
export function saveWorkingHours(workingHours: WorkingHours): void {
  saveJSON(WORKING_HOURS_KEY, workingHours)
}
export function resetWorkingHours(): WorkingHours {
  return resetJSON(WORKING_HOURS_KEY, buildSeedWorkingHours)
}

export function loadHolidays(): Holiday[] {
  return loadJSON(HOLIDAYS_KEY, buildSeedHolidays, (v) => Array.isArray(v))
}
export function saveHolidays(holidays: Holiday[]): void {
  saveJSON(HOLIDAYS_KEY, holidays)
}
export function resetHolidays(): Holiday[] {
  return resetJSON(HOLIDAYS_KEY, buildSeedHolidays)
}
