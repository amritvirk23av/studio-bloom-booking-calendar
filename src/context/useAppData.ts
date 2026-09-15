import { useContext } from 'react'
import type { AppDataValue } from './AppDataContext'
import { AppDataContext } from './appDataContextInstance'

export function useAppData(): AppDataValue {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within an AppDataProvider')
  return ctx
}
