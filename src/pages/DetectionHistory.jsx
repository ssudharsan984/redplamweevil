import { useState } from 'react'
import Layout from '../components/Layout'
import DetectionCard from '../components/DetectionCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { useDetections } from '../hooks/useDetections'
import { deleteDetection } from '../services/firestoreService'

export default function DetectionHistory() {
  const { detections, loading } = useDetections(100)
  const [filter, setFilter] = useState('all') // all | detected | clear
  const [search, setSearch] = useState('')

  const filtered = detections.filter((d) => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'detected' && d.detected) ||
      (filter === 'clear' && !d.detected)
    const matchSearch =
      !search || d.trapId?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const handleDelete = async (id) => {
    if (window.confirm('Delete this detection record?')) {
      await deleteDetection(id)
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Detection History</h1>
        <p className="text-gray-500 text-sm mt-1">All recorded detection events</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          className="input sm:max-w-xs"
          placeholder="Search by Trap ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {['all', 'detected', 'clear'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors
                ${filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              {f === 'all' ? 'All' : f === 'detected' ? '🚨 RPW' : '✅ Clear'}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500 self-center ml-auto">
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading history..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No records found"
          message="Try adjusting your filters or search term."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <DetectionCard key={d.id} detection={d} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </Layout>
  )
}
