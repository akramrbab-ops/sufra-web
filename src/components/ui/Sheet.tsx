import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function Sheet({ open, onClose, children, height }: { open: boolean; onClose: () => void; children: ReactNode; height?: number | string }) {
  const controls = useDragControls()
  const host = typeof document !== 'undefined' ? document.getElementById('overlay-root') : null
  if (!host) return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={onClose} />
          <motion.div
            className="sheet"
            role="dialog"
            style={{ height }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38, mass: 0.9 }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => { if (info.offset.y > 110 || info.velocity.y > 600) onClose() }}
          >
            <div onPointerDown={e => controls.start(e)} style={{ cursor: 'grab', paddingBottom: 4, touchAction: 'none' }}>
              <div className="handle" />
            </div>
            <div className="sheet-body">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    host,
  )
}
