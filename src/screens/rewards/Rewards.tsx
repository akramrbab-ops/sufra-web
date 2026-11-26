import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, Copy, Gift, Share2, Sparkles, Star, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Screen } from '@/app/Screen'
import { Button } from '@/components/ui/Button'
import { Chip, Tag } from '@/components/ui/Chip'
import { Input, TextArea } from '@/components/ui/Input'
import { Item, Stagger, TopBar, SectionHeader } from '@/components/ui/Misc'
import { useStore } from '@/store'
import { RewardsCard } from '@/screens/profile/Profile'
import { t } from '@/i18n'

const REWARDS = [{ value: 25, cost: 500 }, { value: 50, cost: 1000 }, { value: 100, cost: 2000 }]

export function Rewards() {
  const nav = useNavigate()
  const points = useStore(s => s.points)
  const vouchers = useStore(s => s.vouchers)
  const redeem = useStore(s => s.redeem)
  const toast = useStore(s => s.toast)
  return (
    <Screen>
      <TopBar title={t('rewards.title')} right={<button className="t-label c-amber" onClick={() => nav('/rewards/history')}>{t('rewards.history')}</button>} />
      <Stagger className="stack gap-16 pad" style={{ paddingBottom: 40 }}>
        <Item><RewardsCard /></Item>
        <Item><SectionHeader title={t('rewards.redeem')} /></Item>
        <Item className="stack gap-10">
          {REWARDS.map(r => {
            const can = points >= r.cost
            return (
              <div key={r.cost} className="row gap-14 surface" style={{ padding: 14 }}>
                <span style={{ width: 52, height: 52, borderRadius: 16, background: can ? 'var(--amber)' : 'var(--bg-raised)', color: can ? 'var(--text-inverse)' : 'var(--text-tertiary)', display: 'grid', placeItems: 'center', fontWeight: 600 }}>{r.value}</span>
                <span className="stack grow"><span className="t-label-l">SAR {r.value} off your bill</span><span className="t-caption c-tertiary">{t('rewards.redeemFor', { p: r.cost.toLocaleString() })}</span></span>
                <Button size="md" variant={can ? 'primary' : 'secondary'} disabled={!can} onClick={() => { if (redeem(r.value, r.cost)) toast(t('rewards.redeemed'), 'amber'); else toast(t('rewards.notEnough')) }}>{t('rewards.redeem')}</Button>
              </div>
            )
          })}
        </Item>
        <AnimatePresence>
          {vouchers.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="stack gap-10">
              <SectionHeader title="Your rewards" />
              {vouchers.map(v => <motion.div key={v.id} layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="row between surface" style={{ padding: '14px 16px', background: 'var(--amber-tint)' }}><span className="row gap-10 t-label-l"><Wallet size={18} color="var(--amber)" />SAR {v.value} off</span><Tag tone="amber">Ready</Tag></motion.div>)}
            </motion.div>
          )}
        </AnimatePresence>
        <Item><SectionHeader title={t('rewards.how')} /></Item>
        <Item className="surface stack gap-14" style={{ padding: 16 }}>
          {[[CalendarCheck, t('rewards.earn1')], [Sparkles, t('rewards.earn2')], [Star, t('rewards.earn3')]].map(([I, l], i) => {
            const Icon = I as typeof Star
            return <span key={i} className="row gap-12"><span style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--amber-tint)', color: 'var(--amber)', display: 'grid', placeItems: 'center' }}><Icon size={18} /></span><span className="t-body">{l as string}</span></span>
          })}
        </Item>
        <Item className="row gap-10">
          <Button variant="secondary" className="grow" leading={<Share2 size={18} />} onClick={() => nav('/refer')}>{t('rewards.refer')}</Button>
          <Button variant="secondary" className="grow" leading={<Gift size={18} />} onClick={() => nav('/gifts')}>{t('profile.gifts')}</Button>
        </Item>
      </Stagger>
    </Screen>
  )
}

export function PointsHistory() {
  const history = useStore(s => s.history)
  return (
    <Screen>
      <TopBar title={t('rewards.history')} />
      <Stagger className="stack pad" style={{ paddingBottom: 40 }}>
        {history.map((h, i) => (
          <Item key={h.id}>
            {i > 0 && <div className="divider" />}
            <div className="row gap-14" style={{ padding: '14px 0' }}>
              <span style={{ width: 40, height: 40, borderRadius: 20, background: h.amount > 0 ? 'var(--amber-tint)' : 'var(--bg-surface)', color: h.amount > 0 ? 'var(--amber)' : 'var(--text-secondary)', display: 'grid', placeItems: 'center' }}>{h.amount > 0 ? <Sparkles size={18} /> : <Wallet size={18} />}</span>
              <span className="stack grow"><span className="t-label-l">{h.label}</span><span className="t-caption c-tertiary">{h.date}</span></span>
              <span className={`t-label-l ${h.amount > 0 ? 'c-amber' : 'c-secondary'}`}>{h.amount > 0 ? '+' : ''}{h.amount}</span>
            </div>
          </Item>
        ))}
      </Stagger>
    </Screen>
  )
}

export function Refer() {
  const toast = useStore(s => s.toast)
  const code = 'AHMED-SUFRA'
  const copy = async () => { try { await navigator.clipboard?.writeText(code) } catch { /* ignore */ } toast(t('rewards.copied'), 'success') }
  const share = async () => { try { if (navigator.share) await navigator.share({ title: 'Sufra', text: `Book Riyadh’s best tables on Sufra with my code ${code} and get SAR 25 off.` }); else await copy() } catch { /* cancelled */ } }
  return (
    <Screen className="pb-bar">
      <TopBar title={t('rewards.refer')} />
      <div className="stack gap-16 pad" style={{ alignItems: 'center', textAlign: 'center', paddingTop: 20 }}>
        <motion.div initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} style={{ width: 120, height: 120, borderRadius: 60, background: 'var(--amber-tint)', display: 'grid', placeItems: 'center' }}>
          <Gift size={54} color="var(--amber)" strokeWidth={1.4} />
        </motion.div>
        <h1 className="t-h1" style={{ margin: 0 }}>Give SAR 25, get 250 points</h1>
        <p className="t-body c-secondary" style={{ margin: 0 }}>{t('rewards.referBody')} Your friend gets SAR 25 off their first booking.</p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={copy} className="row between" style={{ width: '100%', padding: '18px 20px', borderRadius: 24, border: '1.5px dashed var(--border-strong)', marginTop: 8 }}>
          <span className="t-h2" style={{ letterSpacing: '0.04em' }}>{code}</span><span className="row gap-6 t-label c-amber"><Copy size={16} />{t('common.copy')}</span>
        </motion.button>
        <div className="row gap-10" style={{ width: '100%' }}>{[['3', 'Invited'], ['1', 'Joined'], ['250', 'Points earned']].map(([n, l]) => <div key={l} className="surface stack grow" style={{ padding: 14 }}><span className="t-h2">{n}</span><span className="t-caption c-tertiary">{l}</span></div>)}</div>
      </div>
      <div className="fixed-cta"><Button block leading={<Share2 size={18} />} onClick={share}>{t('common.share')}</Button></div>
    </Screen>
  )
}

const DESIGNS = [
  { id: 'Classic', bg: 'linear-gradient(135deg,#2C2C2A 0%,#121211 60%,#4a3518 100%)', ink: '#E8B36A' },
  { id: 'Celebration', bg: 'linear-gradient(135deg,#E8B36A 0%,#F07167 100%)', ink: '#0B0B0A' },
  { id: 'Ramadan', bg: 'radial-gradient(120% 90% at 80% 10%, #E8B36A33 0, transparent 50%), linear-gradient(160deg,#10302a 0%,#0b1d1a 100%)', ink: '#E8B36A' },
]
export function GiftVisual({ design, amount, to }: { design: string; amount: number; to?: string }) {
  const d = DESIGNS.find(x => x.id === design) ?? DESIGNS[0]
  return (
    <div className="gift-card" style={{ background: d.bg, color: d.ink, border: '1px solid var(--border-subtle)' }}>
      <span className="row between"><span style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.05em' }}>sufra</span><span className="t-caption" style={{ opacity: 0.8 }}>{d.id === 'Ramadan' ? '☾ Ramadan Kareem' : d.id === 'Celebration' ? '✦ Celebrate' : 'Gift card'}</span></span>
      <span className="stack"><span className="t-caption" style={{ opacity: 0.7 }}>{to ? `For ${to}` : 'Gift card'}</span><motion.span key={amount} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="t-display">SAR {amount}</motion.span></span>
    </div>
  )
}

export function Gifts() {
  const nav = useNavigate()
  const count = useStore(s => s.giftCards.length)
  return (
    <Screen className="pb-bar">
      <TopBar title={t('gifts.title')} right={<button className="t-label c-amber" onClick={() => nav('/gifts/wallet')}>{t('gifts.wallet')} ({count})</button>} />
      <Stagger className="stack gap-16 pad">
        <Item><p className="t-body c-secondary" style={{ margin: 0 }}>{t('gifts.subtitle')}</p></Item>
        {DESIGNS.map((d, i) => (
          <Item key={d.id}><motion.button whileTap={{ scale: 0.98 }} style={{ width: '100%', textAlign: 'start' }} onClick={() => nav('/gifts/buy', { state: { design: d.id } })}><GiftVisual design={d.id} amount={[250, 500, 100][i]} /></motion.button></Item>
        ))}
      </Stagger>
      <div className="fixed-cta"><Button block leading={<Gift size={18} />} onClick={() => nav('/gifts/buy')}>Send a gift card</Button></div>
    </Screen>
  )
}

export function BuyGift() {
  const nav = useNavigate()
  const buy = useStore(s => s.buyGift)
  const toast = useStore(s => s.toast)
  const loc = useLocation()
  const initial = (loc.state as { design?: string } | null)?.design ?? 'Classic'
  const [design, setDesign] = useState(initial)
  const [amount, setAmount] = useState(250)
  const [custom, setCustom] = useState('')
  const [to, setTo] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const value = custom ? Math.max(0, parseInt(custom) || 0) : amount
  const ok = value >= 50 && value <= 5000 && to.trim().length > 0
  return (
    <Screen className="pb-bar">
      <TopBar title={t('gifts.title')} />
      <div className="stack gap-14 pad">
        <motion.div layout><GiftVisual design={design} amount={value || 0} to={to || undefined} /></motion.div>
        <span className="t-h3">{t('gifts.design')}</span>
        <div className="row gap-8">{DESIGNS.map(d => <Chip key={d.id} selected={design === d.id} onClick={() => setDesign(d.id)}>{d.id}</Chip>)}</div>
        <span className="t-h3">{t('gifts.amount')}</span>
        <div className="row gap-8 wrap">{[100, 250, 500].map(a => <Chip key={a} selected={!custom && amount === a} onClick={() => { setCustom(''); setAmount(a) }}>SAR {a}</Chip>)}</div>
        <Input label={t('gifts.custom')} value={custom} inputMode="numeric" placeholder="SAR 50 – 5,000" onChange={e => setCustom(e.target.value.replace(/\D/g, '').slice(0, 4))} error={custom && (value < 50 || value > 5000) ? 'Between SAR 50 and 5,000' : undefined} />
        <Input label={t('gifts.to')} value={to} onChange={e => setTo(e.target.value)} placeholder="e.g. Sara" />
        <TextArea label={t('gifts.message')} value={msg} onChange={setMsg} placeholder={t('gifts.messagePh')} />
      </div>
      <div className="fixed-cta"><Button block disabled={!ok || busy} onClick={() => { setBusy(true); setTimeout(() => { buy({ design, amount: value, to: to.trim(), message: msg }); toast(t('gifts.bought'), 'amber'); nav('/gifts/wallet', { replace: true }) }, 800) }}>{busy ? 'Processing…' : t('gifts.buy', { n: value })}</Button></div>
    </Screen>
  )
}

export function GiftWallet() {
  const cards = useStore(s => s.giftCards)
  const toast = useStore(s => s.toast)
  return (
    <Screen>
      <TopBar title={t('gifts.wallet')} />
      <Stagger className="stack gap-16 pad" style={{ paddingBottom: 40 }}>
        {cards.length === 0 && <div className="empty">{t('gifts.empty')}</div>}
        {cards.map(c => (
          <Item key={c.id} className="stack gap-10">
            <GiftVisual design={c.design} amount={c.amount} to={c.to} />
            <div className="row between surface" style={{ padding: '12px 16px' }}>
              <span className="stack"><span className="t-caption c-tertiary">{t('gifts.balance')}</span><span className="t-label-l">SAR {c.balance}</span></span>
              <button className="row gap-6 t-label c-amber" onClick={async () => { try { await navigator.clipboard?.writeText(c.code) } catch { /* */ } toast(t('rewards.copied'), 'success') }}><Copy size={16} />{c.code}</button>
            </div>
          </Item>
        ))}
      </Stagger>
    </Screen>
  )
}
