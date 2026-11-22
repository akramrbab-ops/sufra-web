import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { bestOffer, type Restaurant } from '@/data/restaurants'
import { useStore } from '@/store'
import { t } from '@/i18n'
import { Rating } from './Rating'
import { Tag } from './Chip'

export function SaveButton({ id, variant = 'glass' }: { id: string; variant?: 'glass' | 'ghost' }) {
  const on = useStore(s => s.favourites.includes(id))
  const toggle = useStore(s => s.toggleFav)
  const toast = useStore(s => s.toast)
  return (
    <motion.button
      aria-label="Save"
      aria-pressed={on}
      className={`icon-btn ${variant}`}
      whileTap={{ scale: 0.85 }}
      onClick={e => { e.stopPropagation(); const now = toggle(id); toast(t(now ? 'profile.savedToast' : 'profile.removedToast'), now ? 'amber' : 'default') }}
    >
      <motion.span key={String(on)} initial={{ scale: on ? 0.4 : 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: on ? 10 : 25 }} style={{ display: 'grid' }}>
        <Heart size={on ? 22 : 20} strokeWidth={1.6} fill={on ? 'var(--amber)' : 'none'} color={on ? 'var(--amber)' : 'currentColor'} />
      </motion.span>
    </motion.button>
  )
}

export const sharedId = (id: string, ctx: string) => `photo-${id}-${ctx}`

function useOpen(r: Restaurant, ctx: string) {
  const nav = useNavigate()
  return () => nav(`/restaurant/${r.id}`, { state: { shared: sharedId(r.id, ctx) } })
}

export function CardMini({ r, ctx }: { r: Restaurant; ctx: string }) {
  const open = useOpen(r, ctx)
  return (
    <motion.button whileTap={{ scale: 0.97 }} className="card-mini" onClick={open}>
      <motion.img layoutId={sharedId(r.id, ctx)} src={r.image} alt="" className="img-cover" style={{ position: 'absolute', inset: 0, borderRadius: 24 }} />
      <div className="scrim-b" style={{ position: 'absolute', inset: 0 }} />
      <div className="content">
        <div className="t-label-l ellipsis">{r.name}</div>
        <div className="t-caption c-secondary">{r.cuisine} · {r.rating.toFixed(1)}</div>
      </div>
    </motion.button>
  )
}

export function CardLarge({ r, ctx }: { r: Restaurant; ctx: string }) {
  const open = useOpen(r, ctx)
  const off = bestOffer(r)
  return (
    <motion.div whileTap={{ scale: 0.985 }} className="card-large" onClick={open} role="button" tabIndex={0}>
      <motion.img layoutId={sharedId(r.id, ctx)} src={r.image} alt="" className="img-cover" style={{ position: 'absolute', inset: 0, borderRadius: 28 }} />
      <div className="scrim-b" style={{ position: 'absolute', inset: 0 }} />
      <span className="tag dark" style={{ position: 'absolute', top: 14, insetInlineStart: 14, zIndex: 2, padding: '7px 12px 7px 10px' }}><Rating value={r.rating} /></span>
      <span className="row gap-6" style={{ position: 'absolute', top: 14, insetInlineEnd: 14, zIndex: 2 }}>
        <Tag tone="glass">{r.cuisine}</Tag>
        {off > 0 && <Tag tone="dark"><span className="c-amber">-{off}%</span></Tag>}
      </span>
      <div className="content">
        <div className="t-h1 ellipsis">{r.name}</div>
        <div className="t-body-s c-secondary ellipsis">{r.area} · {r.distanceKm} km · SAR {r.priceAvg} avg</div>
      </div>
      <span style={{ position: 'absolute', insetInlineEnd: 14, bottom: 14, zIndex: 2 }}><SaveButton id={r.id} /></span>
    </motion.div>
  )
}

export function CardRow({ r, ctx, meta }: { r: Restaurant; ctx: string; meta?: string }) {
  const open = useOpen(r, ctx)
  const off = bestOffer(r)
  return (
    <motion.div whileTap={{ scale: 0.98 }} className="card-row" onClick={open} role="button" tabIndex={0}>
      <div className="thumb"><motion.img layoutId={sharedId(r.id, ctx)} src={r.image} alt="" className="img-cover" style={{ borderRadius: 16 }} /></div>
      <div className="stack gap-4 grow" style={{ paddingTop: 2 }}>
        <span className="t-label-l ellipsis">{r.name}</span>
        <span className="t-body-s c-tertiary ellipsis">{meta ?? `${r.cuisine} · ${r.area} · ${r.distanceKm} km`}</span>
        <span className="row gap-8" style={{ marginTop: 2 }}>
          <Rating value={r.rating} count={r.reviewsCount} />
          {off > 0 && <Tag tone="amber">-{off}%</Tag>}
        </span>
      </div>
      <SaveButton id={r.id} variant="ghost" />
    </motion.div>
  )
}
