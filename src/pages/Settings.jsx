import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { subscribeToSettings } from '../services/firestoreService'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

const DEFAULT_SETTINGS = {
  notificationsEnabled: false,
  alertThreshold: 0.7,
  apiEndpoint: '',
  apiKey: '',
  autoRefresh: true,
}

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-gray-300'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

export default function Settings() {
  const { user } = useAuth()
  const toast = useToast()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    const unsub = subscribeToSettings(user.uid, (data) => {
      if (data) setSettings((prev) => ({ ...prev, ...data }))
    })
    return unsub
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await setDoc(doc(db, 'settings', user.uid), settings, { merge: true })
      toast.success('Settings saved successfully.')
    } catch {
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }))

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your detection system preferences</p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-5">

        {/* Account */}
        <section className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-4 h-4 text-primary-600"><UserIcon /></div>
            Account
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input className="input bg-gray-50" value={user?.email || ''} disabled />
          </div>
          <p className="text-xs text-gray-400 mt-2 font-mono">UID: {user?.uid}</p>
        </section>

        {/* Notifications */}
        <section className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-4 h-4 text-primary-600"><BellIcon /></div>
            Notifications
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Push Notifications</p>
              <p className="text-xs text-gray-500">Receive alerts when RPW is detected</p>
            </div>
            <Toggle checked={settings.notificationsEnabled} onChange={(v) => update('notificationsEnabled', v)} />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alert Confidence Threshold:{' '}
              <span className="text-primary-600 font-semibold">{(settings.alertThreshold * 100).toFixed(0)}%</span>
            </label>
            <input type="range" min="0.1" max="1" step="0.05"
              value={settings.alertThreshold}
              onChange={(e) => update('alertThreshold', parseFloat(e.target.value))}
              className="w-full accent-primary-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10%</span><span>100%</span>
            </div>
          </div>
        </section>

        {/* Detection API */}
        <section className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <div className="w-4 h-4 text-primary-600"><CpuIcon /></div>
            Detection API
          </h2>
          <p className="text-xs text-gray-500 mb-4">Connect to your Python YOLO backend</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
              <input className="input" placeholder="https://your-api.example.com/detect"
                value={settings.apiEndpoint}
                onChange={(e) => update('apiEndpoint', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input type="password" className="input" placeholder="Enter your API key"
                value={settings.apiKey}
                onChange={(e) => update('apiKey', e.target.value)} />
            </div>
          </div>
        </section>

        {/* App Preferences */}
        <section className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-4 h-4 text-primary-600"><SettingsIcon /></div>
            App Preferences
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Auto Refresh</p>
              <p className="text-xs text-gray-500">Keep real-time listeners active</p>
            </div>
            <Toggle checked={settings.autoRefresh} onChange={(v) => update('autoRefresh', v)} />
          </div>
        </section>

        <button type="submit" className="btn-primary px-8 flex items-center gap-2" disabled={saving}>
          {saving
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
            : <><div className="w-4 h-4"><SaveIcon /></div>Save Settings</>}
        </button>
      </form>
    </Layout>
  )
}

const UserIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const BellIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const CpuIcon     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
const SettingsIcon= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
const SaveIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
