export const RESOURCE_COLORS = ['bloom', 'sage', 'ochre', 'dusk', 'lilac'] as const
export type ResourceColor = (typeof RESOURCE_COLORS)[number]

export interface Resource {
  id: string
  name: string
  role: string
  color: ResourceColor
  initials: string
}

export interface Service {
  id: string
  name: string
  durationMinutes: number
}

export type AppointmentStatus = 'confirmed' | 'cancelled'

export interface Appointment {
  id: string
  resourceId: string
  serviceId: string
  clientName: string
  clientPhone?: string
  start: string // ISO datetime
  end: string // ISO datetime
  status: AppointmentStatus
  notes?: string
}

export interface DayHours {
  closed: boolean
  openTime: string // "HH:mm"
  closeTime: string // "HH:mm"
}

/** Keyed by Date.getDay(): 0 = Sunday .. 6 = Saturday. */
export type WorkingHours = Record<number, DayHours>

export interface Holiday {
  id: string
  date: string // "yyyy-MM-dd"
  label: string
}

export type ViewMode = 'day' | 'week'

export interface ResourceFilter {
  kind: 'all' | 'single'
  resourceId?: string
}
