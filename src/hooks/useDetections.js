import { useEffect, useState } from 'react'
import { subscribeToDetections } from '../services/firestoreService'

export const useDetections = (maxResults = 50) => {
  const [detections, setDetections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsub = subscribeToDetections((data) => {
      setDetections(data)
      setLoading(false)
    }, maxResults)
    return unsub
  }, [maxResults])

  return { detections, loading, error }
}
