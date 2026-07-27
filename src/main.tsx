import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Pattern B (fixed): fonts + full DS styles + thin DSR companion CSS for Tabs.
import '@fontsource-variable/source-sans-3/index.css'
import './base.scss'
import '@cfpb/design-system-react/dsr.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
