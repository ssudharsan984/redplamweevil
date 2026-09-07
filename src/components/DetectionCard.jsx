import { useState } from 'react'
import { formatDate, formatConfidence, formatTimeAgo, getConfidenceColor, getConfidenceBarColor, normalizeConfidence, isDetected } from '../utils/helpers'

export default function DetectionCard({ detection, onDelete, onClick }) {
  const [imgError, setImgError] = useState(false)
  const { trapId, status, confidence, imageUrl, timestamp, location } = detection
  const detected  = isDetected(detection)
  const confValue = normalizeConfidence(confidence)

  return (
    <div onClick={onClick}
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
        ${detected ? 'border-danger-200' : 'border-primary-200'}
        ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}>

      {/* Status bar */}
      <div className={`h-1 w-full ${detected ? 'bg-danger-500' : 'bg-primary-500'}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Trap ID</p>
            <p className="text-xl font-extrabold text-gray-900">{trapId || '—'}</p>
          </div>
          <span className={detected ? 'badge-detected' : 'badge-clear'}>
            {detected ? 'RPW Detected' : 'No RPW'}
          </span>
        </div>

        {/* Image */}
        {imageUrl && !imgError && (
          <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 h-44 relative">
            <img src={imageUrl} alt={`Detection from ${trapId}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {/* Details */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 text-gray-400 flex-shrink-0"><ClockIcon /></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Detection Time</p>
              <p className="font-medium text-gray-800 text-xs">{formatDate(timestamp)}</p>
            </div>
            <span className="text-xs text-gray-400">{formatTimeAgo(timestamp)}</span>
          </div>

          {location && (
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 text-gray-400 flex-shrink-0"><PinIcon /></div>
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="font-medium text-gray-800 text-xs">{location}</p>
              </div>
            </div>
          )}

          {confValue != null && (
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-gray-400">Confidence</p>
                <p className={`text-sm font-bold ${getConfidenceColor(confidence)}`}>{formatConfidence(confidence)}</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-700 ${getConfidenceBarColor(confidence)}`}
                  style={{ width: `${confValue}%` }} />
              </div>
            </div>
          )}
        </div>

        {onDelete && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(detection.id) }}
            className="mt-4 w-full text-xs text-danger-400 hover:text-danger-600 hover:bg-danger-50 py-1.5 rounded-lg transition-colors border border-transparent hover:border-danger-100">
            Delete record
          </button>
        )}
      </div>
    </div>
  )
}

const ClockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const PinIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
