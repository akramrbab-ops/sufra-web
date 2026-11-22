import { en, type Dict } from './en'

export type Locale = 'en' | 'ar'
const dictionaries: Record<Locale, Dict> = { en, ar: en } // ar.ts to be added; falls back to English for now
let current: Locale = 'en'

export function setLocale(l: Locale) {
  current = l
  document.documentElement.lang = l
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
}

type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : never) : never
type Keys<T> = { [K in keyof T]: T[K] extends Record<string, string> ? Join<K, keyof T[K]> : never }[keyof T]
export type TKey = Keys<Dict>

export function t(key: TKey, vars?: Record<string, string | number>): string {
  const [group, k] = key.split('.') as [keyof Dict, string]
  const raw = (dictionaries[current][group] as Record<string, string>)[k] ?? key
  if (!vars) return raw
  return raw.replace(/\{(\w+)\}/g, (_, v) => String(vars[v] ?? ''))
}

export const sar = (n: number) => `SAR ${Math.round(n).toLocaleString('en-US')}`
