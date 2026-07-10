import { useState, type ReactNode } from 'react'
import './Accordion.css'

interface Props {
  title: string
  subtitle?: string
  icon?: string
  /** Accent color bar on the left of the header. */
  accent?: string
  defaultOpen?: boolean
  children: ReactNode
}

export function Accordion({
  title,
  subtitle,
  icon,
  accent = 'var(--color-accent)',
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="accordion">
      <button
        type="button"
        className="accordion__header"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="accordion__bar" style={{ background: accent }} />
        {icon && (
          <span className="accordion__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="accordion__titles">
          <span className="accordion__title">{title}</span>
          {subtitle && <span className="accordion__subtitle">{subtitle}</span>}
        </span>
        <span className={`accordion__chevron${open ? ' is-open' : ''}`} aria-hidden="true">
          ⌄
        </span>
      </button>
      {open && <div className="accordion__body">{children}</div>}
    </section>
  )
}
