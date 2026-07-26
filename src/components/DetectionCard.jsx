import { formatDate, formatConfidence, getConfidenceColor } from '../utils/helpers'

export default function DetectionCard({ detection, onDelete }) {
  const { trapId, detected, detectedAt, confidence, imageUrl, location } = detection

  return (
    <div className="card hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Trap ID</p>
          <p className="font-bold text-gray-900 text-lg">{trapId || '—'}</p>
        </div>
        <span className={detected ? 'badge-detected' : 'badge-clear'}>
          {detected ? '🚨 RPW Detected' : '✅ No RPW'}
        </span>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 h-40">
          <img
            src={imageUrl}
            alt="Detection"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Detection Time</p>
          <p className="font-medium text-gray-800">{formatDate(detectedAt)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Confidence</p>
          <p className={`font-semibold ${getConfidenceColor(confidence)}`}>
            {formatConfidence(confidence)}
          </p>
        </div>
        {location && (
          <div className="col-span-2">
            <p className="text-gray-500 text-xs">Location</p>
            <p className="font-medium text-gray-800">{location}</p>
          </div>
        )}
      </div>

      {onDelete && (
        <button
          onClick={() => onDelete(detection.id)}
          className="mt-3 text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          Delete record
        </button>
      )}
    </div>
  )
}
