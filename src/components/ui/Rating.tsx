import { Star } from 'lucide-react'

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="row gap-6">
      <Star size={14} fill="var(--amber)" color="var(--amber)" />
      <span className="t-label">{value.toFixed(1)}</span>
      {count !== undefined && <span className="t-body-s c-tertiary">({count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count})</span>}
    </span>
  )
}

export function Stars({ value, size = 22, onChange }: { value: number; size?: number; onChange?: (v: number) => void }) {
  return (
    <span className="row" style={{ gap: size > 30 ? 10 : 6 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} aria-label={`${i} stars`} onClick={() => onChange?.(i)} style={{ display: 'grid', transition: 'transform .25s cubic-bezier(.34,1.56,.64,1)', transform: i <= value ? 'scale(1)' : 'scale(.92)' }}>
          <Star size={size} strokeWidth={1.6} fill={i <= value ? 'var(--amber)' : 'none'} color={i <= value ? 'var(--amber)' : 'var(--text-tertiary)'} />
        </button>
      ))}
    </span>
  )
}
