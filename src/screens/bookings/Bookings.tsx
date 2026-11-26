import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Camera, Star, CreditCard, Navigation, Pencil, Receipt, Sparkles, Users, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Screen } from '@/app/Screen'
import { DateTimeSheet } from '@/components/booking/DateTimeSheet'
import { BookingCard, bookingPhotoId, statusTag } from '@/components/ui/BookingCard'
import { Button, IconButton } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Checkbox, Radio, Segmented, Stepper } from '@/components/ui/Controls'
import { TextArea } from '@/components/ui/Input'
import { InfoRow, Item, Qr, Stagger, TopBar } from '@/components/ui/Misc'
import { Stars } from '@/components/ui/Rating'
import { Sheet } from '@/components/ui/Sheet'
import { byId } from '@/data/restaurants'
import { img } from '@/data/images'
import { whenLabel } from '@/lib/date'
import { useStore } from '@/store'
import { t } from '@/i18n'
import { FESTIVAL, setMenuById } from '@/data/extras'
import { CardIcon, cardLabel } from '@/screens/booking/Booking'
import { Toggle } from '@/components/ui/Controls'
import { Gift, Leaf, UtensilsCrossed } from 'lucide-react'

export function Bookings() {
  const nav = useNavigate()
  const bookings = useStore(s => s.bookings)
  const [tab, setTab] = useState<'up' | 'past'>('up')
  const up = bookings.filter(b => b.status === 'upcoming' || b.status === 'waitlist')
  const past = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled')
  const list = tab === 'up' ? up : past
  return (
    <Screen className="pb-nav">
      <div className="stack gap-16 pad" style={{ paddingTop: 'calc(var(--status-h) + 12px)' }}>
        <h1 className="t-h1" style={{ margin: 0 }}>{t('bookings.title')}</h1>
        <Segmented value={tab} onChange={setTab} options={[{ value: 'up', label: `${t('bookings.upcoming')}${up.length ? ` · ${up.length}` : ''}` }, { value: 'past', label: t('bookings.past') }]} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} initial={{ opacity: 0, x: tab === 'up' ? -24 : 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: tab === 'up' ? -24 : 24 }} transition={{ duration: 0.25 }}>
            {list.length === 0 ? (
              <div className="empty stack gap-12" style={{ alignItems: 'center' }}>
                <CalendarDays size={36} strokeWidth={1.4} />
                <span className="t-h3 c-primary">{t('bookings.empty')}</span><span className="t-body">{t('bookings.emptyBody')}</span>
                <Button size="md" onClick={() => nav('/explore')}>{t('bookings.explore')}</Button>
              </div>
            ) : (
              <Stagger className="stack gap-14">{list.map(b => <Item key={b.id}><BookingCard b={b} /></Item>)}</Stagger>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Screen>
  )
}

export function BookingDetail() {
  const { id } = useParams()
  const loc = useLocation()
  const nav = useNavigate()
  const b = useStore(s => s.bookings.find(x => x.id === id))
  const cancel = useStore(s => s.cancelBooking)
  const toast = useStore(s => s.toast)
  const [modify, setModify] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [reason, setReason] = useState(0)
  useEffect(() => { if ((loc.state as { modify?: boolean } | null)?.modify) { const x = setTimeout(() => setModify(true), 450); return () => clearTimeout(x) } }, [loc.state])
  if (!b) return <Navigate to="/bookings" replace />
  const r = byId(b.restaurantId)!
  const reasons = [t('bookings.reasonPlans'), t('bookings.reasonOther'), t('bookings.reasonMistake'), t('bookings.reasonElse')]
  return (
    <Screen className="pb-bar">
      <div style={{ position: 'relative', height: 300 }}>
        <motion.img layoutId={bookingPhotoId(b.id)} src={r.image} alt="" className="img-cover" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
        <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 140, background: 'linear-gradient(180deg, rgba(11,11,10,.55), rgba(11,11,10,0))' }} />
      </div>
      <TopBar overlay />
      <motion.div className="stack gap-12 pad" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.1 }} style={{ marginTop: -44, paddingTop: 24, position: 'relative', background: 'var(--bg-base)', borderRadius: '32px 32px 0 0' }}>
        <span>{statusTag(b)}</span>
        <h1 className="t-h1" style={{ margin: 0 }}>{r.name}</h1>
        {b.status !== 'cancelled' && (
          <div className="row gap-16 surface" style={{ padding: 14 }}>
            <Qr seed={b.code} />
            <span className="stack gap-4 grow"><span className="t-label-l">{t('bookings.showDoor')}</span><span className="t-caption c-tertiary">{t('bookings.codeNote', { c: b.code })}</span></span>
          </div>
        )}
        <InfoRow icon={<CalendarDays size={20} strokeWidth={1.6} />} label={t('bookings.dateTime')} value={whenLabel(b.date, b.time)} />
        <InfoRow icon={<Users size={20} strokeWidth={1.6} />} label={t('bookings.guestsLabel')} value={`${b.guests} people${b.occasion && b.occasion !== 'None' ? ` · ${b.occasion}` : ''}`} />
        {b.setMenuId && setMenuById(b.setMenuId) && <InfoRow icon={<UtensilsCrossed size={20} strokeWidth={1.6} />} label="Set menu" value={`${setMenuById(b.setMenuId)!.name} · SAR ${setMenuById(b.setMenuId)!.price} per guest`} />}
        {b.festival && <InfoRow icon={<Sparkles size={20} strokeWidth={1.6} />} label={FESTIVAL.name} value={`-${FESTIVAL.discount}% on the food bill`} />}
        {b.dietary && <InfoRow icon={<Leaf size={20} strokeWidth={1.6} />} label="Dietary notes shared" value={b.dietary} />}
        {b.deposit > 0 && <InfoRow icon={<CreditCard size={20} strokeWidth={1.6} />} label={t('bookings.depositPaid')} value={`SAR ${b.deposit} · ${b.paidWith}`} />}
        {b.status === 'cancelled' && <span className="t-body-s c-tertiary">{b.deposit ? t('bookings.cancelBody', { n: b.deposit }) : t('bookings.cancelFree')}</span>}
      </motion.div>
      <motion.div className="fixed-cta stack gap-8" initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 34, delay: 0.2 }}>
        {(b.status === 'upcoming' || b.status === 'waitlist') && (
          <>
            <div className="row gap-10">
              <Button variant="secondary" className="grow" leading={<Pencil size={18} />} onClick={() => setModify(true)}>{t('bookings.modify')}</Button>
              {b.status === 'upcoming'
                ? <Button variant="glass" className="grow" leading={<Receipt size={18} />} onClick={() => nav(`/booking/${b.id}/bill`)}>{t('bookings.payBill')}</Button>
                : <Button variant="glass" className="grow" leading={<Navigation size={18} />} onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(r.address)}`, '_blank')}>{t('bookings.directions')}</Button>}
            </div>
            <Button variant="ghost" size="md" style={{ color: 'var(--danger)' }} onClick={() => setCancelOpen(true)}>{t('bookings.cancelBooking')}</Button>
          </>
        )}
        {b.status === 'completed' && (
          <div className="row gap-10">
            {!b.reviewed && <Button className="grow" onClick={() => nav(`/review/${b.id}`)}>{t('bookings.rate')}</Button>}
            <Button variant="secondary" className="grow" onClick={() => nav(`/restaurant/${r.id}`)}>{t('bookings.again')}</Button>
          </div>
        )}
        {b.status === 'cancelled' && <Button variant="secondary" block onClick={() => nav(`/restaurant/${r.id}`)}>{t('bookings.again')}</Button>}
      </motion.div>
      <DateTimeSheet open={modify} onClose={() => setModify(false)} restaurant={r} modifyingId={b.id} initial={{ date: b.date, time: b.time, guests: b.guests }} />
      <Sheet open={cancelOpen} onClose={() => setCancelOpen(false)}>
        <div className="stack gap-10">
          <span className="t-h2">{t('bookings.cancelTitle')}</span>
          <span className="t-body c-secondary">{b.deposit ? t('bookings.cancelBody', { n: b.deposit }) : t('bookings.cancelFree')}</span>
          <div className="stack" style={{ margin: '6px 0 10px' }}>
            {reasons.map((x, i) => <button key={x} className="row gap-12" style={{ height: 44 }} onClick={() => setReason(i)}><Radio on={reason === i} /><span className="t-body-l">{x}</span></button>)}
          </div>
          <Button variant="danger" block onClick={() => { cancel(b.id); setCancelOpen(false); toast(t('bookings.cancelledToast')); setTimeout(() => nav('/bookings', { replace: true }), 250) }}>{t('bookings.cancelBooking')}</Button>
          <Button variant="ghost" size="md" onClick={() => setCancelOpen(false)}>{t('bookings.keep')}</Button>
        </div>
      </Sheet>
    </Screen>
  )
}

const TIPS = [0, 5, 10, 15]
export function Bill() {
  const { id } = useParams()
  const nav = useNavigate()
  const b = useStore(s => s.bookings.find(x => x.id === id))
  const payBill = useStore(s => s.payBill)
  const [tip, setTip] = useState(10)
  const [split, setSplit] = useState(false)
  const [mode, setMode] = useState<'eq' | 'items'>('eq')
  const [people, setPeople] = useState(b?.guests ?? 2)
  const [mine, setMine] = useState<string[]>([])
  const [share, setShare] = useState<number | null>(null)
  const [done, setDone] = useState<number | null>(null)
  const cards = useStore(s => s.cards)
  const defaultCard = useStore(s => s.defaultCard)
  const gifts = useStore(s => s.giftCards)
  const [method, setMethod] = useState(defaultCard)
  const [methodOpen, setMethodOpen] = useState(false)
  const [useGift, setUseGift] = useState(false)
  const items = useMemo(() => {
    if (!b) return []
    const r = byId(b.restaurantId)!
    const sm = setMenuById(b.setMenuId)
    if (sm) return [{ id: sm.id, name: sm.name, desc: '', price: sm.price, qty: b.guests }, { id: 'drinks', name: 'Soft drinks', desc: '', price: 18, qty: b.guests }]
    const all = r.menu.flatMap(s => s.items)
    return all.slice(0, 5).map((x, i) => ({ ...x, qty: i === 0 ? Math.max(1, Math.round(b.guests / 2)) : 1 }))
  }, [b])
  if (!b) return <Navigate to="/bookings" replace />
  const r = byId(b.restaurantId)!
  const subtotal = items.reduce((a, x) => a + x.price * x.qty, 0)
  const discount = Math.round((subtotal * b.discount) / 100)
  const vat = Math.round((subtotal - discount) * 0.15)
  const tipAmt = Math.round((subtotal * tip) / 100)
  const total = Math.max(0, subtotal - discount + vat + tipAmt - b.deposit)
  const itemsShare = mine.length ? Math.round(items.filter(x => mine.includes(x.id)).reduce((a, x) => a + x.price * x.qty, 0) * (total / Math.max(1, subtotal))) : 0
  const giftBal = gifts.reduce((a, g) => a + g.balance, 0)
  const before = share ?? total
  const giftUsed = useGift ? Math.min(giftBal, before) : 0
  const pay = before - giftUsed
  const card = cards.find(c => c.id === method) ?? cards[0]
  if (done !== null) {
    return (
      <Screen scroll={false}>
        <div className="stack gap-16 pad" style={{ position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} style={{ width: 96, height: 96, borderRadius: 48, background: 'var(--success-tint)', display: 'grid', placeItems: 'center' }}>
            <Receipt size={44} color="var(--success)" strokeWidth={1.5} />
          </motion.div>
          <motion.h1 className="t-h1" style={{ margin: 0 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>{t('bill.paid')}</motion.h1>
          <motion.p className="t-body c-secondary" style={{ margin: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{t('bill.paidBody', { r: r.name, n: done })}</motion.p>
          <motion.span className="row gap-8 t-label c-amber" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.45, type: 'spring' }}><Sparkles size={18} /> +{done} points</motion.span>
          <Button style={{ marginTop: 16 }} onClick={() => nav(`/review/${b.id}`, { replace: true })}>{t('bookings.rate')}</Button>
          <Button variant="ghost" size="md" onClick={() => nav('/bookings', { replace: true })}>{t('common.done')}</Button>
        </div>
      </Screen>
    )
  }
  return (
    <Screen className="pb-bar">
      <TopBar title={t('bill.title')} />
      <Stagger className="stack gap-12 pad">
        <Item className="row gap-12"><img src={r.image} alt="" style={{ width: 48, height: 48, borderRadius: 14, objectFit: 'cover' }} /><span className="stack"><span className="t-label-l">{r.name}</span><span className="t-body-s c-tertiary">Table 12 · {t('common.guests', { n: b.guests })}</span></span></Item>
        <Item className="surface stack gap-12" style={{ padding: 16 }}>
          <span className="t-caption c-tertiary">{t('bill.items')}</span>
          {items.map(x => <div key={x.id} className="row between t-body"><span className="c-secondary">{x.qty} × {x.name}</span><span>SAR {x.price * x.qty}</span></div>)}
          <div className="divider" />
          <div className="row between t-body"><span className="c-secondary">{t('bill.subtotal')}</span><span>SAR {subtotal}</span></div>
          {discount > 0 && <div className="row between t-body"><span className="c-secondary">{t('bill.discount')} (-{b.discount}%)</span><span className="c-success">− SAR {discount}</span></div>}
          <div className="row between t-body"><span className="c-secondary">{t('bill.vat')}</span><span>SAR {vat}</span></div>
          {b.deposit > 0 && <div className="row between t-body"><span className="c-secondary">{t('bill.depositPaid')}</span><span className="c-success">− SAR {b.deposit}</span></div>}
          <div className="row between t-body"><span className="c-secondary">{t('bill.tip')} ({tip}%)</span><span>SAR {tipAmt}</span></div>
          <div className="divider" />
          <div className="row between"><span className="t-label-l">{t('bill.total')}</span><motion.span key={total} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="t-h2">SAR {total}</motion.span></div>
        </Item>
        <Item><span className="t-h3">{t('bill.tip')}</span></Item>
        <Item className="row gap-8">{TIPS.map(x => <Chip key={x} selected={tip === x} onClick={() => setTip(x)}>{x ? `${x}%` : t('bill.none')}</Chip>)}</Item>
        <Item style={{ marginTop: 6 }}><span className="t-h3">Pay with</span></Item>
        <Item>
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => setMethodOpen(true)} className="row gap-14 surface" style={{ width: '100%', padding: '14px 16px', borderRadius: 24 }}>
            <CardIcon c={card} /><span className="t-label-l grow" style={{ textAlign: 'start' }}>{cardLabel(card)}</span><span className="t-label c-amber">Change</span>
          </motion.button>
        </Item>
        {giftBal > 0 && (
          <Item className="list-item surface" style={{ padding: '8px 16px' }}>
            <span className="lead" style={{ background: 'var(--amber-tint)', color: 'var(--amber)' }}><Gift size={18} /></span>
            <span className="stack grow"><span className="t-label-l">Use gift card balance</span><span className="t-caption c-tertiary">SAR {giftBal} available{giftUsed ? ` · SAR ${giftUsed} applied` : ''}</span></span>
            <Toggle on={useGift} onChange={setUseGift} label="Use gift card" />
          </Item>
        )}
        {share !== null && (
          <Item className="row between surface" style={{ padding: '14px 16px', background: 'var(--amber-tint)' }}>
            <span className="t-label-l">{t('bill.yourShare')}</span>
            <span className="row gap-10"><span className="t-h3 c-amber">SAR {share}</span><IconButton size="sm" variant="ghost" label="Remove split" onClick={() => setShare(null)}><X size={16} /></IconButton></span>
          </Item>
        )}
      </Stagger>
      <div className="fixed-cta row gap-10">
        <Button variant="secondary" onClick={() => setSplit(true)}>{t('bill.split')}</Button>
        <Button className="grow" onClick={() => setDone(payBill(b.id, pay))}>{t('bill.pay', { n: pay })}</Button>
      </div>
      <Sheet open={methodOpen} onClose={() => setMethodOpen(false)}>
        <div className="stack gap-10">
          <span className="t-h2">Pay with</span>
          {cards.map(c => (
            <motion.button key={c.id} whileTap={{ scale: 0.98 }} onClick={() => { setMethod(c.id); setMethodOpen(false) }} className="row gap-14" style={{ width: '100%', padding: '14px 16px', borderRadius: 24, background: 'var(--bg-raised)', boxShadow: method === c.id ? 'inset 0 0 0 1.5px var(--amber)' : 'none' }}>
              <CardIcon c={c} /><span className="t-label-l grow" style={{ textAlign: 'start' }}>{cardLabel(c)}</span><Radio on={method === c.id} />
            </motion.button>
          ))}
        </div>
      </Sheet>
      <Sheet open={split} onClose={() => setSplit(false)}>
        <div className="stack gap-16">
          <span className="t-h2">{t('bill.split')}</span>
          <Segmented value={mode} onChange={setMode} options={[{ value: 'eq', label: t('bill.equally') }, { value: 'items', label: t('bill.byItems') }]} />
          {mode === 'eq' ? (
            <div className="row between"><span className="t-label-l">{t('bill.people')}</span><Stepper value={people} min={2} max={12} onChange={setPeople} /></div>
          ) : (
            <div className="stack">
              {items.map(x => (
                <button key={x.id} className="row gap-12" style={{ height: 48 }} onClick={() => setMine(m => (m.includes(x.id) ? m.filter(y => y !== x.id) : [...m, x.id]))}>
                  <Checkbox on={mine.includes(x.id)} /><span className="grow t-body" style={{ textAlign: 'start' }}>{x.qty} × {x.name}</span><span className="t-body-s c-secondary">SAR {x.price * x.qty}</span>
                </button>
              ))}
            </div>
          )}
          <div className="row between surface" style={{ padding: '14px 16px' }}>
            <span className="t-label-l">{t('bill.yourShare')}</span>
            <motion.span key={mode === 'eq' ? people : itemsShare} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="t-h3 c-amber">SAR {mode === 'eq' ? Math.ceil(total / people) : itemsShare}</motion.span>
          </div>
          <Button block disabled={mode === 'items' && !mine.length} onClick={() => { setShare(mode === 'eq' ? Math.ceil(total / people) : itemsShare); setSplit(false) }}>{t('common.apply')}</Button>
        </div>
      </Sheet>
    </Screen>
  )
}

export function ReviewScreen() {
  const { id } = useParams()
  const nav = useNavigate()
  const b = useStore(s => s.bookings.find(x => x.id === id))
  const markReviewed = useStore(s => s.markReviewed)
  const [overall, setOverall] = useState(0)
  const [subs, setSubs] = useState({ food: 0, service: 0, ambience: 0 })
  const [text, setText] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [done, setDone] = useState(false)
  if (!b) return <Navigate to="/bookings" replace />
  const r = byId(b.restaurantId)!
  if (done) {
    return (
      <Screen scroll={false}>
        <div className="stack gap-16 pad" style={{ position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div className="row gap-6">{[0, 1, 2, 3, 4].map(i => <motion.span key={i} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 340, damping: 18 }}><Star size={34} strokeWidth={1.6} fill={i < overall ? 'var(--amber)' : 'none'} color={i < overall ? 'var(--amber)' : 'var(--text-tertiary)'} /></motion.span>)}</div>
          <motion.h1 className="t-h1" style={{ margin: 0 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>{t('review.thanks')}</motion.h1>
          <motion.p className="t-body c-secondary" style={{ margin: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>{t('review.thanksBody')}</motion.p>
          <Button style={{ marginTop: 12 }} onClick={() => nav('/bookings', { replace: true })}>{t('common.done')}</Button>
        </div>
      </Screen>
    )
  }
  return (
    <Screen className="pb-bar">
      <TopBar title={t('review.title')} />
      <Stagger className="stack gap-14 pad">
        <Item className="row gap-12"><img src={r.image} alt="" style={{ width: 52, height: 52, borderRadius: 16, objectFit: 'cover' }} /><span className="stack"><span className="t-label-l">{r.name}</span><span className="t-body-s c-tertiary">{whenLabel(b.date, b.time)} · {t('common.guests', { n: b.guests })}</span></span></Item>
        <Item><span className="t-h2">{t('review.overall')}</span></Item>
        <Item><Stars value={overall} size={40} onChange={setOverall} /></Item>
        <Item className="surface stack gap-10" style={{ padding: '14px 16px' }}>
          {(['food', 'service', 'ambience'] as const).map(k => (
            <div key={k} className="row between"><span className="t-body-l c-secondary">{t(`restaurant.${k}`)}</span><Stars value={subs[k]} onChange={v => setSubs(s => ({ ...s, [k]: v }))} /></div>
          ))}
        </Item>
        <Item><TextArea value={text} onChange={setText} placeholder={t('review.comment')} /></Item>
        <Item className="row gap-10">
          <AnimatePresence>{photos.map((p, i) => <motion.img key={p + i} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} src={p} alt="" style={{ width: 68, height: 68, borderRadius: 16, objectFit: 'cover' }} onClick={() => setPhotos(ph => ph.filter((_, k) => k !== i))} />)}</AnimatePresence>
          {photos.length < 4 && <motion.button whileTap={{ scale: 0.92 }} aria-label="Add photo" onClick={() => setPhotos(p => [...p, [img.kabsa, img.kunafa, img.coffee, img.mezze][p.length]])} style={{ width: 68, height: 68, borderRadius: 16, border: '1.5px dashed var(--border-strong)', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)' }}><Camera size={22} strokeWidth={1.6} /></motion.button>}
        </Item>
      </Stagger>
      <div className="fixed-cta stack gap-10">
        <span className="row gap-6 center t-caption c-amber"><Sparkles size={16} />{t('review.earn')}</span>
        <Button block disabled={!overall} onClick={() => { markReviewed(b.id); setDone(true) }}>{t('review.submit')}</Button>
      </div>
    </Screen>
  )
}
