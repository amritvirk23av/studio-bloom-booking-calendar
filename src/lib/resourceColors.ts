import type { Resource } from '../types'

interface ColorClasses {
  card: string
  chip: string
  dot: string
}

const colorMap: Record<Resource['color'], ColorClasses> = {
  bloom: {
    card: 'bg-bloom-400/15 border-bloom-500 text-bloom-600',
    chip: 'bg-bloom-500 text-white',
    dot: 'bg-bloom-500',
  },
  sage: {
    card: 'bg-sage-400/15 border-sage-500 text-sage-600',
    chip: 'bg-sage-500 text-white',
    dot: 'bg-sage-500',
  },
  ochre: {
    card: 'bg-ochre-400/15 border-ochre-400 text-ochre-600',
    chip: 'bg-ochre-400 text-white',
    dot: 'bg-ochre-400',
  },
  dusk: {
    card: 'bg-dusk-400/15 border-dusk-400 text-dusk-600',
    chip: 'bg-dusk-400 text-white',
    dot: 'bg-dusk-400',
  },
  lilac: {
    card: 'bg-lilac-400/15 border-lilac-400 text-lilac-600',
    chip: 'bg-lilac-400 text-white',
    dot: 'bg-lilac-400',
  },
}

export function resourceColorClasses(color: Resource['color']): ColorClasses {
  return colorMap[color]
}
