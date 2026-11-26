import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { spring } from '@/lib/motion'

const pop = { whileTap: { scale: 0.95 }, transition: spring.press }

export function Chip({ selected, onClick, children }: { selected?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <motion.button {...pop} className={`chip ${selected ? 'selected' : ''}`} onClick={onClick}>
      {children}
    </motion.button>
  )
}

export function FilterPill({ active, icon, children, onClick }: { active?: boolean; icon?: ReactNode; children: ReactNode; onClick?: () => void }) {
  return (
    <motion.button {...pop} className={`pill ${active ? 'active' : ''}`} onClick={onClick}>
      {icon}
      <span className="ellipsis">{children}</span>
      <ChevronDown size={14} strokeWidth={2} />
    </motion.button>
  )
}

export function Tag({ tone = 'surface', children, icon }: { tone?: 'glass' | 'dark' | 'surface' | 'amber' | 'success' | 'danger'; children: ReactNode; icon?: ReactNode }) {
  return (
    <span className={`tag ${tone}`}>
      {icon}
      {children}
    </span>
  )
}
