import { motion, type Variants } from 'framer-motion'
import { createContext, useContext, type ReactNode } from 'react'

export type TransitionKind = 'push' | 'fade' | 'shared' | 'modal'
export interface TransitionCtx { kind: TransitionKind; back: boolean }
export const TransitionContext = createContext<TransitionCtx>({ kind: 'push', back: false })

const ios = [0.32, 0.72, 0, 1] as const
const variants: Variants = {
  initial: ({ kind, back }: TransitionCtx) =>
    kind === 'push' ? { x: back ? '-28%' : '100%', opacity: 1, zIndex: back ? 1 : 2 }
    : kind === 'modal' ? { y: back ? 0 : '100%', opacity: back ? 0.6 : 1, zIndex: back ? 1 : 2 }
    : { opacity: 0, zIndex: 2 },
  animate: { x: 0, y: 0, opacity: 1, transition: { duration: 0.45, ease: ios } },
  exit: ({ kind, back }: TransitionCtx) =>
    kind === 'push' ? { x: back ? '100%' : '-28%', opacity: back ? 1 : 0.6, zIndex: back ? 2 : 1, transition: { duration: 0.45, ease: ios } }
    : kind === 'modal' ? { y: back ? '100%' : 0, opacity: back ? 1 : 0.6, zIndex: back ? 2 : 1, transition: { duration: 0.45, ease: ios } }
    : { opacity: 0, zIndex: 1, transition: { duration: kind === 'shared' ? 0.35 : 0.25, ease: 'easeOut' } },
}

export function Screen({ children, className = '', scroll = true }: { children: ReactNode; className?: string; scroll?: boolean }) {
  const ctx = useContext(TransitionContext)
  return (
    <motion.main custom={ctx} variants={variants} initial="initial" animate="animate" exit="exit" className={`screen ${scroll ? '' : 'no-scroll'} ${className}`}>
      {children}
    </motion.main>
  )
}
