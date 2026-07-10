import type { Category, Region } from '../types'
import { categoryMeta, regionLabel } from '../lib/categories'
import './Badge.css'

export function CategoryBadge({ category }: { category: Category }) {
  const meta = categoryMeta(category)
  return (
    <span className="badge badge--category" style={{ background: meta.color }}>
      <span aria-hidden="true">{meta.icon}</span>
      {meta.label}
    </span>
  )
}

export function RegionBadge({ region }: { region: Region | null }) {
  if (!region) return null
  return <span className="badge badge--region">{regionLabel(region)}</span>
}

export function StatusBadge({
  label,
  tone,
}: {
  label: string
  tone: 'ongoing' | 'upcoming' | 'muted'
}) {
  if (!label) return null
  return <span className={`badge badge--status badge--${tone}`}>{label}</span>
}
