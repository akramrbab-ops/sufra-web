import { AnimatePresence, motion } from 'framer-motion'
import { Leaf, Receipt, Trophy } from 'lucide-react'
import { Bell, CalendarCheck, ChevronDown, CreditCard, Gift, Globe, Heart, HelpCircle, LogOut, Mail, MessageSquare, Pencil, Percent, Phone, Plus, Send, Settings as SettingsIcon, ShieldCheck, Sparkles, Star, Trash2, User, UserPlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '@/app/Screen'
import { Button, IconButton } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Chip'
import { Radio, Toggle } from '@/components/ui/Controls'
import { Input } from '@/components/ui/Input'
import { Avatar, Item, ListItem, Stagger, TopBar } from '@/components/ui/Misc'
import { CardRow } from '@/components/ui/RestaurantCard'
import { Sheet } from '@/components/ui/Sheet'
import { byId } from '@/data/restaurants'
import { useStore, tierFor, type Card } from '@/store'
import { CardIcon, cardLabel } from '@/screens/booking/Booking'
import { t } from '@/i18n'

const initials = (n: string) => n.split(' ').filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase()

export function RewardsCard({ onClick }: { onClick?: () => void }) {
  const points = useStore(s => s.points)
  const tier = tierFor(points)
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={onClick} className="stack gap-12" style={{ width: '100%', textAlign: 'start', padding: '18px 20px', borderRadius: 28, background: 'var(--amber-tint)', border: '1px solid var(--border-subtle)' }}>
      <span className="row between"><span className="row gap-6 t-label c-amber"><Sparkles size={16} />{t('rewards.title')}</span><Tag tone="amber">{tier.tier}</Tag></span>
      <motion.span key={points} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="t-display">{points.toLocaleString()} points</motion.span>
      <div className="progress"><motion.div initial={{ width: 0 }} animate={{ width: `${tier.pct}%` }} transition={{ duration: 1, ease: [0.32, 0.72, 0, 1], delay: 0.2 }} /></div>
      <span className="t-caption c-secondary">{tier.next ? t('rewards.toNext', { n: tier.need.toLocaleString(), tier: tier.next }) : 'Top tier unlocked'} · worth SAR {Math.floor(points / 20)} off</span>
    </motion.button>
  )
}

export function Profile() {
  const nav = useNavigate()
  const user = useStore(s => s.user)
  const auth = useStore(s => s.auth)
  const logout = useStore(s => s.logout)
  const favs = useStore(s => s.favourites.length)
  const tiles = [
    { icon: <Heart size={20} strokeWidth={1.6} />, label: t('profile.favourites'), sub: `${favs}`, to: '/favourites' },
    { icon: <Gift size={20} strokeWidth={1.6} />, label: t('profile.gifts'), sub: 'Send', to: '/gifts' },
    { icon: <UserPlus size={20} strokeWidth={1.6} />, label: t('rewards.refer'), sub: '+250', to: '/refer' },
  ]
  return (
    <Screen className="pb-nav">
      <Stagger className="stack gap-16 pad" style={{ paddingTop: 'calc(var(--status-h) + 16px)' }}>
        <Item className="row gap-14">
          <Avatar initials={initials(user.name)} size={72} />
          <span className="stack grow"><span className="t-h2">{auth === 'guest' ? 'Guest' : user.name}</span><span className="t-body-s c-tertiary">+966 {user.phone}</span></span>
          <IconButton label={t('profile.editProfile')} onClick={() => nav('/profile/edit')}><Pencil size={18} strokeWidth={1.6} /></IconButton>
        </Item>
        <Item><RewardsCard onClick={() => nav('/rewards')} /></Item>
        <Item className="row gap-10">
          {tiles.map(x => (
            <motion.button key={x.to} whileTap={{ scale: 0.95 }} onClick={() => nav(x.to)} className="surface stack gap-10 grow" style={{ padding: 14, textAlign: 'start' }}>
              <span style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--bg-raised)', display: 'grid', placeItems: 'center' }}>{x.icon}</span>
              <span className="stack"><span className="t-label">{x.label}</span><span className="t-caption c-tertiary">{x.sub}</span></span>
            </motion.button>
          ))}
        </Item>
        <Item className="surface stack" style={{ padding: '4px 12px' }}>
          <ListItem icon={<CreditCard size={18} strokeWidth={1.6} />} label={t('profile.payment')} onClick={() => nav('/payment-methods')} />
          <ListItem icon={<Leaf size={18} strokeWidth={1.6} />} label="Dietary preferences" onClick={() => nav('/profile/dietary')} />
          <ListItem icon={<Bell size={18} strokeWidth={1.6} />} label={t('profile.notifications')} onClick={() => nav('/notifications')} />
          <ListItem icon={<SettingsIcon size={18} strokeWidth={1.6} />} label={t('profile.settings')} onClick={() => nav('/settings')} />
          <ListItem icon={<HelpCircle size={18} strokeWidth={1.6} />} label={t('profile.help')} onClick={() => nav('/help')} />
        </Item>
        <Item><ListItem danger icon={<LogOut size={18} strokeWidth={1.6} />} label={t('profile.logout')} onClick={() => { logout(); nav('/welcome', { replace: true }) }} /></Item>
      </Stagger>
    </Screen>
  )
}

export function Favourites() {
  const favs = useStore(s => s.favourites)
  const nav = useNavigate()
  return (
    <Screen>
      <TopBar title={t('profile.favourites')} />
      <div className="stack gap-12 pad" style={{ paddingBottom: 40 }}>
        <span className="t-body-s c-tertiary">{t('profile.saved', { n: favs.length })}</span>
        <motion.div layout className="stack gap-12">
          <AnimatePresence initial={false}>
            {favs.map(id => byId(id)).filter(Boolean).map(r => (
              <motion.div key={r!.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -60, height: 0, marginBottom: -12 }} transition={{ type: 'spring', stiffness: 380, damping: 38 }}>
                <CardRow r={r!} ctx="fav" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {favs.length === 0 && <div className="empty stack gap-12" style={{ alignItems: 'center' }}><Heart size={36} strokeWidth={1.4} /><span className="t-body">{t('profile.noFavs')}</span><Button size="md" onClick={() => nav('/explore')}>{t('bookings.explore')}</Button></div>}
      </div>
    </Screen>
  )
}

const NOTIFS = [
  { group: 'Today', icon: Receipt, accent: true, title: 'Finished at Najd Village?', body: 'Pay your bill in seconds and earn points.', time: 'now', to: '/booking/b1/bill', unread: true },
  { group: 'Today', icon: CalendarCheck, accent: false, title: 'Booking confirmed', body: 'Najd Village, tonight at 7:00 PM for 2 guests.', time: '2m', to: '/booking/b1', unread: true },
  { group: 'Today', icon: Percent, accent: true, title: '-30% tonight at Najd Village', body: 'Book between 7:30 and 9:00 PM to save on the food bill.', time: '1h', to: '/restaurant/najd-village', unread: true },
  { group: 'Earlier', icon: Sparkles, accent: true, title: 'Sufra Festival starts 1 Dec', body: '-50% on food at 8 restaurants for two weeks.', time: 'Yesterday', to: '/festival' },
  { group: 'Earlier', icon: Trophy, accent: true, title: 'Sufra Awards 2026 are out', body: 'See this year’s best tables in Riyadh.', time: 'Yesterday', to: '/awards' },
  { group: 'Earlier', icon: Star, accent: false, title: 'How was Beit Mezze?', body: 'Rate your visit and earn 10 points.', time: 'Yesterday', to: '/review/b3' },
  { group: 'Earlier', icon: Sparkles, accent: true, title: 'You reached Gold', body: 'Enjoy double points on weekend brunches.', time: 'Mon', to: '/rewards' },
  { group: 'Earlier', icon: Gift, accent: true, title: 'Welcome gift', body: 'SAR 25 off your first booking with code SUFRA25.', time: '12 Nov', to: '/offers' },
]
export function Notifications() {
  const nav = useNavigate()
  const [read, setRead] = useState<number[]>([])
  return (
    <Screen>
      <TopBar title={t('profile.notifications')} right={<button className="t-label c-amber" onClick={() => setRead(NOTIFS.map((_, i) => i))}>Read all</button>} />
      <Stagger className="stack gap-4 pad" style={{ paddingBottom: 40 }}>
        {NOTIFS.map((n, i) => (
          <Item key={i}>
            {(i === 0 || NOTIFS[i - 1].group !== n.group) && <span className="t-caption c-tertiary" style={{ display: 'block', margin: i ? '16px 0 4px' : '0 0 4px' }}>{n.group}</span>}
            <motion.button whileTap={{ scale: 0.98 }} className="row gap-14" style={{ width: '100%', padding: '12px 0', textAlign: 'start', alignItems: 'flex-start', position: 'relative' }} onClick={() => { setRead(r => [...r, i]); nav(n.to) }}>
              <span style={{ width: 44, height: 44, borderRadius: 22, background: n.accent ? 'var(--amber-tint)' : 'var(--bg-surface)', color: n.accent ? 'var(--amber)' : undefined, display: 'grid', placeItems: 'center', flexShrink: 0 }}><n.icon size={20} strokeWidth={1.6} /></span>
              <AnimatePresence>{n.unread && !read.includes(i) && <motion.span exit={{ scale: 0 }} style={{ position: 'absolute', left: 36, top: 12, width: 8, height: 8, borderRadius: 4, background: 'var(--amber)' }} />}</AnimatePresence>
              <span className="stack gap-2 grow"><span className="row between gap-8"><span className="t-label-l">{n.title}</span><span className="t-caption c-tertiary">{n.time}</span></span><span className="t-body-s c-secondary">{n.body}</span></span>
            </motion.button>
          </Item>
        ))}
      </Stagger>
    </Screen>
  )
}

export function EditProfile() {
  const nav = useNavigate()
  const user = useStore(s => s.user)
  const update = useStore(s => s.updateUser)
  const toast = useStore(s => s.toast)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const emailBad = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email)
  return (
    <Screen className="pb-bar">
      <TopBar title={t('profile.editProfile')} />
      <Stagger className="stack gap-14 pad">
        <Item className="row center" style={{ margin: '8px 0' }}><Avatar initials={initials(name || 'A')} size={88} /></Item>
        <Item><Input label={t('onboarding.fullName')} value={name} onChange={e => setName(e.target.value)} icon={<User size={20} strokeWidth={1.6} />} /></Item>
        <Item><Input label="Email" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail size={20} strokeWidth={1.6} />} error={emailBad ? 'Enter a valid email' : undefined} /></Item>
        <Item><Input label={t('onboarding.mobile')} value={phone} onChange={e => setPhone(e.target.value)} icon={<Phone size={20} strokeWidth={1.6} />} /></Item>
      </Stagger>
      <div className="fixed-cta"><Button block disabled={!name.trim() || emailBad} onClick={() => { update({ name: name.trim(), email, phone }); toast(t('profile.profileSaved'), 'success'); nav(-1) }}>{t('common.save')}</Button></div>
    </Screen>
  )
}

export function PaymentMethods() {
  const nav = useNavigate()
  const cards = useStore(s => s.cards)
  const def = useStore(s => s.defaultCard)
  const setDef = useStore(s => s.setDefaultCard)
  return (
    <Screen>
      <TopBar title={t('profile.payment')} />
      <Stagger className="stack gap-10 pad">
        {cards.map((c: Card) => (
          <Item key={c.id}>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => setDef(c.id)} className="row gap-14" style={{ width: '100%', padding: '16px', borderRadius: 24, background: 'var(--bg-surface)', boxShadow: def === c.id ? 'inset 0 0 0 1.5px var(--amber)' : 'none', transition: 'box-shadow .25s' }}>
              <CardIcon c={c} /><span className="grow t-label-l" style={{ textAlign: 'start' }}>{cardLabel(c)}</span>{def === c.id && <Tag tone="amber">{t('profile.default')}</Tag>}<Radio on={def === c.id} />
            </motion.button>
          </Item>
        ))}
        <Item><Button variant="secondary" block leading={<Plus size={18} />} onClick={() => nav('/payment-methods/add')}>{t('booking.addCard')}</Button></Item>
      </Stagger>
    </Screen>
  )
}

const luhn = (n: string) => { let s = 0; let alt = false; for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9 } s += d; alt = !alt } return n.length >= 13 && s % 10 === 0 }
export function AddCard() {
  const nav = useNavigate()
  const addCard = useStore(s => s.addCard)
  const toast = useStore(s => s.toast)
  const [num, setNum] = useState('')
  const [exp, setExp] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [tried, setTried] = useState(false)
  const digits = num.replace(/\D/g, '')
  const brand: Card['brand'] = digits.startsWith('4') ? 'Visa' : digits.startsWith('5') ? 'Mastercard' : 'mada'
  const ok = luhn(digits) && /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp) && /^\d{3,4}$/.test(cvc) && name.trim().length > 1
  const save = () => { setTried(true); if (!ok) return; addCard({ id: 'c' + Date.now(), brand, last4: digits.slice(-4) }); toast(t('profile.cardAdded'), 'success'); nav(-1) }
  return (
    <Screen className="pb-bar">
      <TopBar title={t('profile.addCard')} />
      <div className="stack gap-14 pad">
        <motion.div layout className="stack between" style={{ height: 196, borderRadius: 24, padding: 20, background: 'linear-gradient(135deg, #2C2C2A 0%, #1A1A19 55%, #3a2c18 100%)', border: '1px solid var(--border-subtle)', boxShadow: '0 20px 40px rgba(0,0,0,.4)' }}>
          <span className="row between"><span className="t-label c-amber">sufra pay</span><motion.span key={brand} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="t-label">{brand}</motion.span></span>
          <span style={{ fontSize: 22, letterSpacing: '0.12em', fontVariantNumeric: 'tabular-nums' }}>{(digits.padEnd(16, '•').match(/.{1,4}/g) ?? []).join(' ')}</span>
          <span className="row between t-caption c-secondary"><span>{name.toUpperCase() || 'NAME ON CARD'}</span><span>{exp || 'MM/YY'}</span></span>
        </motion.div>
        <Input label={t('profile.cardNumber')} value={num} inputMode="numeric" placeholder="4111 1111 1111 1111" icon={<CreditCard size={20} strokeWidth={1.6} />}
          onChange={e => setNum(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())} error={tried && !luhn(digits) ? t('profile.invalidCard') : undefined} />
        <div className="row gap-10">
          <Input className="grow" label={t('profile.expiry')} value={exp} placeholder="MM/YY" inputMode="numeric" onChange={e => { const d = e.target.value.replace(/\D/g, '').slice(0, 4); setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d) }} error={tried && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp) ? 'MM/YY' : undefined} />
          <Input className="grow" label={t('profile.cvc')} value={cvc} placeholder="123" inputMode="numeric" onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} error={tried && !/^\d{3,4}$/.test(cvc) ? '3–4 digits' : undefined} />
        </div>
        <Input label={t('profile.nameOnCard')} value={name} onChange={e => setName(e.target.value)} icon={<User size={20} strokeWidth={1.6} />} />
        <span className="row gap-6 t-caption c-tertiary"><ShieldCheck size={16} />{t('booking.secure')}</span>
      </div>
      <div className="fixed-cta"><Button block onClick={save}>{t('profile.addCard')}</Button></div>
    </Screen>
  )
}

export function Settings() {
  const nav = useNavigate()
  const prefs = useStore(s => s.prefs)
  const setPrefs = useStore(s => s.setPrefs)
  const resetAll = useStore(s => s.resetAll)
  const toast = useStore(s => s.toast)
  const [del, setDel] = useState(false)
  return (
    <Screen>
      <TopBar title={t('profile.settings')} />
      <Stagger className="stack gap-16 pad" style={{ paddingBottom: 40 }}>
        <Item><span className="t-caption c-tertiary">{t('profile.language')}</span></Item>
        <Item className="surface stack" style={{ padding: '4px 16px' }}>
          <button className="row between" style={{ height: 52 }}><span className="row gap-12"><Globe size={18} strokeWidth={1.6} /><span className="t-body-l">English</span></span><Radio on /></button>
          <div className="divider" />
          <button className="row between" style={{ height: 52, opacity: 0.5 }} onClick={() => toast(t('profile.arabicSoon'))}><span className="row gap-12"><Globe size={18} strokeWidth={1.6} /><span className="t-body-l">العربية</span></span><Tag>Soon</Tag></button>
        </Item>
        <Item><span className="t-caption c-tertiary">{t('profile.notifications')}</span></Item>
        <Item className="surface stack" style={{ padding: '4px 12px' }}>
          <ListItem icon={<Percent size={18} strokeWidth={1.6} />} label={t('profile.pushOffers')} trailing={<Toggle on={prefs.offers} onChange={v => setPrefs({ offers: v })} />} onClick={() => setPrefs({ offers: !prefs.offers })} />
          <ListItem icon={<CalendarCheck size={18} strokeWidth={1.6} />} label={t('profile.pushBookings')} trailing={<Toggle on={prefs.bookings} onChange={v => setPrefs({ bookings: v })} />} onClick={() => setPrefs({ bookings: !prefs.bookings })} />
          <ListItem icon={<Star size={18} strokeWidth={1.6} />} label={t('profile.pushReviews')} trailing={<Toggle on={prefs.reviews} onChange={v => setPrefs({ reviews: v })} />} onClick={() => setPrefs({ reviews: !prefs.reviews })} />
        </Item>
        <Item><ListItem danger icon={<Trash2 size={18} strokeWidth={1.6} />} label={t('profile.deleteAccount')} onClick={() => setDel(true)} /></Item>
      </Stagger>
      <Sheet open={del} onClose={() => setDel(false)}>
        <div className="stack gap-12">
          <span className="t-h2">{t('profile.deleteTitle')}</span>
          <span className="t-body c-secondary">{t('profile.deleteBody')}</span>
          <Button variant="danger" block style={{ marginTop: 8 }} onClick={() => { resetAll(); setDel(false); nav('/welcome', { replace: true }) }}>{t('profile.deleteAccount')}</Button>
          <Button variant="ghost" size="md" onClick={() => setDel(false)}>{t('common.cancel')}</Button>
        </div>
      </Sheet>
    </Screen>
  )
}

const FAQ = [
  ['How do deposits work?', 'Some restaurants ask for a small deposit per guest to hold your table. It’s deducted from your bill, and refunded if you cancel at least 2 hours before.'],
  ['How do I earn points?', 'You earn 20 points for every honoured booking, double at selected restaurants, and 10 points for every verified review. 100 points = SAR 5.'],
  ['Can I change my booking?', 'Yes. Open the booking from Bookings and tap Modify to change the date, time or number of guests.'],
  ['What if I’m running late?', 'Restaurants usually hold tables for 15 minutes. Use Chat with us and we’ll let them know.'],
]
export function Help() {
  const nav = useNavigate()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Screen className="pb-bar">
      <TopBar title={t('profile.help')} />
      <div className="stack gap-12 pad">
        <span className="t-h3">{t('profile.faq')}</span>
        {FAQ.map(([q, a], i) => (
          <div key={q} className="surface" style={{ padding: '0 16px', overflow: 'hidden' }}>
            <button className="row between gap-12" style={{ width: '100%', minHeight: 56, textAlign: 'start' }} onClick={() => setOpen(open === i ? null : i)}>
              <span className="t-label-l">{q}</span>
              <motion.span animate={{ rotate: open === i ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }} className="t-body-s c-secondary" style={{ margin: 0, paddingBottom: 16 }}>{a}</motion.p>}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="fixed-cta"><Button block leading={<MessageSquare size={18} />} onClick={() => nav('/help/chat')}>{t('profile.chat')}</Button></div>
    </Screen>
  )
}

const BOT: [RegExp, string][] = [
  [/late|delay/i, 'No problem — I’ve let the restaurant know you’re on your way. They’ll hold your table for 15 minutes.'],
  [/cancel|refund/i, 'You can cancel from Bookings → your booking → Cancel. Deposits are refunded within 3–5 working days.'],
  [/point|reward/i, 'You have points in Sufra Rewards. Redeem them at checkout — 100 points = SAR 5.'],
  [/.*/, 'Thanks! A Sufra host will reply in a few minutes. Meanwhile, is there anything about your booking I can help with?'],
]
export function Chat() {
  const [msgs, setMsgs] = useState<{ me: boolean; text: string }[]>([{ me: false, text: 'Hi Ahmed 👋 I’m Sufra support. How can I help tonight?' }])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])
  const send = (s: string) => {
    if (!s.trim()) return
    setMsgs(m => [...m, { me: true, text: s.trim() }]); setText(''); setTyping(true)
    setTimeout(() => { setTyping(false); setMsgs(m => [...m, { me: false, text: BOT.find(([re]) => re.test(s))![1] }]) }, 1100)
  }
  return (
    <Screen className="pb-bar">
      <TopBar title={t('profile.chat')} />
      <div className="stack gap-8 pad">
        {msgs.map((m, i) => <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 38 }} className={`chat-bubble ${m.me ? 'me' : 'bot'}`}>{m.text}</motion.div>)}
        {typing && <div className="chat-bubble bot row gap-4" style={{ width: 64 }}>{[0, 1, 2].map(i => <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }} style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--text-secondary)' }} />)}</div>}
        <div className="row gap-8 wrap" style={{ marginTop: 6 }}>{['I’m running late', 'Refund status', 'My points'].map(q => <button key={q} className="chip" onClick={() => send(q)}>{q}</button>)}</div>
        <div ref={end} />
      </div>
      <form className="fixed-cta row gap-10" onSubmit={e => { e.preventDefault(); send(text) }}>
        <span className="field grow" style={{ borderRadius: 999, height: 52 }}><input value={text} onChange={e => setText(e.target.value)} placeholder={t('profile.chatPh')} aria-label="Message" /></span>
        <IconButton size="lg" variant="inverse" label="Send" type="submit"><Send size={20} /></IconButton>
      </form>
    </Screen>
  )
}
