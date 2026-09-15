import { useCallback, useEffect, useState } from 'react'
import { findConflict } from '../lib/conflictDetection'
import { loadAppointments, resetAppointments, saveAppointments } from '../lib/storage'
import { services } from '../data/mockData'
import type { Appointment } from '../types'

export interface MutationResult {
  ok: boolean
  conflict?: Appointment
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadAppointments())

  useEffect(() => {
    saveAppointments(appointments)
  }, [appointments])

  const reschedule = useCallback(
    (id: string, resourceId: string, newStart: Date): MutationResult => {
      const existing = appointments.find((a) => a.id === id)
      if (!existing) return { ok: false }

      const durationMs = new Date(existing.end).getTime() - new Date(existing.start).getTime()
      const start = newStart.toISOString()
      const end = new Date(newStart.getTime() + durationMs).toISOString()

      const conflict = findConflict(appointments, { resourceId, start, end }, id)
      if (conflict) return { ok: false, conflict }

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, resourceId, start, end } : a)),
      )
      return { ok: true }
    },
    [appointments],
  )

  const create = useCallback(
    (input: {
      resourceId: string
      serviceId: string
      clientName: string
      clientPhone?: string
      start: Date
    }): MutationResult => {
      const service = services.find((s) => s.id === input.serviceId)
      if (!service) return { ok: false }

      const start = input.start.toISOString()
      const end = new Date(input.start.getTime() + service.durationMinutes * 60000).toISOString()

      const conflict = findConflict(appointments, { resourceId: input.resourceId, start, end })
      if (conflict) return { ok: false, conflict }

      const appointment: Appointment = {
        id: `apt-${crypto.randomUUID()}`,
        resourceId: input.resourceId,
        serviceId: input.serviceId,
        clientName: input.clientName,
        clientPhone: input.clientPhone,
        start,
        end,
        status: 'confirmed',
      }
      setAppointments((prev) => [...prev, appointment])
      return { ok: true }
    },
    [appointments],
  )

  const cancel = useCallback((id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a)),
    )
  }, [])

  const cancelAllForResource = useCallback((resourceId: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.resourceId === resourceId && a.status !== 'cancelled'
          ? { ...a, status: 'cancelled' as const }
          : a,
      ),
    )
  }, [])

  const resetAppointmentsToSeed = useCallback(() => {
    setAppointments(resetAppointments())
  }, [])

  return {
    appointments: appointments.filter((a) => a.status !== 'cancelled'),
    allAppointments: appointments,
    reschedule,
    createAppointment: create,
    cancelAppointment: cancel,
    cancelAllForResource,
    resetAppointmentsToSeed,
  }
}
