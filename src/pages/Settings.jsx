import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../hooks/useAuth'
import { subscribeToSettings, saveSettings } from '../services/firestoreService'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

const DEFAULT_SETTINGS = {
  notificationsEnabled: false,
  alertThreshold: 0.7,
  apiEndpoint: '',
  apiKey: '',
  autoRefresh: true,
  language: 'en',
}

export default function Settings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)
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
      // Use setDoc with merge for first-time creation
      await setDoc(doc(db, 'settings', user.uid), settings, { merge: true })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }))

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your detection system preferences</p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">

        {/* Account Info */}
        <section className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            👤 Account
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input className="input bg-gray-50" value={user?.email || ''} disabled />
          </div>
          <p className="text-xs text-gray-400 mt-2">UID: {user?.uid}</p>
        </section>

        {/* Notifications */}
        <section className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🔔 Notifications
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Push Notifications</p>
              <p className="text-xs text-gray-500">Receive alerts when RPW is detected (requires FCM setup)</p>
            </div>
            <button
              type="button"
              onClick={() => update('notificationsEnabled', !settings.notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings.notificationsEnabled ? 'bg-primary-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                ${settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alert Confidence Threshold: <span className="text-primary-600">{(settings.alertThreshold * 100).toFixed(0)}%</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={settings.alertThreshold}
              onChange={(e) => update('alertThreshold', parseFloat(e.target.value))}
              className="w-full accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10%</span><span>100%</span>
            </div>
          </div>
        </section>

        {/* YOLO API */}
        <section className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
            🤖 YOLO Detection API
          </h2>
          <p className="text-xs text-gray-500 mb-4">Connect to your Python YOLO backend for AI inference</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
              <input
                className="input"
                placeholder="https://your-api.example.com/detect"
                value={settings.apiEndpoint}
                onChange={(e) => update('apiEndpoint', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••••••"
                value={settings.apiKey}
                onChange={(e) => update('apiKey', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* App Preferences */}
        <section className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ⚙️ App Preferences
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Auto Refresh</p>
              <p className="text-xs text-gray-500">Keep real-time listeners active</p>
            </div>
            <button
              type="button"
              onClick={() => update('autoRefresh', !settings.autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings.autoRefresh ? 'bg-primary-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                ${settings.autoRefresh ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary px-8" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              ✅ Settings saved!
            </span>
          )}
        </div>
      </form>
    </Layout>
  )
}
