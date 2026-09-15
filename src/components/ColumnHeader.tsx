interface Props {
  label: string
  sublabel?: string
  isToday?: boolean
  colorDotClass?: string
  closed?: boolean
}

export function ColumnHeader({ label, sublabel, isToday, colorDotClass, closed }: Props) {
  return (
    <div
      className={`sticky top-0 z-10 flex h-14 flex-col items-center justify-center gap-0.5 border-b border-l border-cream-300 px-2 first:border-l-0 ${
        isToday ? 'bg-cream-200' : 'bg-cream-50'
      }`}
    >
      <div className="flex items-center gap-1.5">
        {colorDotClass && <span className={`size-2 rounded-full ${colorDotClass}`} />}
        <span className="truncate text-sm font-semibold text-ink-900">{label}</span>
      </div>
      {sublabel && (
        <span className={`truncate text-[11px] ${closed ? 'font-medium text-bloom-600' : 'text-ink-400'}`}>
          {sublabel}
        </span>
      )}
    </div>
  )
}
