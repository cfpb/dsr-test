import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Pattern A against DSR main: only library CSS. Component rules are missing
// from dist/index.css today — that is the bug this branch demonstrates.
import '@cfpb/design-system-react/index.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
