import { useCallback, type ReactNode } from 'react'
import { services } from '../data/mockData'
import { useAppointments } from '../hooks/useAppointments'
import { useHolidays } from '../hooks/useHolidays'
import { useResources } from '../hooks/useResources'
import { useWorkingHours } from '../hooks/useWorkingHours'
import { AppDataContext } from './appDataContextInstance'

function useAppDataValue() {
  const appointmentsApi = useAppointments()
  const resourcesApi = useResources()
  const workingHoursApi = useWorkingHours()
  const holidaysApi = useHolidays()

  const resetAll = useCallback(() => {
    appointmentsApi.resetAppointmentsToSeed()
    resourcesApi.resetResourcesToSeed()
    workingHoursApi.resetWorkingHoursToSeed()
    holidaysApi.resetHolidaysToSeed()
  }, [appointmentsApi, resourcesApi, workingHoursApi, holidaysApi])

  return {
    ...appointmentsApi,
    ...resourcesApi,
    ...workingHoursApi,
    ...holidaysApi,
    services,
    resetAll,
  }
}

export type AppDataValue = ReturnType<typeof useAppDataValue>

export function AppDataProvider({ children }: { children: ReactNode }) {
  const value = useAppDataValue()
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}
