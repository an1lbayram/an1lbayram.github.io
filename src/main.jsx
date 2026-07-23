import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { LanguageProvider } from './context/LanguageContext'
import App from './App.jsx'
import './index.css'

registerSW({
  onNeedRefresh() {
    // Optionally prompt user to refresh
  },
  onOfflineReady() {
    // Optionally show a "ready for offline" message
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)
