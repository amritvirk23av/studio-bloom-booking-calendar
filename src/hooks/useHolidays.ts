import { useCallback, useEffect, useState } from 'react'
import { loadHolidays, resetHolidays, saveHolidays } from '../lib/storage'
import type { Holiday } from '../types'

export function useHolidays() {
  const [holidays, setHolidays] = useState<Holiday[]>(() => loadHolidays())

  useEffect(() => {
    saveHolidays(holidays)
  }, [holidays])

  const addHoliday = useCallback((input: { date: string; label: string }) => {
    const holiday: Holiday = { id: `holiday-${crypto.randomUUID()}`, ...input }
    setHolidays((prev) => [...prev, holiday].sort((a, b) => a.date.localeCompare(b.date)))
  }, [])

  const removeHoliday = useCallback((id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const resetHolidaysToSeed = useCallback(() => {
    setHolidays(resetHolidays())
  }, [])

  return { holidays, addHoliday, removeHoliday, resetHolidaysToSeed }
}
