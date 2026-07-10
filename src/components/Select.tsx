import './Select.css'

interface SelectOption<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  value: T | null
  options: SelectOption<T>[]
  onChange: (value: T | null) => void
  /** Label for the "전체" option; also conveys which field this is. */
  allLabel: string
}

export function Select<T extends string>({ value, options, onChange, allLabel }: Props<T>) {
  return (
    <div className="select">
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : (e.target.value as T))}
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="select__chevron" aria-hidden="true">
        ⌄
      </span>
    </div>
  )
}
