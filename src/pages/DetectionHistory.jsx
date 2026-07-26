import { useState } from 'react'
import Layout from '../components/Layout'
import DetectionCard from '../components/DetectionCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { useTraps } from '../hooks/useTraps'
import { deleteTrap } from '../services/firestoreService'
import { isDetected } from '../utils/helpers'

export default function DetectionHistory() {
  const { traps, loading } = useTraps()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = traps.filter((t) => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'detected' && isDetected(t)) ||
      (filter === 'clear' && !isDetected(t))
    const matchSearch = !search || t.trapId?.toLowerCase().includes(search.toLowerCase()) || t.location?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const handleDelete = async (id) => {
    if (window.confirm('Delete this detection record?')) await deleteTrap(id)
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="page-title">Detection History</h1>
        <p className="page-subtitle">All recorded detection events from Firestore</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          className="input sm:max-w-xs"
          placeholder="Search by Trap ID or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'detected', label: '🚨 RPW' },
            { key: 'clear', label: '✅ Clear' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${filter === key ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-400 self-center sm:ml-auto">
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading history..." />
      ) : filtered.length === 0 ? (
        <EmptyState icon="📋" title="No records found" message="Try adjusting your filters or search term." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <DetectionCard key={t.id} detection={t} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </Layout>
  )
}
