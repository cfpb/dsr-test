import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Pattern B (broken demo): fonts + full DS styles only.
// Intentionally omit @cfpb/design-system-react/dsr.css so Tabs lack DSR-only chrome.
import '@fontsource-variable/source-sans-3/index.css'
import './base.scss'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
