export const formatDate = (timestamp) => {
  if (!timestamp) return '—'
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return '—'
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// Handles both integer (96) and decimal (0.96) confidence values
export const normalizeConfidence = (value) => {
  if (value == null) return null
  return value > 1 ? value : Math.round(value * 100)
}

export const formatConfidence = (value) => {
  const v = normalizeConfidence(value)
  return v != null ? `${v}%` : '—'
}

export const getConfidenceColor = (value) => {
  const v = normalizeConfidence(value)
  if (v == null) return 'text-gray-400'
  if (v >= 80) return 'text-red-600'
  if (v >= 50) return 'text-yellow-600'
  return 'text-green-600'
}

export const getConfidenceBarColor = (value) => {
  const v = normalizeConfidence(value)
  if (v == null) return 'bg-gray-300'
  if (v >= 80) return 'bg-red-500'
  if (v >= 50) return 'bg-yellow-500'
  return 'bg-green-500'
}

export const isDetected = (trap) =>
  trap?.status === 'RPW Detected' || trap?.detected === true
