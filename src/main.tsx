import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Pattern A: DSR prebuilt CSS only — do not also import DS dist/index.css
import '@cfpb/design-system-react/index.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
