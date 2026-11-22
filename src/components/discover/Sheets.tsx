import { Check, Percent } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Toggle } from '@/components/ui/Controls'
import { Sheet } from '@/components/ui/Sheet'
import { AREAS, FEATURES } from '@/data/restaurants'
import { PRICE_BANDS, applyFilters, useFilters, type Sort } from '@/store/filters'
import { t } from '@/i18n'

export function AreaSheet({ open, onClose, value, onChange }: { open: boolean; onClose: () => void; value: string; onChange: (a: string) => void }) {
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="stack gap-8">
        <span className="t-h2" style={{ marginBottom: 8 }}>{t('common.area')}</span>
        {AREAS.map(a => (
          <button key={a} className="row between" style={{ height: 52, borderBottom: '1px solid var(--border-subtle)' }} onClick={() => { onChange(a); onClose() }}>
            <span className={`t-body-l ${a === value ? '' : 'c-secondary'}`}>{a}</span>
            {a === value && <Check size={20} color="var(--amber)" />}
          </button>
        ))}
      </div>
    </Sheet>
  )
}

const SORTS: { v: Sort; k: Parameters<typeof t>[0] }[] = [
  { v: 'recommended', k: 'filters.recommended' }, { v: 'top', k: 'filters.topRated' }, { v: 'nearest', k: 'filters.nearest' }, { v: 'offer', k: 'filters.biggestOffer' },
]

export function FiltersSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const f = useFilters()
  const count = applyFilters(f).length
  const toggleIn = (arr: string[], v: string) => (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="stack gap-12">
        <div className="row between"><span className="t-h2">{t('filters.title')}</span><button className="t-label c-amber" onClick={f.reset}>{t('common.reset')}</button></div>
        <span className="t-h3" style={{ marginTop: 6 }}>{t('filters.sort')}</span>
        <div className="row wrap gap-8">{SORTS.map(s => <Chip key={s.v} selected={f.sort === s.v} onClick={() => f.set({ sort: s.v })}>{t(s.k)}</Chip>)}</div>
        <span className="t-h3" style={{ marginTop: 6 }}>{t('filters.price')}</span>
        <div className="row wrap gap-8">{Object.keys(PRICE_BANDS).map(p => <Chip key={p} selected={f.price.includes(p)} onClick={() => f.set({ price: toggleIn(f.price, p) })}>{p}</Chip>)}</div>
        <div className="list-item" style={{ marginTop: 4 }}>
          <span className="lead"><Percent size={18} strokeWidth={1.6} /></span>
          <span className="grow t-body-l">{t('filters.offersOnly')}</span>
          <Toggle on={f.offersOnly} onChange={v => f.set({ offersOnly: v })} label={t('filters.offersOnly')} />
        </div>
        <span className="t-h3" style={{ marginTop: 6 }}>{t('filters.features')}</span>
        <div className="row wrap gap-8">{FEATURES.map(p => <Chip key={p} selected={f.features.includes(p)} onClick={() => f.set({ features: toggleIn(f.features, p) })}>{p}</Chip>)}</div>
        <span className="t-h3" style={{ marginTop: 6 }}>{t('filters.rating')}</span>
        <div className="row wrap gap-8">{[0, 8, 9].map(r => <Chip key={r} selected={f.minRating === r} onClick={() => f.set({ minRating: r })}>{r ? `${r}+` : t('filters.any')}</Chip>)}</div>
        <Button block style={{ marginTop: 16 }} onClick={onClose}>{t('filters.show', { n: count })}</Button>
      </div>
    </Sheet>
  )
}
