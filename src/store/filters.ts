import { create } from 'zustand'
import { bestOffer, restaurants, type Restaurant } from '@/data/restaurants'

export type Sort = 'recommended' | 'top' | 'nearest' | 'offer'
export interface Filters { q: string; cuisine: string | null; sort: Sort; price: string[]; offersOnly: boolean; features: string[]; minRating: number; area: string }
const initial: Filters = { q: '', cuisine: null, sort: 'recommended', price: [], offersOnly: false, features: [], minRating: 0, area: 'Any area' }

export const PRICE_BANDS: Record<string, [number, number]> = { 'Under SAR 100': [0, 99], '100–200': [100, 200], '200–350': [201, 350], '350+': [351, 9999] }

export const useFilters = create<Filters & { set: (f: Partial<Filters>) => void; reset: () => void }>(set => ({
  ...initial,
  set: f => set(f),
  reset: () => set({ ...initial }),
}))

export function applyFilters(f: Filters, list: Restaurant[] = restaurants): Restaurant[] {
  const q = f.q.trim().toLowerCase()
  let out = list.filter(r => {
    if (q && !(`${r.name} ${r.cuisine} ${r.area} ${r.menu.flatMap(s => s.items.map(i => i.name)).join(' ')}`.toLowerCase().includes(q))) return false
    if (f.cuisine && r.cuisine !== f.cuisine) return false
    if (f.area !== 'Any area' && r.area !== f.area) return false
    if (f.offersOnly && bestOffer(r) === 0) return false
    if (f.minRating && r.rating < f.minRating) return false
    if (f.features.length && !f.features.every(ft => r.amenities.includes(ft))) return false
    if (f.price.length && !f.price.some(p => r.priceAvg >= PRICE_BANDS[p][0] && r.priceAvg <= PRICE_BANDS[p][1])) return false
    return true
  })
  if (f.sort === 'top') out = [...out].sort((a, b) => b.rating - a.rating)
  if (f.sort === 'nearest') out = [...out].sort((a, b) => a.distanceKm - b.distanceKm)
  if (f.sort === 'offer') out = [...out].sort((a, b) => bestOffer(b) - bestOffer(a))
  return out
}

export const activeCount = (f: Filters) => (f.sort !== 'recommended' ? 1 : 0) + f.price.length + (f.offersOnly ? 1 : 0) + f.features.length + (f.minRating ? 1 : 0)
