import { useEffect } from 'react'
import { formatTime } from '../lib/dateUtils'
import type { Appointment } from '../types'

interface Props {
  conflict: Appointment | null
  onDismiss: () => void
}

export function ConflictToast({ conflict, onDismiss }: Props) {
  useEffect(() => {
    if (!conflict) return
    const timer = setTimeout(onDismiss, 3500)
    return () => clearTimeout(timer)
  }, [conflict, onDismiss])

  if (!conflict) return null

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink-900 px-4 py-2 text-sm text-white shadow-lg">
      Can't reschedule — conflicts with {conflict.clientName}'s appointment at{' '}
      {formatTime(conflict.start)}.
    </div>
  )
}
