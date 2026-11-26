import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Bell, CalendarDays, ChevronRight, Clock, List, Map as MapIcon, MapPin, Search, SlidersHorizontal, Users, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen } from '@/app/Screen'
import { DateTimeSheet } from '@/components/booking/DateTimeSheet'
import { AreaSheet, FiltersSheet } from '@/components/discover/Sheets'
import { Button, IconButton } from '@/components/ui/Button'
import { Chip, FilterPill, Tag } from '@/components/ui/Chip'
import { Item, ListItem, SectionHeader, Skeleton, Stagger, TopBar } from '@/components/ui/Misc'
import { Rating } from '@/components/ui/Rating'
import { CardLarge, CardMini, CardRow, SaveButton, sharedId } from '@/components/ui/RestaurantCard'
import { TimeSlot } from '@/components/ui/TimeSlot'
import { CUISINES, TIMES, bestOffer, byId, collections, restaurants } from '@/data/restaurants'
import { img } from '@/data/images'
import { dayLabel } from '@/lib/date'
import { useFakeLoad } from '@/lib/hooks'
import { useStore } from '@/store'
import { activeCount, applyFilters, useFilters } from '@/store/filters'
import { t } from '@/i18n'
import { Wordmark } from '@/screens/onboarding/Onboarding'
import { AwardsBanner, FestivalBanner } from '@/screens/features/Features'

function BookingFilterBar({ onDate, onArea }: { onDate: () => void; onArea: () => void }) {
  const s = useStore(st => st.search)
  return (
    <div className="pill-bar">
      <FilterPill icon={<MapPin size={16} strokeWidth={1.6} />} active={s.area !== 'Any area'} onClick={onArea}>{s.area}</FilterPill>
      <FilterPill icon={<CalendarDays size={16} strokeWidth={1.6} />} active onClick={onDate}>{dayLabel(s.date)}</FilterPill>
      <FilterPill icon={<Users size={16} strokeWidth={1.6} />} onClick={onDate}>{t('common.guests', { n: s.guests })}</FilterPill>
    </div>
  )
}

export function Home() {
  const nav = useNavigate()
  const featured = byId('trattoria-sole')!
  const search = useStore(s => s.search)
  const setSearch = useStore(s => s.setSearch)
  const startDraft = useStore(s => s.startDraft)
  const [dateOpen, setDateOpen] = useState(false)
  const [areaOpen, setAreaOpen] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)
  const loading = useFakeLoad('home')
  const near = useMemo(() => restaurants.filter(r => search.area === 'Any area' || r.area === search.area).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6), [search.area])
  const offers = useMemo(() => [...restaurants].sort((a, b) => bestOffer(b) - bestOffer(a)).slice(0, 3), [])
  const pickSlot = (time: string) => {
    setSearch({ time })
    if ((featured.slots[time] ?? 0) < 0) { setBookOpen(true); return }
    startDraft({ restaurantId: featured.id, time })
    nav('/book/details')
  }
  const openFeatured = () => nav(`/restaurant/${featured.id}`, { state: { shared: sharedId(featured.id, 'hero') } })
  return (
    <Screen className="pb-nav">
      <div style={{ position: 'relative', height: 560 }}>
        <motion.img layoutId={sharedId(featured.id, 'hero')} src={featured.image} alt="" className="img-cover" onClick={openFeatured} style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(11,11,10,.45) 0%, rgba(11,11,10,0) 30%, rgba(11,11,10,.85) 72%, #0B0B0A 100%)' }} />
        <div className="row between pad" style={{ position: 'absolute', top: 'calc(var(--status-h) + 8px)', insetInline: 0 }}>
          <Wordmark size={30} />
          <span className="row gap-10">
            <IconButton variant="glass" label="Search" onClick={() => nav('/explore')}><Search size={20} strokeWidth={1.6} /></IconButton>
            <IconButton variant="glass" label="Notifications" onClick={() => nav('/notifications')} style={{ position: 'relative' }}>
              <Bell size={20} strokeWidth={1.6} /><span style={{ position: 'absolute', top: 10, insetInlineEnd: 11, width: 8, height: 8, borderRadius: 4, background: 'var(--amber)' }} />
            </IconButton>
          </span>
        </div>
        <Stagger className="stack gap-10 pad" style={{ position: 'absolute', insetInline: 0, bottom: 36 }}>
          <Item className="row gap-8"><Tag tone="glass">{t('home.tonightsPick')}</Tag><span className="t-body-s c-secondary">{featured.cuisine} · {featured.area}</span></Item>
          <Item className="row between gap-12">
            <button className="t-display ellipsis" style={{ textAlign: 'start' }} onClick={openFeatured}>{featured.name}</button>
            <SaveButton id={featured.id} />
          </Item>
          <Item><p className="t-body c-tertiary" style={{ margin: 0 }}>{featured.description}</p></Item>
          <Item className="row gap-6"><Rating value={featured.rating} count={featured.reviewsCount} /><span className="t-body-s c-tertiary">· SAR {featured.priceAvg} avg</span></Item>
        </Stagger>
      </div>
      <div className="stack gap-24 pad" style={{ marginTop: -16, position: 'relative' }}>
        <div className="stack gap-12">
          <BookingFilterBar onDate={() => setDateOpen(true)} onArea={() => setAreaOpen(true)} />
          <div className="hscroll" style={{ gap: 8 }}>
            {TIMES.slice(0, 7).map(x => <TimeSlot key={x} time={x} discount={featured.slots[x]} selected={x === search.time} onClick={() => pickSlot(x)} />)}
          </div>
        </div>
        <FestivalBanner />
        <div className="stack gap-12">
          <SectionHeader title={t('home.nearYou')} action={t('common.seeAll')} onAction={() => { useFilters.getState().set({ sort: 'nearest', q: '' }); nav('/search') }} />
          <div className="hscroll">
            {loading ? [0, 1, 2].map(i => <Skeleton key={i} h={200} w={160} />) : near.map(r => <CardMini key={r.id} r={r} ctx="near" />)}
          </div>
        </div>
        <div className="stack gap-12">
          <SectionHeader title={t('home.offers')} action={t('common.seeAll')} onAction={() => nav('/offers')} />
          <Stagger className="stack gap-10">
            {loading ? [0, 1, 2].map(i => <Skeleton key={i} h={104} />) : offers.map(r => <Item key={r.id}><CardRow r={r} ctx="offers" /></Item>)}
          </Stagger>
        </div>
        <div className="stack gap-12">
          <SectionHeader title={t('home.collections')} />
          <AwardsBanner />
          <div className="hscroll">
            {collections.map(c => (
              <motion.button key={c.id} whileTap={{ scale: 0.97 }} onClick={() => nav(`/collection/${c.id}`, { state: { shared: `col-${c.id}` } })} style={{ position: 'relative', width: 240, height: 150, borderRadius: 24, overflow: 'hidden', textAlign: 'start' }}>
                <motion.img layoutId={`col-${c.id}`} src={c.image} alt="" className="img-cover" style={{ position: 'absolute', inset: 0, borderRadius: 24 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,.75))' }} />
                <div style={{ position: 'absolute', insetInline: 16, bottom: 14 }} className="stack">
                  <span className="t-h3">{c.title}</span><span className="t-caption c-secondary">{c.ids.length} restaurants</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <DateTimeSheet open={dateOpen} onClose={() => setDateOpen(false)} />
      <DateTimeSheet open={bookOpen} onClose={() => setBookOpen(false)} restaurant={featured} />
      <AreaSheet open={areaOpen} onClose={() => setAreaOpen(false)} value={search.area} onChange={a => setSearch({ area: a })} />
    </Screen>
  )
}

export function Explore() {
  const nav = useNavigate()
  const recent = useStore(s => s.recent)
  const addRecent = useStore(s => s.addRecent)
  const clearRecent = useStore(s => s.clearRecent)
  const f = useFilters()
  const [q, setQ] = useState('')
  const live = useMemo(() => (q.trim() ? applyFilters({ ...useFilters.getState(), q, cuisine: null, area: 'Any area' }) : []), [q])
  const go = (query: string, cuisine: string | null = null) => {
    if (query) addRecent(query)
    f.set({ q: query, cuisine })
    nav('/search')
  }
  return (
    <Screen className="pb-nav">
      <div className="stack gap-16 pad pt-status" style={{ paddingTop: 'calc(var(--status-h) + 12px)' }}>
        <h1 className="t-h1" style={{ margin: 0 }}>{t('explore.title')}</h1>
        <form onSubmit={e => { e.preventDefault(); go(q.trim()) }} className="field" style={{ borderRadius: 999, height: 52, paddingInlineStart: 18 }}>
          <Search size={20} strokeWidth={1.6} color="var(--text-secondary)" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('explore.search')} aria-label={t('explore.search')} />
          {q && <IconButton size="sm" variant="ghost" label="Clear" onClick={() => setQ('')}><X size={18} /></IconButton>}
        </form>
        <AnimatePresence mode="wait">
          {q.trim() ? (
            <motion.div key="live" className="stack gap-10" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {live.length === 0 && <div className="empty t-body">{t('explore.noResults')}</div>}
              {live.slice(0, 5).map(r => <CardRow key={r.id} r={r} ctx="live" />)}
              {live.length > 5 && <Button variant="secondary" onClick={() => go(q.trim())}>{t('common.seeAll')} ({live.length})</Button>}
            </motion.div>
          ) : (
            <motion.div key="idle" className="stack gap-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {recent.length > 0 && (
                <div className="stack gap-4">
                  <SectionHeader title={t('explore.recent')} action={t('common.clear')} onAction={clearRecent} />
                  {recent.map(r => <ListItem key={r} icon={<Clock size={18} strokeWidth={1.6} />} label={r} onClick={() => go(r)} />)}
                </div>
              )}
              <div className="stack gap-12">
                <SectionHeader title={t('explore.cuisines')} />
                <div className="row wrap gap-8">{CUISINES.map(c => <Chip key={c} onClick={() => go('', c)}>{c}</Chip>)}</div>
              </div>
              <div className="stack gap-12">
                <SectionHeader title={t('explore.trending')} action={t('common.seeAll')} onAction={() => go('')} />
                <Stagger className="stack gap-10">{restaurants.slice(2, 5).map(r => <Item key={r.id}><CardRow r={r} ctx="trending" /></Item>)}</Stagger>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  )
}

function SearchHeader({ onFilters, back }: { onFilters: () => void; back?: () => void }) {
  const nav = useNavigate()
  const f = useFilters()
  const n = activeCount(f)
  const label = f.q || f.cuisine || 'All restaurants'
  return (
    <div className="row gap-10">
      <IconButton size="lg" variant="surface" label="Back" onClick={back ?? (() => nav(-1))}><ArrowLeft size={20} strokeWidth={1.6} /></IconButton>
      <div className="field grow" style={{ borderRadius: 999, height: 52, paddingInlineStart: 18, paddingInlineEnd: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        <Search size={20} strokeWidth={1.6} color="var(--text-secondary)" />
        <input value={f.q} placeholder={label} onChange={e => f.set({ q: e.target.value })} aria-label="Search" />
        <IconButton variant="raised" label="Filters" onClick={onFilters} style={{ position: 'relative' }}>
          <SlidersHorizontal size={18} strokeWidth={1.6} />
          {n > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="t-micro" style={{ position: 'absolute', top: -2, insetInlineEnd: -2, minWidth: 18, height: 18, borderRadius: 9, background: 'var(--amber)', color: 'var(--text-inverse)', display: 'grid', placeItems: 'center' }}>{n}</motion.span>}
        </IconButton>
      </div>
    </div>
  )
}

function QuickFilters({ onDate, onArea }: { onDate: () => void; onArea: () => void }) {
  const f = useFilters()
  const s = useStore(st => st.search)
  return (
    <div className="hscroll" style={{ gap: 8 }}>
      <FilterPill active icon={<CalendarDays size={16} strokeWidth={1.6} />} onClick={onDate}>{dayLabel(s.date)} · {s.time}</FilterPill>
      <FilterPill active icon={<Users size={16} strokeWidth={1.6} />} onClick={onDate}>{t('common.guests', { n: s.guests })}</FilterPill>
      <FilterPill active={f.area !== 'Any area'} icon={<MapPin size={16} strokeWidth={1.6} />} onClick={onArea}>{f.area}</FilterPill>
      {f.cuisine && <Chip selected onClick={() => f.set({ cuisine: null })}>{f.cuisine} ✕</Chip>}
      <Chip selected={f.offersOnly} onClick={() => f.set({ offersOnly: !f.offersOnly })}>{t('explore.offersOnly')}</Chip>
      <Chip selected={f.sort === 'top'} onClick={() => f.set({ sort: f.sort === 'top' ? 'recommended' : 'top' })}>{t('explore.topRated')}</Chip>
    </div>
  )
}

export function Results() {
  const nav = useNavigate()
  const f = useFilters()
  const s = useStore(st => st.search)
  const list = applyFilters(f)
  const loading = useFakeLoad('results')
  const [filters, setFilters] = useState(false)
  const [date, setDate] = useState(false)
  const [area, setArea] = useState(false)
  return (
    <Screen>
      <div className="stack gap-12 pad" style={{ paddingTop: 'calc(var(--status-h) + 4px)', paddingBottom: 120 }}>
        <SearchHeader onFilters={() => setFilters(true)} />
        <QuickFilters onDate={() => setDate(true)} onArea={() => setArea(true)} />
        <div className="row gap-6"><span className="t-label">{t('explore.results', { n: list.length })}</span><span className="t-body-s c-tertiary">{t('explore.available', { when: dayLabel(s.date).toLowerCase() })}</span></div>
        {loading ? [0, 1, 2].map(i => <Skeleton key={i} h={230} r={28} />) : (
          <motion.div layout className="stack gap-14">
            <AnimatePresence initial={false}>
              {list.map((r, i) => (
                <motion.div key={r.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 6) * 0.04 } }} exit={{ opacity: 0, scale: 0.96 }}>
                  <CardLarge r={r} ctx="results" />
                </motion.div>
              ))}
            </AnimatePresence>
            {list.length === 0 && <div className="empty t-body">{t('explore.noResults')}<div style={{ marginTop: 16 }}><Button variant="secondary" size="md" onClick={f.reset}>{t('common.reset')}</Button></div></div>}
          </motion.div>
        )}
      </div>
      <motion.div initial={{ y: 100, x: '-50%' }} animate={{ y: 0, x: '-50%' }} transition={{ type: 'spring', stiffness: 300, damping: 34, delay: 0.25 }} style={{ position: 'fixed', bottom: 'calc(40px + var(--safe-bottom))', left: '50%', zIndex: 30 }}>
        <Button size="md" leading={<MapIcon size={18} strokeWidth={1.6} />} onClick={() => nav('/map')} style={{ boxShadow: '0 8px 24px rgba(0,0,0,.45)' }}>{t('explore.map')}</Button>
      </motion.div>
      <FiltersSheet open={filters} onClose={() => setFilters(false)} />
      <DateTimeSheet open={date} onClose={() => setDate(false)} />
      <AreaSheet open={area} onClose={() => setArea(false)} value={f.area} onChange={a => f.set({ area: a })} />
    </Screen>
  )
}

export function MapView() {
  const nav = useNavigate()
  const f = useFilters()
  const list = applyFilters(f)
  const [sel, setSel] = useState<string | null>(list[0]?.id ?? null)
  const [filters, setFilters] = useState(false)
  const [date, setDate] = useState(false)
  const [area, setArea] = useState(false)
  const r = sel ? byId(sel) : undefined
  return (
    <Screen scroll={false}>
      <motion.div initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }} style={{ position: 'absolute', inset: 0 }} onClick={() => setSel(null)}>
        <img src={img.map} alt="" className="img-cover" />
        {list.map((x, i) => {
          const on = x.id === sel
          const off = bestOffer(x)
          return (
            <motion.button key={x.id} className={`map-pin ${on ? 'sel' : ''}`} style={{ left: `${x.map.x + 8}%`, top: `${x.map.y + 14}%`, zIndex: on ? 5 : 3 }}
              initial={{ scale: 0, y: 10 }} animate={{ scale: on ? 1.12 : 1, y: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 38, delay: 0.2 + i * 0.03 }}
              onClick={e => { e.stopPropagation(); setSel(x.id) }}>
              <span className="bubble">{off > 0 ? `-${off}%` : `SAR ${x.priceAvg}`}</span><span className="tail" />
            </motion.button>
          )
        })}
        <span style={{ position: 'absolute', left: '52%', top: '56%', width: 18, height: 18, borderRadius: 9, background: 'var(--amber)', border: '3px solid #fff', boxShadow: '0 0 0 8px rgba(232,179,106,.25)' }} />
      </motion.div>
      <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 220, background: 'linear-gradient(180deg, rgba(11,11,10,.9), rgba(11,11,10,0))', pointerEvents: 'none', zIndex: 9 }} />
      <div className="stack gap-12 pad" style={{ position: 'absolute', insetInline: 0, top: 'calc(var(--status-h) + 4px)', zIndex: 10 }}>
        <SearchHeader onFilters={() => setFilters(true)} />
        <QuickFilters onDate={() => setDate(true)} onArea={() => setArea(true)} />
      </div>
      <div className="stack gap-12 pad" style={{ position: 'absolute', insetInline: 0, bottom: 'calc(40px + var(--safe-bottom))', alignItems: 'center', zIndex: 10 }}>
        <Button variant="glass" size="md" leading={<List size={18} strokeWidth={1.6} />} onClick={() => nav(-1)}>{t('explore.list')}</Button>
        <div style={{ width: '100%', minHeight: 104 }}>
          <AnimatePresence mode="popLayout">
            {r && (
              <motion.div key={r.id} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 38 }} style={{ boxShadow: '0 10px 30px rgba(0,0,0,.5)', borderRadius: 24 }}>
                <CardRow r={r} ctx="map" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <FiltersSheet open={filters} onClose={() => setFilters(false)} />
      <DateTimeSheet open={date} onClose={() => setDate(false)} />
      <AreaSheet open={area} onClose={() => setArea(false)} value={f.area} onChange={a => f.set({ area: a })} />
    </Screen>
  )
}

export function Offers() {
  const nav = useNavigate()
  const startDraft = useStore(s => s.startDraft)
  const list = restaurants.filter(r => bestOffer(r) > 0).sort((a, b) => bestOffer(b) - bestOffer(a))
  return (
    <Screen>
      <TopBar title={t('offersPage.title')} />
      <div className="stack gap-16 pad" style={{ paddingBottom: 40 }}>
        <span className="t-body-s c-tertiary">{t('offersPage.subtitle')}</span>
        <Stagger className="stack gap-16">
          {list.map(r => (
            <Item key={r.id} className="surface stack gap-12" style={{ padding: 12 }}>
              <CardRow r={r} ctx="offerpage" meta={`${r.cuisine} · ${r.area}`} />
              <div className="hscroll" style={{ gap: 8, marginInline: -12, paddingInline: 12, scrollPaddingInline: 12 }}>
                {Object.entries(r.slots).filter(([, d]) => d > 0).map(([time, d]) => (
                  <TimeSlot key={time} time={time} discount={d} onClick={() => { startDraft({ restaurantId: r.id, time }); nav('/book/details') }} />
                ))}
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </Screen>
  )
}

export function Collection() {
  const { id } = useParams()
  const c = collections.find(x => x.id === id) ?? collections[0]
  const nav = useNavigate()
  return (
    <Screen>
      <div style={{ position: 'relative', height: 300 }}>
        <motion.img layoutId={`col-${c.id}`} src={c.image} alt="" className="img-cover" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,11,10,.5), rgba(11,11,10,0) 35%, rgba(11,11,10,.9) 85%, #0B0B0A)' }} />
        <TopBar overlay />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="stack pad" style={{ position: 'absolute', insetInline: 0, bottom: 16 }}>
          <span className="t-h1">{c.title}</span><span className="t-body-s c-secondary">{c.ids.length} restaurants · curated by Sufra</span>
        </motion.div>
      </div>
      <Stagger className="stack gap-10 pad" style={{ paddingTop: 12, paddingBottom: 40 }}>
        {c.ids.map(i => byId(i)!).map(r => <Item key={r.id}><CardRow r={r} ctx={`col-${c.id}`} /></Item>)}
        <Item><Button variant="secondary" block onClick={() => nav('/explore')} trailing={<ChevronRight size={18} />}>{t('explore.title')}</Button></Item>
      </Stagger>
    </Screen>
  )
}
