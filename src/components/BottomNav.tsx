import type { TabKey } from '../store/appStore'
import './BottomNav.css'

interface NavItem {
  key: TabKey
  label: string
  icon: string
}

const ITEMS: NavItem[] = [
  { key: 'map', label: '지도', icon: '🗺️' },
  { key: 'events', label: '행사', icon: '🎟️' },
  { key: 'festivals', label: '축제', icon: '🎆' },
]

interface Props {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`bottom-nav__item${active === item.key ? ' is-active' : ''}`}
          aria-current={active === item.key ? 'page' : undefined}
          onClick={() => onChange(item.key)}
        >
          <span className="bottom-nav__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="bottom-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
