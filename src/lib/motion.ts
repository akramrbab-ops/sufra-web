/** Sufra motion system — one place for every duration, curve and spring. */
export const ease = {
  ios: [0.32, 0.72, 0, 1] as const,       // iOS sheet / navigation curve
  out: [0.22, 1, 0.36, 1] as const,       // soft deceleration for fades
  inOut: [0.65, 0, 0.35, 1] as const,
}
export const dur = { fast: 0.18, base: 0.32, page: 0.52 }
/** Springs tuned to be critically damped (no wobble) unless noted. */
export const spring = {
  gentle: { type: 'spring' as const, stiffness: 220, damping: 30, mass: 1 },
  smooth: { type: 'spring' as const, stiffness: 300, damping: 34, mass: 1 },
  snappy: { type: 'spring' as const, stiffness: 420, damping: 40, mass: 0.8 },
  press: { type: 'spring' as const, stiffness: 520, damping: 38, mass: 0.6 },
  sheet: { type: 'spring' as const, stiffness: 300, damping: 36, mass: 1 },
  /** a single soft settle, for celebratory moments only */
  pop: { type: 'spring' as const, stiffness: 340, damping: 22, mass: 0.9 },
}
export const pressable = { whileTap: { scale: 0.97 }, transition: spring.press }
