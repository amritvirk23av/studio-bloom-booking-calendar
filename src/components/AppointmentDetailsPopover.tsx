import { services } from '../data/mockData'
import { formatTime } from '../lib/dateUtils'
import { resourceColorClasses } from '../lib/resourceColors'
import type { Appointment, Resource } from '../types'

interface Props {
  appointment: Appointment | null
  resources: Resource[]
  onClose: () => void
  onCancel: (id: string) => void
}

export function AppointmentDetailsPopover({ appointment, resources, onClose, onCancel }: Props) {
  if (!appointment) return null

  const service = services.find((s) => s.id === appointment.serviceId)!
  const resource = resources.find((r) => r.id === appointment.resourceId)

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink-900/30 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
      >
        <div className="flex items-center gap-2">
          {resource && (
            <span className={`size-2.5 rounded-full ${resourceColorClasses(resource.color).dot}`} />
          )}
          <h2 className="font-display text-lg font-semibold text-ink-900">
            {appointment.clientName}
          </h2>
        </div>

        <dl className="mt-3 space-y-1.5 text-sm text-ink-700">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-400">Service</dt>
            <dd>{service.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-400">With</dt>
            <dd>{resource?.name ?? 'Unassigned'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-400">Time</dt>
            <dd>
              {formatTime(appointment.start)} – {formatTime(appointment.end)}
            </dd>
          </div>
          {appointment.clientPhone && (
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Phone</dt>
              <dd>{appointment.clientPhone}</dd>
            </div>
          )}
        </dl>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1.5 text-sm text-ink-500 hover:bg-cream-100"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onCancel(appointment.id)
              onClose()
            }}
            className="rounded-full bg-bloom-500/10 px-4 py-1.5 text-sm font-medium text-bloom-600 hover:bg-bloom-500/20"
          >
            Cancel appointment
          </button>
        </div>
      </div>
    </div>
  )
}
