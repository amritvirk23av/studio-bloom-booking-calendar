import { format } from 'date-fns'
import { useState, type FormEvent } from 'react'
import { services } from '../data/mockData'
import type { MutationResult } from '../hooks/useAppointments'
import type { Resource } from '../types'

interface Slot {
  resourceId: string
  slotStart: Date
}

interface Props {
  slot: Slot | null
  resources: Resource[]
  onClose: () => void
  onCreate: (input: {
    resourceId: string
    serviceId: string
    clientName: string
    clientPhone?: string
    start: Date
  }) => MutationResult
}

/** Parent must remount this on a fresh `key` per slot so form state below starts clean per-open. */
export function QuickCreateModal({ slot, resources, onClose, onCreate }: Props) {
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [serviceId, setServiceId] = useState(services[0].id)
  const [resourceId, setResourceId] = useState(slot?.resourceId ?? '')
  const [error, setError] = useState<string | null>(null)

  if (!slot) return null
  const currentSlot = slot

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!clientName.trim()) {
      setError('Client name is required')
      return
    }
    const result = onCreate({
      resourceId,
      serviceId,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || undefined,
      start: currentSlot.slotStart,
    })
    if (!result.ok) {
      setError(
        result.conflict
          ? `Conflicts with ${result.conflict.clientName}'s appointment`
          : 'Could not book this slot',
      )
      return
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink-900/30 p-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
      >
        <h2 className="font-display text-lg font-semibold text-ink-900">New appointment</h2>
        <p className="mb-4 text-xs text-ink-400">
          {format(slot.slotStart, 'EEEE, MMM d · h:mm a')}
        </p>

        <label className="mb-3 block text-sm">
          <span className="mb-1 block text-ink-500">Client name</span>
          <input
            autoFocus
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-400"
            placeholder="Jane Doe"
          />
        </label>

        <label className="mb-3 block text-sm">
          <span className="mb-1 block text-ink-500">Phone (optional)</span>
          <input
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-400"
            placeholder="(555) 555-0123"
          />
        </label>

        <label className="mb-3 block text-sm">
          <span className="mb-1 block text-ink-500">Service</span>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-400"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.durationMinutes} min
              </option>
            ))}
          </select>
        </label>

        <label className="mb-1 block text-sm">
          <span className="mb-1 block text-ink-500">Staff</span>
          <select
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-400"
          >
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="mt-2 text-xs text-bloom-600">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1.5 text-sm text-ink-500 hover:bg-cream-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-bloom-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-bloom-600"
          >
            Book
          </button>
        </div>
      </form>
    </div>
  )
}
