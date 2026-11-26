import { AnimatePresence, motion } from 'framer-motion'
import { Award as AwardIcon, Bell, BellRing, Check, ChevronRight, Leaf, Receipt, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Screen } from '@/app/Screen'
export { AwardBadge } from '@/components/ui/AwardBadge'
import { Button } from '@/components/ui/Button'
import { Chip, Tag } from '@/components/ui/Chip'
import { Toggle } from '@/components/ui/Controls'
import { TextArea } from '@/components/ui/Input'
import { Item, Stagger, TopBar } from '@/components/ui/Misc'
import { CardRow } from '@/components/ui/RestaurantCard'
import { ALLERGIES, AWARDS, AWARDS_YEAR, AWARD_CATEGORIES, DIETS, FESTIVAL, festivalRestaurants, type SetMenu } from '@/data/extras'
import { byId } from '@/data/restaurants'
import { fromISO, toISO } from '@/lib/date'
import { useStore } from '@/store'

/* ---------- shared bits ---------- */
export function festivalDays() {
  const now = fromISO(toISO(new Date())).getTime()
  const start = fromISO(FESTIVAL.start).getTime()
  const end = fromISO(FESTIVAL.end).getTime()
  const day = 86400000
  if (now < start) return { state: 'soon' as const, days: Math.round((start - now) / day) }
  if (now <= end) return { state: 'live' as const, days: Math.round((end - now) / day) + 1 }
  return { state: 'over' as const, days: 0 }
}
export const isFestivalDate = (iso: string) => iso >= FESTIVAL.start && iso <= FESTIVAL.end
const fmt = (iso: string) => fromISO(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

export function FestivalBanner() {
  const nav = useNavigate()
  const f = festivalDays()
  if (f.state === 'over') return null
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={() => nav('/festival', { state: { shared: 'festival-hero' } })} className="festival-banner">
      <motion.img layoutId="festival-hero" src={FESTIVAL.image} alt="" className="img-cover" style={{ position: 'absolute', inset: 0, borderRadius: 28 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(11,11,10,.92) 0%, rgba(11,11,10,.55) 60%, rgba(11,11,10,.2))' }} />
      <span className="stack gap-6" style={{ position: 'relative', textAlign: 'start' }}>
        <Tag tone="amber">{f.state === 'soon' ? `Starts in ${f.days} day${f.days === 1 ? '' : 's'}` : `Live · ${f.days} days left`}</Tag>
        <span className="t-h2">{FESTIVAL.name}</span>
        <span className="t-body-s c-secondary">-{FESTIVAL.discount}% at {FESTIVAL.ids.length} restaurants · {fmt(FESTIVAL.start)} – {fmt(FESTIVAL.end)}</span>
      </span>
      <ChevronRight size={22} color="var(--amber)" style={{ position: 'relative', marginInlineStart: 'auto' }} />
    </motion.button>
  )
}

export function AwardsBanner() {
  const nav = useNavigate()
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={() => nav('/awards')} className="row gap-14 surface" style={{ width: '100%', padding: 14, borderRadius: 28, textAlign: 'start' }}>
      <span style={{ width: 52, height: 52, borderRadius: 26, background: 'var(--amber-tint)', color: 'var(--amber)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Trophy size={24} strokeWidth={1.6} /></span>
      <span className="stack grow"><span className="t-label-l">Sufra Awards {AWARDS_YEAR}</span><span className="t-body-s c-tertiary">The best tables in Riyadh, voted by diners</span></span>
      <ChevronRight size={20} color="var(--text-tertiary)" />
    </motion.button>
  )
}

/* ---------- Festival ---------- */
export function Festival() {
  const nav = useNavigate()
  const loc = useLocation()
  const shared = (loc.state as { shared?: string } | null)?.shared
  const alert = useStore(s => s.festivalAlert)
  const setAlert = useStore(s => s.setFestivalAlert)
  const setSearch = useStore(s => s.setSearch)
  const toast = useStore(s => s.toast)
  const f = festivalDays()
  const list = festivalRestaurants()
  const [cuisine, setCuisine] = useState('All')
  const cuisines = ['All', ...new Set(list.map(r => r.cuisine))]
  const shown = list.filter(r => cuisine === 'All' || r.cuisine === cuisine)
  useEffect(() => { if (f.state !== 'over') setSearch({ date: f.state === 'soon' ? FESTIVAL.start : toISO(new Date()) }) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Screen>
      <div style={{ position: 'relative', height: 340 }}>
        <motion.img layoutId={shared ?? 'festival-hero'} src={FESTIVAL.image} alt="" className="img-cover" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,11,10,.5) 0%, rgba(11,11,10,.1) 35%, rgba(11,11,10,.85) 80%, #0B0B0A)' }} />
        <Stagger className="stack gap-10 pad" style={{ position: 'absolute', insetInline: 0, bottom: 20 }}>
          <Item><Tag tone="amber">{fmt(FESTIVAL.start)} – {fmt(FESTIVAL.end)}</Tag></Item>
          <Item><h1 className="t-display" style={{ margin: 0 }}>{FESTIVAL.name}</h1></Item>
          <Item><span className="t-body c-secondary">Two weeks of -{FESTIVAL.discount}% on the food bill at {list.length} of Riyadh’s favourite restaurants.</span></Item>
        </Stagger>
      </div>
      <TopBar overlay />
      <div className="stack gap-16 pad" style={{ paddingBottom: 48 }}>
        <div className="row gap-10">
          {[{ v: f.state === 'soon' ? f.days : f.days, l: f.state === 'soon' ? 'days to go' : 'days left' }, { v: `-${FESTIVAL.discount}%`, l: 'on food' }, { v: list.length, l: 'restaurants' }].map(x => (
            <div key={x.l} className="surface stack grow" style={{ padding: '14px 16px', borderRadius: 24 }}>
              <span className="t-h2 c-amber">{x.v}</span><span className="t-caption c-tertiary">{x.l}</span>
            </div>
          ))}
        </div>
        {f.state === 'soon' && (
          <div className="list-item surface" style={{ padding: '8px 16px', borderRadius: 24 }}>
            <span className="lead" style={{ background: 'var(--amber-tint)', color: 'var(--amber)' }}>{alert ? <BellRing size={18} /> : <Bell size={18} />}</span>
            <span className="stack grow"><span className="t-label-l">Remind me when it starts</span><span className="t-caption c-tertiary">Festival tables go fast</span></span>
            <Toggle on={alert} onChange={v => { setAlert(v); if (v) toast('We’ll remind you on ' + fmt(FESTIVAL.start), 'amber') }} label="Festival reminder" />
          </div>
        )}
        <div className="stack gap-8">
          <span className="t-h3">How it works</span>
          {['Book a festival restaurant for any date between ' + fmt(FESTIVAL.start) + ' and ' + fmt(FESTIVAL.end) + '.', `The -${FESTIVAL.discount}% is applied to the food bill automatically.`, 'Pay the bill in Sufra and earn double points.'].map((x, i) => (
            <div key={i} className="row gap-12" style={{ alignItems: 'flex-start' }}>
              <span className="t-label c-amber" style={{ width: 24, height: 24, borderRadius: 12, background: 'var(--amber-tint)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{i + 1}</span>
              <span className="t-body-s c-secondary" style={{ paddingTop: 2 }}>{x}</span>
            </div>
          ))}
        </div>
        <div className="hscroll" style={{ gap: 8 }}>{cuisines.map(c => <Chip key={c} selected={cuisine === c} onClick={() => setCuisine(c)}>{c}</Chip>)}</div>
        <motion.div layout className="stack gap-10">
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map(r => (
              <motion.div key={r.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
                <CardRow r={r} ctx="festival" meta={`${r.cuisine} · ${r.area}`} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <Button variant="secondary" block onClick={() => nav('/explore')}>Browse all restaurants</Button>
      </div>
    </Screen>
  )
}

/* ---------- Awards ---------- */
export function Awards() {
  const [cat, setCat] = useState(AWARD_CATEGORIES[0])
  const nav = useNavigate()
  const winners = AWARDS.filter(a => a.category === cat).sort(a => (a.level === 'Winner' ? -1 : 1))
  const top = byId(AWARDS[0].restaurantId)!
  return (
    <Screen>
      <TopBar title={`Sufra Awards ${AWARDS_YEAR}`} />
      <div className="stack gap-16 pad" style={{ paddingBottom: 48 }}>
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => nav(`/restaurant/${top.id}`)} style={{ position: 'relative', height: 260, borderRadius: 28, overflow: 'hidden', textAlign: 'start' }}>
          <img src={top.image} alt="" className="img-cover" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,11,10,.1), rgba(11,11,10,.88))' }} />
          <span className="stack gap-8" style={{ position: 'absolute', insetInline: 18, bottom: 18 }}>
            <span className="tag award" style={{ alignSelf: 'flex-start' }}><Trophy size={13} strokeWidth={2} />Restaurant of the Year</span>
            <span className="t-h1">{top.name}</span>
            <span className="t-body-s c-secondary">{top.cuisine} · {top.area} · {top.rating.toFixed(1)}</span>
          </span>
        </motion.button>
        <span className="t-body-s c-tertiary">Chosen from more than 120,000 verified Sufra reviews this year.</span>
        <div className="hscroll" style={{ gap: 8 }}>{AWARD_CATEGORIES.map(c => <Chip key={c} selected={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>
        <Stagger key={cat} className="stack gap-10">
          {winners.map(a => {
            const r = byId(a.restaurantId)!
            return (
              <Item key={a.restaurantId} className="stack gap-6">
                <span className="row gap-6 t-caption" style={{ color: a.level === 'Winner' ? 'var(--amber)' : 'var(--text-tertiary)' }}><AwardIcon size={14} />{a.level}</span>
                <CardRow r={r} ctx="awards" />
              </Item>
            )
          })}
        </Stagger>
      </div>
    </Screen>
  )
}

/* ---------- Dietary preferences ---------- */
export function DietaryPrefs() {
  const d = useStore(s => s.dietary)
  const set = useStore(s => s.setDietary)
  const toast = useStore(s => s.toast)
  const nav = useNavigate()
  const flip = (k: 'diets' | 'allergies', v: string) => set({ [k]: d[k].includes(v) ? d[k].filter(x => x !== v) : [...d[k], v] })
  return (
    <Screen className="pb-bar">
      <TopBar title="Dietary preferences" />
      <Stagger className="stack gap-14 pad">
        <Item className="row gap-12 surface" style={{ padding: 14, background: 'var(--success-tint)' }}>
          <Leaf size={20} color="var(--success)" style={{ flexShrink: 0 }} />
          <span className="t-body-s c-secondary">We add these to every booking so the restaurant knows before you arrive.</span>
        </Item>
        <Item><span className="t-h3">Diet</span></Item>
        <Item className="row wrap gap-8">{DIETS.map(x => <Chip key={x} selected={d.diets.includes(x)} onClick={() => flip('diets', x)}>{x}</Chip>)}</Item>
        <Item style={{ marginTop: 6 }}><span className="t-h3">Allergies</span></Item>
        <Item className="row wrap gap-8">{ALLERGIES.map(x => <Chip key={x} selected={d.allergies.includes(x)} onClick={() => flip('allergies', x)}>{x}</Chip>)}</Item>
        <Item style={{ marginTop: 6 }}><TextArea label="Anything else" value={d.notes} onChange={v => set({ notes: v })} placeholder="e.g. no spicy food, halal only" /></Item>
        <Item className="list-item surface" style={{ padding: '8px 16px' }}>
          <span className="stack grow"><span className="t-label-l">Share with restaurants</span><span className="t-caption c-tertiary">Added automatically when you book</span></span>
          <Toggle on={d.share} onChange={v => set({ share: v })} label="Share dietary preferences" />
        </Item>
      </Stagger>
      <div className="fixed-cta"><Button block onClick={() => { toast('Preferences saved', 'success'); nav(-1) }}>Save</Button></div>
    </Screen>
  )
}

/* ---------- Set menus ---------- */
export function SetMenuCard({ m, selected, onClick, guests }: { m: SetMenu; selected?: boolean; onClick?: () => void; guests?: number }) {
  const tooFew = guests !== undefined && m.minGuests !== undefined && guests < m.minGuests
  return (
    <motion.button whileTap={{ scale: tooFew ? 1 : 0.98 }} onClick={tooFew ? undefined : onClick} className="row gap-14 surface"
      style={{ width: '100%', padding: 10, borderRadius: 24, textAlign: 'start', alignItems: 'stretch', opacity: tooFew ? 0.45 : 1, boxShadow: selected ? 'inset 0 0 0 1.5px var(--amber)' : 'none', transition: 'box-shadow .25s' }}>
      <img src={m.image} alt="" style={{ width: 84, height: 84, borderRadius: 16, objectFit: 'cover', flexShrink: 0 }} />
      <span className="stack gap-4 grow" style={{ paddingBlock: 2, minWidth: 0 }}>
        <span className="row between gap-8"><span className="t-label-l ellipsis">{m.name}</span>{selected && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 22, height: 22, borderRadius: 11, background: 'var(--amber)', color: 'var(--text-inverse)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Check size={14} strokeWidth={3} /></motion.span>}</span>
        <span className="t-caption c-tertiary" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.courses.join(' · ')}</span>
        <span className="row gap-8" style={{ marginTop: 'auto' }}><span className="t-label c-amber">SAR {m.price} / guest</span>{m.minGuests && <span className="t-caption c-tertiary">min {m.minGuests} guests</span>}</span>
      </span>
    </motion.button>
  )
}

/* ---------- Pay-the-bill push reminder ---------- */
export function PayPrompt() {
  const loc = useLocation()
  const nav = useNavigate()
  const seen = useStore(s => s.payPromptSeen)
  const see = useStore(s => s.seePayPrompt)
  const bookings = useStore(s => s.bookings)
  const target = useMemo(() => bookings.find(b => b.status === 'upcoming' && b.date === toISO(new Date()) && !b.billPaid), [bookings])
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (seen || !target || loc.pathname !== '/home') return
    const x = setTimeout(() => setShow(true), 3500)
    return () => clearTimeout(x)
  }, [seen, target, loc.pathname])
  useEffect(() => { if (show) { const x = setTimeout(() => { setShow(false); see() }, 7000); return () => clearTimeout(x) } }, [show, see])
  const r = target ? byId(target.restaurantId) : undefined
  return (
    <AnimatePresence>
      {show && r && target && (
        <motion.button className="push" initial={{ y: -120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -120, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          drag="y" dragConstraints={{ top: 0, bottom: 0 }} onDragEnd={(_, i) => { if (i.offset.y < -30) { setShow(false); see() } }}
          onClick={() => { setShow(false); see(); nav(`/booking/${target.id}/bill`) }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--amber)', color: 'var(--text-inverse)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Receipt size={20} /></span>
          <span className="stack grow" style={{ textAlign: 'start', minWidth: 0 }}>
            <span className="row between"><span className="t-label">Sufra</span><span className="t-caption c-tertiary">now</span></span>
            <span className="t-label-l ellipsis">Finished at {r.name}?</span>
            <span className="t-body-s c-secondary ellipsis">Pay your bill in seconds and earn points.</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export function GoogleLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path fill="#fff" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" />
      <path fill="#B5B3AE" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#8B8A86" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z" />
      <path fill="#fff" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 6 12 6Z" />
    </svg>
  )
}

