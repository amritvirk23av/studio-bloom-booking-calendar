import type { Appointment } from '../types'

export interface AppointmentCandidate {
  resourceId: string
  start: string
  end: string
}

/** Returns the first existing appointment that overlaps `candidate` on the same resource, if any. */
export function findConflict(
  appointments: Appointment[],
  candidate: AppointmentCandidate,
  excludeId?: string,
): Appointment | undefined {
  const candidateStart = new Date(candidate.start).getTime()
  const candidateEnd = new Date(candidate.end).getTime()

  return appointments.find((existing) => {
    if (existing.id === excludeId) return false
    if (existing.status === 'cancelled') return false
    if (existing.resourceId !== candidate.resourceId) return false

    const existingStart = new Date(existing.start).getTime()
    const existingEnd = new Date(existing.end).getTime()
    return existingStart < candidateEnd && existingEnd > candidateStart
  })
}

export function hasConflict(
  appointments: Appointment[],
  candidate: AppointmentCandidate,
  excludeId?: string,
): boolean {
  return findConflict(appointments, candidate, excludeId) !== undefined
}
