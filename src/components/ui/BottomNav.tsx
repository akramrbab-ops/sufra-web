import { motion } from 'framer-motion'
import { CalendarDays, Compass, Home, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const TABS = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/bookings', icon: CalendarDays, label: 'Bookings' },
  { path: '/profile', icon: User, label: 'Profile' },
]
export const TAB_PATHS = TABS.map(t => t.path)

export function BottomNav() {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const active = TABS.find(t => pathname.startsWith(t.path))?.path
  return (
    <motion.nav className="bottom-nav" initial={{ y: 140, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 140, opacity: 0, transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } }} transition={{ type: 'spring', stiffness: 300, damping: 34, delay: 0.1 }} style={{ isolation: 'isolate', x: '-50%' }}>
      {TABS.map(({ path, icon: Icon, label }) => {
        const on = path === active
        return (
          <motion.button key={path} aria-label={label} className={`tab ${on ? 'active' : ''}`} whileTap={{ scale: 0.88 }} onClick={() => !on && nav(path)}>
            {on && <motion.span layoutId="nav-indicator" className="indicator" transition={{ type: 'spring', stiffness: 380, damping: 38 }} />}
            <Icon size={22} strokeWidth={1.6} />
          </motion.button>
        )
      })}
    </motion.nav>
  )
}
