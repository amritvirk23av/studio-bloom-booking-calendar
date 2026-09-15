import { useCallback, useEffect, useState } from 'react'
import { loadWorkingHours, resetWorkingHours, saveWorkingHours } from '../lib/storage'
import type { DayHours, WorkingHours } from '../types'

export function useWorkingHours() {
  const [workingHours, setWorkingHours] = useState<WorkingHours>(() => loadWorkingHours())

  useEffect(() => {
    saveWorkingHours(workingHours)
  }, [workingHours])

  const updateDay = useCallback((dayOfWeek: number, patch: Partial<DayHours>) => {
    setWorkingHours((prev) => ({
      ...prev,
      [dayOfWeek]: { ...prev[dayOfWeek], ...patch },
    }))
  }, [])

  const resetWorkingHoursToSeed = useCallback(() => {
    setWorkingHours(resetWorkingHours())
  }, [])

  return { workingHours, updateWorkingHoursDay: updateDay, resetWorkingHoursToSeed }
}
