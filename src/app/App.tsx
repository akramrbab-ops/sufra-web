import { AnimatePresence, MotionConfig } from 'framer-motion'
import { spring } from '@/lib/motion'
import { useEffect, useMemo, useRef } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigationType, type Location } from 'react-router-dom'
import { BottomNav, TAB_PATHS } from '@/components/ui/BottomNav'
import { Toasts } from '@/components/ui/Misc'
import { PayPrompt } from '@/screens/features/Features'
import { TransitionContext, type TransitionCtx, type TransitionKind } from './Screen'
import { routes } from './routes'

function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <svg width="72" height="13" viewBox="0 0 72 13" fill="#fff" aria-hidden>
        <rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0.5" width="3" height="11.5" rx="1" />
        <path d="M31 11.5 33.2 9a3 3 0 0 0-4.4 0z" /><path d="M26.6 6.8a6.3 6.3 0 0 1 8.8 0M24 4.1a10 10 0 0 1 14 0" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <rect x="44.5" y="0.5" width="23" height="12" rx="3.5" stroke="#fff" strokeOpacity=".4" fill="none" /><rect x="46" y="2" width="20" height="9" rx="2" /><rect x="69" y="4.5" width="1.5" height="4" rx=".75" fillOpacity=".4" />
      </svg>
    </div>
  )
}

const isTab = (p: string) => TAB_PATHS.includes(p)
const FADE_FROM = ['/', '/signin/location', '/signin/details']
const MODAL_TO = ['/gifts/buy', '/payment-methods/add', '/help/chat']

function kindFor(from: Location, to: Location, back: boolean): TransitionKind {
  if (isTab(from.pathname) && isTab(to.pathname)) return 'fade'
  if (!back && (to.state as { shared?: string } | null)?.shared) return 'shared'
  if (back && (from.state as { shared?: string } | null)?.shared) return 'shared'
  if (!back && FADE_FROM.includes(from.pathname)) return 'fade'
  if (from.pathname === '/welcome' && isTab(to.pathname)) return 'fade'
  if (to.pathname.startsWith('/book/done') || from.pathname.startsWith('/book/done')) return 'fade'
  if (to.pathname === '/welcome' && !back) return 'fade'
  if ((!back && MODAL_TO.includes(to.pathname)) || (back && MODAL_TO.includes(from.pathname))) return 'modal'
  return 'push'
}

function Shell() {
  const location = useLocation()
  const navType = useNavigationType()
  const prev = useRef<Location>(location)
  const ctx: TransitionCtx = useMemo(() => {
    const back = navType === 'POP'
    return { kind: kindFor(prev.current, location, back), back }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])
  useEffect(() => { prev.current = location }, [location])

  const showNav = isTab(location.pathname)
  return (
    <MotionConfig transition={spring.smooth} reducedMotion="user">
    <div className="stage">
      <div className="device">
        <div className="device-notch" />
        <StatusBar />
        <div className="screen-host">
          <TransitionContext.Provider value={ctx}>
            <AnimatePresence custom={ctx} initial={false}>
              <Routes location={location} key={location.pathname}>
                {routes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </TransitionContext.Provider>
        </div>
        <AnimatePresence>{showNav && <BottomNav key="nav" />}</AnimatePresence>
        <div id="overlay-root" />
        <Toasts />
        <PayPrompt />
        <div className="home-indicator" />
      </div>
    </div>
    </MotionConfig>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  )
}
