import { useState } from 'react'
import { formatDate, formatConfidence, formatTimeAgo, getConfidenceColor, getConfidenceBarColor, normalizeConfidence, isDetected } from '../utils/helpers'

export default function DetectionCard({ detection, onDelete, onClick }) {
  const [imgError, setImgError] = useState(false)
  const { trapId, status, confidence, imageUrl, timestamp, location, description } = detection
  const detected = isDetected(detection)
  const confValue = normalizeConfidence(confidence)

  return (
    <div
      onClick={onClick}
      className={`card group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5
        ${detected ? 'border-l-4 border-l-red-400' : 'border-l-4 border-l-emerald-400'}
        ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 -mr-8 -mt-8
        ${detected ? 'bg-red-500' : 'bg-emerald-500'}`} />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3 relative">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-0.5">Trap ID</p>
          <p className="font-extrabold text-gray-900 text-xl leading-none">{trapId || '—'}</p>
        </div>
        <span className={detected ? 'badge-detected' : 'badge-clear'}>
          {detected ? '🚨 RPW Detected' : '✅ No RPW'}
        </span>
      </div>

      {/* Detection Image from Firebase Storage */}
      {imageUrl && !imgError ? (
        <div className="mb-3 rounded-xl overflow-hidden bg-gray-100 h-44 relative">
          <img
            src={imageUrl}
            alt={`Detection from ${trapId}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <span className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
            📷 Detection Image
          </span>
        </div>
      ) : imageUrl && imgError ? (
        <div className="mb-3 rounded-xl bg-gray-100 h-20 flex items-center justify-center text-gray-400 text-sm border border-dashed border-gray-200">
          🖼️ Image unavailable
        </div>
      ) : null}

      {/* Details */}
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center gap-2">
          <span>🕐</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400">Detection Time</p>
            <p className="font-medium text-gray-800 truncate">{formatDate(timestamp)}</p>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">{formatTimeAgo(timestamp)}</span>
        </div>

        {location && (
          <div className="flex items-center gap-2">
            <span>📍</span>
            <div>
              <p className="text-xs text-gray-400">Location</p>
              <p className="font-medium text-gray-800">{location}</p>
            </div>
          </div>
        )}

        {/* Confidence bar */}
        {confValue != null && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-400">Confidence Score</p>
              <p className={`text-sm font-bold ${getConfidenceColor(confidence)}`}>
                {formatConfidence(confidence)}
              </p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${getConfidenceBarColor(confidence)}`}
                style={{ width: `${confValue}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(detection.id) }}
          className="mt-4 w-full text-xs text-red-400 hover:text-red-600 hover:bg-red-50 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
        >
          🗑 Delete record
        </button>
      )}
    </div>
  )
}
