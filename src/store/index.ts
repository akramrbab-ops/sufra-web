import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { addDays, toISO } from '@/lib/date'

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled' | 'waitlist'
export interface Booking {
  id: string; code: string; restaurantId: string; date: string; time: string; guests: number
  seating: string; occasion: string; requests: string; deposit: number; paidWith: string
  status: BookingStatus; reviewed?: boolean; billPaid?: boolean; discount: number
  setMenuId?: string; dietary?: string; festival?: boolean
}
export interface GiftCard { id: string; design: string; amount: number; balance: number; to: string; message: string; code: string }
export interface Card { id: string; brand: 'Apple Pay' | 'Google Pay' | 'mada' | 'Visa' | 'Mastercard'; last4?: string }
export interface PointsEntry { id: string; label: string; amount: number; date: string }
export interface Voucher { id: string; value: number; cost: number }
export interface Draft { restaurantId: string; date: string; time: string; guests: number; seating: string; occasion: string; requests: string; modifyingId?: string; setMenuId?: string }
export interface Toast { id: number; text: string; tone?: 'amber' | 'success' | 'default' }

export interface Dietary { diets: string[]; allergies: string[]; notes: string; share: boolean }
export const dietLabel = (d: Dietary) => (d.share ? [...d.diets, ...d.allergies.map(a => `${a} allergy`), d.notes].filter(Boolean).join(' · ') : '')

const today = toISO(new Date())
const uid = () => Math.random().toString(36).slice(2, 9)
const code = () => 'SF-' + Math.floor(10000 + Math.random() * 89999)

interface State {
  auth: 'new' | 'guest' | 'user'
  user: { name: string; phone: string; email: string; cuisines: string[] }
  dietary: Dietary
  festivalAlert: boolean
  payPromptSeen: boolean
  favourites: string[]
  bookings: Booking[]
  points: number
  history: PointsEntry[]
  vouchers: Voucher[]
  giftCards: GiftCard[]
  cards: Card[]
  defaultCard: string
  prefs: { offers: boolean; bookings: boolean; reviews: boolean }
  recent: string[]
  search: { date: string; time: string; guests: number; area: string }
  draft: Draft | null
  toasts: Toast[]
  // actions
  signIn: (kind: 'guest' | 'user') => void
  logout: () => void
  updateUser: (u: Partial<State['user']>) => void
  setDietary: (d: Partial<Dietary>) => void
  setFestivalAlert: (on: boolean) => void
  seePayPrompt: () => void
  toggleFav: (id: string) => boolean
  setSearch: (s: Partial<State['search']>) => void
  addRecent: (q: string) => void
  clearRecent: () => void
  startDraft: (d: Partial<Draft> & { restaurantId: string }) => void
  updateDraft: (d: Partial<Draft>) => void
  confirmDraft: (o: { deposit: number; paidWith: string; discount: number; pointsUsed: number; promo: number; festival?: boolean }) => Booking
  joinWaitlist: (d: Draft) => void
  cancelBooking: (id: string) => void
  markReviewed: (id: string) => void
  payBill: (id: string, amount: number) => number
  addPoints: (label: string, amount: number) => void
  redeem: (value: number, cost: number) => boolean
  buyGift: (g: Omit<GiftCard, 'id' | 'code' | 'balance'>) => GiftCard
  addCard: (c: Card) => void
  setDefaultCard: (id: string) => void
  setPrefs: (p: Partial<State['prefs']>) => void
  toast: (text: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
  resetAll: () => void
}

const seedBookings = (): Booking[] => [
  { id: 'b1', code: 'SF-48213', restaurantId: 'najd-village', date: today, time: '7:00', guests: 2, seating: 'Family section', occasion: 'Birthday', requests: '', deposit: 100, paidWith: 'Apple Pay', status: 'upcoming', discount: 25 },
  { id: 'b2', code: 'SF-50177', restaurantId: 'hoshi-omakase', date: toISO(addDays(new Date(), 5)), time: '8:30', guests: 4, seating: 'Counter', occasion: 'None', requests: '', deposit: 400, paidWith: 'mada •••• 4417', status: 'upcoming', discount: 0 },
  { id: 'b3', code: 'SF-39021', restaurantId: 'beit-mezze', date: toISO(addDays(new Date(), -3)), time: '8:00', guests: 3, seating: 'Outdoor', occasion: 'None', requests: '', deposit: 0, paidWith: '—', status: 'completed', discount: 20 },
  { id: 'b4', code: 'SF-37755', restaurantId: 'prime-cut', date: toISO(addDays(new Date(), -12)), time: '9:30', guests: 2, seating: 'Indoor', occasion: 'Anniversary', requests: '', deposit: 200, paidWith: 'Visa •••• 0092', status: 'completed', reviewed: true, billPaid: true, discount: 0 },
]

const initial = {
  auth: 'new' as const,
  user: { name: 'Ahmed Al-Qahtani', phone: '55 123 4567', email: 'ahmed@email.com', cuisines: ['Saudi', 'Italian', 'Seafood'] },
  dietary: { diets: [], allergies: ['Nuts'], notes: '', share: true } as Dietary,
  festivalAlert: false,
  payPromptSeen: false,
  favourites: ['najd-village', 'hoshi-omakase', 'beit-mezze', 'trattoria-sole', 'prime-cut'],
  bookings: seedBookings(),
  points: 1240,
  history: [
    { id: 'h1', label: 'Prime Cut · booking honoured', amount: 20, date: '11 Nov' },
    { id: 'h2', label: 'Review · Prime Cut', amount: 10, date: '11 Nov' },
    { id: 'h3', label: 'Double points · Najd Village', amount: 40, date: '2 Nov' },
    { id: 'h4', label: 'Redeemed SAR 25 off', amount: -500, date: '28 Oct' },
    { id: 'h5', label: 'Welcome bonus', amount: 200, date: '12 Oct' },
  ],
  vouchers: [] as Voucher[],
  giftCards: [{ id: 'g1', design: 'Classic', amount: 250, balance: 180, to: 'Ahmed', message: 'Happy birthday!', code: 'GIFT-7Q2K-91' }],
  cards: [{ id: 'apple', brand: 'Apple Pay' }, { id: 'gpay', brand: 'Google Pay' }, { id: 'mada', brand: 'mada', last4: '4417' }, { id: 'visa', brand: 'Visa', last4: '0092' }] as Card[],
  defaultCard: 'apple',
  prefs: { offers: true, bookings: true, reviews: false },
  recent: ['Hoshi Omakase', 'Brunch in Hittin', 'Kabsa near me'],
  search: { date: today, time: '7:00', guests: 2, area: 'Any area' },
  draft: null as Draft | null,
  toasts: [] as Toast[],
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial,
      signIn: kind => set({ auth: kind }),
      logout: () => set({ auth: 'new' }),
      updateUser: u => set(s => ({ user: { ...s.user, ...u } })),
      setDietary: d => set(s => ({ dietary: { ...s.dietary, ...d } })),
      setFestivalAlert: on => set({ festivalAlert: on }),
      seePayPrompt: () => set({ payPromptSeen: true }),
      toggleFav: id => {
        const has = get().favourites.includes(id)
        set(s => ({ favourites: has ? s.favourites.filter(f => f !== id) : [id, ...s.favourites] }))
        return !has
      },
      setSearch: s => set(st => ({ search: { ...st.search, ...s } })),
      addRecent: q => set(s => ({ recent: [q, ...s.recent.filter(r => r.toLowerCase() !== q.toLowerCase())].slice(0, 5) })),
      clearRecent: () => set({ recent: [] }),
      startDraft: d => {
        const s = get().search
        set({ draft: { date: s.date, time: s.time, guests: s.guests, seating: 'No preference', occasion: 'None', requests: '', ...d } })
      },
      updateDraft: d => set(s => ({ draft: s.draft ? { ...s.draft, ...d } : s.draft })),
      confirmDraft: ({ deposit, paidWith, discount, pointsUsed, festival }) => {
        const d = get().draft!
        const diet = dietLabel(get().dietary)
        if (d.modifyingId) {
          let updated!: Booking
          set(s => ({ bookings: s.bookings.map(b => (b.id === d.modifyingId ? (updated = { ...b, date: d.date, time: d.time, guests: d.guests, seating: d.seating, occasion: d.occasion, requests: d.requests, discount, setMenuId: d.setMenuId, festival }) : b)), draft: null }))
          return updated
        }
        const b: Booking = { id: uid(), code: code(), restaurantId: d.restaurantId, date: d.date, time: d.time, guests: d.guests, seating: d.seating, occasion: d.occasion, requests: d.requests, deposit, paidWith, status: 'upcoming', discount, setMenuId: d.setMenuId, dietary: diet || undefined, festival }
        set(s => ({
          bookings: [b, ...s.bookings], draft: null, points: s.points - pointsUsed + 20,
          history: [{ id: uid(), label: 'Booking · pending visit', amount: 20, date: 'Today' }, ...(pointsUsed ? [{ id: uid(), label: 'Points used at checkout', amount: -pointsUsed, date: 'Today' }] : []), ...s.history],
        }))
        return b
      },
      joinWaitlist: d => {
        const b: Booking = { id: uid(), code: code(), restaurantId: d.restaurantId, date: d.date, time: d.time, guests: d.guests, seating: 'No preference', occasion: 'None', requests: '', deposit: 0, paidWith: '—', status: 'waitlist', discount: 0 }
        set(s => ({ bookings: [b, ...s.bookings] }))
      },
      cancelBooking: id => set(s => ({ bookings: s.bookings.map(b => (b.id === id ? { ...b, status: 'cancelled' } : b)) })),
      markReviewed: id => set(s => ({ bookings: s.bookings.map(b => (b.id === id ? { ...b, reviewed: true } : b)), points: s.points + 10, history: [{ id: uid(), label: 'Verified review', amount: 10, date: 'Today' }, ...s.history] })),
      payBill: (id, amount) => {
        const pts = Math.round(amount / 10)
        set(s => ({ bookings: s.bookings.map(b => (b.id === id ? { ...b, billPaid: true, status: 'completed' } : b)), points: s.points + pts, history: [{ id: uid(), label: 'Bill paid in app', amount: pts, date: 'Today' }, ...s.history] }))
        return pts
      },
      addPoints: (label, amount) => set(s => ({ points: s.points + amount, history: [{ id: uid(), label, amount, date: 'Today' }, ...s.history] })),
      redeem: (value, cost) => {
        if (get().points < cost) return false
        set(s => ({ points: s.points - cost, vouchers: [{ id: uid(), value, cost }, ...s.vouchers], history: [{ id: uid(), label: `Redeemed SAR ${value} off`, amount: -cost, date: 'Today' }, ...s.history] }))
        return true
      },
      buyGift: g => {
        const card: GiftCard = { ...g, id: uid(), balance: g.amount, code: 'GIFT-' + uid().toUpperCase().slice(0, 4) + '-' + Math.floor(10 + Math.random() * 89) }
        set(s => ({ giftCards: [card, ...s.giftCards] }))
        return card
      },
      addCard: c => set(s => ({ cards: [...s.cards, c] })),
      setDefaultCard: id => set({ defaultCard: id }),
      setPrefs: p => set(s => ({ prefs: { ...s.prefs, ...p } })),
      toast: (text, tone = 'default') => {
        const id = Date.now() + Math.random()
        set(s => ({ toasts: [...s.toasts, { id, text, tone }] }))
        setTimeout(() => get().dismissToast(id), 2400)
      },
      dismissToast: id => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
      resetAll: () => set({ ...initial, bookings: seedBookings() }),
    }),
    {
      name: 'sufra-store-v2',
      storage: createJSONStorage(() => {
        const mem = new Map<string, string>()
        const ls = (() => { try { const s = window.localStorage; s.setItem('__t', '1'); s.removeItem('__t'); return s } catch { return null } })()
        return {
          getItem: k => { try { return ls ? ls.getItem(k) : mem.get(k) ?? null } catch { return mem.get(k) ?? null } },
          setItem: (k, v) => { try { if (ls) ls.setItem(k, v); else mem.set(k, v) } catch { mem.set(k, v) } },
          removeItem: k => { try { if (ls) ls.removeItem(k); else mem.delete(k) } catch { mem.delete(k) } },
        }
      }),
      partialize: s => {
        const { toasts, draft, payPromptSeen, ...rest } = s
        void toasts; void draft; void payPromptSeen
        return rest
      },
    },
  ),
)

export const tierFor = (points: number) =>
  points >= 2500 ? { tier: 'Platinum', next: null as string | null, need: 0, pct: 100 } :
  points >= 1000 ? { tier: 'Gold', next: 'Platinum', need: 2500 - points, pct: ((points - 1000) / 1500) * 100 } :
  { tier: 'Silver', next: 'Gold', need: 1000 - points, pct: (points / 1000) * 100 }
