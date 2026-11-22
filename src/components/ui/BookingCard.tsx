import { motion } from 'framer-motion'
import { CalendarDays, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { byId } from '@/data/restaurants'
import type { Booking } from '@/store'
import { whenLabel } from '@/lib/date'
import { t } from '@/i18n'
import { Button } from './Button'
import { Tag } from './Chip'

export const bookingPhotoId = (id: string) => `bk-photo-${id}`

export function statusTag(b: Booking) {
  if (b.status === 'upcoming') return <Tag tone="dark"><span className="c-success">{t('bookings.confirmed')}</span></Tag>
  if (b.status === 'waitlist') return <Tag tone="dark"><span className="c-amber">{t('bookings.waitlist')}</span></Tag>
  if (b.status === 'cancelled') return <Tag tone="dark"><span className="c-danger">{t('bookings.cancelled')}</span></Tag>
  return <Tag tone="dark">{t('bookings.completed')}</Tag>
}

export function BookingCard({ b, actions = true }: { b: Booking; actions?: boolean }) {
  const r = byId(b.restaurantId)!
  const nav = useNavigate()
  const open = () => nav(`/booking/${b.id}`, { state: { shared: bookingPhotoId(b.id) } })
  return (
    <motion.div whileTap={{ scale: 0.985 }} className="surface" style={{ overflow: 'hidden', borderRadius: 28 }} onClick={open} role="button" tabIndex={0}>
      <div style={{ position: 'relative', height: 120 }}>
        <motion.img layoutId={bookingPhotoId(b.id)} src={r.image} alt="" className="img-cover" style={{ position: 'absolute', inset: 0, borderRadius: '28px 28px 0 0' }} />
        <span style={{ position: 'absolute', top: 14, insetInlineStart: 14 }}>{statusTag(b)}</span>
      </div>
      <div className="stack gap-12" style={{ padding: '14px 16px 16px' }}>
        <span className="t-h3">{r.name}</span>
        <span className="row gap-16 t-body-s c-secondary">
          <span className="row gap-6"><CalendarDays size={16} strokeWidth={1.6} />{whenLabel(b.date, b.time)}</span>
          <span className="row gap-6"><Users size={16} strokeWidth={1.6} />{t('common.guests', { n: b.guests })}</span>
        </span>
        {actions && b.status === 'upcoming' && (
          <div className="row gap-8">
            <Button variant="secondary" size="md" className="grow" onClick={e => { e.stopPropagation(); nav(`/booking/${b.id}`, { state: { modify: true } }) }}>{t('bookings.modify')}</Button>
            <Button variant="glass" size="md" className="grow" onClick={e => { e.stopPropagation(); nav(`/booking/${b.id}/bill`) }}>{t('bookings.payBill')}</Button>
          </div>
        )}
        {actions && b.status === 'completed' && (
          <div className="row gap-8">
            {!b.reviewed && <Button variant="secondary" size="md" className="grow" onClick={e => { e.stopPropagation(); nav(`/review/${b.id}`) }}>{t('bookings.rate')}</Button>}
            <Button variant="glass" size="md" className="grow" onClick={e => { e.stopPropagation(); nav(`/restaurant/${r.id}`) }}>{t('bookings.again')}</Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
