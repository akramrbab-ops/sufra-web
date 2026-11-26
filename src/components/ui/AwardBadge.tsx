import { Trophy } from 'lucide-react'
import { AWARDS_YEAR, awardFor } from '@/data/extras'

export function AwardBadge({ id, compact, iconOnly }: { id: string; compact?: boolean; iconOnly?: boolean }) {
  const a = awardFor(id)
  if (!a) return null
  return (
    <span className={`tag award${iconOnly ? ' icon-only' : ''}`} title={`${a.category} · ${a.level}`} aria-label={`${a.category} · ${a.level}`}>
      <Trophy size={13} strokeWidth={2} />
      {iconOnly ? null : compact ? `${a.level === 'Winner' ? 'Award winner' : 'Finalist'}` : `Sufra Awards ${AWARDS_YEAR} · ${a.level}`}
    </span>
  )
}

