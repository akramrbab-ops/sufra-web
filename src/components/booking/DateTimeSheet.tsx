import { AnimatePresence, motion } from 'framer-motion'
import { Bell, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, IconButton } from '@/components/ui/Button'
import { Stepper } from '@/components/ui/Controls'
import { Tag } from '@/components/ui/Chip'
import { Sheet } from '@/components/ui/Sheet'
import { TimeSlot } from '@/components/ui/TimeSlot'
import { TIMES, type Restaurant } from '@/data/restaurants'
import { MONTHS_LONG, fromISO, toISO, dayLabel } from '@/lib/date'
import { useStore } from '@/store'
import { t } from '@/i18n'

function Calendar({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const sel = fromISO(value)
  const [cursor, setCursor] = useState(new Date(sel.getFullYear(), sel.getMonth(), 1))
  const [dir, setDir] = useState(1)
  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const count = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
    return [...Array(first.getDay()).fill(null), ...Array.from({ length: count }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1))] as (Date | null)[]
  }, [cursor])
  const canPrev = cursor > new Date(today.getFullYear(), today.getMonth(), 1)
  const move = (n: number) => { setDir(n); setCursor(c => new Date(c.getFullYear(), c.getMonth() + n, 1)) }
  return (
    <div className="stack gap-8">
      <div className="row between">
        <span className="t-h3">{MONTHS_LONG[cursor.getMonth()]} {cursor.getFullYear()}</span>
        <span className="row gap-4">
          <IconButton size="sm" variant="ghost" label="Previous month" disabled={!canPrev} style={{ opacity: canPrev ? 1 : 0.3 }} onClick={() => canPrev && move(-1)}><ChevronLeft size={18} /></IconButton>
          <IconButton size="sm" variant="ghost" label="Next month" onClick={() => move(1)}><ChevronRight size={18} /></IconButton>
        </span>
      </div>
      <div className="cal-grid t-caption c-tertiary">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div style={{ overflow: 'hidden', position: 'relative', minHeight: 6 * 48 }}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div key={cursor.toISOString()} className="cal-grid" custom={dir} style={{ isolation: 'isolate' }}
            initial={{ x: dir * 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -dir * 60, opacity: 0 }} transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}>
            {days.map((d, i) => {
              if (!d) return <span key={i} style={{ width: 44, height: 44 }} />
              const iso = toISO(d)
              const disabled = d < today
              const isSel = iso === value
              const isToday = d.getTime() === today.getTime()
              return (
                <motion.button key={i} whileTap={disabled ? undefined : { scale: 0.85 }} className={`cal-day ${disabled ? 'disabled' : ''} ${isSel ? 'selected' : ''} ${isToday && !isSel ? 'today' : ''}`} disabled={disabled} onClick={() => onChange(iso)}>
                  {isSel && <motion.span layoutId="cal-sel" className="sel-bg" transition={{ type: 'spring', stiffness: 380, damping: 38 }} />}
                  {d.getDate()}
                </motion.button>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

interface Props {
  open: boolean
  onClose: () => void
  restaurant?: Restaurant
  /** when modifying an existing booking */
  modifyingId?: string
  initial?: { date: string; time: string; guests: number }
  setMenuId?: string
}

export function DateTimeSheet({ open, onClose, restaurant, modifyingId, initial, setMenuId }: Props) {
  const nav = useNavigate()
  const search = useStore(s => s.search)
  const setSearch = useStore(s => s.setSearch)
  const startDraft = useStore(s => s.startDraft)
  const confirmDraft = useStore(s => s.confirmDraft)
  const joinWaitlist = useStore(s => s.joinWaitlist)
  const toast = useStore(s => s.toast)
  const base = initial ?? search
  const [date, setDate] = useState(base.date)
  const [time, setTime] = useState(base.time)
  const [guests, setGuests] = useState(base.guests)
  const [waitlist, setWaitlist] = useState(false)
  useEffect(() => {
    if (open) { setDate(base.date); setTime(base.time); setGuests(base.guests); setWaitlist(false) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
  const slots = restaurant ? restaurant.slots : Object.fromEntries(TIMES.map(x => [x, 0]))
  const discount = slots[time] ?? 0
  const full = discount < 0

  const proceed = () => {
    if (!restaurant) { setSearch({ date, time, guests }); onClose(); return }
    if (full) { setWaitlist(true); return }
    setSearch({ date, time, guests })
    startDraft({ restaurantId: restaurant.id, date, time, guests, modifyingId, setMenuId: setMenuId ?? (modifyingId ? undefined : useStore.getState().draft?.restaurantId === restaurant.id ? useStore.getState().draft?.setMenuId : undefined) })
    if (modifyingId) {
      confirmDraft({ deposit: 0, paidWith: '', discount: Math.max(0, discount), pointsUsed: 0, promo: 0 })
      toast(t('bookings.modifiedToast'), 'success')
      onClose()
      return
    }
    onClose()
    setTimeout(() => nav('/book/details'), 180)
  }

  return (
    <Sheet open={open} onClose={() => { setWaitlist(false); onClose() }}>
      <AnimatePresence mode="wait" initial={false}>
        {!waitlist ? (
          <motion.div key="pick" className="stack gap-20" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <div className="row between">
              <div className="stack">
                <span className="t-h2">{modifyingId ? t('bookings.modify') : restaurant ? t('booking.bookTable') : t('booking.pickTime')}</span>
                {restaurant && <span className="t-body-s c-tertiary">{restaurant.name}</span>}
              </div>
              <IconButton variant="raised" size="sm" label="Close" onClick={onClose}><X size={18} /></IconButton>
            </div>
            <div className="row between"><span className="t-label-l">{t('booking.guests')}</span><Stepper value={guests} onChange={setGuests} /></div>
            <Calendar value={date} onChange={setDate} />
            <div className="stack gap-12">
              <span className="t-h2">{t('booking.availableTimes')}</span>
              <div className="hscroll" style={{ gap: 8 }}>
                {TIMES.map(x => <TimeSlot key={x} time={x} discount={slots[x] ?? 0} selected={x === time} onClick={() => setTime(x)} />)}
              </div>
              {restaurant && (
                <div className="row gap-8 wrap">
                  {discount > 0 && <Tag tone="amber">-{discount}% at {time} PM</Tag>}
                  <span className="t-body-s c-tertiary">{restaurant.depositPerGuest ? t('booking.depositPer', { n: restaurant.depositPerGuest }) : t('booking.bookingFee') + ': ' + t('common.free')}</span>
                </div>
              )}
            </div>
            <Button block onClick={proceed} variant={full ? 'accent' : 'primary'} leading={full ? <Bell size={18} /> : undefined}>
              {full ? t('booking.joinWaitlist') : restaurant ? t('booking.continueAt', { t: `${time} PM` }) : t('booking.apply')}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="wait" className="stack gap-16" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.25 }}>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 340, damping: 18 }} style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--amber-tint)', display: 'grid', placeItems: 'center' }}>
              <Bell size={28} color="var(--amber)" />
            </motion.span>
            <span className="t-h2">{t('booking.waitlistTitle')}</span>
            <span className="t-body c-secondary">{t('booking.waitlistBody', { t: `${dayLabel(date)}, ${time} PM`, n: t('common.guests', { n: guests }) })}</span>
            <Button block onClick={() => { joinWaitlist({ restaurantId: restaurant!.id, date, time, guests, seating: '', occasion: '', requests: '' }); toast(t('booking.waitlistDone'), 'amber'); setWaitlist(false); onClose() }}>{t('booking.waitlistJoin')}</Button>
            <Button variant="ghost" size="md" onClick={() => setWaitlist(false)}>{t('common.back')}</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  )
}
