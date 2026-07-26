import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import DetectionCard from '../components/DetectionCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { subscribeToRecentTraps } from '../services/firestoreService'
import { useAuth } from '../hooks/useAuth'
import { formatTimeAgo, isDetected } from '../utils/helpers'

export default function Dashboard() {
  const [traps, setTraps] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const unsub = subscribeToRecentTraps((data) => {
      setTraps(data)
      setLoading(false)
    }, 6)
    return unsub
  }, [])

  const totalDetected = traps.filter(isDetected).length
  const clearScans = traps.length - totalDetected
  const greeting = getGreeting()
  const name = user?.displayName || user?.email?.split('@')[0] || 'Admin'
  const lastUpdated = traps[0]?.timestamp

  return (
    <Layout>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute right-4 top-0 text-8xl opacity-10 select-none">🌴</div>
        <div className="relative z-10">
          <p className="text-primary-100 text-sm font-medium">{greeting}</p>
          <h1 className="text-2xl font-extrabold mt-0.5 capitalize">{name} 👋</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <p className="text-primary-200 text-sm">
              {loading ? 'Loading...' : totalDetected > 0
                ? `⚠️ ${totalDetected} RPW alert${totalDetected > 1 ? 's' : ''} in recent scans`
                : '✅ All clear — no RPW in recent scans'}
            </p>
            {lastUpdated && (
              <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full text-primary-100">
                Last update: {formatTimeAgo(lastUpdated)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Traps" value={loading ? '…' : traps.length} icon="🪤" bgClass="bg-blue-50" colorClass="text-blue-600" />
        <StatCard label="Recent Scans" value={loading ? '…' : traps.length} icon="📡" bgClass="bg-purple-50" colorClass="text-purple-600" />
        <StatCard label="RPW Alerts" value={loading ? '…' : totalDetected} icon="🚨" bgClass="bg-red-50" colorClass="text-red-500" />
        <StatCard label="Clear Scans" value={loading ? '…' : clearScans} icon="✅" bgClass="bg-emerald-50" colorClass="text-emerald-600" />
      </div>

      {/* RPW Alert Banner */}
      {!loading && totalDetected > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="font-semibold text-red-800">Red Palm Weevil Detected!</p>
            <p className="text-sm text-red-600 mt-0.5">
              {totalDetected} detection{totalDetected > 1 ? 's' : ''} found. Check Trap Details for full information and images.
            </p>
          </div>
        </div>
      )}

      {/* Recent Detections */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="section-title">Recent Detections</h2>
          <p className="text-xs text-gray-400 mt-0.5">Latest trap scan results with detection images</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <span className="pulse-dot" />
          <span className="text-xs text-emerald-700 font-semibold">Live</span>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching detections..." />
      ) : traps.length === 0 ? (
        <EmptyState
          icon="📡"
          title="No detections yet"
          message="Detection results from your Python YOLO script will appear here in real-time."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {traps.map((trap) => (
            <DetectionCard key={trap.id} detection={trap} />
          ))}
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
