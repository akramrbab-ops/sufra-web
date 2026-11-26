import { motion, type Variants } from 'framer-motion'
import { createContext, useContext, type ReactNode } from 'react'
import { dur, ease } from '@/lib/motion'

export type TransitionKind = 'push' | 'fade' | 'shared' | 'modal'
export interface TransitionCtx { kind: TransitionKind; back: boolean }
export const TransitionContext = createContext<TransitionCtx>({ kind: 'push', back: false })

const P = { duration: dur.page, ease: ease.ios }
/* push: new page slides over, old page drifts left and dims; shared: soft cross-fade so the photo can fly; modal: rises from the bottom */
const variants: Variants = {
  initial: ({ kind, back }: TransitionCtx) =>
    kind === 'push' ? (back ? { x: '-24%', opacity: 0.7, zIndex: 1, boxShadow: '0 0 0 rgba(0,0,0,0)' } : { x: '100%', opacity: 1, zIndex: 2, boxShadow: '-24px 0 48px rgba(0,0,0,.45)' })
    : kind === 'modal' ? (back ? { y: 0, scale: 0.96, opacity: 0.7, zIndex: 1 } : { y: '100%', opacity: 1, zIndex: 2 })
    : kind === 'shared' ? { opacity: 0, zIndex: 2 }
    : { opacity: 0, scale: 0.985, zIndex: 2 },
  animate: ({ kind }: TransitionCtx) => ({
    x: 0, y: 0, scale: 1, opacity: 1,
    boxShadow: kind === 'push' ? '-24px 0 48px rgba(0,0,0,0)' : undefined,
    transition: kind === 'push' || kind === 'modal' ? P : kind === 'shared' ? { duration: 0.34, ease: ease.out } : { duration: 0.28, ease: ease.out },
  }),
  exit: ({ kind, back }: TransitionCtx) =>
    kind === 'push' ? (back ? { x: '100%', opacity: 1, zIndex: 2, boxShadow: '-24px 0 48px rgba(0,0,0,.45)', transition: P } : { x: '-24%', opacity: 0.7, zIndex: 1, transition: P })
    : kind === 'modal' ? (back ? { y: '100%', zIndex: 2, transition: P } : { scale: 0.96, opacity: 0.7, zIndex: 1, transition: P })
    : { opacity: 0, zIndex: 1, transition: { duration: kind === 'shared' ? 0.3 : 0.2, ease: ease.out } },
}

export function Screen({ children, className = '', scroll = true }: { children: ReactNode; className?: string; scroll?: boolean }) {
  const ctx = useContext(TransitionContext)
  return (
    <motion.main custom={ctx} variants={variants} initial="initial" animate="animate" exit="exit" className={`screen ${scroll ? '' : 'no-scroll'} ${className}`}>
      {children}
    </motion.main>
  )
}
