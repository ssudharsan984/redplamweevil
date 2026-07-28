import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import DetectionCard from '../components/DetectionCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { subscribeToRecentTraps } from '../services/firestoreService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { formatTimeAgo, isDetected } from '../utils/helpers'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [traps, setTraps] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, profile, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const name = profile?.fullName || user?.displayName || user?.email?.split('@')[0] || 'Admin'
  const role = profile?.role || 'Farmer'
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  useEffect(() => {
    const unsub = subscribeToRecentTraps((data) => {
      setTraps(data)
      setLoading(false)
    }, 6)
    return unsub
  }, [])

  const totalDetected = traps.filter(isDetected).length
  const clearScans = traps.length - totalDetected
  const activeTraps = traps.filter((t) => t.active !== false).length
  const lastUpdated = traps[0]?.timestamp

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully.')
    navigate('/login', { replace: true })
  }

  return (
    <Layout>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute right-4 top-0 opacity-10 select-none pointer-events-none">
          <img src="/appstore-images/android/launchericon-192x192.png" alt="" className="w-24 h-24" />
        </div>
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Profile avatar */}
            <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-xl font-extrabold text-white flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-primary-100 text-xs font-medium">{getGreeting()} · {role}</p>
              <h1 className="text-xl font-extrabold mt-0.5">{name} 👋</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-primary-200 text-xs">
                  {loading ? 'Loading...' : totalDetected > 0
                    ? `⚠️ ${totalDetected} RPW alert${totalDetected > 1 ? 's' : ''} detected`
                    : '✅ All clear — no RPW detected'}
                </p>
                {lastUpdated && (
                  <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full text-primary-100">
                    {formatTimeAgo(lastUpdated)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex-shrink-0 text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Plantation Overview */}
      <div className="mb-2">
        <h2 className="section-title">Plantation Overview</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-4">Real-time summary of your detection system</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Traps"  value={loading ? '…' : traps.length}   icon="🪤" bgClass="bg-blue-50"    colorClass="text-blue-600" />
        <StatCard label="Active Traps" value={loading ? '…' : activeTraps}    icon="📡" bgClass="bg-purple-50"  colorClass="text-purple-600" />
        <StatCard label="RPW Alerts"   value={loading ? '…' : totalDetected}  icon="🚨" bgClass="bg-red-50"     colorClass="text-red-500" />
        <StatCard label="Clear Scans"  value={loading ? '…' : clearScans}     icon="✅" bgClass="bg-emerald-50" colorClass="text-emerald-600" />
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

      {/* Recent Detection Images */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="section-title">Recent Detection Images</h2>
          <p className="text-xs text-gray-400 mt-0.5">Latest trap scan results</p>
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

      {/* Notifications */}
      <div className="mt-8">
        <h2 className="section-title mb-4">🔔 Notifications</h2>
        {totalDetected > 0 ? (
          <div className="space-y-3">
            {traps.filter(isDetected).slice(0, 3).map((trap) => (
              <div key={trap.id} className="card-flat flex items-center gap-3 p-4 border-l-4 border-l-red-400">
                <span className="text-2xl">🚨</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">RPW Detected — {trap.trapId}</p>
                  <p className="text-xs text-gray-500">{trap.location || 'Unknown location'} · {formatTimeAgo(trap.timestamp)}</p>
                </div>
                {trap.confidence != null && (
                  <span className="text-xs font-bold text-red-600">{trap.confidence}%</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card-flat flex items-center gap-3 p-4">
            <span className="text-2xl">✅</span>
            <p className="text-sm text-gray-500">No new notifications. All traps are clear.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
