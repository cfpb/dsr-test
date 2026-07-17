import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Pattern B: fonts + full DS styles (see base.scss). No DSR index.css.
import '@fontsource-variable/source-sans-3/index.css'
import './base.scss'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
