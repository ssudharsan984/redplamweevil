import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SplashScreen() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    const t = setTimeout(() => navigate(user ? '/dashboard' : '/login', { replace: true }), 1800)
    return () => clearTimeout(t)
  }, [loading, user, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #14532d 0%, #166534 50%, #15803d 100%)' }}>

      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 25% 75%, #4ade80 0%, transparent 50%), radial-gradient(circle at 75% 25%, #86efac 0%, transparent 50%)' }} />

      <div className="relative z-10 flex flex-col items-center gap-5 animate-fade-in">
        <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20">
          <img src="/appstore-images/android/launchericon-192x192.png" alt="RPW Detect" className="w-full h-full object-cover" />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">RPW Detect</h1>
          <p className="text-green-200 mt-1.5 text-sm">Red Palm Weevil Detection System</p>
        </div>
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-4 border-white/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin" />
          </div>
          <p className="text-green-200 text-xs">{loading ? 'Checking authentication...' : user ? 'Welcome back!' : 'Loading...'}</p>
        </div>
      </div>

      <p className="absolute bottom-6 text-green-300/60 text-xs">v1.0.0</p>
    </div>
  )
}
