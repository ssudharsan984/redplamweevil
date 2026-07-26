import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import DetectionCard from '../components/DetectionCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { subscribeToRecentDetections } from '../services/firestoreService'
import { useTraps } from '../hooks/useTraps'

export default function Dashboard() {
  const [recent, setRecent] = useState([])
  const [loadingDetections, setLoadingDetections] = useState(true)
  const { traps, loading: loadingTraps } = useTraps()

  useEffect(() => {
    const unsub = subscribeToRecentDetections((data) => {
      setRecent(data)
      setLoadingDetections(false)
    }, 6)
    return unsub
  }, [])

  const totalDetected = recent.filter((d) => d.detected).length
  const activeTraps = traps.length

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time Red Palm Weevil monitoring overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Traps" value={loadingTraps ? '…' : activeTraps} icon="🪤" />
        <StatCard label="Recent Detections" value={loadingDetections ? '…' : recent.length} icon="📡" />
        <StatCard
          label="RPW Alerts"
          value={loadingDetections ? '…' : totalDetected}
          icon="🚨"
          colorClass="text-red-500"
        />
        <StatCard
          label="Clear Scans"
          value={loadingDetections ? '…' : recent.length - totalDetected}
          icon="✅"
          colorClass="text-green-500"
        />
      </div>

      {/* Recent Detections */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Recent Detections</h2>
        <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-full">
          Live · Real-time
        </span>
      </div>

      {loadingDetections ? (
        <LoadingSpinner message="Fetching detections..." />
      ) : recent.length === 0 ? (
        <EmptyState
          icon="📡"
          title="No detections yet"
          message="Detections from your traps will appear here in real-time."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {recent.map((d) => (
            <DetectionCard key={d.id} detection={d} />
          ))}
        </div>
      )}
    </Layout>
  )
}
