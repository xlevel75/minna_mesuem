import './SearchInput.css'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder }: Props) {
  return (
    <div className="search-input">
      <span className="search-input__icon" aria-hidden="true">
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  )
}
