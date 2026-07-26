import { formatDate, formatConfidence, getConfidenceColor } from '../utils/helpers'

export default function DetectionCard({ detection, onDelete }) {
  const { trapId, detected, detectedAt, confidence, imageUrl, location } = detection

  const confValue = confidence != null ? Math.round(confidence * 100) : null

  return (
    <div className={`card group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5
      ${detected ? 'border-l-4 border-l-red-400' : 'border-l-4 border-l-emerald-400'}`}
    >
      {/* Status glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 -mr-8 -mt-8
        ${detected ? 'bg-red-500' : 'bg-emerald-500'}`} />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4 relative">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-0.5">Trap ID</p>
          <p className="font-extrabold text-gray-900 text-xl leading-none">{trapId || '—'}</p>
        </div>
        <span className={detected ? 'badge-detected' : 'badge-clear'}>
          {detected ? '🚨 RPW Detected' : '✅ No RPW'}
        </span>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 h-44 relative">
          <img
            src={imageUrl}
            alt="Detection"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.parentElement.style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      {/* Details grid */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-base">🕐</span>
          <div>
            <p className="text-xs text-gray-400">Detection Time</p>
            <p className="font-medium text-gray-800">{formatDate(detectedAt)}</p>
          </div>
        </div>

        {location && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-base">📍</span>
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
              <p className="text-xs text-gray-400">Confidence</p>
              <p className={`text-sm font-bold ${getConfidenceColor(confidence)}`}>
                {formatConfidence(confidence)}
              </p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-700
                  ${confValue >= 80 ? 'bg-red-500' : confValue >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${confValue}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {onDelete && (
        <button
          onClick={() => onDelete(detection.id)}
          className="mt-4 w-full text-xs text-red-400 hover:text-red-600 hover:bg-red-50 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
        >
          🗑 Delete record
        </button>
      )}
    </div>
  )
}
