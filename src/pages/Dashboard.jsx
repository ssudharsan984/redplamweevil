import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import DetectionCard from '../components/DetectionCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { subscribeToRecentDetections } from '../services/firestoreService'
import { useTraps } from '../hooks/useTraps'
import { useAuth } from '../hooks/useAuth'
import { formatDate } from '../utils/helpers'

export default function Dashboard() {
  const [recent, setRecent] = useState([])
  const [loadingDetections, setLoadingDetections] = useState(true)
  const { traps, loading: loadingTraps } = useTraps()
  const { user } = useAuth()

  useEffect(() => {
    const unsub = subscribeToRecentDetections((data) => {
      setRecent(data)
      setLoadingDetections(false)
    }, 6)
    return unsub
  }, [])

  const totalDetected = recent.filter((d) => d.detected).length
  const clearScans = recent.length - totalDetected
  const activeTraps = traps.filter((t) => t.active).length
  const greeting = getGreeting()
  const name = user?.displayName || user?.email?.split('@')[0] || 'Admin'

  return (
    <Layout>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 text-8xl opacity-10 -mt-2 -mr-2">🌴</div>
        <div className="relative z-10">
          <p className="text-primary-100 text-sm font-medium">{greeting}</p>
          <h1 className="text-2xl font-extrabold mt-0.5 capitalize">{name} 👋</h1>
          <p className="text-primary-200 text-sm mt-1">
            {loadingDetections ? 'Loading system status...' : (
              totalDetected > 0
                ? `⚠️ ${totalDetected} RPW alert${totalDetected > 1 ? 's' : ''} in recent scans`
                : '✅ All clear — no RPW detected in recent scans'
            )}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Active Traps"
          value={loadingTraps ? '…' : activeTraps}
          icon="🪤"
          bgClass="bg-blue-50"
          colorClass="text-blue-600"
        />
        <StatCard
          label="Total Scans"
          value={loadingDetections ? '…' : recent.length}
          icon="📡"
          bgClass="bg-purple-50"
          colorClass="text-purple-600"
        />
        <StatCard
          label="RPW Alerts"
          value={loadingDetections ? '…' : totalDetected}
          icon="🚨"
          bgClass="bg-red-50"
          colorClass="text-red-500"
        />
        <StatCard
          label="Clear Scans"
          value={loadingDetections ? '…' : clearScans}
          icon="✅"
          bgClass="bg-emerald-50"
          colorClass="text-emerald-600"
        />
      </div>

      {/* Alert banner if RPW detected */}
      {!loadingDetections && totalDetected > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="font-semibold text-red-800">Red Palm Weevil Detected!</p>
            <p className="text-sm text-red-600 mt-0.5">
              {totalDetected} detection{totalDetected > 1 ? 's' : ''} found in recent scans. Check the Detection History for details.
            </p>
          </div>
        </div>
      )}

      {/* Recent Detections Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="section-title">Recent Detections</h2>
          <p className="text-xs text-gray-400 mt-0.5">Last 6 detection events</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <span className="pulse-dot" />
          <span className="text-xs text-emerald-700 font-semibold">Live</span>
        </div>
      </div>

      {loadingDetections ? (
        <LoadingSpinner message="Fetching detections..." />
      ) : recent.length === 0 ? (
        <EmptyState
          icon="📡"
          title="No detections yet"
          message="Detections from your traps will appear here in real-time as they come in."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {recent.map((d) => (
            <DetectionCard key={d.id} detection={d} />
          ))}
        </div>
      )}

      {/* Trap Status Summary */}
      {!loadingTraps && traps.length > 0 && (
        <div className="mt-8">
          <h2 className="section-title mb-4">Trap Status Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {traps.map((trap) => (
              <div key={trap.id} className="card-flat flex items-center gap-3 p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
                  ${trap.active ? 'bg-green-50' : 'bg-gray-50'}`}>
                  🪤
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{trap.trapId}</p>
                  <p className="text-xs text-gray-400 truncate">{trap.location || 'No location'}</p>
                </div>
                <span className={trap.active ? 'badge-active' : 'badge-inactive'}>
                  {trap.active ? '● Active' : '○ Off'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning,'
  if (h < 17) return 'Good afternoon,'
  return 'Good evening,'
}
