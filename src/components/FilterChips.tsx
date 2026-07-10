import './FilterChips.css'

export interface ChipOption<T extends string> {
  value: T
  label: string
  icon?: string
}

interface Props<T extends string> {
  options: ChipOption<T>[]
  /** null represents the "전체" (all) selection. */
  value: T | null
  onChange: (value: T | null) => void
  allLabel?: string
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  allLabel = '전체',
}: Props<T>) {
  return (
    <div className="filter-chips" role="group">
      <button
        type="button"
        className={`chip${value === null ? ' is-active' : ''}`}
        onClick={() => onChange(null)}
      >
        {allLabel}
      </button>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`chip${value === opt.value ? ' is-active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon && <span aria-hidden="true">{opt.icon}</span>} {opt.label}
        </button>
      ))}
    </div>
  )
}
