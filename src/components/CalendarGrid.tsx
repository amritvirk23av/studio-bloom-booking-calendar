import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  dayHoursFor,
  getBusinessWindow,
  holidayFor,
  isSlotWithinDayHours,
  type BusinessWindow,
} from '../lib/businessHours'
import { hasConflict } from '../lib/conflictDetection'
import {
  formatDayHeader,
  getDaySlots,
  getWeekDays,
  isToday as isTodayFn,
  SLOT_HEIGHT_PX,
  slotsPerDay,
} from '../lib/dateUtils'
import { resourceColorClasses } from '../lib/resourceColors'
import type { MutationResult } from '../hooks/useAppointments'
import type { Appointment, DayHours, Holiday, Resource, Service, ViewMode, WorkingHours } from '../types'
import { AppointmentCard } from './AppointmentCard'
import { ColumnHeader } from './ColumnHeader'
import { TimeAxis } from './TimeAxis'
import { TimeSlotCell } from './TimeSlotCell'

interface Props {
  viewMode: ViewMode
  anchorDate: Date
  selectedResourceId: string
  resources: Resource[]
  services: Service[]
  workingHours: WorkingHours
  holidays: Holiday[]
  appointments: Appointment[]
  reschedule: (id: string, resourceId: string, newStart: Date) => MutationResult
  onSlotClick: (resourceId: string, slotStart: Date) => void
  onAppointmentClick: (appointment: Appointment) => void
  onConflict: (conflict: Appointment) => void
}

interface OverSlot {
  resourceId: string
  slotStart: Date
}

interface Column {
  key: string
  resourceId: string
  date: Date
  headerLabel: string
  headerSublabel?: string
  colorDotClass?: string
  isToday: boolean
  closed: boolean
  closedLabel?: string
  dayHours: DayHours
  slots: Date[]
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function closedLabelFor(dayHours: DayHours, holiday: Holiday | undefined): string | undefined {
  if (holiday) return holiday.label
  if (dayHours.closed) return 'Closed'
  return undefined
}

export function CalendarGrid({
  viewMode,
  anchorDate,
  selectedResourceId,
  resources,
  services,
  workingHours,
  holidays,
  appointments,
  reschedule,
  onSlotClick,
  onAppointmentClick,
  onConflict,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null)
  const [overSlot, setOverSlot] = useState<OverSlot | null>(null)

  const businessWindow: BusinessWindow = useMemo(
    () => getBusinessWindow(workingHours),
    [workingHours],
  )

  const columns = useMemo<Column[]>(() => {
    if (viewMode === 'day') {
      const visibleResources =
        selectedResourceId === 'all'
          ? resources
          : resources.filter((r) => r.id === selectedResourceId)
      const dayHours = dayHoursFor(anchorDate, workingHours)
      const holiday = holidayFor(anchorDate, holidays)
      const slots = getDaySlots(anchorDate, businessWindow)
      return visibleResources.map((resource) => ({
        key: resource.id,
        resourceId: resource.id,
        date: anchorDate,
        headerLabel: resource.name,
        headerSublabel: resource.role,
        colorDotClass: resourceColorClasses(resource.color).dot,
        isToday: isTodayFn(anchorDate),
        closed: dayHours.closed || !!holiday,
        closedLabel: closedLabelFor(dayHours, holiday),
        dayHours,
        slots,
      }))
    }

    const resource = resources.find((r) => r.id === selectedResourceId) ?? resources[0]
    return getWeekDays(anchorDate).map((day) => {
      const dayHours = dayHoursFor(day, workingHours)
      const holiday = holidayFor(day, holidays)
      return {
        key: day.toISOString(),
        resourceId: resource?.id ?? '',
        date: day,
        headerLabel: formatDayHeader(day),
        isToday: isTodayFn(day),
        closed: dayHours.closed || !!holiday,
        closedLabel: closedLabelFor(dayHours, holiday),
        dayHours,
        slots: getDaySlots(day, businessWindow),
      }
    })
  }, [viewMode, anchorDate, selectedResourceId, resources, workingHours, holidays, businessWindow])

  const appointmentsByResource = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    for (const appt of appointments) {
      const list = map.get(appt.resourceId) ?? []
      list.push(appt)
      map.set(appt.resourceId, list)
    }
    return map
  }, [appointments])

  const serviceFor = (appt: Appointment) => services.find((s) => s.id === appt.serviceId)!
  const resourceFor = (id: string) => resources.find((r) => r.id === id)!

  function handleDragStart(event: DragStartEvent) {
    const appt = event.active.data.current?.appointment as Appointment | undefined
    setActiveAppointment(appt ?? null)
  }

  function handleDragOver(event: DragOverEvent) {
    const data = event.over?.data.current as OverSlot | undefined
    setOverSlot(data ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const appt = activeAppointment
    const data = event.over?.data.current as OverSlot | undefined
    setActiveAppointment(null)
    setOverSlot(null)
    if (!appt || !data) return
    const result = reschedule(appt.id, data.resourceId, data.slotStart)
    if (!result.ok && result.conflict) onConflict(result.conflict)
  }

  function handleDragCancel() {
    setActiveAppointment(null)
    setOverSlot(null)
  }

  const dragConflict = useMemo(() => {
    if (!activeAppointment || !overSlot) return false
    const durationMs =
      new Date(activeAppointment.end).getTime() - new Date(activeAppointment.start).getTime()
    const start = overSlot.slotStart.toISOString()
    const end = new Date(overSlot.slotStart.getTime() + durationMs).toISOString()
    return hasConflict(appointments, { resourceId: overSlot.resourceId, start, end }, activeAppointment.id)
  }, [activeAppointment, overSlot, appointments])

  const gridHeight = slotsPerDay(businessWindow) * SLOT_HEIGHT_PX

  // Working hours are studio-wide, so a closed day view applies to every staff
  // column at once — show one banner instead of repeating "Closed" per column.
  if (viewMode === 'day' && columns.length > 0 && columns[0].closed) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="rounded-2xl border border-cream-300 bg-white px-8 py-10 text-center shadow-sm">
          <p className="font-display text-lg font-semibold text-ink-900">Studio Bloom is closed</p>
          <p className="mt-1 text-sm text-ink-400">{columns[0].closedLabel}</p>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex flex-1 overflow-auto">
        <TimeAxis businessWindow={businessWindow} />
        <div className="flex flex-1">
          {columns.map((col) => (
            <div key={col.key} className="min-w-[9rem] flex-1">
              <ColumnHeader
                label={col.headerLabel}
                sublabel={col.closed ? col.closedLabel : col.headerSublabel}
                isToday={col.isToday}
                colorDotClass={col.colorDotClass}
                closed={col.closed}
              />
              {col.closed ? (
                <div
                  className="grid place-items-center border-l border-cream-200 text-xs font-medium text-ink-400 first:border-l-0"
                  style={{
                    height: gridHeight,
                    backgroundImage:
                      'repeating-linear-gradient(135deg, #f4ead9 0px, #f4ead9 6px, transparent 6px, transparent 12px)',
                  }}
                >
                  {col.closedLabel}
                </div>
              ) : (
                <div className="relative border-l border-cream-200 first:border-l-0" style={{ height: gridHeight }}>
                  {col.slots.map((slot, i) => (
                    <TimeSlotCell
                      key={slot.getTime()}
                      resourceId={col.resourceId}
                      slotStart={slot}
                      isHourStart={i % 4 === 0}
                      isHoverTarget={
                        !!overSlot &&
                        overSlot.resourceId === col.resourceId &&
                        overSlot.slotStart.getTime() === slot.getTime()
                      }
                      hoverConflict={dragConflict}
                      disabled={!isSlotWithinDayHours(slot, col.dayHours)}
                      onSlotClick={onSlotClick}
                    />
                  ))}
                  {(appointmentsByResource.get(col.resourceId) ?? [])
                    .filter((appt) => isSameCalendarDay(new Date(appt.start), col.date))
                    .map((appt) => (
                      <AppointmentCard
                        key={appt.id}
                        appointment={appt}
                        service={serviceFor(appt)}
                        resource={resourceFor(appt.resourceId)}
                        businessWindow={businessWindow}
                        onClick={() => onAppointmentClick(appt)}
                      />
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeAppointment ? (
          <AppointmentCard
            appointment={activeAppointment}
            service={serviceFor(activeAppointment)}
            resource={resourceFor(activeAppointment.resourceId)}
            businessWindow={businessWindow}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
