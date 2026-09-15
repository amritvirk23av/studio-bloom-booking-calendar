import { useCallback, useState } from 'react'
import { navigateAnchor } from '../lib/dateUtils'
import type { Resource, ViewMode } from '../types'

export function useCalendarView(resources: Resource[]) {
  const [viewMode, setViewModeRaw] = useState<ViewMode>('day')
  const [anchorDate, setAnchorDate] = useState(() => new Date())
  const [rawSelectedResourceId, setSelectedResourceId] = useState<string>('all')

  // Derived rather than synced via effect: if the raw selection points at a
  // staff member deleted in Admin, fall back to a valid one for this render.
  const selectedResourceId =
    rawSelectedResourceId === 'all' || resources.some((r) => r.id === rawSelectedResourceId)
      ? rawSelectedResourceId
      : (resources[0]?.id ?? 'all')

  // Week view is always scoped to one resource, so switching into it from
  // "All Staff" needs a concrete resource selected.
  const setViewMode = useCallback(
    (mode: ViewMode) => {
      setViewModeRaw(mode)
      if (mode === 'week') {
        setSelectedResourceId((id) => (id === 'all' ? (resources[0]?.id ?? 'all') : id))
      }
    },
    [resources],
  )

  const goToday = useCallback(() => setAnchorDate(new Date()), [])

  const goPrev = useCallback(
    () => setAnchorDate((d) => navigateAnchor(viewMode, d, -1)),
    [viewMode],
  )

  const goNext = useCallback(
    () => setAnchorDate((d) => navigateAnchor(viewMode, d, 1)),
    [viewMode],
  )

  const goToDate = useCallback((date: Date) => setAnchorDate(date), [])

  return {
    viewMode,
    setViewMode,
    anchorDate,
    selectedResourceId,
    setSelectedResourceId,
    goToday,
    goPrev,
    goNext,
    goToDate,
  }
}
