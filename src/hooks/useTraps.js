import { useEffect, useState } from 'react'
import { subscribeToTraps } from '../services/firestoreService'

export const useTraps = () => {
  const [traps, setTraps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToTraps((data) => {
      setTraps(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return { traps, loading }
}
