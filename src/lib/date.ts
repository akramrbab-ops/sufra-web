const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const pad = (n: number) => String(n).padStart(2, '0')
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const fromISO = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }

export function dayLabel(iso: string): string {
  const d = fromISO(iso)
  const t = new Date(); t.setHours(0, 0, 0, 0)
  const diff = Math.round((d.getTime() - t.getTime()) / 86400000)
  if (diff === 0) return 'Tonight'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}
export const timeLabel = (t: string) => `${t} PM`
export const whenLabel = (iso: string, t: string) => `${dayLabel(iso)}, ${timeLabel(t)}`
export const isPast = (iso: string) => { const t = new Date(); t.setHours(0, 0, 0, 0); return fromISO(iso) < t }
