import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Library stylesheet first (what a consumer gets from `gridory/styles.css`),
// then the demo's own Tailwind/shadcn setup.
import './styles/index.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
