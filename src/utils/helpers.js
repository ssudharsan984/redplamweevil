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

export const formatConfidence = (value) => {
  if (value == null) return '—'
  return `${(value * 100).toFixed(1)}%`
}

export const getStatusLabel = (detected) =>
  detected ? 'RPW Detected' : 'No RPW'

export const getConfidenceColor = (value) => {
  if (value == null) return 'text-gray-500'
  if (value >= 0.8) return 'text-red-600'
  if (value >= 0.5) return 'text-yellow-600'
  return 'text-green-600'
}
