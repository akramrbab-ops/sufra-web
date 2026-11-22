import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/500.css'
import '@fontsource/geist-sans/600.css'
import '@/styles/tokens.css'
import '@/styles/global.css'
import { setLocale } from '@/i18n'
import App from '@/app/App'

setLocale('en')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
