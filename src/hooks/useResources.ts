import { useCallback, useEffect, useState } from 'react'
import { loadResources, resetResources, saveResources } from '../lib/storage'
import type { Resource } from '../types'

export function useResources() {
  const [resources, setResources] = useState<Resource[]>(() => loadResources())

  useEffect(() => {
    saveResources(resources)
  }, [resources])

  const addResource = useCallback((input: Omit<Resource, 'id'>) => {
    const resource: Resource = { ...input, id: `staff-${crypto.randomUUID()}` }
    setResources((prev) => [...prev, resource])
  }, [])

  const updateResource = useCallback((id: string, patch: Partial<Omit<Resource, 'id'>>) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }, [])

  /** Returns false (and leaves state unchanged) if this would remove the last remaining staff member. */
  const removeResource = useCallback(
    (id: string): boolean => {
      if (resources.length <= 1) return false
      setResources((prev) => prev.filter((r) => r.id !== id))
      return true
    },
    [resources],
  )

  const resetResourcesToSeed = useCallback(() => {
    setResources(resetResources())
  }, [])

  return { resources, addResource, updateResource, removeResource, resetResourcesToSeed }
}
