import { useDroppable } from '@dnd-kit/core'

interface Props {
  resourceId: string
  slotStart: Date
  isHourStart: boolean
  isHoverTarget: boolean
  hoverConflict: boolean
  disabled?: boolean
  onSlotClick: (resourceId: string, slotStart: Date) => void
}

export function TimeSlotCell({
  resourceId,
  slotStart,
  isHourStart,
  isHoverTarget,
  hoverConflict,
  disabled,
  onSlotClick,
}: Props) {
  const { setNodeRef } = useDroppable({
    id: `slot-${resourceId}-${slotStart.getTime()}`,
    data: { resourceId, slotStart },
    disabled,
  })

  const hoverClass = isHoverTarget
    ? hoverConflict
      ? 'bg-bloom-500/25'
      : 'bg-sage-500/25'
    : disabled
      ? ''
      : 'hover:bg-cream-200/60'

  return (
    <div
      ref={setNodeRef}
      onClick={disabled ? undefined : () => onSlotClick(resourceId, slotStart)}
      title={disabled ? 'Outside working hours' : undefined}
      className={`h-4 border-b border-cream-200 ${isHourStart ? 'border-t border-t-cream-300' : ''} ${
        disabled ? 'cursor-not-allowed bg-[#e2ddd3]' : ''
      } ${hoverClass}`}
    />
  )
}
