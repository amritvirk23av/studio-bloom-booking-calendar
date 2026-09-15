import { createContext } from 'react'
import type { AppDataValue } from './AppDataContext'

export const AppDataContext = createContext<AppDataValue | null>(null)
