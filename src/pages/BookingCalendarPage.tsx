import { useState } from 'react'
import { AppointmentDetailsPopover } from '../components/AppointmentDetailsPopover'
import { CalendarGrid } from '../components/CalendarGrid'
import { CalendarHeader } from '../components/CalendarHeader'
import { ConflictToast } from '../components/ConflictToast'
import { QuickCreateModal } from '../components/QuickCreateModal'
import { useAppData } from '../context/useAppData'
import { useCalendarView } from '../hooks/useCalendarView'
import type { Appointment } from '../types'

interface CreateSlot {
  resourceId: string
  slotStart: Date
}

export function BookingCalendarPage() {
  const {
    appointments,
    resources,
    services,
    workingHours,
    holidays,
    reschedule,
    createAppointment,
    cancelAppointment,
    resetAll,
  } = useAppData()

  const {
    viewMode,
    setViewMode,
    anchorDate,
    selectedResourceId,
    setSelectedResourceId,
    goPrev,
    goNext,
    goToday,
    goToDate,
  } = useCalendarView(resources)

  const [createSlot, setCreateSlot] = useState<CreateSlot | null>(null)
  const [detailsAppointment, setDetailsAppointment] = useState<Appointment | null>(null)
  const [conflict, setConflict] = useState<Appointment | null>(null)

  return (
    <div className="flex h-screen flex-col bg-cream-50">
      <CalendarHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        anchorDate={anchorDate}
        resources={resources}
        workingHours={workingHours}
        holidays={holidays}
        selectedResourceId={selectedResourceId}
        setSelectedResourceId={setSelectedResourceId}
        goPrev={goPrev}
        goNext={goNext}
        goToday={goToday}
        goToDate={goToDate}
        onReset={resetAll}
      />

      <CalendarGrid
        viewMode={viewMode}
        anchorDate={anchorDate}
        selectedResourceId={selectedResourceId}
        resources={resources}
        services={services}
        workingHours={workingHours}
        holidays={holidays}
        appointments={appointments}
        reschedule={reschedule}
        onSlotClick={(resourceId, slotStart) => setCreateSlot({ resourceId, slotStart })}
        onAppointmentClick={setDetailsAppointment}
        onConflict={setConflict}
      />

      <QuickCreateModal
        key={createSlot ? `${createSlot.resourceId}-${createSlot.slotStart.getTime()}` : 'none'}
        slot={createSlot}
        resources={resources}
        onClose={() => setCreateSlot(null)}
        onCreate={createAppointment}
      />

      <AppointmentDetailsPopover
        appointment={detailsAppointment}
        resources={resources}
        onClose={() => setDetailsAppointment(null)}
        onCancel={cancelAppointment}
      />

      <ConflictToast conflict={conflict} onDismiss={() => setConflict(null)} />
    </div>
  )
}
