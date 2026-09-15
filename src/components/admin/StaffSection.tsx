import { useState, type FormEvent } from 'react'
import { useAppData } from '../../context/useAppData'
import { resourceColorClasses } from '../../lib/resourceColors'
import { RESOURCE_COLORS, type Resource, type ResourceColor } from '../../types'

interface FormState {
  name: string
  role: string
  color: ResourceColor
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? '').concat(parts[1]?.[0] ?? '').toUpperCase() || '??'
}

const EMPTY_FORM: FormState = { name: '', role: '', color: RESOURCE_COLORS[0] }

export function StaffSection() {
  const { resources, appointments, addResource, updateResource, removeResource, cancelAllForResource } =
    useAppData()
  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null)

  function startAdd() {
    setForm({ ...EMPTY_FORM, color: RESOURCE_COLORS[resources.length % RESOURCE_COLORS.length] })
    setEditingId('new')
    setFormError(null)
    setBlockedMessage(null)
  }

  function startEdit(resource: Resource) {
    setForm({ name: resource.name, role: resource.role, color: resource.color })
    setEditingId(resource.id)
    setFormError(null)
    setBlockedMessage(null)
  }

  function cancelForm() {
    setEditingId(null)
    setFormError(null)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.role.trim()) {
      setFormError('Name and role are both required.')
      return
    }

    if (editingId === 'new') {
      addResource({ name: form.name.trim(), role: form.role.trim(), color: form.color, initials: initialsFor(form.name) })
    } else if (editingId) {
      updateResource(editingId, {
        name: form.name.trim(),
        role: form.role.trim(),
        color: form.color,
        initials: initialsFor(form.name),
      })
    }
    setEditingId(null)
    setFormError(null)
  }

  function handleDelete(resource: Resource) {
    const activeCount = appointments.filter((a) => a.resourceId === resource.id).length
    const message =
      activeCount > 0
        ? `Delete ${resource.name}? This will cancel their ${activeCount} upcoming appointment${activeCount === 1 ? '' : 's'}.`
        : `Delete ${resource.name}?`
    if (!confirm(message)) return

    if (activeCount > 0) cancelAllForResource(resource.id)
    const removed = removeResource(resource.id)
    if (!removed) {
      setBlockedMessage('At least one staff member is required — add another before deleting this one.')
    } else {
      setBlockedMessage(null)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink-900">Staff</h2>
        {editingId === null && (
          <button
            type="button"
            onClick={startAdd}
            className="rounded-full bg-bloom-500 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-bloom-600"
          >
            Add employee
          </button>
        )}
      </div>

      {blockedMessage && resources.length <= 1 && (
        <p className="mb-4 text-sm text-bloom-600">{blockedMessage}</p>
      )}

      {editingId !== null && (
        <form
          onSubmit={handleSubmit}
          className="mb-5 rounded-2xl border border-cream-300 bg-white p-4 shadow-sm"
        >
          <label className="mb-3 block text-sm">
            <span className="mb-1 block text-ink-500">Name</span>
            <input
              autoFocus
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={`w-full rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-400 ${
                formError && !form.name.trim() ? 'border-bloom-400' : 'border-cream-300'
              }`}
              placeholder="Jane Doe"
            />
          </label>
          <label className="mb-3 block text-sm">
            <span className="mb-1 block text-ink-500">Role</span>
            <input
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className={`w-full rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-400 ${
                formError && !form.role.trim() ? 'border-bloom-400' : 'border-cream-300'
              }`}
              placeholder="Massage Therapist"
            />
          </label>
          <div className="mb-4 text-sm">
            <span className="mb-1.5 block text-ink-500">Color</span>
            <div className="flex gap-2">
              {RESOURCE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color }))}
                  aria-label={color}
                  className={`size-7 rounded-full ${resourceColorClasses(color).dot} ${
                    form.color === color ? 'ring-2 ring-ink-900 ring-offset-2 ring-offset-white' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {formError && <p className="mb-3 text-sm text-bloom-600">{formError}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-full px-3 py-1.5 text-sm text-ink-500 hover:bg-cream-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-bloom-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-bloom-600"
            >
              {editingId === 'new' ? 'Add' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-2">
        {resources.map((resource) => (
          <li
            key={resource.id}
            className="flex items-center gap-3 rounded-xl border border-cream-300 bg-white px-4 py-3 shadow-sm"
          >
            <span className={`size-3 shrink-0 rounded-full ${resourceColorClasses(resource.color).dot}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">{resource.name}</p>
              <p className="truncate text-xs text-ink-400">{resource.role}</p>
            </div>
            <button
              type="button"
              onClick={() => startEdit(resource)}
              className="rounded-full px-3 py-1 text-xs font-medium text-ink-500 hover:bg-cream-100"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(resource)}
              className="rounded-full px-3 py-1 text-xs font-medium text-bloom-600 hover:bg-bloom-500/10"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
