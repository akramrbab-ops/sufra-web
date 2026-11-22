import { AnimatePresence, motion } from 'framer-motion'
import { Check, Minus, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { useId } from 'react'

const spring = { type: 'spring' as const, stiffness: 520, damping: 34 }

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} className={`toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)}>
      <motion.span layout transition={spring} className="knob" />
    </button>
  )
}

export function Radio({ on }: { on: boolean }) {
  return (
    <span className={`radio ${on ? 'on' : ''}`}>
      <AnimatePresence>{on && <motion.span className="dot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring} />}</AnimatePresence>
    </span>
  )
}

export function Checkbox({ on }: { on: boolean }) {
  return (
    <motion.span className={`check ${on ? 'on' : ''}`} animate={{ scale: on ? [1, 1.15, 1] : 1 }} transition={{ duration: 0.3 }}>
      {on && <Check size={16} strokeWidth={2.4} />}
    </motion.span>
  )
}

export function Stepper({ value, min = 1, max = 12, onChange }: { value: number; min?: number; max?: number; onChange: (v: number) => void }) {
  return (
    <div className="row gap-20" style={{ padding: 4, borderRadius: 999, background: 'var(--bg-surface)' }}>
      <motion.button whileTap={{ scale: 0.88 }} aria-label="Decrease" className="icon-btn raised" style={{ width: 40, height: 40, opacity: value <= min ? 0.4 : 1 }} onClick={() => value > min && onChange(value - 1)}>
        <Minus size={18} strokeWidth={1.8} />
      </motion.button>
      <div style={{ width: 22, height: 24, position: 'relative', overflow: 'hidden', textAlign: 'center' }} className="t-h3">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span key={value} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={spring} style={{ display: 'block' }}>
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.button whileTap={{ scale: 0.88 }} aria-label="Increase" className="icon-btn raised" style={{ width: 40, height: 40, opacity: value >= max ? 0.4 : 1 }} onClick={() => value < max && onChange(value + 1)}>
        <Plus size={18} strokeWidth={1.8} />
      </motion.button>
    </div>
  )
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: ReactNode }[]; value: T; onChange: (v: T) => void }) {
  const id = useId()
  return (
    <div className="segmented" style={{ isolation: 'isolate' }}>
      {options.map(o => (
        <button key={o.value} className={o.value === value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.value === value && <motion.span layoutId={`seg-${id}`} className="seg-bg" transition={spring} />}
          {o.label}
        </button>
      ))}
    </div>
  )
}
