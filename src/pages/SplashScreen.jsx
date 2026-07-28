import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SplashScreen() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    const timer = setTimeout(() => {
      navigate(user ? '/dashboard' : '/login', { replace: true })
    }, 2000)
    return () => clearTimeout(timer)
  }, [loading, user, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 flex flex-col items-center justify-center">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 animate-bounce-slow">
          <img
            src="/appstore-images/android/launchericon-192x192.png"
            alt="RPW Detect"
            className="w-full h-full object-cover"
          />
        </div>

        {/* App name */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">RPW Detect</h1>
          <p className="text-primary-200 mt-1 text-sm">Red Palm Weevil Detection System</p>
        </div>

        {/* Spinner */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-primary-200 text-xs">
            {loading ? 'Checking authentication...' : user ? 'Welcome back!' : 'Loading...'}
          </p>
        </div>
      </div>

      {/* Version */}
      <p className="absolute bottom-6 text-primary-300 text-xs">v1.0.0 · AI-Based RPW Monitoring</p>
    </div>
  )
}
