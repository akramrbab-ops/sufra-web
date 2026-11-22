import { motion } from 'framer-motion'
import { t } from '@/i18n'

export function TimeSlot({ time, discount, selected, onClick }: { time: string; discount: number; selected?: boolean; onClick?: () => void }) {
  const full = discount < 0
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      animate={{ scale: selected ? [1, 1.08, 1] : 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={`slot ${selected ? 'selected' : ''} ${full ? 'full' : ''}`}
      onClick={onClick}
    >
      <span className="time">{time}</span>
      <span className="offer">{full ? t('common.full') : discount > 0 ? `-${discount}%` : t('common.book')}</span>
    </motion.button>
  )
}
