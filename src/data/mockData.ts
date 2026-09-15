import { addDays, format, setHours, setMinutes, startOfWeek } from 'date-fns'
import type { Appointment, DayHours, Holiday, Resource, Service, WorkingHours } from '../types'

export function buildSeedResources(): Resource[] {
  return [
    { id: 'staff-1', name: 'Maren Osei', role: 'Massage Therapist', color: 'bloom', initials: 'MO' },
    { id: 'staff-2', name: 'Elin Vasquez', role: 'Esthetician', color: 'sage', initials: 'EV' },
    { id: 'staff-3', name: 'Priya Nandan', role: 'Acupuncturist', color: 'ochre', initials: 'PN' },
    { id: 'staff-4', name: 'Jonah Reyes', role: 'Physiotherapist', color: 'dusk', initials: 'JR' },
  ]
}

const WEEKDAY: DayHours = { closed: false, openTime: '08:00', closeTime: '20:00' }
const SATURDAY: DayHours = { closed: false, openTime: '09:00', closeTime: '17:00' }
const CLOSED: DayHours = { closed: true, openTime: '09:00', closeTime: '17:00' }

/** Keyed by Date.getDay(): 0=Sun .. 6=Sat. Mon-Fri normal hours, shorter Saturday, closed Sunday. */
export function buildSeedWorkingHours(): WorkingHours {
  return {
    0: CLOSED,
    1: WEEKDAY,
    2: WEEKDAY,
    3: WEEKDAY,
    4: WEEKDAY,
    5: WEEKDAY,
    6: SATURDAY,
  }
}

/** One holiday a few days out so a demo visitor can see the closed-day state quickly, plus a fixed seasonal one. */
export function buildSeedHolidays(): Holiday[] {
  const upcoming = addDays(new Date(), 6)
  return [
    { id: 'holiday-1', date: format(upcoming, 'yyyy-MM-dd'), label: 'Staff Training Day' },
    { id: 'holiday-2', date: `${new Date().getFullYear()}-12-25`, label: 'Christmas Day' },
  ]
}

export const services: Service[] = [
  { id: 'svc-1', name: 'Signature Massage', durationMinutes: 60 },
  { id: 'svc-2', name: 'Express Facial', durationMinutes: 30 },
  { id: 'svc-3', name: 'Deep Tissue Massage', durationMinutes: 90 },
  { id: 'svc-4', name: 'Acupuncture Session', durationMinutes: 45 },
  { id: 'svc-5', name: 'Physio Consultation', durationMinutes: 30 },
  { id: 'svc-6', name: 'Hot Stone Therapy', durationMinutes: 75 },
]

const clientNames = [
  'Sofia Marlowe', 'Deshawn Price', 'Ines Bergman', 'Tobias Klein', 'Amara Osei',
  'Noor Haddad', 'Lucas Ferreira', 'Yuki Tanaka', 'Freya Lindqvist', 'Omar Salim',
  'Camille Dubois', 'Ravi Chandran', 'Isla McAllister', 'Marco Bellini', 'Aaliyah Grant',
]

function at(day: Date, hour: number, minute = 0): Date {
  return setMinutes(setHours(day, hour), minute)
}

function iso(date: Date): string {
  return date.toISOString()
}

/** Builds a fresh seeded appointment set anchored to the current week, so demo data is always relevant. */
export function buildSeedAppointments(): Appointment[] {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const mon = weekStart
  const tue = addDays(weekStart, 1)
  const wed = addDays(weekStart, 2)
  const thu = addDays(weekStart, 3)
  const fri = addDays(weekStart, 4)

  let clientIdx = 0
  const nextClient = () => clientNames[clientIdx++ % clientNames.length]

  const entries: Array<[string, string, Date, number, number]> = [
    // resourceId, serviceId, day, startHour, startMinute
    ['staff-1', 'svc-1', mon, 9, 0],
    ['staff-1', 'svc-3', mon, 11, 0],
    ['staff-1', 'svc-6', mon, 14, 30],
    ['staff-1', 'svc-1', tue, 10, 0],
    ['staff-1', 'svc-1', wed, 9, 30],
    ['staff-1', 'svc-3', thu, 13, 0],
    ['staff-1', 'svc-6', fri, 9, 0],

    ['staff-2', 'svc-2', mon, 9, 30],
    ['staff-2', 'svc-2', mon, 10, 30],
    ['staff-2', 'svc-2', tue, 9, 0],
    ['staff-2', 'svc-6', tue, 11, 0],
    ['staff-2', 'svc-2', wed, 14, 0],
    ['staff-2', 'svc-2', thu, 9, 30],
    ['staff-2', 'svc-6', fri, 13, 0],

    ['staff-3', 'svc-4', mon, 10, 0],
    ['staff-3', 'svc-4', tue, 13, 30],
    ['staff-3', 'svc-4', wed, 9, 0],
    ['staff-3', 'svc-4', wed, 15, 0],
    ['staff-3', 'svc-4', thu, 11, 0],
    ['staff-3', 'svc-4', fri, 10, 30],

    ['staff-4', 'svc-5', mon, 8, 30],
    ['staff-4', 'svc-5', tue, 14, 0],
    ['staff-4', 'svc-5', wed, 11, 30],
    ['staff-4', 'svc-5', thu, 8, 30],
    ['staff-4', 'svc-5', fri, 15, 30],
  ]

  return entries.map(([resourceId, serviceId, day, hour, minute], i) => {
    const service = services.find((s) => s.id === serviceId)!
    const start = at(day, hour, minute)
    const end = addMinutesToDate(start, service.durationMinutes)
    return {
      id: `seed-${i + 1}`,
      resourceId,
      serviceId,
      clientName: nextClient(),
      start: iso(start),
      end: iso(end),
      status: 'confirmed' as const,
    }
  })
}

function addMinutesToDate(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000)
}
