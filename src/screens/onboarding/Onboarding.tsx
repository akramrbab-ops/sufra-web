import { motion } from 'framer-motion'
import { Clock, Globe, MapPin, Phone, User, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '@/app/Screen'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Input, OtpInput } from '@/components/ui/Input'
import { TopBar, Stagger, Item } from '@/components/ui/Misc'
import { CUISINES } from '@/data/restaurants'
import { img } from '@/data/images'
import { useStore } from '@/store'
import { t } from '@/i18n'

const ios = [0.32, 0.72, 0, 1] as const

export const AppleLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M16.37 12.3c-.02-2.2 1.8-3.27 1.88-3.32-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.6 1.1 8.75.73 1.05 1.6 2.23 2.73 2.19 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.32-3.5zM14.2 5.83c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.67-.92 2.66.97.08 1.96-.49 2.56-1.21z" /></svg>
)

export function Wordmark({ size = 30 }: { size?: number }) {
  return (
    <motion.span layoutId="wordmark" transition={{ duration: 0.8, ease: ios }} className="row" style={{ fontSize: size, fontWeight: 500, letterSpacing: '-0.05em', lineHeight: 1, alignItems: 'flex-end' }}>
      sufra
      <span style={{ width: size * 0.18, height: size * 0.18, borderRadius: '50%', background: 'var(--amber)', marginInlineStart: size * 0.08, marginBottom: size * 0.12 }} />
    </motion.span>
  )
}

export function Splash() {
  const nav = useNavigate()
  const auth = useStore(s => s.auth)
  useEffect(() => {
    const id = setTimeout(() => nav(auth === 'new' ? '/welcome' : '/home', { replace: true }), 1500)
    return () => clearTimeout(id)
  }, [nav, auth])
  return (
    <Screen scroll={false}>
      <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 0.25, scale: 1 }} transition={{ duration: 1.4, ease: ios }}
        style={{ position: 'absolute', width: 320, height: 320, left: '50%', top: '50%', marginLeft: -160, marginTop: -170, borderRadius: '50%', background: 'var(--amber)', filter: 'blur(110px)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.7, ease: ios }}>
          <Wordmark size={56} />
        </motion.div>
      </div>
    </Screen>
  )
}

export function Welcome() {
  const nav = useNavigate()
  const signIn = useStore(s => s.signIn)
  return (
    <Screen scroll={false}>
      <motion.img src={img.terrace} alt="" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: ios }} className="img-cover" style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,11,10,.35) 0%, rgba(11,11,10,0) 30%, rgba(11,11,10,.55) 55%, #0B0B0A 75%)' }} />
      <div className="row between pad" style={{ position: 'absolute', top: 'calc(var(--status-h) + 10px)', insetInline: 0 }}>
        <Wordmark size={30} />
        <span className="tag glass" style={{ padding: '8px 14px 8px 12px', fontSize: 14 }} title={t('profile.arabicSoon')}>
          <Globe size={16} strokeWidth={1.6} /> العربية
        </span>
      </div>
      <Stagger className="stack gap-14 pad" style={{ position: 'absolute', insetInline: 0, bottom: 'calc(34px + var(--safe-bottom))' }}>
        <Item><h1 className="t-display" style={{ margin: 0 }}>{t('onboarding.welcomeTitle')}</h1></Item>
        <Item><p className="t-body-l c-secondary" style={{ margin: 0 }}>{t('onboarding.welcomeBody')}</p></Item>
        <Item style={{ marginTop: 10 }}><Button block leading={<Phone size={20} strokeWidth={1.6} />} onClick={() => nav('/signin/phone')}>{t('onboarding.continuePhone')}</Button></Item>
        <Item className="row gap-10">
          <Button variant="glass" className="grow" leading={<AppleLogo />} onClick={() => nav('/signin/details')}>{t('onboarding.apple')}</Button>
          <Button variant="glass" className="grow" leading={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M21.35 11.1H12v2.98h5.35c-.23 1.5-1.68 4.4-5.35 4.4-3.22 0-5.85-2.67-5.85-5.96S8.78 6.56 12 6.56c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 4 14.55 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.2 0 8.64-3.65 8.64-8.8 0-.6-.07-1.04-.29-1.1z" /></svg>} onClick={() => nav('/signin/details')}>{t('onboarding.google')}</Button>
        </Item>
        <Item className="row center"><Button variant="ghost" size="md" onClick={() => { signIn('guest'); nav('/home') }}>{t('onboarding.guest')}</Button></Item>
        <Item><p className="t-caption c-tertiary" style={{ margin: 0, textAlign: 'center' }}>{t('onboarding.legal')}</p></Item>
      </Stagger>
    </Screen>
  )
}

export function PhoneScreen() {
  const nav = useNavigate()
  const user = useStore(s => s.user)
  const update = useStore(s => s.updateUser)
  const [phone, setPhone] = useState(user.phone)
  const digits = phone.replace(/\D/g, '')
  const valid = /^5\d{8}$/.test(digits)
  const [touched, setTouched] = useState(false)
  return (
    <Screen>
      <TopBar />
      <Stagger className="stack gap-12 pad" style={{ paddingTop: 12 }}>
        <Item><h1 className="t-h1" style={{ margin: 0 }}>{t('onboarding.phoneTitle')}</h1></Item>
        <Item><p className="t-body-l c-secondary" style={{ margin: 0 }}>{t('onboarding.phoneBody')}</p></Item>
        <Item className="row gap-10" style={{ marginTop: 12, alignItems: 'flex-start' }}>
          <Input label={t('onboarding.country')} value="+966" readOnly icon={<Globe size={20} strokeWidth={1.6} />} style={{ width: 52 }} />
          <Input className="grow" label={t('onboarding.mobile')} value={phone} inputMode="tel" autoFocus icon={<Phone size={20} strokeWidth={1.6} />}
            onChange={e => setPhone(e.target.value)} onBlur={() => setTouched(true)} error={touched && !valid ? t('onboarding.invalidPhone') : undefined} placeholder="5X XXX XXXX" />
        </Item>
        <Item><span className="t-caption c-tertiary">{t('onboarding.smsNote')}</span></Item>
      </Stagger>
      <div className="fixed-cta"><Button block disabled={!valid} onClick={() => { update({ phone: digits.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3') }); nav('/signin/otp') }}>{t('onboarding.sendCode')}</Button></div>
    </Screen>
  )
}

export function OtpScreen() {
  const nav = useNavigate()
  const phone = useStore(s => s.user.phone)
  const [code, setCode] = useState('')
  const [s, setS] = useState(30)
  useEffect(() => { const id = setInterval(() => setS(x => Math.max(0, x - 1)), 1000); return () => clearInterval(id) }, [])
  useEffect(() => { if (code.length === 6) { const id = setTimeout(() => nav('/signin/details'), 350); return () => clearTimeout(id) } }, [code, nav])
  return (
    <Screen>
      <TopBar />
      <Stagger className="stack gap-12 pad" style={{ paddingTop: 12 }}>
        <Item><h1 className="t-h1" style={{ margin: 0 }}>{t('onboarding.otpTitle')}</h1></Item>
        <Item><p className="t-body-l c-secondary" style={{ margin: 0 }}>{t('onboarding.otpBody', { phone })}</p></Item>
        <Item style={{ marginTop: 12 }}><OtpInput value={code} onChange={setCode} /></Item>
        <Item className="row gap-6 t-body-s c-tertiary">
          <Clock size={16} strokeWidth={1.6} />
          {s > 0 ? t('onboarding.resendIn', { s: String(s).padStart(2, '0') }) : <button className="c-amber t-label" onClick={() => setS(30)}>{t('onboarding.resend')}</button>}
        </Item>
      </Stagger>
      <div className="fixed-cta"><Button block disabled={code.length < 6} onClick={() => nav('/signin/details')}>{t('onboarding.verify')}</Button></div>
    </Screen>
  )
}

export function DetailsScreen() {
  const nav = useNavigate()
  const user = useStore(s => s.user)
  const update = useStore(s => s.updateUser)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [likes, setLikes] = useState<string[]>(user.cuisines)
  return (
    <Screen className="pb-bar">
      <TopBar />
      <Stagger className="stack gap-12 pad" style={{ paddingTop: 12 }}>
        <Item><h1 className="t-h1" style={{ margin: 0 }}>{t('onboarding.detailsTitle')}</h1></Item>
        <Item><p className="t-body-l c-secondary" style={{ margin: 0 }}>{t('onboarding.detailsBody')}</p></Item>
        <Item style={{ marginTop: 8 }}><Input label={t('onboarding.fullName')} value={name} onChange={e => setName(e.target.value)} icon={<User size={20} strokeWidth={1.6} />} /></Item>
        <Item><Input label={t('onboarding.email')} value={email} type="email" onChange={e => setEmail(e.target.value)} placeholder="name@email.com" icon={<Mail size={20} strokeWidth={1.6} />} /></Item>
        <Item style={{ marginTop: 8 }}><h3 className="t-h3" style={{ margin: 0 }}>{t('onboarding.likes')}</h3></Item>
        <Item className="row wrap gap-8">
          {CUISINES.map(c => <Chip key={c} selected={likes.includes(c)} onClick={() => setLikes(l => (l.includes(c) ? l.filter(x => x !== c) : [...l, c]))}>{c}</Chip>)}
        </Item>
      </Stagger>
      <div className="fixed-cta"><Button block disabled={!name.trim()} onClick={() => { update({ name: name.trim(), email, cuisines: likes }); nav('/signin/location') }}>{t('onboarding.startExploring')}</Button></div>
    </Screen>
  )
}

export function LocationScreen() {
  const nav = useNavigate()
  const signIn = useStore(s => s.signIn)
  const done = () => { signIn('user'); nav('/home', { replace: true }) }
  return (
    <Screen scroll={false}>
      <img src={img.map} alt="" className="img-cover" style={{ position: 'absolute', inset: 0, opacity: 0.55 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 38%, rgba(11,11,10,0) 0, rgba(11,11,10,.6) 45%, #0B0B0A 72%)' }} />
      <div style={{ position: 'absolute', left: '50%', top: '36%', transform: 'translate(-50%,-50%)' }}>
        {[0, 1, 2].map(i => (
          <motion.span key={i} style={{ position: 'absolute', left: -60, top: -60, width: 120, height: 120, borderRadius: '50%', border: '1.5px solid var(--amber)' }}
            initial={{ scale: 0.3, opacity: 0.8 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }} />
        ))}
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 }}
          style={{ position: 'relative', display: 'grid', placeItems: 'center', width: 64, height: 64, marginLeft: -32, marginTop: -32, borderRadius: '50%', background: 'var(--amber)', color: 'var(--text-inverse)', boxShadow: '0 10px 40px rgba(232,179,106,.45)' }}>
          <MapPin size={28} strokeWidth={1.8} />
        </motion.span>
      </div>
      <Stagger className="stack gap-12 pad" style={{ position: 'absolute', insetInline: 0, bottom: 'calc(34px + var(--safe-bottom))' }}>
        <Item><h1 className="t-h1" style={{ margin: 0 }}>{t('onboarding.locationTitle')}</h1></Item>
        <Item><p className="t-body-l c-secondary" style={{ margin: 0 }}>{t('onboarding.locationBody')}</p></Item>
        <Item style={{ marginTop: 12 }}><Button block onClick={done}>{t('onboarding.allowLocation')}</Button></Item>
        <Item className="row center"><Button variant="ghost" size="md" onClick={done}>{t('onboarding.notNow')}</Button></Item>
      </Stagger>
    </Screen>
  )
}
