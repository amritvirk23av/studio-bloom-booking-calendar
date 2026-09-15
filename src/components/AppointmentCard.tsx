import type { CSSProperties } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { BusinessWindow } from '../lib/businessHours'
import { durationPx, formatTime, slotTopPx } from '../lib/dateUtils'
import { resourceColorClasses } from '../lib/resourceColors'
import type { Appointment, Resource, Service } from '../types'

interface Props {
  appointment: Appointment
  service: Service
  resource: Resource
  businessWindow: BusinessWindow
  onClick?: () => void
  isOverlay?: boolean
}

export function AppointmentCard({
  appointment,
  service,
  resource,
  businessWindow,
  onClick,
  isOverlay,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: appointment.id,
    data: { appointment },
    disabled: isOverlay,
  })

  const colors = resourceColorClasses(resource.color)
  const height = durationPx(appointment.start, appointment.end)

  const style: CSSProperties = isOverlay
    ? { height }
    : {
        position: 'absolute',
        top: slotTopPx(new Date(appointment.start), businessWindow),
        height,
        left: 4,
        right: 4,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.35 : 1,
        zIndex: isDragging ? 20 : 1,
      }

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={style}
      className={`overflow-hidden rounded-lg border-l-[3px] px-2 py-1 text-left text-xs shadow-sm transition-shadow hover:shadow-md hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-bloom-400 ${colors.card} ${
        isOverlay ? 'w-56 cursor-grabbing shadow-lg' : 'cursor-grab'
      }`}
    >
      <p className="truncate font-semibold leading-tight">{appointment.clientName}</p>
      <p className="truncate leading-tight opacity-80">{service.name}</p>
      <p className="truncate leading-tight opacity-70">{formatTime(appointment.start)}</p>
    </button>
  )
}
