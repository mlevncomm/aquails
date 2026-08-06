import { StrictMode, useEffect, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { initAuth } from '@/services/authService'
import { AppErrorBoundary } from '@/components/AppErrorBoundary'
import { installChunkLoadRecovery } from '@/lib/chunkRecovery'

installChunkLoadRecovery()
void initAuth()

function ChunkRecoveryGate({ children }: { children: ReactNode }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const onFail = () => setFailed(true)
    window.addEventListener('aquails:chunk-recovery-failed', onFail)
    return () => window.removeEventListener('aquails:chunk-recovery-failed', onFail)
  }, [])

  if (failed) {
    throw new Error('Chunk recovery failed')
  }

  return children
}

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML =
    '<main style="font-family:system-ui,sans-serif;padding:2rem;text-align:center"><h1>Aquails yüklenemedi</h1><p>Sayfa kök öğesi bulunamadı. Lütfen sayfayı yenileyin.</p></main>'
  throw new Error('Root element #root not found')
}

createRoot(rootEl).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <ChunkRecoveryGate>
          <App />
        </ChunkRecoveryGate>
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
)
