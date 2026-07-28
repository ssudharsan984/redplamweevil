import { useEffect, useState } from 'react'
import { subscribeToNotifications } from '../services/firestoreService'
import { useAuth } from '../context/AuthContext'

/**
 * Custom hook to subscribe to the Firestore 'notifications' collection.
 *
 * @param {number} limitCount - Optional limit on how many notifications to fetch.
 * @returns {{ notifications: Array, loading: boolean, error: Error|null }}
 */
export const useNotifications = (limitCount = null) => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setLoading(false)
      return
    }

    const unsub = subscribeToNotifications(
      (data) => {
        setNotifications(data)
        setLoading(false)
      },
      user.uid // filter by current user
    )

    return unsub
  }, [user])

  return { notifications, loading, error }
}

