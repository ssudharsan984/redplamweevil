import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register service worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    if (window.confirm('New version available! Click OK to update.')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('RPW Detection app is ready to work offline.')
  },
  onRegistered(r) {
    console.log('Service worker registered:', r)
  },
  onRegisterError(error) {
    console.error('Service worker registration failed:', error)
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
