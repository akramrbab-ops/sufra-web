import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Clock, MapPin, Navigation, Percent, Phone, Share2, X } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Screen } from '@/app/Screen'
import { DateTimeSheet } from '@/components/booking/DateTimeSheet'
import { Button, IconButton } from '@/components/ui/Button'
import { Chip, Tag } from '@/components/ui/Chip'
import { InfoRow, Item, ReviewCard, SectionHeader, Stagger, TopBar } from '@/components/ui/Misc'
import { Rating } from '@/components/ui/Rating'
import { SaveButton } from '@/components/ui/RestaurantCard'
import { bestOffer, byId, restaurants, type Restaurant as R } from '@/data/restaurants'
import { img } from '@/data/images'
import { dayLabel } from '@/lib/date'
import { useStore } from '@/store'
import { t } from '@/i18n'
import { FESTIVAL, inFestival, setMenusFor } from '@/data/extras'
import { AwardBadge } from '@/components/ui/AwardBadge'
import { SetMenuCard, festivalDays } from '@/screens/features/Features'

type Tab = 'overview' | 'menu' | 'reviews' | 'info'

function Gallery({ r, sharedId, onOpen }: { r: R; sharedId?: string; onOpen: (i: number) => void }) {
  const [i, setI] = useState(0)
  const n = r.gallery.length
  return (
    <div style={{ position: 'relative', height: 400, overflow: 'hidden', touchAction: 'pan-y' }}>
      <motion.div className="row" style={{ height: '100%', width: `${n * 100}%` }} animate={{ x: `${(-i * 100) / n}%` }} transition={{ type: 'spring', stiffness: 300, damping: 34 }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25}
        onDragEnd={(_, info) => { if (info.offset.x < -60 && i < n - 1) setI(i + 1); else if (info.offset.x > 60 && i > 0) setI(i - 1) }}>
        {r.gallery.map((src, k) => (
          <div key={k} style={{ width: `${100 / n}%`, height: '100%', position: 'relative' }} onClick={() => onOpen(k)}>
            {k === 0 && sharedId ? (
              <motion.img layoutId={sharedId} src={src} alt="" className="img-cover" draggable={false} style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
            ) : (
              <img src={src} alt="" className="img-cover" draggable={false} style={{ position: 'absolute', inset: 0 }} />
            )}
          </div>
        ))}
      </motion.div>
      <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 160, background: 'linear-gradient(180deg, rgba(11,11,10,.55), rgba(11,11,10,0))', pointerEvents: 'none' }} />
      <div className="row gap-6" style={{ position: 'absolute', bottom: 58, left: '50%', transform: 'translateX(-50%)' }}>
        {r.gallery.map((_, k) => <motion.span key={k} animate={{ width: k === i ? 18 : 6, opacity: k === i ? 1 : 0.45 }} style={{ height: 6, borderRadius: 3, background: '#fff' }} />)}
      </div>
    </div>
  )
}

function OfferBanner({ r, onClick }: { r: R; onClick: () => void }) {
  const off = bestOffer(r)
  if (!off) return null
  const best = Object.entries(r.slots).filter(([, d]) => d === off).map(([x]) => x)
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={onClick} className="row gap-12" style={{ padding: '12px 14px 12px 12px', borderRadius: 24, background: 'var(--amber-tint)', textAlign: 'start' }}>
      <span style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--amber)', color: 'var(--text-inverse)', display: 'grid', placeItems: 'center' }}><Percent size={20} /></span>
      <span className="stack grow"><span className="t-label-l">{t('restaurant.offerOnBill', { d: `-${off}%` })}</span><span className="t-caption c-amber">{t('common.tonight')} · {best[0]}{best.length > 1 ? ` – ${best[best.length - 1]}` : ''} PM</span></span>
      <ChevronRight size={18} color="var(--amber)" />
    </motion.button>
  )
}

function ScoreBars({ r }: { r: R }) {
  const rows: [string, number][] = [[t('restaurant.food'), r.subScores.food], [t('restaurant.service'), r.subScores.service], [t('restaurant.ambience'), r.subScores.ambience], [t('restaurant.value'), r.subScores.value]]
  return (
    <div className="surface stack gap-16" style={{ padding: 20, borderRadius: 28 }}>
      <div className="row gap-14"><span style={{ fontSize: 48, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1 }}>{r.rating.toFixed(1)}</span><span className="stack"><span className="t-h3">{r.rating >= 9 ? t('restaurant.excellent') : t('restaurant.veryGood')}</span><span className="t-caption c-tertiary">{t('restaurant.verified', { n: r.reviewsCount.toLocaleString() })}</span></span></div>
      {rows.map(([l, v], i) => (
        <div key={l} className="row gap-12">
          <span className="t-body-s c-secondary" style={{ width: 76 }}>{l}</span>
          <div className="progress grow"><motion.div initial={{ width: 0 }} animate={{ width: `${v * 10}%` }} transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.32, 0.72, 0, 1] }} /></div>
          <span className="t-label">{v.toFixed(1)}</span>
        </div>
      ))}
    </div>
  )
}

export function Restaurant() {
  const { id } = useParams()
  const r = byId(id ?? '') ?? restaurants[0]
  const loc = useLocation()
  const nav = useNavigate()
  const shared = (loc.state as { shared?: string } | null)?.shared
  const search = useStore(s => s.search)
  const toast = useStore(s => s.toast)
  const [tab, setTab] = useState<Tab>((loc.state as { tab?: Tab } | null)?.tab ?? 'overview')
  const [book, setBook] = useState(false)
  const [menuCat, setMenuCat] = useState(0)
  const startDraft = useStore(s => s.startDraft)
  const setMenus = setMenusFor(r.id)
  const fest = inFestival(r.id) && festivalDays().state !== 'over'
  const menuTabs = [...(setMenus.length ? ['Set menus'] : []), ...r.menu.map(s => s.title)]
  const [pickedMenu, setPickedMenu] = useState<string | undefined>()
  const bookSetMenu = (smId: string) => { setPickedMenu(smId); setBook(true) }
  void startDraft
  const [reviewSort, setReviewSort] = useState('recent')
  const reviews = [...r.reviews].sort((a, b) => (reviewSort === 'high' ? b.score - a.score : reviewSort === 'low' ? a.score - b.score : 0)).filter(x => reviewSort !== 'photos' || x.photos)
  const tabs: [Tab, string][] = [['overview', t('restaurant.overview')], ['menu', t('restaurant.menu')], ['reviews', t('restaurant.reviews')], ['info', t('restaurant.info')]]
  const share = async () => {
    try { await navigator.clipboard?.writeText(`${r.name} on Sufra`) } catch { /* ignore */ }
    toast('Link copied', 'success')
  }
  return (
    <Screen className="pb-bar">
      <Gallery r={r} sharedId={shared} onOpen={i => nav(`/restaurant/${r.id}/gallery`, { state: { i } })} />
      <TopBar overlay right={<><IconButton variant="glass" label="Share" onClick={share}><Share2 size={20} strokeWidth={1.6} /></IconButton><SaveButton id={r.id} /></>} />
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1], delay: 0.08 }}
        className="stack gap-14 pad" style={{ position: 'relative', marginTop: -32, paddingTop: 24, background: 'var(--bg-base)', borderRadius: '32px 32px 0 0', minHeight: 500 }}>
        <h1 className="t-display" style={{ margin: 0 }}>{r.name}</h1>
        <span className="t-body c-secondary">{r.cuisine} · {r.area} · SAR {r.priceAvg} avg</span>
        <div className="row gap-8 wrap"><Rating value={r.rating} count={r.reviewsCount} />{r.badges.map(b => <Tag key={b}>{b}</Tag>)}{r.pointsMultiplier && <Tag tone="amber">2× points</Tag>}<AwardBadge id={r.id} /></div>
        {fest && (
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => nav('/festival')} className="row gap-12" style={{ padding: '12px 14px 12px 12px', borderRadius: 24, background: 'var(--bg-surface)', border: '1px solid rgba(232,179,106,.35)', textAlign: 'start' }}>
            <span className="t-label" style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--amber-tint)', color: 'var(--amber)', display: 'grid', placeItems: 'center' }}>-{FESTIVAL.discount}%</span>
            <span className="stack grow"><span className="t-label-l">Part of {FESTIVAL.name}</span><span className="t-caption c-tertiary">-{FESTIVAL.discount}% on food · 1 – 14 Dec</span></span>
            <ChevronRight size={18} color="var(--amber)" />
          </motion.button>
        )}
        <OfferBanner r={r} onClick={() => setBook(true)} />
        <div className="hscroll" style={{ gap: 8 }}>{tabs.map(([k, l]) => <Chip key={k} selected={tab === k} onClick={() => setTab(k)}>{l}</Chip>)}</div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} className="stack gap-16" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
            {tab === 'overview' && (
              <>
                <p className="t-body c-secondary" style={{ margin: 0 }}>{r.description}</p>
                <InfoRow icon={<MapPin size={20} strokeWidth={1.6} />} label={t('restaurant.address')} value={r.address} />
                <InfoRow icon={<Clock size={20} strokeWidth={1.6} />} label={t('restaurant.hours')} value={`${t('common.open')} · ${r.hours}`} />
                {setMenus.length > 0 && (
                  <>
                    <SectionHeader title="Set menus" action={t('common.seeAll')} onAction={() => { setTab('menu'); setMenuCat(0) }} />
                    <div className="stack gap-10">{setMenus.map(m => <SetMenuCard key={m.id} m={m} onClick={() => bookSetMenu(m.id)} />)}</div>
                  </>
                )}
                <SectionHeader title="Popular dishes" action={t('common.seeAll')} onAction={() => setTab('menu')} />
                <div className="hscroll">
                  {r.menu.flatMap(s => s.items).filter(x => x.image).slice(0, 5).map(x => (
                    <div key={x.id} className="stack gap-8" style={{ width: 148 }}>
                      <img src={x.image} alt="" style={{ width: 148, height: 120, borderRadius: 20, objectFit: 'cover' }} />
                      <span className="t-label ellipsis">{x.name}</span><span className="t-caption c-amber">SAR {x.price}</span>
                    </div>
                  ))}
                </div>
                <SectionHeader title={t('restaurant.reviews')} action={t('common.seeAll')} onAction={() => setTab('reviews')} />
                <ReviewCard r={r.reviews[0]} />
              </>
            )}
            {tab === 'menu' && (
              <>
                <div className="hscroll" style={{ gap: 8 }}>{menuTabs.map((s, i) => <Chip key={s} selected={i === menuCat} onClick={() => setMenuCat(i)}>{s}</Chip>)}</div>
                {setMenus.length > 0 && menuCat === 0 ? (
                  <Stagger key="sm" className="stack gap-10">
                    <Item><span className="t-body-s c-tertiary">Book a table with a set menu and the kitchen prepares it for your arrival. You pay at the restaurant.</span></Item>
                    {setMenus.map(m => <Item key={m.id}><SetMenuCard m={m} onClick={() => bookSetMenu(m.id)} /></Item>)}
                  </Stagger>
                ) : (
                <Stagger key={menuCat} className="stack">
                  {r.menu[menuCat - (setMenus.length ? 1 : 0)].items.map((x, i) => (
                    <Item key={x.id}>
                      {i > 0 && <div className="divider" />}
                      <div className="row gap-16" style={{ padding: '14px 0', alignItems: 'flex-start' }}>
                        <div className="stack gap-6 grow"><span className="t-label-l">{x.name}</span><span className="t-body-s c-tertiary">{x.desc}</span><span className="t-label c-amber">SAR {x.price}</span></div>
                        {x.image && <img src={x.image} alt="" style={{ width: 88, height: 88, borderRadius: 16, objectFit: 'cover' }} />}
                      </div>
                    </Item>
                  ))}
                </Stagger>
                )}
              </>
            )}
            {tab === 'reviews' && (
              <>
                <ScoreBars r={r} />
                <div className="hscroll" style={{ gap: 8 }}>
                  {[['recent', t('restaurant.mostRecent')], ['high', t('restaurant.highest')], ['low', t('restaurant.lowest')], ['photos', t('restaurant.withPhotos')]].map(([k, l]) => <Chip key={k} selected={reviewSort === k} onClick={() => setReviewSort(k)}>{l}</Chip>)}
                </div>
                <Stagger key={reviewSort} className="stack gap-12">{reviews.map(x => <Item key={x.id}><ReviewCard r={x} /></Item>)}</Stagger>
              </>
            )}
            {tab === 'info' && (
              <>
                <div style={{ position: 'relative', height: 160, borderRadius: 24, overflow: 'hidden' }}>
                  <img src={img.map} alt="" className="img-cover" style={{ objectPosition: `${r.map.x}% ${r.map.y}%` }} />
                  <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 40, height: 40, borderRadius: 20, background: 'var(--amber)', color: 'var(--text-inverse)', display: 'grid', placeItems: 'center', boxShadow: '0 0 0 10px rgba(232,179,106,.25)' }}><MapPin size={20} /></span>
                </div>
                <InfoRow icon={<MapPin size={20} strokeWidth={1.6} />} label={t('restaurant.address')} value={r.address} />
                <InfoRow icon={<Clock size={20} strokeWidth={1.6} />} label={t('restaurant.hours')} value={r.hours} />
                <InfoRow icon={<Phone size={20} strokeWidth={1.6} />} label={t('restaurant.phone')} value={r.phone} trailing={<a href={`tel:${r.phone.replace(/\s/g, '')}`} className="t-label">Call</a>} />
                <Button variant="glass" block leading={<Navigation size={18} strokeWidth={1.6} />} onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(r.name + ' ' + r.address)}`, '_blank')}>{t('restaurant.directions')}</Button>
                <span className="t-h3">{t('restaurant.amenities')}</span>
                <div className="row wrap gap-8">{r.amenities.map(a => <Tag key={a}>{a}</Tag>)}</div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <motion.div className="book-bar" initial={{ y: 120 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.25 }}>
        <span className="stack"><span className="t-label-l">{dayLabel(search.date)} · {t('common.guests', { n: search.guests })}</span>{bestOffer(r) > 0 && <span className="t-caption c-amber">{t('restaurant.offersUpTo', { n: `-${bestOffer(r)}%` })}</span>}</span>
        <Button onClick={() => setBook(true)}>{t('restaurant.bookTable')}</Button>
      </motion.div>
      <DateTimeSheet open={book} onClose={() => { setBook(false); setPickedMenu(undefined) }} restaurant={r} setMenuId={pickedMenu} />
    </Screen>
  )
}

export function GalleryViewer() {
  const { id } = useParams()
  const r = byId(id ?? '') ?? restaurants[0]
  const loc = useLocation()
  const nav = useNavigate()
  const [i, setI] = useState((loc.state as { i?: number } | null)?.i ?? 0)
  return (
    <Screen scroll={false} className="">
      <div style={{ position: 'absolute', inset: 0, background: '#000' }} />
      <AnimatePresence initial={false} mode="popLayout">
        <motion.img key={i} src={r.gallery[i]} alt="" drag="x" dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => { if (info.offset.x < -60) setI(Math.min(r.gallery.length - 1, i + 1)); else if (info.offset.x > 60) setI(Math.max(0, i - 1)) }}
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.3 }}
          style={{ position: 'absolute', left: 0, right: 0, top: '50%', marginTop: -220, width: '100%', height: 440, objectFit: 'cover' }} draggable={false} />
      </AnimatePresence>
      <div className="row between pad" style={{ position: 'absolute', top: 'calc(var(--status-h) + 8px)', insetInline: 0 }}>
        <span className="t-label">{i + 1} / {r.gallery.length}</span>
        <IconButton variant="glass" label="Close" onClick={() => nav(-1)}><X size={20} /></IconButton>
      </div>
      <div className="row gap-8 center" style={{ position: 'absolute', insetInline: 0, bottom: 'calc(48px + var(--safe-bottom))' }}>
        {r.gallery.map((src, k) => (
          <motion.button key={k} onClick={() => setI(k)} animate={{ opacity: k === i ? 1 : 0.45, scale: k === i ? 1.08 : 1 }} style={{ width: 56, height: 56, borderRadius: 14, overflow: 'hidden', border: k === i ? '2px solid #fff' : '2px solid transparent' }}>
            <img src={src} alt="" className="img-cover" />
          </motion.button>
        ))}
      </div>
    </Screen>
  )
}
