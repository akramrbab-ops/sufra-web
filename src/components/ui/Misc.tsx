import { AnimatePresence, motion, type MotionStyle } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ChevronRight, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Review } from '@/data/restaurants'
import { useStore } from '@/store'
import { IconButton } from './Button'
import { Tag } from './Chip'

export function TopBar({ title, right, overlay, onBack }: { title?: string; right?: ReactNode; overlay?: boolean; onBack?: () => void }) {
  const nav = useNavigate()
  return (
    <header className={`topbar ${overlay ? 'overlay' : ''}`}>
      <IconButton label="Back" variant={overlay ? 'glass' : 'surface'} onClick={onBack ?? (() => nav(-1))}>
        <ArrowLeft size={20} strokeWidth={1.6} />
      </IconButton>
      {title && <span className="title ellipsis" style={{ top: 'var(--status-h)', lineHeight: '60px' }}>{title}</span>}
      <span className="row gap-10">{right}</span>
    </header>
  )
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="row between">
      <h2 className="t-h2" style={{ margin: 0 }}>{title}</h2>
      {action && <button className="t-body-s c-tertiary" onClick={onAction}>{action}</button>}
    </div>
  )
}

export function ListItem({ icon, label, value, trailing, onClick, danger }: { icon: ReactNode; label: string; value?: string; trailing?: ReactNode; onClick?: () => void; danger?: boolean }) {
  return (
    <motion.button whileTap={{ scale: 0.98 }} className="list-item" onClick={onClick}>
      <span className="lead" style={danger ? { color: 'var(--danger)' } : undefined}>{icon}</span>
      <span className="grow t-body-l" style={danger ? { color: 'var(--danger)' } : undefined}>{label}</span>
      {value && <span className="t-body-s c-tertiary">{value}</span>}
      {trailing ?? <ChevronRight size={18} strokeWidth={1.6} color="var(--text-tertiary)" />}
    </motion.button>
  )
}

export function InfoRow({ icon, label, value, trailing }: { icon: ReactNode; label: string; value: string; trailing?: ReactNode }) {
  return (
    <div className="info-row">
      <span className="lead">{icon}</span>
      <span className="stack gap-2 grow" style={{ gap: 2 }}>
        <span className="t-caption c-tertiary">{label}</span>
        <span className="t-label-l">{value}</span>
      </span>
      {trailing}
    </div>
  )
}

export function Avatar({ initials, size = 44 }: { initials: string; size?: number }) {
  return <span className={`avatar ${size >= 72 ? 't-h2' : size >= 44 ? 't-label' : 't-caption'}`} style={{ width: size, height: size }}>{initials}</span>
}

export function ReviewCard({ r }: { r: Review }) {
  return (
    <div className="surface stack gap-12" style={{ padding: 16 }}>
      <div className="row gap-10">
        <Avatar initials={r.initials} size={32} />
        <div className="stack grow"><span className="t-label">{r.name}</span><span className="t-caption c-tertiary">Visited {r.date} · {r.guests} guests</span></div>
        <Tag>{r.score.toFixed(1)}</Tag>
      </div>
      <p className="t-body-s c-secondary" style={{ margin: 0 }}>{r.body}</p>
      {r.photos && <div className="row gap-8">{r.photos.map((p, i) => <img key={i} src={p} alt="" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />)}</div>}
    </div>
  )
}

export function Skeleton({ h, w = '100%', r = 24 }: { h: number; w?: number | string; r?: number }) {
  return <div className="skeleton" style={{ height: h, width: w, borderRadius: r, flexShrink: 0 }} />
}

export function Toasts() {
  const toasts = useStore(s => s.toasts)
  return (
    <div className="toast-host">
      <AnimatePresence>
        {toasts.map(tt => (
          <motion.div key={tt.id} className="toast" layout initial={{ y: -30, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -20, opacity: 0, scale: 0.95 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }}>
            {tt.tone === 'success' ? <CheckCircle2 size={18} color="var(--success)" /> : tt.tone === 'amber' ? <CheckCircle2 size={18} color="var(--amber)" /> : <Info size={18} color="var(--text-secondary)" />}
            {tt.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } },
  item: { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 380, damping: 32 } } },
}

export function Stagger({ children, className = '', style }: { children: ReactNode; className?: string; style?: MotionStyle }) {
  return <motion.div variants={stagger.container} initial="hidden" animate="show" className={className} style={style}>{children}</motion.div>
}
export function Item({ children, className = '', style }: { children: ReactNode; className?: string; style?: MotionStyle }) {
  return <motion.div variants={stagger.item} className={className} style={style}>{children}</motion.div>
}

export function Qr({ seed }: { seed: string }) {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const cells = Array.from({ length: 81 }, (_, i) => {
    const x = i % 9, y = Math.floor(i / 9)
    const finder = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5)
    if (finder) return !(x % 8 === 1 && y % 8 === 1) && !((x === 1 && y === 1) || (x === 7 && y === 1) || (x === 1 && y === 7)) ? true : x % 2 === 1
    h = (h * 1103515245 + 12345) >>> 0
    return (h >> 16) % 2 === 0
  })
  return <div className="qr">{cells.map((on, i) => <i key={i} className={on ? '' : 'off'} />)}</div>
}
