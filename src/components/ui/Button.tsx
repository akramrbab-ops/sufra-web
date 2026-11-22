import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'accent' | 'secondary' | 'glass' | 'ghost' | 'danger'
interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: 'lg' | 'md'
  block?: boolean
  leading?: ReactNode
  trailing?: ReactNode
  children?: ReactNode
}

export const press = { whileTap: { scale: 0.97, opacity: 0.8 }, transition: { type: 'spring' as const, stiffness: 500, damping: 30 } }

export function Button({ variant = 'primary', size = 'lg', block, leading, trailing, children, className = '', ...rest }: ButtonProps) {
  return (
    <motion.button {...press} className={`btn ${variant} ${size === 'md' ? 'md' : ''} ${block ? 'block' : ''} ${className}`} {...rest}>
      {leading}
      {children}
      {trailing}
    </motion.button>
  )
}

interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'glass' | 'surface' | 'raised' | 'inverse' | 'ghost'
  size?: 'lg' | 'md' | 'sm'
  label: string
  children: ReactNode
}
export function IconButton({ variant = 'surface', size = 'md', label, children, className = '', ...rest }: IconButtonProps) {
  return (
    <motion.button aria-label={label} whileTap={{ scale: 0.9 }} transition={{ type: 'spring', stiffness: 500, damping: 28 }} className={`icon-btn ${variant} ${size === 'md' ? '' : size} ${className}`} {...rest}>
      {children}
    </motion.button>
  )
}
