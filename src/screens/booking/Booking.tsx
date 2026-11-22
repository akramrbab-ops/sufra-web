import { motion, type MotionProps } from 'framer-motion'
import { CalendarPlus, CreditCard, Gift, Lock, MessageSquare, Pencil, Plus, ShieldCheck, Sparkles, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Screen } from '@/app/Screen'
import { DateTimeSheet } from '@/components/booking/DateTimeSheet'
import { BookingCard } from '@/components/ui/BookingCard'
import { Button, IconButton } from '@/components/ui/Button'
import { Chip, Tag } from '@/components/ui/Chip'
import { Radio, Toggle } from '@/components/ui/Controls'
import { Input, TextArea } from '@/components/ui/Input'
import { Item, ListItem, Stagger, TopBar } from '@/components/ui/Misc'
import { byId } from '@/data/restaurants'
import { dayLabel, fromISO } from '@/lib/date'
import { useStore, type Card } from '@/store'
import { t } from '@/i18n'
import { AppleLogo } from '@/screens/onboarding/Onboarding'

export function cardLabel(c: Card) { return c.last4 ? `${c.brand} •••• ${c.last4}` : c.brand }
export function CardIcon({ c }: { c: Card }) {
  return c.brand === 'Apple Pay' ? <AppleLogo size={22} /> : <CreditCard size={22} strokeWidth={1.6} />
}

export function BookingDetails() {
  const nav = useNavigate()
  const live = useStore(s => s.draft)
  const last = useRef(live)
  if (live) last.current = live
  const draft = live ?? last.current
  const update = useStore(s => s.updateDraft)
  const user = useStore(s => s.user)
  const [edit, setEdit] = useState(false)
  if (!draft) return <Navigate to="/home" replace />
  const r = byId(draft.restaurantId)!
  const off = r.slots[draft.time] ?? 0
  const seatings = [t('booking.noPref'), t('booking.indoor'), t('booking.outdoor'), t('booking.family')]
  const occasions = [t('booking.none'), t('booking.birthday'), t('booking.anniversary'), t('booking.business')]
  return (
    <Screen className="pb-bar">
      <TopBar title={t('booking.detailsTitle')} />
      <Stagger className="stack gap-12 pad">
        <Item className="row gap-12 surface" style={{ padding: 10 }}>
          <img src={r.image} alt="" style={{ width: 60, height: 60, borderRadius: 16, objectFit: 'cover' }} />
          <span className="stack gap-4 grow">
            <span className="t-label-l">{r.name}</span>
            <span className="t-body-s c-secondary">{dayLabel(draft.date)} · {draft.time} PM · {t('common.guests', { n: draft.guests })}</span>
            {off > 0 && <span><Tag tone="amber">-{off}% on food</Tag></span>}
          </span>
          <IconButton size="sm" variant="ghost" label="Edit" onClick={() => setEdit(true)}><Pencil size={18} strokeWidth={1.6} /></IconButton>
        </Item>
        <Item style={{ marginTop: 8 }}><span className="t-h3">{t('booking.seating')}</span></Item>
        <Item className="row wrap gap-8">{seatings.map(s => <Chip key={s} selected={draft.seating === s} onClick={() => update({ seating: s })}>{s}</Chip>)}</Item>
        <Item style={{ marginTop: 8 }}><span className="t-h3">{t('booking.occasion')}</span></Item>
        <Item className="row wrap gap-8">{occasions.map(s => <Chip key={s} selected={draft.occasion === s} onClick={() => update({ occasion: s })}>{s}</Chip>)}</Item>
        <Item style={{ marginTop: 8 }}><TextArea label={t('booking.requests')} value={draft.requests} onChange={v => update({ requests: v })} placeholder={t('booking.requestsPh')} icon={<MessageSquare size={20} strokeWidth={1.6} />} /></Item>
        <Item><ListItem icon={<User size={18} strokeWidth={1.6} />} label={user.name} value={`+966 ${user.phone}`} onClick={() => nav('/profile/edit')} /></Item>
      </Stagger>
      <div className="fixed-cta"><Button block onClick={() => nav('/book/pay')}>{t('common.continue')}</Button></div>
      <DateTimeSheet open={edit} onClose={() => setEdit(false)} restaurant={r} initial={{ date: draft.date, time: draft.time, guests: draft.guests }} />
    </Screen>
  )
}

export function Payment() {
  const nav = useNavigate()
  const live = useStore(s => s.draft)
  const last = useRef(live)
  if (live) last.current = live
  const draft = live ?? last.current
  const cards = useStore(s => s.cards)
  const defaultCard = useStore(s => s.defaultCard)
  const points = useStore(s => s.points)
  const confirm = useStore(s => s.confirmDraft)
  const toast = useStore(s => s.toast)
  const [method, setMethod] = useState(defaultCard)
  const [promo, setPromo] = useState('')
  const [promoState, setPromoState] = useState<'none' | 'ok' | 'bad'>('none')
  const [usePts, setUsePts] = useState(false)
  const [paying, setPaying] = useState(false)
  if (!draft) return <Navigate to="/home" replace />
  const r = byId(draft.restaurantId)!
  const deposit = r.depositPerGuest * draft.guests
  const promoOff = promoState === 'ok' ? 25 : 0
  const ptsUse = usePts ? Math.min(points - (points % 100), Math.max(0, (deposit - promoOff) * 20), 1000) : 0
  const ptsOff = ptsUse / 20
  const due = Math.max(0, deposit - promoOff - ptsOff)
  const card = cards.find(c => c.id === method) ?? cards[0]
  const applyPromo = () => setPromoState(promo.trim().toUpperCase() === 'SUFRA25' ? 'ok' : 'bad')
  const pay = () => {
    setPaying(true)
    setTimeout(() => {
      const b = confirm({ deposit: due, paidWith: due ? cardLabel(card) : '—', discount: Math.max(0, r.slots[draft.time] ?? 0), pointsUsed: ptsUse, promo: promoOff })
      toast(t('booking.bookedTitle'), 'success')
      nav(`/book/done/${b.id}`, { replace: true })
    }, 900)
  }
  return (
    <Screen className="pb-bar">
      <TopBar title={t('booking.confirmTitle')} />
      <Stagger className="stack gap-12 pad">
        <Item className="surface stack gap-12" style={{ padding: 16 }}>
          <div className="row between"><span className="t-body c-secondary">{t('booking.deposit', { p: r.depositPerGuest, n: t('common.guests', { n: draft.guests }) })}</span><span className="t-label">SAR {deposit}</span></div>
          <div className="row between"><span className="t-body c-secondary">{t('booking.bookingFee')}</span><span className="t-label">{t('common.free')}</span></div>
          {promoOff > 0 && <div className="row between"><span className="t-body c-secondary">{t('booking.promo')}</span><span className="t-label c-success">− SAR {promoOff}</span></div>}
          {ptsOff > 0 && <div className="row between"><span className="t-body c-secondary">{t('booking.usePoints', { n: ptsUse })}</span><span className="t-label c-success">{t('booking.pointsValue', { n: ptsOff })}</span></div>}
          <div className="divider" />
          <div className="row between"><span className="t-label-l">{t('booking.dueNow')}</span><motion.span key={due} initial={{ scale: 1.15, color: '#E8B36A' }} animate={{ scale: 1, color: '#FFFFFF' }} className="t-h3">SAR {due}</motion.span></div>
          <span className="t-caption c-tertiary">{deposit ? t('booking.depositNote') : 'No deposit needed at this restaurant.'}</span>
        </Item>
        <Item className="row gap-10" style={{ alignItems: 'flex-end' }}>
          <Input className="grow" label={t('booking.promo')} value={promo} onChange={e => { setPromo(e.target.value); setPromoState('none') }} placeholder={t('booking.promoPh')} icon={<Gift size={20} strokeWidth={1.6} />}
            error={promoState === 'bad' ? t('booking.promoInvalid') : undefined} help={promoState === 'ok' ? t('booking.promoApplied') : 'Try SUFRA25'} />
          <Button variant="secondary" style={{ marginBottom: 22 }} onClick={applyPromo} disabled={!promo.trim()}>{t('booking.apply')}</Button>
        </Item>
        <Item className="list-item surface" style={{ padding: '8px 16px' }}>
          <span className="lead" style={{ background: 'var(--amber-tint)', color: 'var(--amber)' }}><Sparkles size={18} /></span>
          <span className="stack grow"><span className="t-label-l">{t('booking.usePoints', { n: Math.min(points - (points % 100), 1000) })}</span><span className="t-caption c-tertiary">{points.toLocaleString()} available · 100 pts = SAR 5</span></span>
          <Toggle on={usePts} onChange={setUsePts} label="Use points" />
        </Item>
        {due > 0 && (
          <>
            <Item style={{ marginTop: 6 }}><span className="t-h3">{t('booking.payWith')}</span></Item>
            {cards.map(c => (
              <Item key={c.id}>
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => setMethod(c.id)} className="row gap-14" style={{ width: '100%', padding: '14px 16px', borderRadius: 24, background: 'var(--bg-surface)', boxShadow: method === c.id ? 'inset 0 0 0 1.5px var(--amber)' : 'none', transition: 'box-shadow .25s' }}>
                  <CardIcon c={c} /><span className="t-label-l grow" style={{ textAlign: 'start' }}>{cardLabel(c)}</span><Radio on={method === c.id} />
                </motion.button>
              </Item>
            ))}
            <Item><button className="row gap-10 c-amber t-label" style={{ padding: 4 }} onClick={() => nav('/payment-methods/add')}><Plus size={20} />{t('booking.addCard')}</button></Item>
          </>
        )}
      </Stagger>
      <div className="fixed-cta stack gap-10">
        <span className="row gap-6 center t-caption c-tertiary"><ShieldCheck size={16} />{t('booking.secure')}</span>
        <Button block disabled={paying} onClick={pay} leading={paying ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} style={{ width: 18, height: 18, borderRadius: 9, border: '2px solid rgba(0,0,0,.2)', borderTopColor: '#0B0B0A' }} /> : <Lock size={18} />}>
          {paying ? 'Processing…' : due > 0 ? t('booking.pay', { n: due }) : t('booking.confirmFree')}
        </Button>
      </div>
    </Screen>
  )
}

const draw = (duration: number, delay: number) => ({ initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration, delay } }) as unknown as MotionProps

function downloadIcs(name: string, dateISO: string, time: string) {
  const d = fromISO(dateISO)
  const [h, m] = time.split(':').map(Number)
  d.setHours(h + 12, m)
  const f = (x: Date) => x.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const end = new Date(d.getTime() + 2 * 3600000)
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${f(d)}\nDTEND:${f(end)}\nSUMMARY:Dinner at ${name}\nDESCRIPTION:Booked with Sufra\nEND:VEVENT\nEND:VCALENDAR`
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  a.download = `${name.replace(/\s/g, '-')}.ics`
  a.click()
}

export function Confirmed() {
  const { id } = useParams()
  const nav = useNavigate()
  const b = useStore(s => s.bookings.find(x => x.id === id))
  const toast = useStore(s => s.toast)
  const [show, setShow] = useState(false)
  useEffect(() => { const x = setTimeout(() => setShow(true), 200); return () => clearTimeout(x) }, [])
  if (!b) return <Navigate to="/bookings" replace />
  const r = byId(b.restaurantId)!
  return (
    <Screen className="pb-bar">
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.2, scale: 1 }} transition={{ duration: 1.2 }} style={{ position: 'absolute', width: 320, height: 320, left: 36, top: -60, borderRadius: '50%', background: 'var(--amber)', filter: 'blur(110px)', pointerEvents: 'none' }} />
      <div className="stack gap-14 pad" style={{ paddingTop: 'calc(var(--status-h) + 38px)', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} style={{ width: 84, height: 84, borderRadius: 42, background: 'var(--amber-tint)', display: 'grid', placeItems: 'center' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <motion.circle cx="12" cy="12" r="10" {...draw(0.6, 0.15)} />
            <motion.path d="m8 12 3 3 5-6" {...draw(0.4, 0.6)} />
          </svg>
        </motion.div>
        <motion.h1 className="t-h1" style={{ margin: 0 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>{t('booking.bookedTitle')}</motion.h1>
        <motion.p className="t-body c-secondary" style={{ margin: 0 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          {t('booking.bookedBody', { r: r.name, when: dayLabel(b.date).toLowerCase(), t: `${b.time} PM` })}
        </motion.p>
        {show && <motion.div style={{ width: '100%', textAlign: 'start' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}><BookingCard b={b} actions={false} /></motion.div>}
        <motion.span className="row gap-8 t-label c-amber" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: 'spring' }}><Sparkles size={18} />{t('booking.pointsAdded', { n: r.pointsMultiplier ? 40 : 20 })}</motion.span>
      </div>
      <div className="fixed-cta stack gap-8">
        <Button block leading={<CalendarPlus size={20} strokeWidth={1.6} />} onClick={() => { downloadIcs(r.name, b.date, b.time); toast('Added to calendar', 'success') }}>{t('booking.addCalendar')}</Button>
        <div className="row gap-8">
          <Button variant="secondary" className="grow" size="md" onClick={() => nav(`/booking/${b.id}`)}>{t('booking.viewBooking')}</Button>
          <Button variant="ghost" className="grow" size="md" onClick={() => nav('/home', { replace: true })}>{t('booking.backHome')}</Button>
        </div>
      </div>
    </Screen>
  )
}

